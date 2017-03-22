import {
  UPDATE_CURRENT_LOCATION,
  SET_DOT_COLOR,
} from '../constants/main'


const ACTION_HANDLERS = {
  [UPDATE_CURRENT_LOCATION]: (state, action) => ({
    ...state,
    currentLocation: action.payload,
  }),
  [SET_DOT_COLOR]: (state, action) => ({
    ...state,
    dotColor: action.payload,
  }),
}

const initialState = {
  currentLocation: {
    address: 'Budapest',
    coordinate: undefined,
  },
  dotColor: 'black',
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
