import createDebounce from 'redux-debounce'
import Config from 'react-native-config'

export const CONFIG_MAP = 'map'

export default createDebounce({
  [CONFIG_MAP]: Config.MAP_DEBOUNCE,
})
