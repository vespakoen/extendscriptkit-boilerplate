import bridge from 'extendscriptkit/js/bridge'

export function evalJsx(code) {
  return new Promise(resolve =>
    bridge.evalScript(code, resolve)
  )
}
