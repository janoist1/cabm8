import React, { Component } from 'react'
import { Image, TouchableOpacity } from 'react-native'


export default ({visible, onPress, style}) => (
  visible &&
  <TouchableOpacity onPress={onPress} style={style}>
    <Image
      style={{flex: 1, width: style.width, height: style.height}}
      source={require('../../assets/crosshair.png')} />
  </TouchableOpacity>
)
