import { connect } from 'react-redux'
import { calculateDistance } from '../lib'
import {
  getPosition,
  getRegion,
  getPinColor,
  getMarkers,
  getPolylines,
} from '../selectors/main'
import {
  changeRegion,
  goToMyPosition,
  openDirections,
} from '../modules/main'
import Main from '../components/Main'

const mapStateToProps = state => ({
  ...state.main,
  directionsVisible: state.directions.visible,
  directionsEditing: state.directions.editing,
  crosshairVisible: getPosition(state) !== null && calculateDistance(getPosition(state), getRegion(state)) > 1,
  pinColor: getPinColor(state),
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
