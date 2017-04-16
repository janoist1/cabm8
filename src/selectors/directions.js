import Config from 'react-native-config'

export const isDirectionsVisible = state => state.directions.visible

export const isDirectionsEditing = state => state.directions.editing

export const getWaypoints = state => state.directions.waypoints

export const getSelectedWaypoint = state => getWaypoints(state)[getSelectedWaypointIndex(state)]

export const getSelectedWaypointIndex = state => state.directions.selectedWaypointIndex

export const getLastWaypoint = state => getWaypoints(state).slice(-1)[0]

export const getDisplayableWaypoints = state => {
  const { waypoints } = state.directions

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
