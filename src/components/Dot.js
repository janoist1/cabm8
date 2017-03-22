import React, { Component } from 'react'
import { View, Image, StyleSheet } from 'react-native'

const Dot = ({color = 'black', visible = true, style = {}}) => (
  visible &&
  <View pointerEvents="none" style={[styles.container, style]}>
    <View style={styles.dot}>
      <View style={[styles.dotColor, {backgroundColor: color}]} />
    </View>
  </View>
)

Dot.propTypes = {
  color: React.PropTypes.string,
  visible: React.PropTypes.bool,
  style: React.PropTypes.object,
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gainsboro',
  },
  dotColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 1,
  },
})

export default Dot

