// javascript shims
import 'extendscript-es5-shim/String/trim'
import 'extendscript-es5-shim/Array/forEach'
import 'extendscript-es5-shim/Array/map'
import 'extendscript-es5-shim/Object/keys'
import 'extendscript-es5-shim/Object/defineProperty'

// adobe ae helpers
import 'extendscriptkit/jsx/ae/Application'
import 'extendscriptkit/jsx/ae/Project'
import 'extendscriptkit/jsx/ae/Composition'

// bridge and console shims
import dispatch from 'extendscriptkit/jsx/bridge'
import console from 'extendscriptkit/jsx/console'

// other libs
import createLayerPropertySetter from './createLayerPropertySetter'

const textSetter = createLayerPropertySetter({
  "Source Text": "Text is set using generated function"
})

const startTime = Date.now()
app.undoable('Fastly adding layers', () => {
  app.faster(() => {
    app.project.forCompositionsWithName('_s01e01', composition => {
      for (let i = 0; i < 10; i++) {
        const funkyTextLayer = composition.layers.addText('FunkyTextLayer')
        textSetter(funkyTextLayer)
      }
      const duration = Date.now() - startTime
      console.log('took: ' + (duration / 1000) + 's')
    })
  })
})
