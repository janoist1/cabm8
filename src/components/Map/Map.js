import React from 'react'
import { Dimensions, View, Text, Button, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import Dot from '../Dot'


export const Map = props => (
  <View style={[styles.container, props.style]}>
    <MapView
      style={styles.map}
      region={props.region}
      onRegionChangeComplete={props.onRegionChangeComplete}
    >
      {props.markers.map((marker, i) => (
        <MapView.Marker
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          anchor={{x: 0.5, y: 0.5}}
          key={i}
        >
          <Dot color={marker.color} />
        </MapView.Marker>
      ))}

      {props.polylines.map((polyline, i) => (
        <MapView.Polyline {...polyline} key={i} />
      ))}
    </MapView>

    {props.children}
  </View>
)

Map.propTypes = {
  position: React.PropTypes.object,
  region: React.PropTypes.object.isRequired,
  markers: React.PropTypes.array.isRequired,
  polylines: React.PropTypes.array.isRequired,
  onRegionChangeComplete: React.PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  map: {
    flex: 1,
  },
  dot: {
    zIndex: 1,
}
})

export default Map
