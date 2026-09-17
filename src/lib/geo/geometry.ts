export type LonLat = [number, number]

/** Ray casting sobre el anillo exterior. Asume polígonos simples sin huecos (valido para los barrios de Valencia). */
export function pointInRing(longitude: number, latitude: number, ring: LonLat[]): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    const intersects =
      yi > latitude !== yj > latitude &&
      longitude < ((xj - xi) * (latitude - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

export function pointInPolygon(longitude: number, latitude: number, coordinates: LonLat[][]): boolean {
  const outerRing = coordinates[0]
  if (!outerRing) return false
  return pointInRing(longitude, latitude, outerRing)
}

const EARTH_RADIUS_METERS = 6371000

export function haversineDistanceMeters(a: LonLat, b: LonLat): number {
  const [lon1, lat1] = a
  const [lon2, lat2] = b
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)

  const h =
    sinDLat * sinDLat + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * sinDLon * sinDLon

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h))
}
