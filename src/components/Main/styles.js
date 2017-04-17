import { StyleSheet } from 'react-native'

export const main = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  addressBar: {
    position: 'absolute',
    left: 18,
    // top: 15,
    right: 18,
    zIndex: 1,
  },
  pin: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  directions: {
    zIndex: 1,
  },
  crosshair: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    zIndex: 1,
    width: 30,
    height: 30,
  },
})

export default {
  main,
}
