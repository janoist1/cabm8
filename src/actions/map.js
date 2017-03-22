import {
  MAP_CHANGE_POSITION,
  MAP_CHANGE_REGION,
  MAP_ADD_MARKER,
  MAP_UPDATE_MARKER,
  MAP_REMOVE_MARKER,
  MAP_REMOVE_ALL_MARKERS,
  MAP_ADD_POLYLINE,
  MAP_UPDATE_POLYLINE,
  MAP_REMOVE_POLYLINE,
  MAP_SET_POLYLINES,
} from '../constants/map'

export const changePosition = position => ({
  type: MAP_CHANGE_POSITION,
  payload: position,
})

export const changeRegion = region => ({
  type: MAP_CHANGE_REGION,
  payload: region,
})

export const addMarker = ({identifier, ...marker}) => ({
  type: MAP_ADD_MARKER,
  payload: {
    identifier,
    ...marker,
  },
})

export const updateMarker = ({identifier, ...marker}) => ({
  type: MAP_UPDATE_MARKER,
  payload: {
    identifier,
    ...marker,
  },
})

// export const addOrUpdateMarker = marker => (dispatch, getState) => {
//   const state = getState()
//   const hasMarker = () => state.map.markers.find(m => m.identifier === marker.identifier) !== undefined
//
//   dispatch((hasMarker() ? updateMarker : addMarker)(marker))
// }

export const removeMarker = ({identifier}) => ({
  type: MAP_REMOVE_MARKER,
  payload: {
    identifier,
  },
})

export const removeAllMarkers = () => ({
  type: MAP_REMOVE_ALL_MARKERS,
})

export const addPolyline = polyline => ({
  type: MAP_ADD_POLYLINE,
  payload: polyline,
})

export const updatePolyline = (index, polyline) => ({
  type: MAP_UPDATE_POLYLINE,
  payload: {
    index,
    polyline,
  },
})

export const setPolylines = polylines => ({
  type: MAP_SET_POLYLINES,
  payload: polylines,
})

export const goToCoordinate = coordinate => (dispatch, getState) =>
  dispatch(changeRegion({
    ...getState().map.region,
    ...coordinate,
  }))

export const goToMyLocation = () => (dispatch, getState) =>
  dispatch(goToCoordinate({
    latitude: getState().map.position.coords.latitude,
    longitude: getState().map.position.coords.longitude,
  }))
