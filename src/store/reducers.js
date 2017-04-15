import { combineReducers } from 'redux'
import counter from '../modules/Counter/modules/counter'
import main from '../reducers/main'
import directions from '../reducers/directions'

export const makeRootReducer = asyncReducers =>
  combineReducers({
    counter,
    main,
    directions,
    ...asyncReducers,
  })

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer