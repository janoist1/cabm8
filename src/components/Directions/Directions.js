import React, { Component } from 'react'
import { Animated, View, StyleSheet } from 'react-native'
import CircleButton from '../CircleButton'
import ViewPager from '../ViewPager'
import Waypoint from './Waypoint'

const CONTAINER_HEIGHT = 200

class Directions extends Component {
  static propTypes = {
    visible: React.PropTypes.bool.isRequired,
    editing: React.PropTypes.bool.isRequired,
    waypoints: React.PropTypes.array.isRequired,
    canAddMoreWaypoints: React.PropTypes.bool.isRequired,
    selectedWaypointIndex: React.PropTypes.number.isRequired,
    duration: React.PropTypes.number,
    style: React.PropTypes.any,
    closeDirections: React.PropTypes.func.isRequired,
    addNextWaypoint: React.PropTypes.func.isRequired,
    submitWaypointAddress: React.PropTypes.func.isRequired,
    submitWaypointFare: React.PropTypes.func.isRequired,
    submitWaypointPassengers: React.PropTypes.func.isRequired,
    selectWaypoint: React.PropTypes.func.isRequired,
    finishEditing: React.PropTypes.func.isRequired,
    startEditing: React.PropTypes.func.isRequired,
  }

  height = new Animated.Value(0)
  position = 'relative'

  componentWillReceiveProps (nextProps) {
    if (nextProps.visible === this.props.visible) {
      return
    }

    if (!this.props.visible && nextProps.visible) {
      this.__show()
    }

    if (this.props.visible && !nextProps.visible) {
      this.__hide()
    }
  }

  render () {
    // todo: refactor / spread props
    return (
      <Animated.View style={[styles.container, this.props.style, { height: this.height, position: this.position }]}>
        <ViewPager
          style={styles.waypoints}
          selectedIndex={this.props.selectedWaypointIndex}
          onSelectedIndexChange={this.props.selectWaypoint}
        >
          {this.props.waypoints.map((item, i) =>
            <Waypoint key={i}
              index={i}
              active={this.props.selectedWaypointIndex === i}
              editing={this.props.editing}
              waypoint={item}
              style={styles.waypoint}
              onSubmitAddress={address => this.props.submitWaypointAddress(address)}
              onSubmitFare={fare => this.props.submitWaypointFare(fare)}
              onSubmitPassengers={passengers => this.props.submitWaypointPassengers(passengers)}
            />
          )}
        </ViewPager>

        <View style={styles.footer}>
          <CircleButton style={styles.footerButton} title='👈' onPress={this.props.closeDirections} />
          <CircleButton style={styles.footerButton}
            title='👍'
            onPress={() => this.props.finishEditing()}
            visible={!this.props.canAddMoreWaypoints && this.props.editing && this.props.waypoints.length > 1}
          />
          <CircleButton style={styles.footerButton}
            title='✍️'
            onPress={() => this.props.startEditing()}
            visible={!this.props.editing}
          />
          <CircleButton style={styles.footerButton}
            title='👉'
            onPress={() => this.props.addNextWaypoint()}
            visible={this.props.canAddMoreWaypoints}
          />
        </View>
      </Animated.View>
    )
  }

  __animate (prop, from, to, cb) {
    prop.setValue(from)

    return Animated.timing(
      prop,
      {
        toValue: to,
        duration: this.props.duration || 300,
        // easing: Easing.quad,
      }
    ).start(cb)
  }

  __show () {
    this.position = 'absolute'
    this.__animate(this.height, 0, CONTAINER_HEIGHT, () => {
      this.position = 'relative'
      this.forceUpdate()
    })
  }

  __hide () {
    this.position = 'absolute'
    setTimeout(() => {
      this.__animate(this.height, CONTAINER_HEIGHT, 0, () => {
        this.position = 'relative'
        this.forceUpdate()
      })
    }, 10)
  }
}

const styles = StyleSheet.create({
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
  footer: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  footerButton: {
    flex: 1,
    width: 36,
    height: 36,
    marginLeft: 5,
  },
})

export default Directions
