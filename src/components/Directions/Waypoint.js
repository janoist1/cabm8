import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'


const Waypoint = ({
  index,
  waypoint,
  style,
  onChangeAddress,
  onSubmitEditingAddress,
  onChangeCost,
  onSubmitEditingCost,
}) => (
  <View style={[styles.container, style]}>
    <Text style={styles.index}>{index + 1}</Text>
    <View style={{flex: 1}}>
      <TextInput
        style={styles.addressInput}
        value={waypoint.address}
        onChangeText={onChangeAddress}
        onSubmitEditing={onSubmitEditingAddress}
      />
      <View style={styles.costContainer}>
        <Text style={styles.label}>Ratio:</Text>
        <Text style={[styles.input, styles.ratio]}>{waypoint.ratio}</Text>
        <Text style={styles.label}>Distance:</Text>
        <Text style={[styles.input, styles.distance]}>{waypoint.distance}</Text>
        <Text style={styles.label}>Cost:</Text>
        <TextInput
          style={[styles.input, styles.cost]}
          value={waypoint.cost + ""}
          onChangeText={onChangeCost}
          onSubmitEditing={onSubmitEditingCost}
        />
      </View>
    </View>
  </View>
)

Waypoint.propTypes = {
  index: React.PropTypes.number.isRequired,
  waypoint: React.PropTypes.object.isRequired,
  style: React.PropTypes.any.isRequired,
  onChangeAddress: React.PropTypes.func.isRequired,
  onSubmitEditingAddress: React.PropTypes.func.isRequired,
  onChangeCost: React.PropTypes.func.isRequired,
  onSubmitEditingCost: React.PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  index: {
    marginLeft: 5,
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 48,
    // textAlignVertical: 'center',
  },
  addressInput: {
    width: '100%',
  },
  costContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
    textAlignVertical: 'center',
    marginRight: 5,
  },
  input: {
    marginRight: 5,
  },
  ratio: {
    width: 50,
    textAlignVertical: 'center',
  },
  distance: {
    width: 50,
    textAlignVertical: 'center',
  },
  cost: {
    width: 50,
  },
})

export default Waypoint
