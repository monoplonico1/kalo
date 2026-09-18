import { Droplets, Thermometer, TreePine, Waves } from 'lucide-react'
import type { CircleMarkerOptions } from 'leaflet'
import type { ComponentType } from 'react'
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

export const SHADE_ORDER: ShadeBucket[] = ['muy_baja', 'baja', 'media', 'alta', 'muy_alta']

export type MapLayerId = 'barrios' | 'fountains' | 'parks' | 'beach'

export const FOUNTAIN_COLOR = '#0A84FF'
export const PARK_COLOR = '#30D158'
export const BEACH_COLOR = '#00C7BE'
export const HEAT_LAYER_COLOR = '#FF9F0A'
export const YOU_ARE_HERE_COLOR = '#FF453A'

interface MapLayerDef {
  id: MapLayerId
  label: string
  icon: ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>
  color: string
}

export const MAP_LAYERS: MapLayerDef[] = [
  { id: 'barrios', label: 'Calor', icon: Thermometer, color: HEAT_LAYER_COLOR },
  { id: 'fountains', label: 'Fuentes', icon: Droplets, color: FOUNTAIN_COLOR },
  { id: 'parks', label: 'Parques', icon: TreePine, color: PARK_COLOR },
  { id: 'beach', label: 'Playa', icon: Waves, color: BEACH_COLOR },
]

/**
 * circleMarker (capa vectorial nativa de Leaflet) en vez de Marker+icono por
 * punto: con 800+ fuentes, un DOM node por marcador se nota en moviles.
 * Radios distintos ademas del color: tocar cualquiera abre el panel de
 * detalle con el nombre, asi que el color nunca es la unica pista.
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

export const fountainMarkerStyle = markerStyle(FOUNTAIN_COLOR, 5)
export const beachMarkerStyle = markerStyle(BEACH_COLOR, 6)
export const parkMarkerStyle = markerStyle(PARK_COLOR, 7)
export const youAreHereMarkerStyle = markerStyle(YOU_ARE_HERE_COLOR, 9)

export type MapCategory = 'barrio' | 'fountain' | 'park' | 'beach'

export interface SelectedMapPlace {
  category: MapCategory
  nombre: string
  lat: number
  lon: number
  sombraBucket?: ShadeBucket | null
  vulnerabilidadGlobal?: string | null
  areaM2?: number
  beachType?: 'ducha' | 'lavapies'
  /** Solo para barrios: oficial de la ciudad + ajuste de sombra del barrio (sin perfil de salud, es sobre el lugar). */
  estimatedApparentTemperature?: number
}

export const CATEGORY_LABELS: Record<MapCategory, string> = {
  barrio: 'Barrio',
  fountain: 'Fuente de agua pública',
  park: 'Parque o jardín',
  beach: 'Playa',
}

/** Texto de "como te ayuda con el calor", especifico por categoria y, cuando aplica, por atributo. */
export function helpTextFor(place: SelectedMapPlace): string {
  switch (place.category) {
    case 'fountain':
      return 'Podés hidratarte o refrescarte la cara y las muñecas. Buena parada si sentís mareos o mucho calor caminando.'
    case 'park':
      return 'La sombra de los árboles puede sentirse varios grados más fresca que la calle. Buen lugar para hacer una pausa larga.'
    case 'beach': {
      const isShower = place.beachType === 'ducha'
      return isShower
        ? 'Ducha pública para refrescarte directamente con agua.'
        : 'Lavapiés para refrescarte los pies antes o después de la playa.'
    }
    case 'barrio': {
      const bucket = place.sombraBucket
      const shadeText = bucket
        ? `Este barrio tiene cobertura de sombra y arbolado ${SHADE_LABELS[bucket]}.`
        : 'Todavía no tenemos datos de sombra para este barrio.'
      return shadeText
    }
  }
}
