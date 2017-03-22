import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native'
import createStore from './src/store/createStore'
import scenes from './src/scenes'
import AppContainer from './src/containers/App'

const initialState = {}
const store = createStore(initialState)

export default class CabM8 extends Component {
  render() {
    return <AppContainer scenes={scenes} store={store} />
  }
}

AppRegistry.registerComponent('cabm8', () => CabM8)
