import { createSelector } from 'reselect'
import * as directions from '../selectors/directions'

export const getAddress = state => state.main.address

export const getPosition = state => state.main.position

export const getCoordinate = state => ({
  latitude: getRegion(state).latitude,
  longitude: getRegion(state).longitude,
})

export const getRegion = state => {
  return state.main.region
}

// todo: review
// export const getRegion = state => {
//   if (!directions.isDirectionsVisible(state)) {
//     return state.main.region
//   }
//
//   const selectedWaypoint = directions.getSelectedWaypoint(state)
//
//   if (!directions.isDirectionsEditing(state) || !selectedWaypoint.coordinate) {
//     return state.main.region
//   }
//
//   return {
//     ...state.main.region,
//     ...selectedWaypoint.coordinate,
//   }
// }

export const getMarkerFilter = state => ({
  editing: directions.isDirectionsEditing(state),
  selectedWaypointIndex: directions.getSelectedWaypointIndex(state),
})

export const getMarkers = createSelector(
  [directions.getWaypoints, getMarkerFilter],
  (waypoints, filter) => waypoints
    .map((waypoint, index) => createMarker({ waypoint, calloutVisible: index === filter.selectedWaypointIndex }))
    .filter((marker, index) => !filter.editing || index !== filter.selectedWaypointIndex)
)

export const createMarker = ({ waypoint, calloutVisible }) => ({
  color: waypoint.color,
  coordinate: waypoint.coordinate,
  title: waypoint.address,
  calloutVisible,
})

export const getPinColor = state => state.directions.visible && directions.getSelectedWaypoint(state)
  ? directions.getSelectedWaypoint(state).color : 'black'

export const getDestinationPolyline = waypoints => ({
  coordinates: getPolylineForWaypoint(waypoints, waypoints.length - 1),
  strokeColor: 'grey',
  strokeWidth: 5,
})

export const getSelectedWaypointPolyline = (waypoints, selectedWaypointIndex) => ({
  coordinates: getPolylineForWaypoint(waypoints, selectedWaypointIndex),
  strokeColor: waypoints[selectedWaypointIndex].color,
  strokeWidth: 3,
})

export const getPolylines = createSelector(
  [
    directions.isDirectionsVisible,
    directions.isDirectionsEditing,
    directions.getSelectedWaypointIndex,
    directions.getWaypoints,
  ],
  (visible, editing, selectedWaypointIndex, waypoints) =>
    !visible || editing ? [] : [
      getDestinationPolyline(waypoints),
      getSelectedWaypointPolyline(waypoints, selectedWaypointIndex),
    ]
)

const getPolylineForWaypoint = (waypoints, index) =>
  waypoints
    .slice(1, index + 1)
    .reduce((polyline, waypoint) => polyline.concat(waypoint.polyline), [])
