import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import {
  changeRegion,
  goToMyPosition,
  openDirections,
} from '../actions/main'
import Main from '../components/Main'

const toFixed = n => n.toFixed(5) * 1
const getPosition = state => state.main.position
const getRegion = state => state.main.region
const getWaypoints = state => state.directions.waypoints
const getVisibleWaypoints = state => getWaypoints(state).filter(waypoint => waypoint.visible)
const getMarker = (waypoint, index) => {
  return ({
    identifier: index,
    color: waypoint.color,
    coordinate: waypoint.coordinate,
    title: waypoint.address,
  })
}
const getSelectedWaypoint = state => getWaypoints(state)[state.directions.selectedWaypointIndex]
const getLastWaypoint = state => getWaypoints(state)[getWaypoints(state).length - 1]
const getMarkers = createSelector([ getVisibleWaypoints ], waypoints => waypoints.map(getMarker))
const getSelectedWaypointPolyline = state => {
  const waypoint = getSelectedWaypoint(state)

  return {
    coordinates: waypoint.polyline,
    strokeColor: waypoint.color,
    strokeWidth: 3,
  }
}
const getLastWaypointPolyline = state => {
  const waypoint = getLastWaypoint(state)

  return {
    coordinates: waypoint.polyline,
    strokeColor: 'grey',
    strokeWidth: 5,
  }
}
const getPolylines = state => {
  const { directions } = state

  if (!directions.visible || directions.editing) {
    return []
  }

  const polylines = [
    getLastWaypointPolyline(state),
    getSelectedWaypointPolyline(state),
  ]

  return polylines.filter(polyline => !!polyline.coordinates)
}

const mapStateToProps = state => ({
  ...state.main,
  directionsVisible: state.directions.visible,
  directionsEditing: state.directions.editing,
  crosshairVisible: getPosition(state) !== null &&
    toFixed(getPosition(state).latitude) !== toFixed(getRegion(state).latitude) &&
    toFixed(getPosition(state).longitude) !== toFixed(getRegion(state).longitude),
  pinColor: state.directions.visible && getSelectedWaypoint(state) ? getSelectedWaypoint(state).color : 'black',
  map: {
    region: getRegion(state),
    markers: getMarkers(state),
    polylines: getPolylines(state),
  },
})

const mapDispatchToProps = {
  changeRegion,
  goToMyPosition,
  openDirections,
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
