const {
  enablePlayerDebugMode,
  tailLogs,
  openChromeRemoteDebugger,
  watchJsx,
  watchJs,
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

watchJsx()
// wait for the jsx bundle to be available for brfs to pick up (only on initial load)
setTimeout(() => {
  watchJs()
}, 3000)

writeTemplates('dev')
symlinkExtension('dev')
