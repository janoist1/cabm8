import { StyleSheet } from 'react-native'

export const directions = {
  main: StyleSheet.create({
    container: {
      backgroundColor: 'white',
      bottom: 0,
      left: 0,
      right: 0,
    },
    waypoints: {
      marginBottom: 5,
    },
    waypoint: {
      margin: 10,
    },
  }),
  footer: StyleSheet.create({
    container: {
      height: 44,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    button: {
      flex: 1,
      width: 36,
      height: 36,
      marginLeft: 5,
    },
  }),
}

export const waypoint = {
  main: StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
  }),
  index: StyleSheet.create({
    container: {
      marginTop: 5,
      marginLeft: 5,
      marginRight: 10,
    },
    background: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
    },
    text: {
      fontWeight: 'bold',
      fontSize: 42,
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },
  }),
  details: StyleSheet.create({
    container: {
      flex: 1,
    },
    label: {
      textAlignVertical: 'center',
      marginRight: 5,
      height: 38,
    },
    value: {
      fontWeight: 'bold',
      textAlignVertical: 'center',
      marginRight: 5,
      height: 38,
    },
  }),
  address: StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      flex: 1,
    },
    reset: {
      width: 20,
      alignItems: 'center',
    },
  }),
  fare: StyleSheet.create({
    container: {
      width: '100%',
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    distance: {
      width: 50,
      textAlignVertical: 'center',
    },
    input: {
      width: 50,
    },
  }),
  passengers: StyleSheet.create({
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
  }),
}

export default {
  directions,
  waypoint,
}
