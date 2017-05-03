import {
  boundsToRegion,
  decodePolyline,
  geocodeAddress,
  getDirections,
} from '../lib'
import * as main from './main'
import {
  isDirectionsVisible,
  isDirectionsEditing,
  isWaypointAtCoordinate,
  getWaypoints,
  getSelectedWaypoint,
  getSelectedWaypointIndex,
  getRouteRegion,
} from '../selectors/directions'
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
const SET_ROUTE_REGION = 'cabm8/directions/SET_ROUTE_REGION'

// action creators
export const showDirections = () => ({
  type: SHOW_DIRECTIONS,
})

export const hideDirections = () => ({
  type: HIDE_DIRECTIONS,
})

export const openDirections = () => [
  createWaypoint({
    ...defaultWaypoint,
  }),
  showDirections(),
  startEditing(),
]

export const closeDirections = () => [
  hideDirections(),
  resetWaypoints(),
  setRouteRegion(null),
]

export const updateLocation = ({ address, coordinate }) => (dispatch, getState) => {
  if (!isDirectionsVisible(getState())) {
    return
  }

  dispatch(updateSelectedWaypoint({
    address,
    coordinate,
    // reset polyline if waypoint's coordinate's changed - it makes shouldDirectionsUpdate return true
    ...(isDirectionsEditing(getState()) && !isWaypointAtCoordinate(getSelectedWaypoint(getState()), coordinate)
      ? { polyline: [] } : {}),
  }))
}

export const startEditing = () => (dispatch, getState) =>
  dispatch([
    main.goToCoordinate(getSelectedWaypoint(getState()).coordinate), // todo: review
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

export const updateSelectedWaypoint = waypoint => (dispatch, getState) =>
  dispatch(updateWaypoint(getSelectedWaypointIndex(getState()), waypoint))

export const setSelectedWaypointIndex = index => ({
  type: SET_SELECTED_WAYPOINT_INDEX,
  payload: index,
})

export const selectWaypoint = index => (dispatch, getState) => {
  const waypoints = getWaypoints(getState())

  dispatch([
    setSelectedWaypointIndex(index),
    main.goToCoordinate(waypoints[index].coordinate),
  ])
}

export const createWaypoint = (waypoint = { ...defaultWaypoint }) => (dispatch, getState) => {
  const getColorForWaypoint = index => waypointColors[Math.min(index, Config.MAX_WAYPOINTS - 1)]

  if (!waypoint.coordinate && getWaypoints(getState()).length) {
    waypoint.coordinate = getSelectedWaypoint(getState()).coordinate
  }

  const selectedWaypointIndex = getWaypoints(getState()).length

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

export const setRouteRegion = routeRegion => ({
  type: SET_ROUTE_REGION,
  payload: routeRegion,
})

export const submitWaypointAddress = address => (dispatch, getState) => {
  if (getSelectedWaypoint(getState()).address === address) {
    return
  }

  if (!isDirectionsEditing(getState())) {
    dispatch(startEditing())
  }

  geocodeAddress(address)
    .then(response => response.json())
    .then(json => {
      if (!json.results.length) {
        throw Error('Address not found')
      }

      const result = json.results[0]
      const latitude = result.geometry.location.lat
      const longitude = result.geometry.location.lng
      const coordinate = { latitude, longitude }

      dispatch([
        updateSelectedWaypoint({
          address: result.formatted_address,
          coordinate,
        }),
        main.goToCoordinate(coordinate), // todo: review
      ])
    })
}

export const submitWaypointFare = fare => (dispatch, getState) => {
  if (getSelectedWaypoint(getState()).fare === fare) {
    return
  }

  dispatch(updateSelectedWaypoint({ fare }))
}

export const submitWaypointPassengers = passengers => (dispatch, getState) => {
  if (getSelectedWaypoint(getState()).passengers === passengers) {
    return
  }

  dispatch(updateSelectedWaypoint({ passengers }))
}

export const updateDirections = () => (dispatch, getState) => {
  const shouldDirectionsUpdate = waypoints =>
    waypoints
      .slice(1)
      .reduce((changed, waypoint) => changed || waypoint.polyline.length < 1, false)

  if (getWaypoints(getState()).length === 1) {
    return
  }

  if (!shouldDirectionsUpdate(getWaypoints(getState()))) {
    dispatch(main.setRegion(getRouteRegion(getState())))
    return
  }

  const coordinates = getWaypoints(getState()).map(waypoint => waypoint.coordinate)

  getDirections(coordinates)
    .then(route => {
      const bounds = Object.values(route.bounds).map(coordinate => ({
        latitude: coordinate.lat,
        longitude: coordinate.lng,
      }))
      const region = boundsToRegion(bounds, 2)

      dispatch([
        setRouteRegion(region),
        main.setRegion(region),
      ])

      let distance = 0

      route.legs.forEach((leg, index) => {
        distance += leg.distance.value

        dispatch(updateWaypoint(index + 1, {
          distance,
          polyline: leg.steps.reduce((polyline, step) => polyline.concat(decodePolyline(step.polyline.points)), []),
        }))
      })
    })
}

// reducer
const initialState = {
  visible: false,
  editing: false,
  waypoints: [],
  selectedWaypointIndex: 0,
  routeRegion: null, // todo: review if it's better to store the entire route and rebuilding polylines from 'cache' too
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
  [SET_ROUTE_REGION]: (state, action) => ({
    ...state,
    routeRegion: action.payload,
  }),
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
