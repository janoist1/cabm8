export const isDirectionsVisible = state => state.directions.visible

export const isDirectionsEditing = state => state.directions.editing

export const getWaypoints = state => state.directions.waypoints

export const getVisibleWaypoints = state => getWaypoints(state).filter(waypoint => waypoint.visible)

export const getSelectedWaypoint = state => getWaypoints(state)[getSelectedWaypointIndex(state)]

export const getSelectedWaypointIndex = state => state.directions.selectedWaypointIndex

export const getLastWaypoint = state => getWaypoints(state).slice(-1)[0]
