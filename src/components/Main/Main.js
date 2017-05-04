import React from 'react'
import { View } from 'react-native'
import Map from '../Map'
import AddressBar from './AddressBar'
import Crosshair from './Crosshair'
import Directions from '../../containers/Directions'
import Pin from '../Pin'
import { main as styles } from './styles'

const Main = ({
  address,
  goToMyPosition,
  changeRegion,
  openDirections,
  selectWaypoint,
  crosshairVisible,
  directionsVisible,
  directionsEditing,
  pinColor,
  map,
}) => (
  <View style={styles.container}>
    <Map style={styles.map} {...map} onRegionChangeComplete={changeRegion} onMarkerPress={selectWaypoint}>
      <Pin
        style={styles.pin}
        color={pinColor}
        visible={!directionsVisible || directionsEditing}
      />

      <Crosshair style={styles.crosshair} visible={crosshairVisible} onPress={goToMyPosition} />
    </Map>

    <AddressBar
      style={styles.addressBar}
      value={address}
      visible={!directionsVisible}
      onPress={openDirections}
    />

    <Directions style={styles.directions} />
  </View>
)

Main.propTypes = {
  address: React.PropTypes.string.isRequired,
  goToMyPosition: React.PropTypes.func.isRequired,
  changeRegion: React.PropTypes.func.isRequired,
  openDirections: React.PropTypes.func.isRequired,
  selectWaypoint: React.PropTypes.func.isRequired,
  crosshairVisible: React.PropTypes.bool.isRequired,
  directionsVisible: React.PropTypes.bool.isRequired,
  directionsEditing: React.PropTypes.bool.isRequired,
  pinColor: React.PropTypes.string.isRequired,
  map: React.PropTypes.object.isRequired,
}

export default Main
