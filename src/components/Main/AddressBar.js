import React from 'react'
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native'

class AddressBar extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    visible: React.PropTypes.bool.isRequired,
    duration: React.PropTypes.number,
    onPress: React.PropTypes.func.isRequired,
    style: React.PropTypes.any,
  }

  top = new Animated.Value(15)

  componentWillReceiveProps (nextProps) {
    if (nextProps.visible === this.props.visible) {
      return
    }

    if (!this.props.visible && nextProps.visible) {
      this.__show()
    }

    if (this.props.visible && !nextProps.visible) {
      this.__hide()
    }
  }

  render () {
    const { style, value, onPress } = this.props

    return (
      <Animated.View style={[styles.container, style, { top: this.top }]}>
        <TouchableOpacity style={styles.touchable} onPress={onPress}>
          <Text style={styles.text}>{value}</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  __animate (prop, from, to, cb) {
    prop.setValue(from)

    return Animated.timing(
      prop,
      {
        toValue: to,
        duration: this.props.duration || 300,
        // easing: Easing.linear,
      }
    ).start(cb)
  }

  __show () {
    this.__animate(this.top, -40, 15)
  }

  __hide () {
    this.__animate(this.top, 15, -40)
  }
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
  touchable: {
    flex: 1,
  },
  text: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
  },
})

export default AddressBar
