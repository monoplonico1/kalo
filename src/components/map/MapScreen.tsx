import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer } from 'react-leaflet'
import type { Layer, PathOptions } from 'leaflet'
import type { Feature, FeatureCollection, Point } from 'geojson'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'
import { NavigationBar } from '../ui/NavigationBar'
import { useProfileStore } from '../../store/useProfileStore'
import { useValenciaMapLayers } from '../../hooks/useValenciaMapLayers'
import { isWithinValencia } from '../../lib/geo/valenciaNeighborhoods'
import {
  beachMarkerStyle,
  fountainMarkerStyle,
  parkMarkerStyle,
  SHADE_COLORS,
  SHADE_LABELS,
  youAreHereMarkerStyle,
} from './mapMarkers'
import { MapLegend } from './MapLegend'
import type { ShadeBucket } from '../../types'

const VALENCIA_CENTER: [number, number] = [39.4699, -0.3763]
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const DARK_TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO'

function barrioStyle(feature?: Feature): PathOptions {
  const bucket = feature?.properties?.sombraBucket as ShadeBucket | null | undefined
  const color = bucket ? SHADE_COLORS[bucket] : '#8E8E93'
  return { fillColor: color, fillOpacity: 0.35, color, weight: 1, opacity: 0.7 }
}

function bindBarrioPopup(feature: Feature, layer: Layer) {
  const props = feature.properties ?? {}
  const bucket = (props.sombraBucket as ShadeBucket | null) ?? null
  const shadeText = bucket ? `Sombra y arbolado ${SHADE_LABELS[bucket]}` : 'Sin datos de sombra'
  layer.bindPopup(`<strong>${(props.nombre as string) ?? 'Barrio'}</strong><br />${shadeText}`)
}

function pointCoords(feature: Feature): [number, number] {
  const [lon, lat] = (feature.geometry as Point).coordinates as [number, number]
  return [lat, lon]
}

export function MapScreen() {
  const location = useProfileStore((s) => s.location)
  const withinValencia = location !== null && isWithinValencia(location.latitude, location.longitude)
  const { barrios, fountains, parks, beachAmenities } = useValenciaMapLayers(withinValencia)

  const center: [number, number] =
    withinValencia && location ? [location.latitude, location.longitude] : VALENCIA_CENTER

  return (
    <div className="flex min-h-full flex-col">
      <NavigationBar title="Mapa" large={false} />

      {!withinValencia && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <MapPin size={40} className="text-[var(--color-secondary-label)]" aria-hidden />
          <p className="text-[17px] text-[var(--color-secondary-label)]">
            El mapa de calor por barrio está disponible por ahora solo para Valencia. Estamos evaluando sumar más
            ciudades.
          </p>
        </div>
      )}

      {withinValencia && (
        <>
          <div className="h-[60vh] w-full">
            <MapContainer center={center} zoom={14} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
              <TileLayer url={DARK_TILE_URL} attribution={DARK_TILE_ATTRIBUTION} />

              {barrios && (
                <GeoJSON data={barrios as FeatureCollection} style={barrioStyle} onEachFeature={bindBarrioPopup} />
              )}

              {parks &&
                (parks as FeatureCollection).features.map((feature, i) => {
                  const [lat, lon] = pointCoords(feature)
                  return (
                    <CircleMarker key={`park-${i}`} center={[lat, lon]} {...parkMarkerStyle}>
                      <Popup>
                        <strong>{(feature.properties?.nombre as string) ?? 'Parque'}</strong>
                        <br />
                        Zona verde
                      </Popup>
                    </CircleMarker>
                  )
                })}

              {beachAmenities &&
                (beachAmenities as FeatureCollection).features.map((feature, i) => {
                  const [lat, lon] = pointCoords(feature)
                  const isShower = feature.properties?.tipo === 'ducha'
                  return (
                    <CircleMarker key={`beach-${i}`} center={[lat, lon]} {...beachMarkerStyle}>
                      <Popup>
                        <strong>{isShower ? 'Ducha de playa' : 'Lavapiés de playa'}</strong>
                      </Popup>
                    </CircleMarker>
                  )
                })}

              {fountains &&
                (fountains as FeatureCollection).features.map((feature, i) => {
                  const [lat, lon] = pointCoords(feature)
                  return (
                    <CircleMarker key={`fountain-${i}`} center={[lat, lon]} {...fountainMarkerStyle}>
                      <Popup>
                        <strong>Fuente de agua pública</strong>
                        <br />
                        {(feature.properties?.calle as string) ?? ''}
                      </Popup>
                    </CircleMarker>
                  )
                })}

              {location && (
                <CircleMarker center={[location.latitude, location.longitude]} {...youAreHereMarkerStyle}>
                  <Popup>Estás aquí</Popup>
                </CircleMarker>
              )}
            </MapContainer>
          </div>

          <MapLegend />
        </>
      )}
    </div>
  )
}
