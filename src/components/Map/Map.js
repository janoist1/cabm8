import React from 'react'
import { View, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import Pin from '../Pin'

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
          anchor={{ x: 0.5, y: 0.5 }}
          key={i}
        >
          <Pin key={i} color={marker.color} />
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
  children: React.PropTypes.any,
  region: React.PropTypes.object.isRequired,
  markers: React.PropTypes.array.isRequired,
  polylines: React.PropTypes.array.isRequired,
  style: React.PropTypes.any,
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
})

export default Map
