import { Dimensions } from 'react-native'
import { calculateDistance, geocodeCoordinate } from '../lib'
import { CONFIG_MAP } from '../middlewares/debounce'
import {
  getSelectedWaypointIndex,
  getSelectedWaypoint,
  isDirectionsVisible,
  isDirectionsEditing,
} from '../selectors/directions'
import * as directions from './directions'

// actions
const SET_POSITION = 'cabm8/main/SET_POSITION'
const SET_REGION = 'cabm8/main/SET_REGION'
const SET_ADDRESS = 'cabm8/main/SET_ADDRESS'
const LOOKUP_ADDRESS = 'cabm8/main/LOOKUP_ADDRESS'

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
    ...getState().main.region,
    ...coordinate,
  }))

export const goToMyPosition = () => (dispatch, getState) =>
getState().main.position && dispatch(goToCoordinate({
  latitude: getState().main.position.latitude,
  longitude: getState().main.position.longitude,
}))

export const lookupAddress = coordinate => (dispatch, getState) => {
  const state = getState()
  const selectedWaypoint = getSelectedWaypoint(state)

  if (isDirectionsVisible(state)) {
    if (selectedWaypoint && calculateDistance(selectedWaypoint.coordinate, coordinate) === 0) {
      // switching waypoints - so that we've already looked up the coords
      dispatch({ type: 'switching waypoints' })
      return
    }

    if (!isDirectionsEditing(state)) {
      dispatch({ type: '!edit' })
      return
    }
  }

  return {
    type: LOOKUP_ADDRESS,
    payload: geocodeCoordinate(coordinate)
      .then(data => {
        if (data.error_message) {
          throw Error(data.error_message)
        }

        if (!data.results.length) {
          throw Error('No result')
        }

        const result = data.results[0]
        const address = result.formatted_address

        dispatch(setAddress(address))

        if (isDirectionsVisible(state)) {
          dispatch(directions.updateWaypoint(getSelectedWaypointIndex(state), {
            address,
            coordinate,
            polyline: [], // makes directions.shouldDirectionsUpdate return true
          }))
        }
      }),
    meta: {
      debounce: CONFIG_MAP,
    },
  }
}

export const changeRegion = region => [
  setRegion(region),
  lookupAddress({
    latitude: region.latitude,
    longitude: region.longitude,
  })
]

export const openDirections = () => (dispatch, getState) => {
  const main = getState().main

  dispatch(directions.openDirections({
    address: main.address,
    coordinate: {
      latitude: main.region.latitude,
      longitude: main.region.longitude,
    },
  }))
}

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
