import React from 'react'
import MapView from 'react-native-maps'
import Pin from '../Pin'

class Marker extends React.Component {
  marker

  render () {
    const { color } = this.props

    return (
      <MapView.Marker
        {...this.props}
        ref={_marker => { this.marker = _marker }}
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <Pin color={color} />
      </MapView.Marker>
    )
  }

  componentDidUpdate () {
    this.updateCallout()
  }

  componentDidMount () {
    this.updateCallout()
  }

  updateCallout () {
    if (this.props.calloutVisible) {
      this.marker.showCallout()
    } else {
      this.marker.hideCallout()
    }
  }
}

Marker.propTypes = {
  calloutVisible: React.PropTypes.bool.isRequired,
  color: React.PropTypes.string.isRequired,
  /* eslint-disable react/no-unused-prop-types */
  coordinate: React.PropTypes.object.isRequired,
  title: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func,
  /* eslint-enable react/no-unused-prop-types */
}

export default Marker
