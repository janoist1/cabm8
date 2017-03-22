import {
  DIRECTIONS_SHOW,
  DIRECTIONS_HIDE,
  DIRECTIONS_ADD_WAYPOINT,
  DIRECTIONS_UPDATE_WAYPOINT,
  DIRECTIONS_SELECT_WAYPOINT,
  DIRECTIONS_RESET_WAYPOINTS,
  DIRECTIONS_LOCK,
  DIRECTIONS_UNLOCK,
} from '../constants/directions'


const ACTION_HANDLERS = {
  [DIRECTIONS_SHOW]: (state, action) => ({
    ...state,
    isOpen: true,
  }),
  [DIRECTIONS_HIDE]: (state, action) => ({
    ...state,
    isOpen: false,
  }),
  [DIRECTIONS_ADD_WAYPOINT]: (state, action) => ({
    ...state,
    waypoints: [
      ...state.waypoints,
      action.payload,
    ],
  }),
  [DIRECTIONS_UPDATE_WAYPOINT]: (state, action) => ({
    ...state,
    waypoints: state.waypoints.map((item, i) => i !== action.payload.index ? item : {
      ...item,
      ...action.payload.waypoint,
    }),
  }),
  [DIRECTIONS_SELECT_WAYPOINT]: (state, action) => ({
    ...state,
    selectedWaypointIndex: action.payload,
  }),
  [DIRECTIONS_RESET_WAYPOINTS]: (state, action) => ({
    ...state,
    waypoints: [],
    selectedWaypointIndex: 0,
  }),
  [DIRECTIONS_LOCK]: (state, action) => ({
    ...state,
    isLocked: true,
  }),
  [DIRECTIONS_UNLOCK]: (state, action) => ({
    ...state,
    isLocked: false,
  }),
}

const initialState = {
  isOpen: false,
  isLocked: true,
  waypoints: [],
  selectedWaypointIndex: 0,
  routeToSelectedWaypoint: null,
  routeToDestination: null,
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
