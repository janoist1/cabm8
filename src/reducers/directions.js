import {
  DIRECTIONS_SHOW,
  DIRECTIONS_HIDE,
  DIRECTIONS_ADD_WAYPOINT,
  DIRECTIONS_UPDATE_WAYPOINT,
  DIRECTIONS_SET_SELECTED_WAYPOINT_INDEX,
  DIRECTIONS_RESET_WAYPOINTS,
  DIRECTIONS_SET_EDITING,
} from '../constants/directions'

const initialState = {
  visible: false,
  editing: false,
  waypoints: [],
  selectedWaypointIndex: 0,
}

const ACTION_HANDLERS = {
  [DIRECTIONS_SHOW]: (state, action) => ({
    ...state,
    visible: true,
  }),
  [DIRECTIONS_HIDE]: (state, action) => ({
    ...state,
    visible: false,
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
  [DIRECTIONS_SET_SELECTED_WAYPOINT_INDEX]: (state, action) => ({
    ...state,
    selectedWaypointIndex: action.payload,
  }),
  [DIRECTIONS_RESET_WAYPOINTS]: (state, action) => ({
    ...state,
    waypoints: [],
    selectedWaypointIndex: 0,
  }),
  [DIRECTIONS_SET_EDITING]: (state, action) => ({
    ...state,
    editing: action.payload,
  }),
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
