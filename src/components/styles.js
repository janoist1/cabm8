import { StyleSheet } from 'react-native'

export const circleButton = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  view: {
    flex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gainsboro',
  },
  text: {
    flex: 1,
    fontSize: 26,
    color: 'white',
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
