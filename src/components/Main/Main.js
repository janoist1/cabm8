import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import Map from '../Map'
import AddressBar from './AddressBar'
import Crosshair from './Crosshair'
import Directions from '../../containers/Directions'
import Pin from '../Pin'

export default class Main extends Component {
  static propTypes = {
    address: React.PropTypes.string.isRequired,
    goToMyPosition: React.PropTypes.func.isRequired,
    changeRegion: React.PropTypes.func.isRequired,
    openDirections: React.PropTypes.func.isRequired,
    crosshairVisible: React.PropTypes.bool.isRequired,
    directionsVisible: React.PropTypes.bool.isRequired,
    directionsEditing: React.PropTypes.bool.isRequired,
    pinColor: React.PropTypes.string.isRequired,
    map: React.PropTypes.object.isRequired,
  }

  render () {
    return (
      <View style={styles.container}>
        <Map style={styles.map} {...this.props.map} onRegionChangeComplete={this.props.changeRegion}>
          <Pin
            style={styles.pin}
            color={this.props.pinColor}
            visible={!this.props.directionsVisible || this.props.directionsEditing}
          />

          <Crosshair style={styles.crosshair}
            visible={this.props.crosshairVisible}
            onPress={this.props.goToMyPosition}
          />
        </Map>

        <AddressBar
          style={styles.addressBar}
          value={this.props.address}
          visible={!this.props.directionsVisible}
          onPress={this.props.openDirections}
        />

        <Directions style={styles.directions} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  addressBar: {
    position: 'absolute',
    left: 18,
    // top: 15,
    right: 18,
    zIndex: 1,
  },
  pin: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  openDirections: {
    position: 'absolute',
    left: 15,
    bottom: 15,
    zIndex: 1,
  },
  directions: {
    zIndex: 1,
  },
  crosshair: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    zIndex: 1,
    width: 30,
    height: 30,
  },
})
