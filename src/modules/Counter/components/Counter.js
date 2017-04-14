import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

export const Counter = props => (
  <View style={styles.container}>
    <Text>Counter: {props.counter}</Text>
    <Button title='Increment' onPress={props.increment} />
    <Button title='Double (Async)' onPress={props.doubleAsync} />
  </View>
)

Counter.propTypes = {
  counter: React.PropTypes.number.isRequired,
  doubleAsync: React.PropTypes.func.isRequired,
  increment: React.PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
})

export default Counter
