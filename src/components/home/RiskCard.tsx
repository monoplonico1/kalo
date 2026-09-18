import { Sun } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { RiskAssessment } from '../../types'

interface RiskCardProps {
  cityLabel: string
  apparentTemperature: number
  assessment: RiskAssessment
}

export function RiskCard({ cityLabel, apparentTemperature, assessment }: RiskCardProps) {
  return (
    <section
      role="alert"
      aria-label={`Sensación térmica ${Math.round(apparentTemperature)} grados en ${cityLabel}, ${assessment.level === 'low' ? 'riesgo bajo' : assessment.level === 'moderate' ? 'riesgo moderado' : assessment.level === 'high' ? 'riesgo alto' : 'riesgo extremo'}`}
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

      <p className="text-[80px] font-black leading-none tracking-tight">{Math.round(apparentTemperature)}°</p>
      <p className="text-[16px] text-[var(--color-secondary-label)]">Sensación térmica en {cityLabel}</p>

      <Badge level={assessment.level} />
    </section>
  )
}
