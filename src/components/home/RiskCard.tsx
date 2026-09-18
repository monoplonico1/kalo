import { Sun } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { RiskAssessment } from '../../types'

interface RiskCardProps {
  cityLabel: string
  apparentTemperature: number
  assessment: RiskAssessment
}

const LEVEL_TEXT: Record<RiskAssessment['level'], string> = {
  low: 'riesgo bajo',
  moderate: 'riesgo moderado',
  high: 'riesgo alto',
  extreme: 'riesgo extremo',
}

export function RiskCard({ cityLabel, apparentTemperature, assessment }: RiskCardProps) {
  const officialTemperature = Math.round(apparentTemperature)
  const heroTemperature = Math.round(assessment.effectiveApparentTemperature)
  const isPersonalized = assessment.thresholdAdjustment !== 0

  return (
    <section
      role="alert"
      aria-label={`Tu sensación térmica estimada, ${heroTemperature} grados en ${cityLabel}${isPersonalized ? `, oficial ${officialTemperature} grados` : ''}, ${LEVEL_TEXT[assessment.level]}`}
      className="flex flex-col items-center gap-3 border-b border-[var(--hairline)] px-4 py-8 text-center"
    >
      <div className="hero-float relative flex h-24 w-24 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle, var(--color-system-orange) 0%, transparent 70%)', opacity: 0.35 }}
          aria-hidden
        />
        <Sun size={72} strokeWidth={1.5} className="relative text-[var(--color-system-orange)]" aria-hidden />
      </div>

      <p className="text-[80px] font-black leading-none tracking-tight">{heroTemperature}°</p>
      <p className="text-[16px] text-[var(--color-secondary-label)]">
        {isPersonalized ? (
          <>
            Tu sensación estimada en {cityLabel} · oficial {officialTemperature}°
          </>
        ) : (
          <>Tu sensación térmica en {cityLabel}</>
        )}
      </p>

      <Badge level={assessment.level} />
    </section>
  )
}
