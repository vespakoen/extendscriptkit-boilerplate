import { applyMiddleware, createStore } from 'redux'
import reduxThunk from 'redux-thunk'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'remote-redux-devtools'

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools({
      realtime: true
    })(applyMiddleware(reduxThunk))
  )
  return store
}
