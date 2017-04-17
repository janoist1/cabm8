import { Dimensions } from 'react-native'
import { geocodeCoordinate } from '../lib'
import {
  getSelectedWaypoint,
  isWaypointAtCoordinate,
  isDirectionsVisible,
  isDirectionsEditing,
} from '../selectors/directions'
import * as directions from './directions'
import {
  getAddress,
  getCoordinate,
  getPosition,
  getRegion,
} from '../selectors/main'

// actions
const SET_POSITION = 'cabm8/main/SET_POSITION'
const SET_REGION = 'cabm8/main/SET_REGION'
const SET_ADDRESS = 'cabm8/main/SET_ADDRESS'

// action creators
export const setPosition = position => ({
  type: SET_POSITION,
  payload: position,
})

export const setRegion = region => ({
  type: SET_REGION,
  payload: region,
})

export const setAddress = address => ({
  type: SET_ADDRESS,
  payload: address,
})

export const goToCoordinate = coordinate => (dispatch, getState) =>
  dispatch(setRegion({
    ...getRegion(getState()),
    ...coordinate,
  }))

export const goToMyPosition = () => (dispatch, getState) =>
  getPosition(getState()) && dispatch(goToCoordinate(getPosition(getState())))

export const changeRegion = region => [
  setRegion(region),
  lookupAddress({
    latitude: region.latitude,
    longitude: region.longitude,
  }),
]

export const lookupAddress = coordinate => (dispatch, getState) => {
  const state = getState()
  const selectedWaypoint = getSelectedWaypoint(state)

  if (isDirectionsVisible(state) &&
    (!isDirectionsEditing(state) || isWaypointAtCoordinate(selectedWaypoint, coordinate))) {
    return
  }

  geocodeCoordinate(coordinate)
    .then(data => {
      if (data.error_message) {
        throw Error(data.error_message)
      }

      if (!data.results.length) {
        throw Error('No result')
      }

      const address = data.results[0].formatted_address

      dispatch([
        setAddress(address),
        directions.updateLocation({
          address,
          coordinate,
        }),
      ])
    })
}

export const openDirections = () => (dispatch, getState) =>
  dispatch([
    directions.openDirections(),
    directions.updateLocation({
      address: getAddress(getState()),
      coordinate: getCoordinate(getState()),
    }),
  ])

// reducer
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
