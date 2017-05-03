import React from 'react'
import { View, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import Marker from './Marker'

export const Map = ({
  children,
  polylines,
  markers,
  region,
  style,
  onRegionChangeComplete,
  onMarkerPress,
}) =>
  <View style={[styles.container, style]}>
    <MapView
      toolbarEnabled={false}
      showsIndoors={false}
      moveOnMarkerPress={false}
      style={styles.map}
      region={region}
      onRegionChangeComplete={onRegionChangeComplete}
  >
      {markers.map((marker, i) => (
        <Marker {...marker} onPress={() => onMarkerPress(i)} key={i} />
    ))}

      {polylines.map((polyline, i) => (
        <MapView.Polyline {...polyline} key={i} />
    ))}
    </MapView>

    {children}
  </View>

Map.propTypes = {
  children: React.PropTypes.any,
  region: React.PropTypes.object.isRequired,
  markers: React.PropTypes.array.isRequired,
  polylines: React.PropTypes.array.isRequired,
  style: React.PropTypes.any,
  onRegionChangeComplete: React.PropTypes.func,
  onMarkerPress: React.PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  map: {
    flex: 1,
  },
})

export default Map
