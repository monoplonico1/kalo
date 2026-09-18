import { useState } from 'react'
import { CircleMarker, GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import type { Layer, Polygon, PathOptions } from 'leaflet'
import type { Feature, FeatureCollection, Point } from 'geojson'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'
import { useProfileStore } from '../../store/useProfileStore'
import { useValenciaMapLayers } from '../../hooks/useValenciaMapLayers'
import { isWithinValencia } from '../../lib/geo/valenciaNeighborhoods'
import {
  beachMarkerStyle,
  fountainMarkerStyle,
  MAP_LAYERS,
  parkMarkerStyle,
  SHADE_COLORS,
  youAreHereMarkerStyle,
  type MapLayerId,
  type SelectedMapPlace,
} from './mapCategories'
import { MapPanel } from './MapPanel'
import type { ShadeBucket } from '../../types'

const VALENCIA_CENTER: [number, number] = [39.4699, -0.3763]
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const DARK_TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO'

function barrioStyle(feature?: Feature): PathOptions {
  const bucket = feature?.properties?.sombraBucket as ShadeBucket | null | undefined
  const color = bucket ? SHADE_COLORS[bucket] : '#8E8E93'
  return { fillColor: color, fillOpacity: 0.35, color, weight: 1, opacity: 0.7 }
}

function pointCoords(feature: Feature): [number, number] {
  const [lon, lat] = (feature.geometry as Point).coordinates as [number, number]
  return [lat, lon]
}

export function MapScreen() {
  const location = useProfileStore((s) => s.location)
  const withinValencia = location !== null && isWithinValencia(location.latitude, location.longitude)
  const { barrios, fountains, parks, beachAmenities } = useValenciaMapLayers(withinValencia)

  const [visibleLayers, setVisibleLayers] = useState<Set<MapLayerId>>(
    () => new Set(MAP_LAYERS.map((l) => l.id)),
  )
  const [selectedPlace, setSelectedPlace] = useState<SelectedMapPlace | null>(null)

  function toggleLayer(id: MapLayerId) {
    setVisibleLayers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function bindBarrioClick(feature: Feature, layer: Layer) {
    layer.on('click', () => {
      const props = feature.properties ?? {}
      const center = (layer as Polygon).getBounds().getCenter()
      setSelectedPlace({
        category: 'barrio',
        nombre: (props.nombre as string) ?? 'Barrio',
        lat: center.lat,
        lon: center.lng,
        sombraBucket: (props.sombraBucket as ShadeBucket | null) ?? null,
        vulnerabilidadGlobal: (props.vulnerabilidadGlobal as string | null) ?? null,
      })
    })
  }

  const center: [number, number] =
    withinValencia && location ? [location.latitude, location.longitude] : VALENCIA_CENTER

  return (
    <div className="flex min-h-full flex-col">
      {!withinValencia && (
        <div className="safe-top flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <MapPin size={40} className="text-[var(--color-secondary-label)]" aria-hidden />
          <p className="text-[17px] text-[var(--color-secondary-label)]">
            El mapa de calor por barrio está disponible por ahora solo para Valencia. Estamos evaluando sumar más
            ciudades.
          </p>
        </div>
      )}

      {withinValencia && (
        <div className="safe-top relative h-[calc(100vh-4.5rem)] w-full">
          {/*
            Leaflet asigna z-index 200-700 a sus panes internos. Sin un
            z-index explicito aca, ".leaflet-container" (position:relative
            pero z-index:auto) no crea su propio stacking context, y esos
            valores se comparan directo contra el z-10 del panel flotante
            en el contexto raiz — y ganan. Este wrapper con z-0 los contiene.
          */}
          <div className="absolute inset-0 z-0">
            <MapContainer center={center} zoom={14} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
            <TileLayer url={DARK_TILE_URL} attribution={DARK_TILE_ATTRIBUTION} />

            {visibleLayers.has('barrios') && barrios && (
              <GeoJSON data={barrios as FeatureCollection} style={barrioStyle} onEachFeature={bindBarrioClick} />
            )}

            {visibleLayers.has('parks') &&
              parks &&
              (parks as FeatureCollection).features.map((feature, i) => {
                const [lat, lon] = pointCoords(feature)
                return (
                  <CircleMarker
                    key={`park-${i}`}
                    center={[lat, lon]}
                    {...parkMarkerStyle}
                    eventHandlers={{
                      click: () =>
                        setSelectedPlace({
                          category: 'park',
                          nombre: (feature.properties?.nombre as string) ?? 'Parque',
                          lat,
                          lon,
                          areaM2: feature.properties?.areaM2 as number | undefined,
                        }),
                    }}
                  />
                )
              })}

            {visibleLayers.has('beach') &&
              beachAmenities &&
              (beachAmenities as FeatureCollection).features.map((feature, i) => {
                const [lat, lon] = pointCoords(feature)
                const beachType = feature.properties?.tipo === 'ducha' ? 'ducha' : 'lavapies'
                return (
                  <CircleMarker
                    key={`beach-${i}`}
                    center={[lat, lon]}
                    {...beachMarkerStyle}
                    eventHandlers={{
                      click: () =>
                        setSelectedPlace({
                          category: 'beach',
                          nombre: beachType === 'ducha' ? 'Ducha de playa' : 'Lavapiés de playa',
                          lat,
                          lon,
                          beachType,
                        }),
                    }}
                  />
                )
              })}

            {visibleLayers.has('fountains') &&
              fountains &&
              (fountains as FeatureCollection).features.map((feature, i) => {
                const [lat, lon] = pointCoords(feature)
                return (
                  <CircleMarker
                    key={`fountain-${i}`}
                    center={[lat, lon]}
                    {...fountainMarkerStyle}
                    eventHandlers={{
                      click: () =>
                        setSelectedPlace({
                          category: 'fountain',
                          nombre: (feature.properties?.calle as string) ?? 'Fuente de agua pública',
                          lat,
                          lon,
                        }),
                    }}
                  />
                )
              })}

            {location && <CircleMarker center={[location.latitude, location.longitude]} {...youAreHereMarkerStyle} />}
            </MapContainer>
          </div>

          <MapPanel
            visibleLayers={visibleLayers}
            onToggleLayer={toggleLayer}
            selectedPlace={selectedPlace}
            onCloseDetail={() => setSelectedPlace(null)}
            userLocation={location}
          />
        </div>
      )}
    </div>
  )
}
