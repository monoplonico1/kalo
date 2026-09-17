import type { RiskLevel } from '../types'

export const typography = {
  largeTitle: 'text-[34px] font-bold leading-tight',
  title1: 'text-[28px] font-bold leading-tight',
  title2: 'text-[22px] font-bold leading-snug',
  headline: 'text-[17px] font-semibold leading-snug',
  body: 'text-[17px] font-normal leading-normal',
  callout: 'text-[16px] font-normal leading-normal',
  footnote: 'text-[13px] font-normal leading-normal',
  caption: 'text-[12px] font-normal leading-normal',
} as const

export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
} as const

export const riskColors: Record<RiskLevel, string> = {
  low: 'var(--risk-low)',
  moderate: 'var(--risk-moderate)',
  high: 'var(--risk-high)',
  extreme: 'var(--risk-extreme)',
}

export const riskLabels: Record<RiskLevel, string> = {
  low: 'Riesgo bajo',
  moderate: 'Riesgo moderado',
  high: 'Riesgo alto',
  extreme: 'Riesgo extremo',
}
