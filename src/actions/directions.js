// import
import {
  DIRECTIONS_SHOW,
  DIRECTIONS_HIDE,
  DIRECTIONS_ADD_WAYPOINT,
  DIRECTIONS_UPDATE_WAYPOINT,
  DIRECTIONS_SELECT_WAYPOINT,
  DIRECTIONS_RESET_WAYPOINTS,
  DIRECTIONS_LOCK,
  DIRECTIONS_UNLOCK,
} from '../constants/directions'
import * as main from './main'
import * as map from './map'


const key = 'AIzaSyBQa1S8MneTUG8WXxS1wpaJVyACKEnvcCs'
const defaultWaypoint = {
  address: '',
  coordinate: undefined,
  cost: 0,
  color: undefined,
  ratio: 0,
  distance: 0,
  polyline: undefined,
}
const selectedWaypointPolyline = {
  strokeWidth: 3,
}
const lastWaypointPolyline = {
  strokeWidth: 5,
  strokeColor: 'grey',
}

export const openDirections = origin => [
  createWaypoint({
    ...defaultWaypoint,
    ...origin,
  }),
  showDirections(),
]

export const closeDirections = () => [
  hideDirections(),
  resetWaypoints(),
  main.goToCurrentLocation(),
  main.setDotColor('black'),
  map.removeAllMarkers(),
  map.setPolylines([]),
]

export const startEditing = () => [
  unlock(),
  map.setPolylines([]),
]

export const finishEditing = () => (dispatch, getState) => {
  const { selectedWaypointIndex } = getState().directions

  dispatch([
    lock(),
    invalidatePolylinesFromIndex(selectedWaypointIndex),
    getDirections(),
  ])
}

export const invalidatePolylinesFromIndex = selectedWaypointIndex => (dispatch, getState) => {
  const { waypoints } = getState().directions

  for (let index = selectedWaypointIndex; index < waypoints.length; index++) {
    dispatch(updateWaypoint(index, {
      polyline: undefined,
    }))
  }
}

export const showDirections = () => ({
  type: DIRECTIONS_SHOW,
})

export const hideDirections = () => ({
  type: DIRECTIONS_HIDE,
})

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

export const selectWaypoint = index => ({
  type: DIRECTIONS_SELECT_WAYPOINT,
  payload: index,
})

export const selectAndGoToWaypoint = index => (dispatch, getState) => { // todo: selectWaypoint + setSelectedWaypoint
  dispatch(selectWaypoint(index))

  const { directions } = getState()
  const selectedWaypoint = directions.waypoints[directions.selectedWaypointIndex]

  dispatch([
    main.setDotColor(selectedWaypoint.color),
    map.goToCoordinate(selectedWaypoint.coordinate),
  ])

  if (directions.isLocked) {
    dispatch(getDirections())
  }
}

export const createWaypoint = (waypoint = {...defaultWaypoint}) => (dispatch, getState) => {
  let directions = getState().directions

  if (!waypoint.coordinate && directions.waypoints.length) {
    waypoint.coordinate = directions.waypoints[directions.selectedWaypointIndex].coordinate
  }

  const selectedWaypointIndex = directions.waypoints.length

  if (!waypoint.color) {
    waypoint.color = getColorForWaypoint(selectedWaypointIndex)
  }

  dispatch([
    startEditing(),
    addWaypoint(waypoint),
    selectWaypoint(selectedWaypointIndex),
    map.addMarker({
      identifier: selectedWaypointIndex,
      coordinate: waypoint.coordinate,
      color: waypoint.color,
    }),
    main.setDotColor(waypoint.color),
  ])
}

export const removeWaypoint = index => ({
  type: DIRECTIONS_REMOVE_WAYPOINT,
  payload: index,
})

export const resetWaypoints = () => ({
  type: DIRECTIONS_RESET_WAYPOINTS,
})

export const lock = () => ({
  type: DIRECTIONS_LOCK,
})

