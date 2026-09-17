/**
 * Capas GeoJSON para el tab Mapa. A diferencia de valenciaNeighborhoods.ts
 * (que resuelve un punto puntual para el risk engine), aca se carga la
 * coleccion completa para dibujarla con react-leaflet.
 *
 * Mismo alcance y mismas fuentes que valenciaNeighborhoods.ts: solo Valencia,
 * datos abiertos del Ajuntament de València, ver CLAUDE.md.
 */

import type { FeatureCollection } from 'geojson'

const cache = new Map<string, Promise<FeatureCollection>>()

function loadGeoJSON(path: string): Promise<FeatureCollection> {
  let promise = cache.get(path)
  if (!promise) {
    promise = fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar ${path} (${res.status})`)
        return res.json() as Promise<FeatureCollection>
      })
      .catch((error) => {
        cache.delete(path)
        throw error
      })
    cache.set(path, promise)
  }
  return promise
}

export function loadBarriosLayer(): Promise<FeatureCollection> {
  return loadGeoJSON('/data/valencia-barrios.geojson')
}

export function loadFountainsLayer(): Promise<FeatureCollection> {
  return loadGeoJSON('/data/valencia-fuentes.geojson')
}

export function loadParksLayer(): Promise<FeatureCollection> {
  return loadGeoJSON('/data/valencia-parques.geojson')
}

export function loadBeachAmenitiesLayer(): Promise<FeatureCollection> {
  return loadGeoJSON('/data/valencia-playa.geojson')
}
