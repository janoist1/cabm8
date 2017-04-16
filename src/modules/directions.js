import { decodePolyline, geocodeAddress, getDirections } from '../lib'
import * as main from './main'
import Config from 'react-native-config'

const defaultWaypoint = {
  address: '',
  coordinate: undefined,
  color: undefined,
  distance: 0,
  fare: 0,
  passengers: 1,
  polyline: [],
}
const waypointColors = JSON.parse(Config.WAYPOINT_COLORS)

// actions
const SHOW_DIRECTIONS = 'cabm8/directions/SHOW_DIRECTIONS'
const HIDE_DIRECTIONS = 'cabm8/directions/HIDE_DIRECTIONS'
const ADD_WAYPOINT = 'cabm8/directions/ADD_WAYPOINT'
const UPDATE_WAYPOINT = 'cabm8/directions/UPDATE_WAYPOINT'
const SET_SELECTED_WAYPOINT_INDEX = 'cabm8/directions/SET_SELECTED_WAYPOINT_INDEX'
const REMOVE_WAYPOINT = 'cabm8/directions/REMOVE_WAYPOINT'
const RESET_WAYPOINTS = 'cabm8/directions/RESET'
const SET_EDITING = 'cabm8/directions/SET_EDITING'

// action creators
export const showDirections = () => ({
  type: SHOW_DIRECTIONS,
})

export const hideDirections = () => ({
  type: HIDE_DIRECTIONS,
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
    setEditing(true),
  ])

export const finishEditing = () => [
  setEditing(false),
  updateDirections(),
]

export const addWaypoint = waypoint => ({
  type: ADD_WAYPOINT,
  payload: waypoint,
})

export const updateWaypoint = (index, waypoint) => ({
  type: UPDATE_WAYPOINT,
  payload: {
    index,
    waypoint,
  },
})

export const setSelectedWaypointIndex = index => ({
  type: SET_SELECTED_WAYPOINT_INDEX,
  payload: index,
})

export const selectWaypoint = index => (dispatch, getState) => {
  const { directions } = getState()
  const { editing, waypoints } = directions

  if (editing) {
    dispatch(main.goToCoordinate(waypoints[index].coordinate))
  }

  dispatch([
    setSelectedWaypointIndex(index),
  ])
}

export const createWaypoint = (waypoint = { ...defaultWaypoint }) => (dispatch, getState) => {
  const getColorForWaypoint = index => waypointColors[Math.min(index, Config.MAX_WAYPOINTS - 1)]
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

  if (!directions.editing) {
    dispatch(startEditing())
  }

  dispatch(createWaypoint())
}

export const removeWaypoint = index => ({
  type: REMOVE_WAYPOINT,
  payload: index,
})

export const resetWaypoints = () => ({
  type: RESET_WAYPOINTS,
})

export const setEditing = editing => ({
  type: SET_EDITING,
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

// reducer
const initialState = {
  visible: false,
  editing: false,
  waypoints: [],
  selectedWaypointIndex: 0,
}

const ACTION_HANDLERS = {
  [SHOW_DIRECTIONS]: (state, action) => ({
    ...state,
    visible: true,
  }),
  [HIDE_DIRECTIONS]: (state, action) => ({
    ...state,
    visible: false,
  }),
  [ADD_WAYPOINT]: (state, action) => ({
    ...state,
    waypoints: [
      ...state.waypoints,
      action.payload,
    ],
  }),
  [UPDATE_WAYPOINT]: (state, action) => ({
    ...state,
    waypoints: state.waypoints.map((item, i) => i !== action.payload.index ? item : {
      ...item,
      ...action.payload.waypoint,
    }),
  }),
  [SET_SELECTED_WAYPOINT_INDEX]: (state, action) => ({
    ...state,
    selectedWaypointIndex: action.payload,
  }),
  [RESET_WAYPOINTS]: (state, action) => ({
    ...state,
    waypoints: [],
    selectedWaypointIndex: 0,
  }),
  [SET_EDITING]: (state, action) => ({
    ...state,
    editing: action.payload,
  }),
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
