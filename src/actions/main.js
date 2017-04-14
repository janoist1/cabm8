import { calculateDistance, lookupCoordinate } from '../lib'
import {
  getSelectedWaypointIndex,
  getSelectedWaypoint,
  isDirectionsVisible,
  isDirectionsEditing,
} from '../selectors/directions'
import {
  SET_POSITION,
  SET_REGION,
  SET_ADDRESS,
} from '../constants/main'
import * as directions from './directions'

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

export const changeRegion = region => (dispatch, getState) => {
  dispatch(setRegion(region))

  const state = getState()
  const coordinate = {
    latitude: region.latitude,
    longitude: region.longitude,
  }
  const selectedWaypoint = getSelectedWaypoint(state)

  if (isDirectionsVisible(state)) {
    if (selectedWaypoint && calculateDistance(selectedWaypoint.coordinate, coordinate) === 0) {
      // switching waypoints - so that we've already looked up the coords
      return
    }

    if (!isDirectionsEditing(state)) {
      return
    }
  }

  lookupCoordinate(coordinate)
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

      if (isDirectionsVisible()) {
        dispatch(directions.updateWaypoint(getSelectedWaypointIndex(state), {
          address,
          coordinate,
          polyline: [], // makes shouldDirectionsUpdate to return true
        }))
      }
    })
}

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
