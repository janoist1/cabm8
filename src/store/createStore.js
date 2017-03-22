import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import multi from 'redux-multi'
import { composeWithDevTools } from 'redux-devtools-extension'
import devToolsEnhancer from 'remote-redux-devtools'
import makeRootReducer from './reducers'

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [multi, thunk]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [devToolsEnhancer()]

  // let composeEnhancers = compose
  let composeEnhancers = composeWithDevTools({})

  // ======================================================
  // Store Instantiation
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  return store
}
