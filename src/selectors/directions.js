import { calculateDistance } from '../lib'
import Config from 'react-native-config'

export const getDirections = state => state.directions

export const isDirectionsVisible = state => getDirections(state).visible

export const isDirectionsEditing = state => getDirections(state).editing

export const getWaypoints = state => getDirections(state).waypoints

export const getSelectedWaypoint = state => getWaypoints(state)[getSelectedWaypointIndex(state)]

export const getSelectedWaypointIndex = state => getDirections(state).selectedWaypointIndex

export const getLastWaypoint = state => getWaypoints(state).slice(-1)[0]

export const getDisplayableWaypoints = state => {
  const { waypoints } = getDirections(state)

  if (waypoints.length < 1) {
    return []
  }

  let { passengers } = waypoints[0]
  let farePayed = 0

  const getFareDetails = waypoint => {
    const fareAtThisStop = waypoint.fare - farePayed
    const farePerPassenger = fareAtThisStop / passengers
    const fareDue = farePerPassenger * waypoint.passengers

    farePayed += fareDue
    passengers -= waypoint.passengers

    return {
      fareDue: fareDue.toFixed(1),
      farePerPassenger: farePerPassenger.toFixed(1),
    }
  }

  return waypoints.map((waypoint, index) => {
    if (index === 0) {
      return waypoint
    }

    return {
      ...waypoint,
      ...getFareDetails(waypoint),
      remainingPassengers: getRemainingPassengers(waypoints) + waypoints[index].passengers,
    }
  })
}

export const getRemainingPassengers = waypoints => {
  const totalNumberOfPassengers = waypoints[0].passengers

  return waypoints
      .slice(1)
      .reduce((passengers, waypoint) => passengers - waypoint.passengers, totalNumberOfPassengers)
}

export const getCanAddMoreWaypoints = state => getWaypoints(state).length < 1 ||
  (getWaypoints(state).length < Config.MAX_WAYPOINTS && getRemainingPassengers(getWaypoints(state)) > 0)

export const isWaypointAtCoordinate = (waypoint, coordinate) =>
  !!waypoint.coordinate && calculateDistance(waypoint.coordinate, coordinate) < 1 // less than a metre

export const getRouteRegion = state => getDirections(state).routeRegion
