const fs = require('fs')
const path = require('path')
const browserify = require('browserify')
const execSync = require('child_process').execSync
const spawn = require('child_process').spawn
const del = require('del')
const debugTemplate = require('./templates/.debug')
const manifestTemplate = require('./templates/manifest')
const uglifyJS = require('uglify-js')
require('dotenv').config()

const projectDir = path.join(__dirname, '..')
const buildDir = path.join(projectDir, 'build')
const distDir = path.join(projectDir, 'dist')
const jsEntry = path.join(projectDir, 'js/index.js')
const jsxEntry = path.join(projectDir, 'jsx/index.js')
const jsBundle = path.join(distDir, 'bundle.js')
const jsxBundle = path.join(distDir, 'bundle.jsx')
const jsxDevBundle = path.join(buildDir, 'bundle.jsx')
const ZXPSignCmdPath = path.join(__dirname, './ZXPSignCmd/ZXPSignCmd')
const outXZP = path.join(distDir, 'Extension.zxp')
const outCert = path.join(distDir, 'Cert.p12')

const NAME = process.env.EXTENSION_NAME
const BUNDLE_ID = process.env.EXTENSION_BUNDLE_ID
const BUNDLE_VERSION = process.env.EXTENSION_BUNDLE_VERSION
const CEP_VERSION = process.env.EXTENSION_CEP_VERSION
const PANEL_WIDTH = process.env.EXTENSION_PANEL_WIDTH
const PANEL_HEIGHT = process.env.EXTENSION_PANEL_HEIGHT
const CEF_PARAMS = process.env.EXTENSION_CEF_PARAMS
const AUTO_OPEN_REMOTE_DEBUGGER = process.env.EXTENSION_AUTO_OPEN_REMOTE_DEBUGGER
const ENABLE_PLAYERDEBUGMODE = process.env.EXTENSION_ENABLE_PLAYERDEBUGMODE
const TAIL_LOGS = process.env.EXTENSION_TAIL_LOGS
const APP_IDS = process.env.EXTENSION_APP_IDS

function enablePlayerDebugMode() {
  // enable unsigned extensions for CEP 4 5 6 and 7
  execSync(`
    defaults write com.adobe.CSXS.7 PlayerDebugMode 1;
    defaults write com.adobe.CSXS.6 PlayerDebugMode 1;
    defaults write com.adobe.CSXS.5 PlayerDebugMode 1;
    defaults write com.adobe.CSXS.4 PlayerDebugMode 1;
  `)
}

function tailLogs() {
  // tail the Adobe After Effects extension log files
  const files = [
    '/Library/Logs/CSXS/CEP6-AEFT.log',
    // `/Library/Logs/CSXS/CEPHtmlEngine6-AEFT-14.0-${NAME}-renderer.log`,
    // `/Library/Logs/CSXS/CEPHtmlEngine6-AEFT-14.0-${NAME}.log`
  ]
  files.forEach(file => spawn('tail', ['-f', path.join(process.env.HOME, file)], {
    end: process.env,
    stdio: 'inherit'
  }))
}

function openChromeRemoteDebugger() {
  // open the debugger page in chrome
  spawn('open', ['-a', 'Google Chrome', 'http://localhost:3001'], {
    end: process.env,
    stdio: 'inherit'
  })
}

function bundleJsx() {
  // start the build process for jsx/index.js (for ES6/7 support in ExtendScript)
  require('browserify')(jsxEntry, {
    debug: true
  })
  .bundle(function (err, bundle) {
    if (err) {
      console.error(err.stack)
      return
    }
    fs.writeFileSync(jsxBundle, bundle)
    const result = uglifyJS.minify([jsxBundle])
    fs.writeFileSync(jsxBundle, result.code)
  })
}

function bundleJs() {
  // start the build process for index.js (for ES6/7 support in CEF)
  require('browserify')(jsEntry, {
    debug: false,
    plugin: [
      [require('prependify'), 'nodeRequire = require;']
    ]
  })
  .bundle(function (err, bundle) {
    if (err) {
      console.error(err.stack)
      return
    }
    fs.writeFileSync(jsBundle, bundle)
    const result = uglifyJS.minify([jsBundle])
    fs.writeFileSync(jsBundle, result.code)
  })
}

