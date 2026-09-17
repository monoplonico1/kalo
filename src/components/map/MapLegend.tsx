import { BEACH_COLOR, FOUNTAIN_COLOR, PARK_COLOR, SHADE_COLORS, SHADE_LABELS, YOU_ARE_HERE_COLOR } from './mapMarkers'
import type { ShadeBucket } from '../../types'

const SHADE_ORDER: ShadeBucket[] = ['muy_baja', 'baja', 'media', 'alta', 'muy_alta']

export function MapLegend() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-24">
      <div>
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
          abiertos del Ajuntament de València.
        </p>
      </div>

      <div className="border-y border-white/10 py-3">
        <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">En el mapa</h2>
        <ul className="flex flex-col gap-2">
          <li className="flex items-center gap-3 text-[16px]">
            <span
              className="h-3 w-3 shrink-0 rounded-full border border-white/60"
              style={{ backgroundColor: FOUNTAIN_COLOR }}
              aria-hidden
            />
            Fuentes de agua pública
          </li>
          <li className="flex items-center gap-3 text-[16px]">
            <span
              className="h-3 w-3 shrink-0 rounded-sm border border-white/60"
              style={{ backgroundColor: PARK_COLOR }}
              aria-hidden
            />
            Parques y jardines grandes
          </li>
          <li className="flex items-center gap-3 text-[16px]">
            <span
              className="h-3 w-3 shrink-0 rounded-full border border-white/60"
              style={{ backgroundColor: BEACH_COLOR }}
              aria-hidden
            />
            Duchas y lavapiés de playa
          </li>
          <li className="flex items-center gap-3 text-[16px]">
            <span
              className="h-4 w-4 shrink-0 rounded-full border border-white/60"
              style={{ backgroundColor: YOU_ARE_HERE_COLOR }}
              aria-hidden
            />
            Tu ubicación
          </li>
        </ul>
      </div>
    </div>
  )
}
