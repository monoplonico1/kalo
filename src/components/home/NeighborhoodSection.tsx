import { Droplets, TreePine } from 'lucide-react'
import type { NearbyFountain, NeighborhoodContext } from '../../types'

interface NeighborhoodSectionProps {
  neighborhood: NeighborhoodContext
  fountains: NearbyFountain[]
}

const SHADE_LABELS: Record<string, string> = {
  muy_baja: 'muy baja',
  baja: 'baja',
  media: 'media',
  alta: 'alta',
  muy_alta: 'muy alta',
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export function NeighborhoodSection({ neighborhood, fountains }: NeighborhoodSectionProps) {
  const shadeLabel = neighborhood.sombraBucket ? SHADE_LABELS[neighborhood.sombraBucket] : null

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">
          Tu barrio: {neighborhood.nombre}
        </h2>
        <div className="flex items-start gap-3 border-l-2 border-white/15 py-1 pl-4">
          <TreePine size={20} className="mt-0.5 shrink-0 text-[var(--color-system-green)]" aria-hidden />
          <p className="text-[16px] leading-snug">
            {shadeLabel ? (
              <>
                Cobertura de sombra y arbolado <strong>{shadeLabel}</strong>.{' '}
                {neighborhood.thresholdAdjustment > 0 &&
                  `Por tener poca sombra, sumamos ${neighborhood.thresholdAdjustment}° a tu sensación térmica de hoy.`}
                {neighborhood.thresholdAdjustment < 0 &&
                  `Por tener bastante sombra, restamos ${Math.abs(neighborhood.thresholdAdjustment)}° a tu sensación térmica de hoy.`}
                {neighborhood.thresholdAdjustment === 0 && 'No ajustamos tu sensación térmica por esto.'}
              </>
            ) : (
              'Todavía no tenemos datos de cobertura de sombra para esta zona.'
            )}
          </p>
        </div>

        {neighborhood.vulnerabilidadGlobal && (
          <p className="mt-2 text-[13px] text-[var(--color-tertiary-label)]">
            Vulnerabilidad social del barrio ante el calor: {neighborhood.vulnerabilidadGlobal.toLowerCase()}. Este
            dato es sobre la población del barrio, no sobre la temperatura.
          </p>
        )}
      </div>

      {fountains.length > 0 && (
        <div>
          <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">
            Fuentes de agua pública cerca
          </h2>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {fountains.map((fountain, i) => (
              <div key={`${fountain.calle}-${i}`} className="flex items-start gap-3 py-3">
                <Droplets size={20} className="mt-0.5 shrink-0 text-[var(--color-system-blue)]" aria-hidden />
                <p className="text-[16px] leading-snug">
                  {fountain.calle ?? 'Fuente pública'} · {formatDistance(fountain.distanceMeters)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
