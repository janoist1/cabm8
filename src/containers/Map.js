import { connect } from 'react-redux'
import * as actions from '../actions/map'
import Map from '../components/Map'

const mapDispatchToProps = {
  changeRegion: region => actions.changeRegion(region),
}

const mapStateToProps = state => ({
  ...state.map,
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onRegionChangeComplete: region => {
    ownProps.onRegionChangeComplete && ownProps.onRegionChangeComplete(region)
    dispatchProps.changeRegion(region)
  },
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Map)
