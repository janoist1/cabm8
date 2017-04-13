import { Dimensions } from 'react-native'
import {
  SET_POSITION,
  SET_REGION,
  SET_ADDRESS,
} from '../constants/main'


const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE = 47.498247
const LONGITUDE = 19.032445
const LATITUDE_DELTA = 0.01
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const initialState = {
  address: 'Budapest',
  position: null,
  region: {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
}

const ACTION_HANDLERS = {
  [SET_POSITION]: (state, action) => ({
    ...state,
    position: action.payload,
  }),
  [SET_REGION]: (state, action) => ({
    ...state,
    region: action.payload,
  }),
  [SET_ADDRESS]: (state, action) => ({
    ...state,
    address: action.payload,
  }),
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
