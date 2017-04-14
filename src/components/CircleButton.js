import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export const CircleButton = ({ title, visible = true, onPress, style }) => (
  visible &&
  <View style={[...style, ...styles.container]}>
    <TouchableOpacity style={styles.view} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  </View>
)

CircleButton.PropTypes = {
  title: React.PropTypes.string.isRequired,
  visible: React.PropTypes.bool,
  onPress: React.PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  view: {
    flex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gainsboro',
    // backgroundColor: 'black',
    // marginLeft: 5, // FIXME
  },
  text: {
    flex: 1,
    fontSize: 26,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})

export default CircleButton
