import type { CircleMarkerOptions } from 'leaflet'
import type { ShadeBucket } from '../../types'

export const SHADE_COLORS: Record<ShadeBucket, string> = {
  muy_baja: '#FF453A',
  baja: '#FF9F0A',
  media: '#FFD60A',
  alta: '#30D158',
  muy_alta: '#0A84FF',
}

export const SHADE_LABELS: Record<ShadeBucket, string> = {
  muy_baja: 'muy baja',
  baja: 'baja',
  media: 'media',
  alta: 'alta',
  muy_alta: 'muy alta',
}

export const FOUNTAIN_COLOR = '#0A84FF'
export const PARK_COLOR = '#30D158'
export const BEACH_COLOR = '#00C7BE'
export const YOU_ARE_HERE_COLOR = '#FF453A'

/**
 * circleMarker (capa vectorial nativa de Leaflet) en vez de Marker+icono por
 * punto: con 800+ fuentes, un DOM node por marcador se nota en moviles.
 */
function markerStyle(color: string, radius: number): CircleMarkerOptions {
  return {
    radius,
    fillColor: color,
    fillOpacity: 0.9,
    color: 'rgba(255,255,255,0.9)',
    weight: 1.5,
  }
}

// Radios distintos por categoria ademas del color: un toque en cualquier
// marcador muestra su nombre en un popup, asi que el color nunca es la unica
// pista, ni siquiera antes de tocarlo.
export const fountainMarkerStyle = markerStyle(FOUNTAIN_COLOR, 5)
export const beachMarkerStyle = markerStyle(BEACH_COLOR, 6)
export const parkMarkerStyle = markerStyle(PARK_COLOR, 7)
export const youAreHereMarkerStyle = markerStyle(YOU_ARE_HERE_COLOR, 9)
