import { connect } from 'react-redux'
import {
  closeDirections,
  createWaypoint,
  updateWaypoint,
  removeWaypoint,
  submitWaypoint,
  selectAndGoToWaypoint,
  finishEditing,
  startEditing,
} from '../actions/directions'
import Directions from '../components/Directions'


const mapStateToProps = state => ({
  ...state.directions,
})

const mapDispatchToProps = {
  closeDirections,
  createWaypoint,
  updateWaypoint,
  removeWaypoint,
  submitWaypoint,
  selectAndGoToWaypoint,
  finishEditing,
  startEditing,
}

export default connect(mapStateToProps, mapDispatchToProps)(Directions)
