(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./src/jsx/ae/Project');
require('./src/jsx/ae/Composition');

app.project.forCompositions(function (composition) {
  composition.forLayers(function (layer) {
    console.log(layer);
  });
  var textLayer = composition.layers.addText('Moehahahaaa');
  textLayer.property('Source Text').setValue('Sweet sauce');
});

},{"./src/jsx/ae/Composition":2,"./src/jsx/ae/Project":3}],2:[function(require,module,exports){
"use strict";

CompItem.prototype.forLayers = function (cb) {
  var layers = this.layers;
  var numLayers = layers.length;
  for (var i = 1; i <= numLayers; i++) {
    cb(layers[i]);
  }
};

CompItem.prototype.forSelectedLayers = function (cb) {
  var selectedLayers = this.selectedLayers;
  var numSelectedLayers = selectedLayers.length;
  if (numSelectedLayers !== 0) {
    for (var i = 0; i < numSelectedLayers; i++) {
      cb(selectedLayers[i]);
    }
  }
};

},{}],3:[function(require,module,exports){
"use strict";

Project.prototype.forItems = function (cb) {
  var numItems = this.numItems;
  for (var i = 1; i <= numItems; i++) {
    var item = this.item(i);
    cb(item);
  }
};

Project.prototype.forCompositions = function (cb) {
  return this.forItems(function (item) {
    if (item instanceof CompItem) {
      cb(item);
    }
  });
};

},{}]},{},[1]);