function watchJsx() {
  // start the watch process for jsx/index.js (for ExtendScript ES6/7 support)
  spawn(path.join(projectDir, '/node_modules/.bin/watchify'), ['-t', 'babelify', jsxEntry, '-o', jsxDevBundle], {
    end: process.env,
    stdio: 'inherit'
  })
}

function watchJs() {
  // run panel watch process on port 3000
  require('budo')(jsEntry, {
    browserify: {
      debug: true,
      plugin: [
        [require('prependify'), 'nodeRequire = require;']
      ]
    },
    port: 3000,
    host: '0.0.0.0',
    live: true,
    serve: 'bundle.js',
    stream: process.stdout,
    // middleware: [proxy('/api', 'http://localhost:8080/api')],
  })
}

function writeTemplates(env) {
  // make sure the CSXS folder exists
  const dir = env === 'prod' ? distDir : buildDir

  try { del.sync(dir) } catch (err) {}
  try { fs.mkdirSync(dir) } catch (err) {}
  try { fs.mkdirSync(path.join(dir, 'CSXS')) } catch (err) {}

  if (env === 'dev') {
    // write .debug file
    const debugContents = debugTemplate(BUNDLE_ID, APP_IDS.split(','))
    fs.writeFileSync(path.join(dir, '.debug'), debugContents)
  }

  // write manifest.xml file
  const manifestContents = manifestTemplate(
    NAME,
    BUNDLE_ID,
    BUNDLE_VERSION,
    CEP_VERSION,
    PANEL_WIDTH,
    PANEL_HEIGHT,
    CEF_PARAMS.split(',')
  )
  fs.writeFileSync(path.join(dir, 'CSXS/manifest.xml'), manifestContents)
  const scripts = env === 'prod' ? '<script src="bundle.js"></script>' : `
    <script src="http://localhost:3000/bundle.js"></script>
    <script src="http://localhost:35729/livereload.js"></script>`
  let panelHtml = fs.readFileSync(path.join(projectDir, '/panel.html'), 'utf8')
  panelHtml = panelHtml.replace('{scripts}', scripts)
  fs.writeFileSync(path.join(dir, '/panel.html'), panelHtml)
}

function symlinkExtension(env) {
  const dir = env === 'prod' ? distDir : buildDir
  // symlink this extension into the extensions folder
  const CEP_EXTENSIONS_PATH = '/Library/Application\ Support/Adobe/CEP/extensions'
  const CEP_EXTENSIONS_PATH_ALT = path.join(process.env.HOME, CEP_EXTENSIONS_PATH)
  function symLink(target) {
    del.sync(target, { force: true })
    fs.symlinkSync(dir, target)
  }
  try {
    const target = path.join(CEP_EXTENSIONS_PATH, BUNDLE_ID)
    symLink(target)
  } catch (err) {
    const target = path.join(CEP_EXTENSIONS_PATH_ALT, BUNDLE_ID)
    symLink(target)
  }
}

function bundleZXP() {
  console.log(`${ZXPSignCmdPath} -selfSignedCert US NY Company CommonName password ${outCert}`)
  execSync(`${ZXPSignCmdPath} -selfSignedCert US NY Company CommonName password ${outCert}`)
  console.log(`${ZXPSignCmdPath} -sign ${distDir} ${outXZP} ${outCert} password`)
  execSync(`${ZXPSignCmdPath} -sign ${distDir} ${outXZP} ${outCert} password`)
}

module.exports = {
  enablePlayerDebugMode: enablePlayerDebugMode,
  tailLogs: tailLogs,
  openChromeRemoteDebugger: openChromeRemoteDebugger,
  bundleJsx: bundleJsx,
  bundleJs: bundleJs,
  watchJsx: watchJsx,
  watchJs: watchJs,
  writeTemplates: writeTemplates,
  symlinkExtension: symlinkExtension,
  bundleZXP: bundleZXP
}
