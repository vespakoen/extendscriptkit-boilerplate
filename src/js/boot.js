const style = require('../../style.scss')
const { csi } = require('./bridge')

// add stylesheet
const styleEl = document.createElement('style')
styleEl.innerHTML = style
document.body.appendChild(styleEl)

// add log event listener
csi.addEventListener('CONSOLE_LOG', e => {
  console.log.apply(console, e.data.split(','))
})

csi.addEventListener('CONSOLE_ERROR', e => {
  const errEl = document.createElement('span')
  errEl.style.position = 'absolute'
  errEl.style.top = '0px'
  errEl.style.right = '0px'
  errEl.style.bottom = '0px'
  errEl.style.left = '0px'
  errEl.style.backgroundColor = 'white'
  errEl.style.color = 'red'
  errEl.innerHTML = e.data
  document.body.appendChild(errEl)
  console.error.apply(console, e.data.split(','))
})
