import React from 'react'
import { Scene, Modal, Actions } from 'react-native-router-flux'
import Main from './containers/Main'

export default Actions.create(
  <Scene key='modal' component={Modal}>
    <Scene key='root' hideNavBar>
      <Scene key='main' component={Main} title='Main' initial />
    </Scene>
  </Scene>)
