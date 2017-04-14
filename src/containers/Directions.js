import { connect } from 'react-redux'
import {
  closeDirections,
  addNextWaypoint,
  updateWaypoint,
  removeWaypoint,
  submitWaypointAddress,
  submitWaypointFare,
  submitWaypointPassengers,
  selectWaypoint,
  finishEditing,
  startEditing,
} from '../actions/directions'
import Directions from '../components/Directions'

const getWaypointsWithProportionalFare = state => {
  const { waypoints } = state.directions

  if (waypoints.length < 1) {
    return []
  }

  let { passengers } = waypoints[0]
  let farePayed = 0

  return waypoints.reduce((waypoints, waypoint) => {
    if (waypoints === undefined) {
      return [waypoint]
    }

    const fareAtThisStop = waypoint.fare - farePayed
    const farePerPassenger = fareAtThisStop / passengers
    const fareDue = farePerPassenger * waypoint.passengers

    farePayed += fareDue
    passengers -= waypoint.passengers

    waypoints.push({
      ...waypoint,
      fareDue: fareDue.toFixed(1),
      farePerPassenger: farePerPassenger.toFixed(1),
    })

    return waypoints
  }, undefined)
}

const mapStateToProps = state => ({
  ...state.directions,
  waypoints: getWaypointsWithProportionalFare(state),
})

const mapDispatchToProps = {
  closeDirections,
  addNextWaypoint,
  updateWaypoint,
  removeWaypoint,
  submitWaypointAddress,
  submitWaypointFare,
  submitWaypointPassengers,
  selectWaypoint,
  finishEditing,
  startEditing,
}

export default connect(mapStateToProps, mapDispatchToProps)(Directions)
