const earthRadiusInMetre = 6371e3

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

export const calculateRegionDelta = ({ latitude }, radiusInMetre, aspectRatio = 1) => {
  const radiusInRad = radiusInMetre / earthRadiusInMetre
  const longitudeDelta = rad2deg(radiusInRad / Math.cos(deg2rad(latitude)))
  const latitudeDelta = aspectRatio * rad2deg(radiusInRad)

  return {
    latitudeDelta,
    longitudeDelta,
  }
}

export const boundsToRegion = (bounds, margin = 1, aspectRatio = 1) => {
  const [ latitude, longitude ] = boundsToCenter(bounds)
  const R = (calculateDistance(bounds[0], { latitude, longitude })) * margin

  return {
    latitude,
    longitude,
    ...calculateRegionDelta({ latitude }, R, aspectRatio),
  }
}

export const boundsToCenter = bounds =>
  bounds.reduce((coordinate1, coordinate2) => [
    average([coordinate1.latitude, coordinate2.latitude]),
    average([coordinate1.longitude, coordinate2.longitude]),
  ])

export const calculateDistance = (coord1, coord2) => {
  const R = earthRadiusInMetre
  const lat1 = coord1.latitude
  const lat2 = coord2.latitude
  const lon1 = coord1.longitude
  const lon2 = coord2.longitude
  const φ1 = deg2rad(lat1)
  const φ2 = deg2rad(lat2)
  const Δφ = deg2rad(lat2 - lat1)
  const Δλ = deg2rad(lon2 - lon1)

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export const deg2rad = n => n * Math.PI / 180

export const rad2deg = n => n / Math.PI * 180

export const average = numbers => numbers.reduce((sum, n) => sum + n, 0) / numbers.length

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
