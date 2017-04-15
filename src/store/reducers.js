import { combineReducers } from 'redux'
import main from '../modules/main'
import directions from '../modules/directions'

export const makeRootReducer = asyncReducers =>
  combineReducers({
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
