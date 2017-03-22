import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'
import CircleButton from '../CircleButton'
import ViewPager from '../ViewPager'
import Waypoint from './Waypoint'


class Directions extends Component {
  static propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    isLocked: React.PropTypes.bool.isRequired,
    waypoints: React.PropTypes.array.isRequired,
    selectedWaypointIndex: React.PropTypes.number.isRequired,
    closeDirections: React.PropTypes.func.isRequired,
    createWaypoint: React.PropTypes.func.isRequired,
    removeWaypoint: React.PropTypes.func.isRequired,
    updateWaypoint: React.PropTypes.func.isRequired,
    submitWaypoint: React.PropTypes.func.isRequired,
    selectAndGoToWaypoint: React.PropTypes.func.isRequired,
    finishEditing: React.PropTypes.func.isRequired,
    startEditing: React.PropTypes.func.isRequired,
  }

  render() {
    return (
      this.props.isOpen &&
      <View style={[styles.container, this.props.style]}>
        <ViewPager
          style={styles.waypoints}
          selectedIndex={this.props.selectedWaypointIndex}
          onSelectedIndexChange={this.props.selectAndGoToWaypoint}
        >
          {this.props.waypoints.map((item, i) =>
            <Waypoint key={i}
                      index={i}
                      waypoint={item}
                      style={styles.waypoint}
                      onChangeAddress={value => { this.props.updateWaypoint(i, {address: value}) }}
                      onSubmitEditingAddress={() => this.props.submitWaypoint(i, item)}
                      onChangeCost={value => { this.props.updateWaypoint(i, {cost: value}) }}
                      onSubmitEditingCost={() => this.props.submitWaypoint(i, item)}
            />
          )}
        </ViewPager>

        <View style={styles.footer}>
          <CircleButton style={styles.footerButton} title="👈" onPress={this.props.closeDirections} />
          <CircleButton style={styles.footerButton}
                        title="👍"
                        onPress={() => this.props.finishEditing()}
                        visible={!this.props.isLocked}
          />
          <CircleButton style={styles.footerButton}
                        title="✍️"
                        onPress={() => this.props.startEditing()}
                        visible={this.props.isLocked}
          />
          <CircleButton style={styles.footerButton} title="👉" onPress={() => this.props.createWaypoint()} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 200,
  },
  waypoints: {
    marginBottom: 5,
  },
  waypoint: {
    margin: 10,
  },
  footer: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  footerButton: {
    flex: 1,
    width: 36,
    height: 36,
    marginLeft: 5,
  },
})

export default Directions
