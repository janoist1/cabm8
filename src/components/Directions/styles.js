import { StyleSheet } from 'react-native'

// todo: move styles here

export const passengers = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: 55,
    height: 38,
    marginRight: 5,
  },
  value: {
    width: 15,
    textAlign: 'center',
  },
  picker: {
    width: 38,
    height: 38,
  },
})

export default {
  passengers,
}
