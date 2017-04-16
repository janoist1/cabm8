export const geocodeCoordinate = coordinate =>
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}`)
    .then(response => response.json())

export const geocodeAddress = address => fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}`)

export const getDirections = coordinates => {
  const coordinateToString = coordinate => Object.values(coordinate).join(',')
  const coordinatesToString = coordinates => coordinates.map(coordinateToString).join('|')

  if (coordinates.length < 2) {
    return Promise.reject(Error('Not enough waypoints'))
  }

  let url = `https://maps.googleapis.com/maps/api/directions/json`
  const origin = coordinatesToString(coordinates.slice(0, 1))
  const destination = coordinatesToString(coordinates.slice(-1))
  const waypoints = coordinatesToString(coordinates.slice(1, -1))

  url += `?origin=${origin}&destination=${destination}`
  url += waypoints.length > 0 ? `&waypoints=${waypoints}` : ''

  return fetch(url)
    .then(response => response.json())
    .then(json => {
      if (!json.routes.length) {
        throw Error('No route found')
      }

      return json.routes[0]
    })
}

export const generateNumbers = (N, M) => [...(function * () {
  let i = M === undefined ? 0 : N
  let max = M || N
  while (i <= max) yield i++
})()]

export const arraysEqual = (array1, array2) =>
  array1.length === array2.length && array1.every((v, i) => v === array2[i])

export const calculateDistance = (coord1, coord2) => {
  const toRad = n => n * Math.PI / 180
  const R = 6371e3 // metres
  const lat1 = coord1.latitude * 1.0
  const lat2 = coord2.latitude * 1.0
  const lon1 = coord1.longitude * 1.0
  const lon2 = coord2.longitude * 1.0
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export const decodePolyline = encoded => {
  if (!encoded) {
    return []
  }

  const poly = []
  let index = 0
  let len = encoded.length
  let lat = 0
  let lng = 0

  while (index < len) {
    let b
    let shift = 0
    let result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result = result | ((b & 0x1f) << shift)
      shift += 5
    } while (b >= 0x20)

    let dlat = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1)
    lat += dlat

    shift = 0
    result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result = result | ((b & 0x1f) << shift)
      shift += 5
    } while (b >= 0x20)

    let dlng = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1)
    lng += dlng

    let p = {
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    }

    poly.push(p)
  }

  return poly
}
