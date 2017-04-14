import { decodePolyline, geocodeAddress, getDirections } from '../lib'
import {
  DIRECTIONS_SHOW,
  DIRECTIONS_HIDE,
  DIRECTIONS_ADD_WAYPOINT,
  DIRECTIONS_REMOVE_WAYPOINT,
  DIRECTIONS_UPDATE_WAYPOINT,
  DIRECTIONS_SET_SELECTED_WAYPOINT_INDEX,
  DIRECTIONS_RESET_WAYPOINTS,
  DIRECTIONS_SET_EDITING,
} from '../constants/directions'
import * as main from './main'

const defaultWaypoint = {
  address: '',
  coordinate: undefined,
  color: undefined,
  distance: 0,
  fare: 0,
  passengers: 0,
  polyline: [],
  visible: false,
}

export const showDirections = () => ({
  type: DIRECTIONS_SHOW,
})

export const hideDirections = () => ({
  type: DIRECTIONS_HIDE,
})

export const openDirections = ({ address, coordinate }) => [
  createWaypoint({
    ...defaultWaypoint,
    address,
    coordinate,
  }),
  showDirections(),
  startEditing(),
]

export const closeDirections = () => [
  hideDirections(),
  resetWaypoints(),
]

export const startEditing = () => (dispatch, getState) =>
  dispatch([
    main.goToCoordinate(getState().directions.waypoints[getState().directions.selectedWaypointIndex].coordinate),
    updateWaypoint(getState().directions.selectedWaypointIndex, { visible: false }),
    setEditing(true),
  ])

export const finishEditing = () => (dispatch, getState) => {
  const { selectedWaypointIndex } = getState().directions

  dispatch([
    updateWaypoint(selectedWaypointIndex, { visible: true }),
    setEditing(false),
    updateDirections(),
  ])
}

export const addWaypoint = waypoint => ({
  type: DIRECTIONS_ADD_WAYPOINT,
  payload: waypoint,
})

export const updateWaypoint = (index, waypoint) => ({
  type: DIRECTIONS_UPDATE_WAYPOINT,
  payload: {
    index,
    waypoint,
  },
})

export const setSelectedWaypointIndex = index => ({
  type: DIRECTIONS_SET_SELECTED_WAYPOINT_INDEX,
  payload: index,
})

export const selectWaypoint = index => (dispatch, getState) => {
  const { directions } = getState()
  const { editing, selectedWaypointIndex, waypoints } = directions

  if (editing) {
    dispatch([
      updateWaypoint(selectedWaypointIndex, { visible: true }),
      updateWaypoint(index, { visible: false }),
      main.goToCoordinate(waypoints[index].coordinate),
    ])
  }

  dispatch([
    setSelectedWaypointIndex(index),
  ])

  if (!editing) {
    dispatch(updateDirections()) // todo: review
  }
}

export const createWaypoint = (waypoint = { ...defaultWaypoint }) => (dispatch, getState) => {
  let directions = getState().directions

  if (!waypoint.coordinate && directions.waypoints.length) {
    waypoint.coordinate = directions.waypoints[directions.selectedWaypointIndex].coordinate
  }

  const selectedWaypointIndex = directions.waypoints.length

  if (!waypoint.color) {
    waypoint.color = getColorForWaypoint(selectedWaypointIndex)
  }

  dispatch([
    addWaypoint(waypoint),
    setSelectedWaypointIndex(selectedWaypointIndex),
  ])
}

export const addNextWaypoint = () => (dispatch, getState) => {
  const { directions } = getState()
  const { selectedWaypointIndex, waypoints } = directions
  const selectedWaypoint = waypoints[selectedWaypointIndex]

  if (!directions.editing) {
    dispatch(startEditing())
  }

  if (!selectedWaypoint.visible) {
    dispatch(updateWaypoint(selectedWaypointIndex, { visible: true }))
  }

  dispatch(createWaypoint())
}

export const removeWaypoint = index => ({
  type: DIRECTIONS_REMOVE_WAYPOINT,
  payload: index,
})

export const resetWaypoints = () => ({
  type: DIRECTIONS_RESET_WAYPOINTS,
})

export const setEditing = editing => ({
  type: DIRECTIONS_SET_EDITING,
  payload: editing,
})

export const submitWaypointAddress = address => (dispatch, getState) => {
  const { directions } = getState()
  const { selectedWaypointIndex } = directions

  if (directions.waypoints[selectedWaypointIndex].address === address) {
    return
  }

  if (!directions.editing) {
    dispatch(startEditing())
  }

  geocodeAddress(address)
    .then(response => response.json())
    .then(json => {
      if (!json.results.length) {
        return
      }

      const result = json.results[0]
      const latitude = result.geometry.location.lat
      const longitude = result.geometry.location.lng
      const coordinate = { latitude, longitude }

      dispatch([
        updateWaypoint(selectedWaypointIndex, {
          address: result.formatted_address,
          coordinate,
        }),
        main.goToCoordinate(coordinate),
      ])
    })
}

export const submitWaypointFare = fare => (dispatch, getState) => {
  const { directions } = getState()
  const { selectedWaypointIndex } = directions

  if (directions.waypoints[selectedWaypointIndex].fare === fare) {
    return
  }

  dispatch(updateWaypoint(selectedWaypointIndex, { fare }))
}

export const submitWaypointPassengers = passengers => (dispatch, getState) => {
  const { directions } = getState()
  const { selectedWaypointIndex } = directions

  if (passengers < 1 || passengers > 6) {
    return
  }

  if (directions.waypoints[selectedWaypointIndex].passengers === passengers) {
    return
  }

  dispatch(updateWaypoint(selectedWaypointIndex, { passengers }))
}

export const updateDirections = () => (dispatch, getState) => {
  const { directions } = getState()

  const shouldDirectionsUpdate = waypoints =>
    waypoints
      .slice(1)
      .reduce((changed, waypoint) => changed || waypoint.polyline.length < 1, false)

  if (directions.waypoints.length === 1) {
    return
  }

  if (!shouldDirectionsUpdate(directions.waypoints)) {
    return
  }

  const coordinates = directions.waypoints.map(waypoint => waypoint.coordinate)

  getDirections(coordinates)
    .then(route => {
      let distance = 0

      route.legs.forEach((leg, index) => {
        distance += leg.distance.value

        leg.steps.forEach(step => {
          dispatch(updateWaypoint(index + 1, {
            distance,
            polyline: decodePolyline(step.polyline.points),
          }))
        })
      })
    })
}

const getColorForWaypoint = index => [
  'black',
  'cornflowerblue',
  'crimson',
  'limegreen',
  'darkorange',
  'gold',
  'hotpink',
][Math.min(index, 6)]
