import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { circleButton as styles } from './styles'

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

export default CircleButton
