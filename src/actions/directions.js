import {
  DIRECTIONS_SHOW,
  DIRECTIONS_HIDE,
  DIRECTIONS_ADD_WAYPOINT,
  DIRECTIONS_REMOVE_WAYPOINT,
  DIRECTIONS_UPDATE_WAYPOINT,
  DIRECTIONS_SET_SELECTED_WAYPOINT_INDEX,
  DIRECTIONS_RESET_WAYPOINTS,
  DIRECTIONS_SET_EDITING,
  DIRECTIONS_INVALIDATE_POLYLINES,
} from '../constants/directions'
import * as main from './main'

const defaultWaypoint = {
  address: '',
  coordinate: undefined,
  color: undefined,
  distance: 0,
  fare: 0,
  passengers: 0,
  polyline: undefined,
  visible: false,
}

export const showDirections = () => ({
  type: DIRECTIONS_SHOW,
})

export const hideDirections = () => ({
  type: DIRECTIONS_HIDE,
})

export const invalidatePolylines = (index = 0) => ({
  type: DIRECTIONS_INVALIDATE_POLYLINES,
  payload: index,
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
  finishEditing(),
  resetWaypoints(),
  main.goToMyPosition(),
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
    getDirections(),
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
    dispatch(getDirections())
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

  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}`) // &key=${key}
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

export const getDirections = () => (dispatch, getState) => {
  const { directions } = getState()
  const getRoute = waypoints => {
    const coordinateToString = coordinate => Object.values(coordinate).join(',')
    const coordinatesToString = coordinates => coordinates.map(coordinateToString).join('|')

    if (waypoints.length < 2) {
      return Promise.reject(Error('Not enough waypoints'))
    }

    let url = `https://maps.googleapis.com/maps/api/directions/json`

    const origin = coordinatesToString(
      waypoints
        .map(waypoint => waypoint.coordinate)
        .slice(0, 1)
    )
    const destination = coordinatesToString(
      waypoints
        .map(waypoint => waypoint.coordinate)
        .slice(-1)
    )
    const waypointsStr = coordinatesToString(
      waypoints
        .map(waypoint => waypoint.coordinate)
        .slice(1, -1)
    )

    url += `?origin=${origin}&destination=${destination}` // &key=${key}
    url += waypointsStr.length > 0 ? `&waypoints=${waypointsStr}` : ''

    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!json.routes.length) {
          console.log({ url, json })
          throw Error('No route found')
        }

        return json.routes[0]
      })
  }

  if (directions.waypoints.length === 1) {
    return
  }

  const lastWaypointIndex = directions.waypoints.length - 1
  const selectedWaypoint = directions.waypoints[directions.selectedWaypointIndex]
  const lastWaypoint = directions.waypoints[lastWaypointIndex]
  const getRouteToSelectedWaypoint = () => getRoute(directions.waypoints.slice(0, directions.selectedWaypointIndex + 1))
  const getRouteToLastWaypoint = () => getRoute(directions.waypoints)

  ;(async () => {
    if (!selectedWaypoint.polyline && directions.selectedWaypointIndex > 0) {
      const route = await getRouteToSelectedWaypoint()
      const distance = route.legs.reduce((distance, leg) => distance + leg.distance.value, 0)

      dispatch(updateWaypoint(directions.selectedWaypointIndex, {
        fare: 480 + distance * 280 / 1000,
        distance,
        polyline: decodePolyline(route.overview_polyline.points),
      }))
    }

    if (!lastWaypoint.polyline && directions.selectedWaypointIndex < lastWaypointIndex) {
      const route = await getRouteToLastWaypoint()
      const distance = route.legs.reduce((distance, leg) => distance + leg.distance.value, 0)

      dispatch(updateWaypoint(lastWaypointIndex, {
        fare: 480 + distance * 280 / 1000,
        distance,
        polyline: decodePolyline(route.overview_polyline.points),
      }))
    }

    // dispatch([
    //   // {type: 'ASD', payload: routeToSelectedWaypoint},
    //   // map.setPolylines([...polylines].reverse()),
    //   // updateWaypoint(directions.selectedWaypointIndex, {
    //   //   // distance: routeToSelectedWaypoint.legs.reduce((distance, leg) => leg.distance.value, 0) / 1000,
    //   //   polyline: polylines[0],
    //   // }),
    // ])
  })()
}

function getColorForWaypoint (index) {
  return [
    'black',
    'cornflowerblue',
    'crimson',
    'limegreen',
    'darkorange',
    'gold',
    'hotpink',
  ][index]
}

function decodePolyline (encoded) {
  if (!encoded) {
    return []
  }

  const poly = []
  let index = 0
  let len = encoded.length
  let lat = 0
  let lng = 0

  while (index < len) {
    let b
    let shift = 0
    let result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result = result | ((b & 0x1f) << shift)
      shift += 5
    } while (b >= 0x20)

    let dlat = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1)
    lat += dlat

    shift = 0
    result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result = result | ((b & 0x1f) << shift)
      shift += 5
    } while (b >= 0x20)

    let dlng = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1)
    lng += dlng

    let p = {
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    }

    poly.push(p)
  }

  return poly
}
