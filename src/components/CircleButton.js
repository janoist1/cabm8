import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import { circleButton as styles } from './styles'

export const CircleButton = ({ icon, size = 30, visible = true, onPress, style }) => (
  visible &&
  <View style={style}>
    <TouchableOpacity
      style={[styles.view, {width: size, height: size, borderRadius: size / 2}]}
      onPress={onPress}
    >
      <FontAwesome style={[styles.icon, {fontSize: size * 3 / 4}]}>{Icons[icon]}</FontAwesome>
    </TouchableOpacity>
  </View>
)

CircleButton.PropTypes = {
  icon: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  visible: React.PropTypes.bool,
  onPress: React.PropTypes.func.isRequired,
}

export default CircleButton
