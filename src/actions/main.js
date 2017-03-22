import {
  UPDATE_CURRENT_LOCATION,
  SET_DOT_COLOR,
} from '../constants/main'
import * as map from './map'
import * as directions from './directions'


const key = 'AIzaSyBQa1S8MneTUG8WXxS1wpaJVyACKEnvcCs'

export const updateCurrentLocation = location => ({
  type: UPDATE_CURRENT_LOCATION,
  payload: location,
})

export const goToCurrentLocation = () => (dispatch, getState) =>
  dispatch(map.changeRegion({
    ...getState().map.region,
    ...getState().main.currentLocation.coordinate,
  }))

export const changeCoordinate = coordinate => (dispatch, getState) => { // fixme: change fn name
  const { isOpen, isLocked, selectedWaypointIndex, waypoints } = getState().directions
  const lookupCoordinate = coordinate =>
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${key}`)
      .then(response => response.json())

  if (isOpen && isLocked) {
    return
  }

  // todo: wrap into fn
  if (waypoints.length) {
    const selectedWaypointCoordinate = waypoints[selectedWaypointIndex].coordinate
    if (isOpen &&
      selectedWaypointCoordinate.latitude === coordinate.latitude &&
      selectedWaypointCoordinate.longitude === coordinate.longitude)
    {
      return
    }
  }

  lookupCoordinate(coordinate).then(json => {
    if (!json.results.length) {
      return
    }

    const result = json.results[0]
    const waypoint = {
      address: result.formatted_address,
      coordinate,
    }

    if (isOpen) {
      dispatch([
        directions.updateWaypoint(selectedWaypointIndex, waypoint),
        map.updateMarker({
          identifier: selectedWaypointIndex,
          coordinate: waypoint.coordinate,
        }),
      ])
    } else {
      dispatch(updateCurrentLocation(waypoint))
    }
  })
}

export const openDirections = () => (dispatch, getState) => {
  const state = getState()

  dispatch(directions.openDirections(state.main.currentLocation))
}

export const setDotColor = color => ({
  type: SET_DOT_COLOR,
  payload: color,
})
