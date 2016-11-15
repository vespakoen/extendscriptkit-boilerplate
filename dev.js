// const proxy = require('middleware-proxy')
const fs = require('fs')
const path = require('path')
const browserify = require('browserify')
const watchify = require('watchify')
const execSync = require('child_process').execSync
const spawn = require('child_process').spawn
const del = require('del')
const replace = require('browserify-replace')

const extension = 'com.test.test.extension'

// enable unsigned extensions for CEP 4 5 6 and 7
execSync(`
  defaults write com.adobe.CSXS.7 PlayerDebugMode 1;
  defaults write com.adobe.CSXS.6 PlayerDebugMode 1;
  defaults write com.adobe.CSXS.5 PlayerDebugMode 1;
  defaults write com.adobe.CSXS.4 PlayerDebugMode 1;
`)

// tail the Adobe After Effects log file (v6)
spawn('tail', ['-f', path.join(process.env.HOME, '/Library/Logs/CSXS/CEP6-AEFT.log')], {
  end: process.env,
  stdio: 'inherit'
})

// tail the Adobe After Effects html engine renderer log file (v6)
spawn('tail', ['-f', path.join(process.env.HOME, `/Library/Logs/CSXS/CEPHtmlEngine6-AEFT-14.0-${extension}-renderer.log`)], {
  end: process.env,
  stdio: 'inherit'
})

// tail the Adobe After Effects html engine log file (v6)
spawn('tail', ['-f', path.join(process.env.HOME, `/Library/Logs/CSXS/CEPHtmlEngine6-AEFT-14.0-${extension}.log`)], {
  end: process.env,
  stdio: 'inherit'
})

// open the debugger page in chrome
spawn('open', ['-a', 'Google Chrome', 'http://localhost:3001'], {
  end: process.env,
  stdio: 'inherit'
})

// start the watch process for index.jsx (for ExtendScript ES6/7 support)
spawn('watchify', ['-t', 'babelify', 'index.jsx', '-o', 'build/bundle.jsx'], {
  end: process.env,
  stdio: 'inherit'
})

// symlink this extension into the extensions folder
const CEP_EXTENSIONS_PATH = '/Library/Application\ Support/Adobe/CEP/extensions'
const CEP_EXTENSIONS_PATH_ALT = path.join(process.env.HOME, CEP_EXTENSIONS_PATH)
function symLink(target) {
  del.sync(target, { force: true })
  fs.symlinkSync(__dirname, target)
}
try {
  const target = path.join(CEP_EXTENSIONS_PATH, extension)
  symLink(target)
} catch (err) {
  const target = path.join(CEP_EXTENSIONS_PATH_ALT, extension)
  symLink(target)
}

// run panel watch process on port 3000
require('budo')('index.js', {
  browserify: {
    debug: true,
    transform: [

    ]
  },
  port: 3000,
  host: '0.0.0.0',
  live: true,
  serve: 'bundle.js',
  stream: process.stdout,
  // middleware: [proxy('/api', 'http://localhost:8080/api')],
})
