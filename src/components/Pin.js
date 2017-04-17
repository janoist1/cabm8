import React from 'react'
import { View } from 'react-native'
import { pin as styles } from './styles'

const Pin = ({ color = 'black', visible = true, style = {} }) => (
  visible &&
  <View pointerEvents='none' style={[styles.container, style]} key={color}>
    <View style={styles.dot}>
      <View style={[styles.dotColor, { backgroundColor: color }]} />
    </View>
  </View>
)

Pin.propTypes = {
  color: React.PropTypes.string,
  visible: React.PropTypes.bool,
}

export default Pin
