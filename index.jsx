require('./src/jsx/ae/Project')
require('./src/jsx/ae/Composition')

app.project.forCompositions(composition => {
  composition.forLayers(function (layer) {
    console.log(layer)
  })
  const textLayer = composition.layers.addText('Moehahahaaa')
  textLayer
    .property('Source Text')
    .setValue('Sweet sauce')
})
