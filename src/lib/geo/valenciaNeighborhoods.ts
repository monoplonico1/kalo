import { haversineDistanceMeters, pointInPolygon, type LonLat } from './geometry'
import type { NearbyFountain, NeighborhoodContext, ShadeBucket, VulnerabilityLevel } from '../../types'

/**
 * Enriquecimiento hiperlocal solo para Valencia, a partir de datos abiertos
 * del Ajuntament de València (opendata.vlci.valencia.es): limites de barrio,
 * densidad arborea/sombra y vulnerabilidad social por barrio, mas fuentes de
 * agua publica. Fuera de esta zona, todo lo de este modulo devuelve null:
 * el resto de la app sigue funcionando igual que en cualquier otra ciudad.
 *
 * Los archivos en public/data/ son una foto simplificada de esos datasets
 * (ver CLAUDE.md para atribucion y como refrescarlos).
 */

const VALENCIA_BOUNDS = {
  minLat: 39.27,
  maxLat: 39.57,
  minLon: -0.44,
  maxLon: -0.27,
}

export function isWithinValencia(latitude: number, longitude: number): boolean {
  return (
    latitude >= VALENCIA_BOUNDS.minLat &&
    latitude <= VALENCIA_BOUNDS.maxLat &&
    longitude >= VALENCIA_BOUNDS.minLon &&
    longitude <= VALENCIA_BOUNDS.maxLon
  )
}

interface BarrioProperties {
  nombre: string
  distrito: string | null
  sombraBucket: ShadeBucket | null
  arbolesPerKm2: number | null
  vulnerabilidadGlobal: VulnerabilityLevel | null
  indiceVulnerabilidad: number | null
}

interface BarrioFeature {
  type: 'Feature'
  properties: BarrioProperties
  geometry: { type: 'Polygon'; coordinates: LonLat[][] }
}

interface FountainFeature {
  type: 'Feature'
  properties: { calle: string | null }
  geometry: { type: 'Point'; coordinates: LonLat }
}

/**
 * Ajuste conservador por cobertura de sombra/arbolado: menos sombra tiende a
 * significar microclima mas caluroso (islas de calor urbanas). No es una
 * medicion real de temperatura por barrio, es una estimacion documentada en
 * la literatura de islas de calor urbana, deliberadamente chica.
 */
const SHADE_ADJUSTMENT: Record<ShadeBucket, number> = {
  muy_baja: 1.5,
  baja: 1,
  media: 0.5,
  alta: 0,
  muy_alta: -0.5,
}

let barriosPromise: Promise<BarrioFeature[]> | null = null
let fountainsPromise: Promise<FountainFeature[]> | null = null

function loadBarrios(): Promise<BarrioFeature[]> {
  if (!barriosPromise) {
    barriosPromise = fetch('/data/valencia-barrios.geojson')
      .then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar valencia-barrios.geojson (${res.status})`)
        return res.json()
      })
      .then((data: { features: BarrioFeature[] }) => data.features)
      .catch((error) => {
        barriosPromise = null
        throw error
      })
  }
  return barriosPromise
}

function loadFountains(): Promise<FountainFeature[]> {
  if (!fountainsPromise) {
    fountainsPromise = fetch('/data/valencia-fuentes.geojson')
      .then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar valencia-fuentes.geojson (${res.status})`)
        return res.json()
      })
      .then((data: { features: FountainFeature[] }) => data.features)
      .catch((error) => {
        fountainsPromise = null
        throw error
      })
  }
  return fountainsPromise
}

export async function findBarrio(latitude: number, longitude: number): Promise<NeighborhoodContext | null> {
  if (!isWithinValencia(latitude, longitude)) return null

  const barrios = await loadBarrios()
  const match = barrios.find((feature) => pointInPolygon(longitude, latitude, feature.geometry.coordinates))
  if (!match) return null

  const { properties } = match
  const thresholdAdjustment = properties.sombraBucket ? SHADE_ADJUSTMENT[properties.sombraBucket] : 0

  return {
    nombre: properties.nombre,
    distrito: properties.distrito,
    sombraBucket: properties.sombraBucket,
    arbolesPerKm2: properties.arbolesPerKm2,
    vulnerabilidadGlobal: properties.vulnerabilidadGlobal,
    thresholdAdjustment,
  }
}

const MAX_FOUNTAIN_DISTANCE_METERS = 1500

export async function findNearestFountains(
  latitude: number,
  longitude: number,
  count: number,
): Promise<NearbyFountain[]> {
  if (!isWithinValencia(latitude, longitude)) return []

  const fountains = await loadFountains()
  const origin: LonLat = [longitude, latitude]

  return fountains
    .map((feature) => ({
      calle: feature.properties.calle,
      distanceMeters: Math.round(haversineDistanceMeters(origin, feature.geometry.coordinates)),
    }))
    .filter((fountain) => fountain.distanceMeters <= MAX_FOUNTAIN_DISTANCE_METERS)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, count)
}
