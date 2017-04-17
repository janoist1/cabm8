import React, { Component } from 'react'
import { Animated, View, StyleSheet } from 'react-native'
import CircleButton from '../CircleButton'
import ViewPager from '../ViewPager'
import Waypoint from './Waypoint'
import { directions as styles } from './styles'

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
    const {
      editing,
      selectWaypoint,
      selectedWaypointIndex,
      style,
      waypoints,
      addNextWaypoint,
      canAddMoreWaypoints,
      closeDirections,
      finishEditing,
      startEditing,
      submitWaypointAddress,
      submitWaypointFare,
      submitWaypointPassengers,
    } = this.props

    return (
      <Animated.View style={[styles.main.container, style, { height: this.height, position: this.position }]}>
        <ViewPager
          style={styles.main.waypoints}
          selectedIndex={selectedWaypointIndex}
          onSelectedIndexChange={selectWaypoint}
        >
          {waypoints.map((item, i) =>
            <Waypoint key={i}
              index={i}
              active={selectedWaypointIndex === i}
              editing={editing}
              waypoint={item}
              style={styles.main.waypoint}
              onSubmitAddress={address => submitWaypointAddress(address)}
              onSubmitFare={fare => submitWaypointFare(fare)}
              onSubmitPassengers={passengers => submitWaypointPassengers(passengers)}
            />
          )}
        </ViewPager>

        <View style={styles.footer.container}>
          <CircleButton style={styles.footer.button} title='👈' onPress={closeDirections} />
          <CircleButton style={styles.footer.button}
            title='👍'
            onPress={() => finishEditing()}
            visible={!canAddMoreWaypoints && editing && waypoints.length > 1}
          />
          <CircleButton style={styles.footer.button}
            title='✍️'
            onPress={() => startEditing()}
            visible={!editing}
          />
          <CircleButton style={styles.footer.button}
            title='👉'
            onPress={() => addNextWaypoint()}
            visible={canAddMoreWaypoints}
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

export default Directions
