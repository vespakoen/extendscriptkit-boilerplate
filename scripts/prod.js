const {
  enablePlayerDebugMode,
  tailLogs,
  openChromeRemoteDebugger,
  bundleJsx,
  bundleJs,
  writeTemplates,
  symlinkExtension
} = require('./actions')

function isLooselyTruthy(val) {
  return val !== undefined && (val === "1" || val.toLowerCase() === "true")
}

if (isLooselyTruthy(process.env.EXTENSION_ENABLE_PLAYERDEBUGMODE))
  enablePlayerDebugMode()

if (isLooselyTruthy(process.env.EXTENSION_TAIL_LOGS))
  tailLogs()

if (isLooselyTruthy(process.env.EXTENSION_AUTO_OPEN_REMOTE_DEBUGGER))
  openChromeRemoteDebugger()

bundleJsx()
bundleJs()
writeTemplates('prod')
symlinkExtension()
