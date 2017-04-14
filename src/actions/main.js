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

  const coordinate = {
    latitude: region.latitude,
    longitude: region.longitude,
  }
  const { visible, editing, selectedWaypointIndex, waypoints } = getState().directions
  const selectedWaypoint = waypoints[selectedWaypointIndex]
  const lookupCoordinate = coordinate =>
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}`)
      .then(response => response.json())
  const toFixed = n => n.toFixed(5) * 1

  // todo: wrap into fn
  if (visible && selectedWaypoint &&
    toFixed(selectedWaypoint.coordinate.latitude) === toFixed(coordinate.latitude) &&
    toFixed(selectedWaypoint.coordinate.longitude) === toFixed(coordinate.longitude)) {
    return
  }

  if (visible && !editing) {
    return
  }

  lookupCoordinate(coordinate)
    .then(json => {
      if (json.error_message) {
        throw Error(json.error_message)
      }

      if (!json.results.length) {
        return
      }

      const result = json.results[0]
      const address = result.formatted_address

      dispatch(setAddress(address))

      if (visible) {
        dispatch([
          directions.invalidatePolylines(selectedWaypointIndex),
          directions.updateWaypoint(selectedWaypointIndex, {
            address,
            coordinate,
          }),
        ])
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
