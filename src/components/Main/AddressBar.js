import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'

export const AddressBar = ({style, value, visible, onPress}) => (
  visible &&
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <Text style={styles.text}>{value}</Text>
  </TouchableOpacity>
)

AddressBar.propTypes = {
  value: React.PropTypes.string.isRequired,
  visible: React.PropTypes.bool.isRequired,
  onPress: React.PropTypes.func.isRequired,
  style: React.PropTypes.any.isRequired,
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gainsboro',
    borderRadius: 3,
  },
  text: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
  },
})

export default AddressBar
