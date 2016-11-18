import genFn from 'generate-function'

export default function createLayerPropertySetter (props) {
  const fn = genFn()('function setLayerProperties(layer) {')
  Object.keys(props)
    .forEach(k =>
      fn(`layer.property('${k}').setValue('${props[k]}')`))
  fn('}')
  return fn.toFunction()
}
