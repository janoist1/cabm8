import { connect } from 'react-redux'
import {
  changeCoordinate,
  openDirections,
} from '../actions/main'
import * as map from '../actions/map'
import Main from '../components/Main'


const toFixed = n => n.toFixed(5) * 1

const mapStateToProps = state => ({
  ...state.main,
  isDirectionsOpen: state.directions.isOpen,
  isDirectionsLocked: state.directions.isLocked,
  isCrosshairVisible: state.map.position !== null &&
    toFixed(state.map.position.coords.latitude) !== toFixed(state.map.region.latitude) &&
    toFixed(state.map.position.coords.longitude) !== toFixed(state.map.region.longitude),
})

const mapDispatchToProps = {
  goToMyLocation: map.goToMyLocation,
  changeCoordinate: region => changeCoordinate({
    latitude: region.latitude,
    longitude: region.longitude,
  }),
  openDirections,
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
