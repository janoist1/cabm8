import React from 'react'
import {
  Scene,
  Reducer,
  Router,
  Switch,
  Modal,
  Actions,
  ActionConst,
} from 'react-native-router-flux'
import Main from './containers/Main'
import Counter from './modules/Counter'

export default scenes = Actions.create(
  <Scene key="modal" component={Modal}>
    <Scene key="root" hideNavBar={true}>
      <Scene key="main" component={Main} title="Main" initial={true} />
      <Scene key="counter" component={Counter} title="Counter" hideNavBar={false} />
    </Scene>
  </Scene>
)
