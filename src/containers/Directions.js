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
} from '../modules/directions'
import {
  getDisplayableWaypoints,
  getCanAddMoreWaypoints,
} from '../selectors/directions'
import Directions from '../components/Directions'

const mapStateToProps = state => ({
  ...state.directions,
  waypoints: getDisplayableWaypoints(state),
  canAddMoreWaypoints: getCanAddMoreWaypoints(state),
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
