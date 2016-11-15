const CSInterface = require('./CSInterface')
const csi = new CSInterface()

// helper function for evaluating ExtendScript
function evalJsx(code) {
  return new Promise(resolve => {
    csi.evalScript(code, res => resolve(res))
  })
}

module.exports = {
  evalJsx,
  csi
}
