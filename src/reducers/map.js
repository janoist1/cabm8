import { Dimensions } from 'react-native'
import {
  MAP_CHANGE_POSITION,
  MAP_ADD_MARKER,
  MAP_UPDATE_MARKER,
  MAP_REMOVE_MARKER,
  MAP_REMOVE_ALL_MARKERS,
  MAP_CHANGE_REGION,
  MAP_ADD_POLYLINE,
  MAP_UPDATE_POLYLINE,
  MAP_SET_POLYLINES,
} from '../constants/map'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE = 47.498247
const LONGITUDE = 19.032445
const LATITUDE_DELTA = 0.01
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const initialState = {
  region: {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
  markers: [],
  polylines: [],
  position: null,
  isLoading: false,
  error: null,
}

const ACTION_HANDLERS = {
  [MAP_CHANGE_POSITION]: (state, action) => ({
    ...state,
    position: action.payload,
  }),
  [MAP_CHANGE_REGION]: (state, action) => ({
    ...state,
    region: action.payload,
  }),
  [MAP_ADD_MARKER]: (state, action) => ({
    ...state,
    markers: [
      ...state.markers,
      action.payload,
    ],
  }),
  [MAP_UPDATE_MARKER]: (state, action) => ({
    ...state,
    markers: state.markers.map(marker =>
      marker.identifier === action.payload.identifier
        ? {
          ...marker,
          ...action.payload,
        }
        : marker
    ),
  }),
  [MAP_REMOVE_MARKER]: (state, action) => ({
    ...state,
    markers: state.markers.filter(marker => marker.identifier !== action.payload.identifier),
  }),
  [MAP_REMOVE_ALL_MARKERS]: (state, action) => ({
    ...state,
    markers: [],
  }),
  [MAP_ADD_POLYLINE]: (state, action) => ({
    ...state,
    polylines: [
      ...state.polylines,
      action.payload,
    ],
  }),
  [MAP_UPDATE_POLYLINE]: (state, action) => ({
    ...state,
    polylines: state.polylines.map((polyline, index) =>
      index === action.payload.index
        ? {
          ...polyline,
          ...action.payload.polyline,
        }
        : polyline
    ),
  }),
  [MAP_SET_POLYLINES]: (state, action) => ({
    ...state,
    polylines: action.payload,
  }),
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
