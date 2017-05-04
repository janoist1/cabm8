import { StyleSheet } from 'react-native'

export const circleButton = StyleSheet.create({
  container: {
  },
  view: {
    backgroundColor: 'white',
    borderWidth: 0,
    borderColor: 'black',
  },
  icon: {
    flex: 1,
    color: 'dimgray',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})

export const pin = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gainsboro',
  },
  dotColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 1,
  },
})

export default {
  circleButton,
  pin,
}
