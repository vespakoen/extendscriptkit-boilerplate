CompItem.prototype.forLayers = function(cb) {
  const layers = this.layers
  const numLayers = layers.length
  for (var i = 1; i <= numLayers; i++) {
    cb(layers[i])
  }
}

CompItem.prototype.forSelectedLayers = function(cb) {
  const selectedLayers = this.selectedLayers
  const numSelectedLayers = selectedLayers.length
  if (numSelectedLayers !== 0) {
    for (var i = 0; i < numSelectedLayers; i++) {
      cb(selectedLayers[i])
    }
  }
}
