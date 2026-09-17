import { useState } from 'react'
import { ChevronDown, ChevronUp, MapPinned, X } from 'lucide-react'
import {
  CATEGORY_LABELS,
  helpTextFor,
  MAP_LAYERS,
  SHADE_COLORS,
  SHADE_LABELS,
  SHADE_ORDER,
  type MapLayerId,
  type SelectedMapPlace,
} from './mapCategories'
import { haversineDistanceMeters } from '../../lib/geo/geometry'
import { buildDirectionsUrl } from '../../lib/geo/directions'
import { Button } from '../ui/Button'
import type { Location } from '../../types'

interface MapPanelProps {
  visibleLayers: Set<MapLayerId>
  onToggleLayer: (id: MapLayerId) => void
  selectedPlace: SelectedMapPlace | null
  onCloseDetail: () => void
  userLocation: Location | null
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

function FilterRow({
  visibleLayers,
  onToggleLayer,
  trailing,
}: {
  visibleLayers: Set<MapLayerId>
  onToggleLayer: (id: MapLayerId) => void
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 pt-3">
      <div className="flex flex-1 gap-2 overflow-x-auto">
        {MAP_LAYERS.map((layer) => {
          const isActive = visibleLayers.has(layer.id)
          const Icon = layer.icon
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => onToggleLayer(layer.id)}
              aria-pressed={isActive}
              aria-label={`Mostrar ${layer.label} en el mapa`}
              className="flex min-h-11 min-w-16 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition-colors duration-200 ease-out"
              style={{
                backgroundColor: isActive ? `color-mix(in srgb, ${layer.color} 22%, transparent)` : 'transparent',
                color: isActive ? layer.color : 'var(--color-tertiary-label)',
              }}
            >
              <Icon size={22} aria-hidden />
              <span className="text-[11px] font-medium">{layer.label}</span>
            </button>
          )
        })}
      </div>
      {trailing}
    </div>
  )
}

function ShadeLegend() {
  return (
    <div className="px-4 pb-1">
      <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">
        Sombra y arbolado por barrio
      </h2>
      <div className="flex items-center justify-between gap-1">
        {SHADE_ORDER.map((bucket) => (
          <div key={bucket} className="flex flex-1 flex-col items-center gap-1">
            <span
              className="h-3 w-full rounded-sm"
              style={{ backgroundColor: SHADE_COLORS[bucket], opacity: 0.7 }}
              aria-hidden
            />
            <span className="text-center text-[11px] text-[var(--color-tertiary-label)]">
              {SHADE_LABELS[bucket]}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[13px] leading-snug text-[var(--color-tertiary-label)]">
        Es una estimación a partir de cobertura arbórea, no una medición real de temperatura por calle. Datos
        abiertos del Ajuntament de València. Tocá cualquier punto o barrio del mapa para ver el detalle.
      </p>
    </div>
  )
}

export function MapPanel({ visibleLayers, onToggleLayer, selectedPlace, onCloseDetail, userLocation }: MapPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (selectedPlace) {
    const distanceMeters = userLocation
      ? haversineDistanceMeters(
          [userLocation.longitude, userLocation.latitude],
          [selectedPlace.lon, selectedPlace.lat],
        )
      : null

    return (
      <div className="map-panel-surface absolute inset-x-3 bottom-3 z-10 max-h-[70%] overflow-y-auto rounded-[20px]">
        <div className="flex items-start justify-between gap-3 p-4">
          <div>
            <p className="text-[17px] font-bold leading-snug">{selectedPlace.nombre}</p>
            <p className="text-[13px] text-[var(--color-secondary-label)]">
              {CATEGORY_LABELS[selectedPlace.category]}
              {distanceMeters !== null && ` · a ${formatDistance(distanceMeters)}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onCloseDetail}
            aria-label="Cerrar detalle"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-[var(--color-secondary-label)]"
          >
            <X size={22} aria-hidden />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-4">
          <p className="text-[16px] leading-snug">{helpTextFor(selectedPlace)}</p>

          {selectedPlace.category === 'barrio' && selectedPlace.vulnerabilidadGlobal && (
            <p className="text-[13px] text-[var(--color-tertiary-label)]">
              Vulnerabilidad social del barrio ante el calor: {selectedPlace.vulnerabilidadGlobal.toLowerCase()}. No
              es una medida de temperatura.
            </p>
          )}

          {selectedPlace.category !== 'barrio' && (
            <a
              href={buildDirectionsUrl(selectedPlace.lat, selectedPlace.lon)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="tinted" className="flex w-full items-center justify-center gap-2">
                <MapPinned size={20} aria-hidden />
                Cómo llegar
              </Button>
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="map-panel-surface absolute inset-x-3 bottom-3 z-10 rounded-[20px]">
      <FilterRow
        visibleLayers={visibleLayers}
        onToggleLayer={onToggleLayer}
        trailing={
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? 'Contraer leyenda' : 'Expandir leyenda'}
            aria-expanded={isExpanded}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-[var(--color-secondary-label)]"
          >
            {isExpanded ? <ChevronDown size={22} aria-hidden /> : <ChevronUp size={22} aria-hidden />}
          </button>
        }
      />
      {isExpanded && <ShadeLegend />}
      <div className="h-3" />
    </div>
  )
}
