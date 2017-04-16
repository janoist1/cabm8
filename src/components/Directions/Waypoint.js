import React from 'react'
import { View, Text, Picker, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { generateNumbers } from '../../lib'
import styles_ from './styles'
import Config from 'react-native-config'

class Waypoint extends React.Component {
  static propTypes = {
    active: React.PropTypes.bool.isRequired,
    index: React.PropTypes.number.isRequired,
    editing: React.PropTypes.bool.isRequired,
    waypoint: React.PropTypes.object.isRequired,
    style: React.PropTypes.any,
    onSubmitAddress: React.PropTypes.func.isRequired,
    onSubmitFare: React.PropTypes.func.isRequired,
    onSubmitPassengers: React.PropTypes.func.isRequired,
  }

  state = {
    address: '',
    addressEditing: false,
    fare: 0,
  }

  // this is a workaround for an issue with Picker.onValueChange
  // need to avoid onValueChange to get fired when re-rendering
  // more: https://github.com/facebook/react-native/issues/12520
  _pickerWorkaroundFlag1: false // becomes true if we have just swiped to this waypoint
  _pickerWorkaroundFlag2: false // becomes true if remainingPassengers has changed

  constructor (props) {
    super(props)

    this.setAddress = this.setAddress.bind(this)
    this.setFare = this.setFare.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.active
  }

  componentWillReceiveProps (nextProps) {
    this._pickerWorkaroundFlag1 = this._pickerWorkaroundFlag1 || (!this.props.active && nextProps.active)
    this._pickerWorkaroundFlag2 = this._pickerWorkaroundFlag2 ||
      (nextProps.waypoint.remainingPassengers !== this.props.waypoint.remainingPassengers)

    const { address, fare } = nextProps.waypoint

    this.setState(state => ({
      address,
      fare,
    }))
  }

  render () {
    const { index, editing, waypoint, style, onSubmitAddress } = this.props
    const { address, addressEditing } = this.state

    return (
      <View style={[styles.container, style]}>
        <View style={styles.index}>
          <View style={[styles.indexBackground, { backgroundColor: waypoint.color }]}>
            <Text style={styles.indexText}>{index || '⚑'}</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.addressContainer}>
            <TextInput
              style={styles.addressInput}
              value={address}
              onChangeText={this.setAddress}
              onSubmitEditing={() => onSubmitAddress(this.state.address)}
              onFocus={() => this.setAddressEditing(true)}
              onBlur={() => this.setAddressEditing(false)}
            />
            {addressEditing && <TouchableOpacity style={styles.resetAddress} onPress={() => this.setAddress('')}>
              <Text>✖︎</Text>
            </TouchableOpacity>}
          </View>

          {index === 0 && this.renderStart()}

          {index > 0 && editing && this.renderEditing()}

          {index > 0 && !editing && this.renderResults()}
        </View>
      </View>
    )
  }

  renderStart () {
    return (
      <View style={styles.fareContainer}>
        <Text style={styles.label}>Number of passengers travelling:</Text>
        {this.renderPassengersInput(Config.MAX_PASSENGERS)}
      </View>
    )
  }

  renderEditing () {
    return (
      <View style={styles.fareContainer}>
        <Text style={styles.label}>Number of passengers getting off:</Text>
        {this.renderPassengersInput(this.props.waypoint.remainingPassengers)}

        <Text style={styles.label}>Fare on the taxi meter:</Text>
        {this.renderFareInput()}

      </View>
    )
  }

  renderResults () {
    const { waypoint } = this.props

    return (
      <View style={styles.fareContainer}>
        <Text style={styles.label}>Distance:</Text>
        <Text style={[styles.value, styles.distance]}>{(waypoint.distance / 1000).toFixed(1)} km</Text>

        <Text style={styles.label}>Fare due at this stop:</Text>
        <Text style={[styles.value]}>{waypoint.fareDue}</Text>

        <Text style={styles.label}>Fare per passenger at this stop:</Text>
        <Text style={[styles.value]}>{waypoint.farePerPassenger}</Text>
      </View>
    )
  }

  renderFareInput () {
    const { onSubmitFare } = this.props
    const { fare } = this.state

    return (
      <TextInput
        style={[styles.value, styles.fare]}
        keyboardType='numeric'
        value={fare + ''}
        onChangeText={this.setFare}
        onSubmitEditing={() => onSubmitFare(this.state.fare)}
      />
    )
  }

  renderPassengersInput (maxPassengers) {
    const { editing, onSubmitPassengers, waypoint: { passengers } } = this.props

    const applyPickerWorkaround = () => {
      let flag = this._pickerWorkaroundFlag1 && this._pickerWorkaroundFlag2

      this._pickerWorkaroundFlag1 = false
      this._pickerWorkaroundFlag2 = false

      return flag
    }

    return (
      <View style={styles_.passengers.container}>
        <Text style={[styles.value, styles_.passengers.value]}>{passengers}</Text>

        {editing && <Picker
          style={styles_.passengers.picker}
          selectedValue={passengers}
          mode={Picker.MODE_DROPDOWN}
          onValueChange={value => applyPickerWorkaround() || onSubmitPassengers(value)}>
          {generateNumbers(1, maxPassengers).map(i =>
            <Picker.Item key={i} label={i + ''} value={i} />
          )}
        </Picker>}
      </View>
    )
  }

  setAddressEditing (addressEditing) {
    this.setState(state => ({
      addressEditing,
    }))
  }

  setAddress (address) {
    this.setState(state => ({
      address,
    }))
  }

  setFare (fare) {
    this.setState(state => ({
      fare: fare ? parseFloat(fare) : 0,
    }))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  index: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 10,
  },
  indexBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
  },
  indexText: {
    fontWeight: 'bold',
    fontSize: 42,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  addressContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressInput: {
    flex: 1,
  },
  resetAddress: {
    width: 20,
    alignItems: 'center',
  },
  fareContainer: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
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
  distance: {
    width: 50,
    textAlignVertical: 'center',
  },
  fare: {
    width: 50,
  },
  total: {

  },
  totalValue: {
    fontSize: 20,
  },
})

export default Waypoint
