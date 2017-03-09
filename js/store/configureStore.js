import { applyMiddleware, createStore } from 'redux'
import reduxThunk from 'redux-thunk'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'remote-redux-devtools'
import createLogger from 'redux-logger';

export default function configureStore(initialState) {
  const logger = createLogger()
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools({
      realtime: true
    })(applyMiddleware(reduxThunk, logger))
  )
  return store
}
