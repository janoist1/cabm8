import React, { Component, PropTypes } from 'react'
import { connect, Provider } from 'react-redux'
import { Router } from 'react-native-router-flux'
import * as main from '../modules/main'

const RouterWithRedux = connect()(Router)

class App extends Component {
  static propTypes = {
    scenes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  }

  componentDidMount () { // TODO: move it to a better place
    const { dispatch } = this.props.store
    const watchID = navigator.geolocation.watchPosition( // eslint-disable-line no-unused-vars
      position => {
        dispatch(main.setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }))
      },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 1000,
      }
    )

    // navigator.geolocation.clearWatch(this.watchID)
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { scenes, store } = this.props

    return (
      <Provider store={store}>
        <RouterWithRedux scenes={scenes} />
      </Provider>
    )
  }
}

export default App