export const unlock = () => ({
  type: DIRECTIONS_UNLOCK,
})

export const submitWaypoint = (index, waypoint) => (dispatch, getState) => {
  const state = getState()

  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${waypoint.address}&key=${key}`)
    .then(response => response.json())
    .then(json => {
      if (!json.results.length) {
        return
      }

      const result = json.results[0]
      const latitude = result.geometry.location.lat
      const longitude = result.geometry.location.lng
      const coordinate = {latitude, longitude}

      dispatch([
        updateWaypoint(index, {
          address: result.formatted_address,
          coordinate,
        }),
        map.updateMarker({
          identifier: index,
          coordinate: waypoint.coordinate,
          title: waypoint.address,
        }),
        map.changeRegion({
          ...state.map.region,
          ...coordinate,
        }),
      ])
    })
}

export const getDirections = () => (dispatch, getState) => {
  const { directions } = getState()
  const getRoute = waypoints => {
    const coordinateToString = coordinate => Object.values(coordinate).join(',')
    const coordinatesToString = coordinates => coordinates.map(coordinateToString).join('|')

    if (waypoints.length < 2) {
      return Promise.reject()
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

    url += `?origin=${origin}&destination=${destination}&key=${key}`;
    url += waypointsStr.length > 0 ? `&waypoints=${waypointsStr}` : '';

    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!json.routes.length) {
          throw Error('No route found')
        }

        return json.routes[0]
      })
  }

  if (directions.waypoints.length === 1) {
    return
  }

  const selectedWaypoint = directions.waypoints[directions.selectedWaypointIndex]
  const lastWaypoint = directions.waypoints.slice(-1)[0]
  const getRouteToSelectedWaypoint = () => getRoute(directions.waypoints.slice(0, directions.selectedWaypointIndex + 1))
  const getRouteToLastWaypoint = () => getRoute(directions.waypoints)

    ;(async () => {
    const polylines = []

    if (directions.selectedWaypointIndex > 0) {
      let polyline = selectedWaypoint.polyline

      if (!polyline) {
        const routeToSelectedWaypoint = await getRouteToSelectedWaypoint()

        polyline = {
          coordinates: decodePolyline(routeToSelectedWaypoint.overview_polyline.points),
        }
      }

      polylines.push({
        ...polyline,
        ...selectedWaypointPolyline,
        strokeColor: selectedWaypoint.color,
      })
    }

    if (directions.selectedWaypointIndex < directions.waypoints.length - 1) {
      let polyline = lastWaypoint.polyline

      if (!polyline) {
        const routeToLastWaypoint = await getRouteToLastWaypoint()

        polyline = {
          coordinates: decodePolyline(routeToLastWaypoint.overview_polyline.points),
        }
      }

      polylines.push({
        ...polyline,
        ...lastWaypointPolyline,
      })
    } else {
      polylines.push({
        ...polylines[0],
        ...lastWaypointPolyline,
      })
    }

    dispatch([
      // {type: 'ASD', payload: routeToSelectedWaypoint},
      map.setPolylines([...polylines].reverse()),
      updateWaypoint(directions.selectedWaypointIndex, {
        // distance: routeToSelectedWaypoint.legs.reduce((distance, leg) => leg.distance.value, 0) / 1000,
        polyline: polylines[0],
      }),
    ])
  })()
}


function getColorForWaypoint(index) {
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

function decodePolyline(encoded) {
  if (!encoded) {
    return []
  }
  const poly = []
  let index = 0, len = encoded.length
  let lat = 0, lng = 0

  while (index < len) {
    let b, shift = 0, result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result = result | ((b & 0x1f) << shift)
      shift += 5
    } while (b >= 0x20)

    let dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1)
    lat += dlat

    shift = 0
    result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result = result | ((b & 0x1f) << shift)
      shift += 5
    } while (b >= 0x20)

    let dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1)
    lng += dlng

    let p = {
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    }

    poly.push(p)
  }

  return poly
}
