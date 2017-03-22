import React, { Component } from 'react'
import {
  Dimensions,
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import Map from '../../containers/Map'
import AddressBar from './AddressBar'
import Crosshair from './Crosshair'
import Directions from '../../containers/Directions'
import Dot from '../Dot'


export default class Main extends Component {
  static propTypes = {
    currentLocation: React.PropTypes.object.isRequired,
    goToMyLocation: React.PropTypes.func.isRequired,
    changeCoordinate: React.PropTypes.func.isRequired,
    openDirections: React.PropTypes.func.isRequired,
    isCrosshairVisible: React.PropTypes.bool.isRequired,
    isDirectionsOpen: React.PropTypes.bool.isRequired,
    dotColor: React.PropTypes.string.isRequired,
  }

  render() {
    return (
      <View style={styles.container}>
        <Map style={styles.map} onRegionChangeComplete={this.props.changeCoordinate}>
          <Dot
            style={{
              zIndex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            color={this.props.dotColor}
            visible={!this.props.isDirectionsOpen || !this.props.isDirectionsLocked}
          />

          <Crosshair style={styles.crosshair}
                     visible={this.props.isCrosshairVisible}
                     onPress={this.props.goToMyLocation}
          />
        </Map>

        <AddressBar
          style={styles.addressBar}
          value={this.props.currentLocation.address}
          visible={!this.props.isDirectionsOpen}
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
    top: 15,
    right: 18,
    zIndex: 1,
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
