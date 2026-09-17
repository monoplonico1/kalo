import { AlertCircle, AlertTriangle, CheckCircle2, Flame } from 'lucide-react'
import type { RiskLevel } from '../../types'
import { riskColors, riskLabels } from '../../lib/designTokens'

const riskIcons: Record<RiskLevel, typeof CheckCircle2> = {
  low: CheckCircle2,
  moderate: AlertCircle,
  high: AlertTriangle,
  extreme: Flame,
}

interface BadgeProps {
  level: RiskLevel
}

/**
 * Cada nivel de riesgo lleva icono distinto + texto, nunca solo color
 * (seccion 6.6: no depender solo del color, cubre daltonismo).
 */
export function Badge({ level }: BadgeProps) {
  const Icon = riskIcons[level]
  const color = riskColors[level]

  return (
    <span
      className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-[16px] font-semibold"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`, color }}
    >
      <Icon size={20} aria-hidden />
      {riskLabels[level]}
    </span>
  )
}
