Project.prototype.forItems = function (cb) {
  const numItems = this.numItems
  for (var i = 1; i <= numItems; i++) {
    const item = this.item(i)
    cb(item)
  }
}

Project.prototype.forCompositions = function(cb) {
  return this.forItems(item => {
    if (item instanceof CompItem) {
      cb(item)
    }
  })
}
