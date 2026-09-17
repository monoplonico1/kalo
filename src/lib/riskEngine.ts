import type { HealthProfile, RiskAssessment, RiskLevel } from '../types'

/**
 * Motor de riesgo climatico. Puro y sin dependencias de UI o de red para poder
 * testearlo y ajustar umbrales facilmente (ver seccion 8 y 14 del brief).
 *
 * Los umbrales son un punto de partida de producto, no son guia medica.
 */

const THRESHOLD_LOW_MODERATE = 27
const THRESHOLD_MODERATE_HIGH = 32
const THRESHOLD_HIGH_EXTREME = 38

const MAX_PROFILE_ADJUSTMENT = 6

export function calculateProfileAdjustment(health: HealthProfile): number {
  let adjustment = 0
  if (health.ageBand === '65-plus') adjustment += 3
  if (health.hasRespiratoryOrCardiacCondition) adjustment += 3
  if (health.isPregnant) adjustment += 2
  if (health.worksOutdoors) adjustment += 2
  if (!health.hasHomeAC) adjustment += 2
  return Math.min(adjustment, MAX_PROFILE_ADJUSTMENT)
}

export function classifyRiskLevel(effectiveApparentTemperature: number): RiskLevel {
  if (effectiveApparentTemperature < THRESHOLD_LOW_MODERATE) return 'low'
  if (effectiveApparentTemperature < THRESHOLD_MODERATE_HIGH) return 'moderate'
  if (effectiveApparentTemperature < THRESHOLD_HIGH_EXTREME) return 'high'
  return 'extreme'
}

function buildRecommendations(level: RiskLevel, health: HealthProfile, isNight: boolean): string[] {
  const recommendations: string[] = []

  switch (level) {
    case 'low':
      recommendations.push('Buen momento para actividades al aire libre.')
      recommendations.push('Tomá agua con regularidad, aunque no sientas mucho calor.')
      break
    case 'moderate':
      recommendations.push('Tomá agua cada hora, incluso sin sed.')
      recommendations.push('Preferí lugares con sombra si vas a estar afuera un rato largo.')
      break
    case 'high':
      recommendations.push('Evitá salir entre las 13 y las 17h si podés.')
      recommendations.push('Usá ropa liviana y clara, y buscá sombra o aire acondicionado.')
      recommendations.push('Prestá atención a mareos, dolor de cabeza o calambres: son señales de alerta.')
      break
    case 'extreme':
      recommendations.push('Evitá salir de tu casa salvo que sea necesario, sobre todo entre 12 y 18h.')
      recommendations.push('Tomá agua cada 20-30 minutos, aunque no tengas sed.')
      recommendations.push('Si sentís confusión, náuseas o piel muy caliente y seca, buscá ayuda de inmediato.')
      break
  }

  if (health.worksOutdoors && (level === 'high' || level === 'extreme')) {
    recommendations.push('Si trabajás afuera, pedí pausas frecuentes en la sombra.')
  }

  if (!health.hasHomeAC && isNight && (level === 'high' || level === 'extreme')) {
    recommendations.push('De noche, ventilá tu casa cuando el aire de afuera esté más fresco.')
  }

  return recommendations.slice(0, 3)
}

export interface AssessRiskInput {
  apparentTemperature: number
  health: HealthProfile
  customThresholdOffset?: number
  /** Ajuste hiperlocal (ej. microclima de barrio en Valencia). Ver src/lib/geo/valenciaNeighborhoods.ts. */
  neighborhoodAdjustment?: number
  isNight?: boolean
}

export function assessRisk({
  apparentTemperature,
  health,
  customThresholdOffset = 0,
  neighborhoodAdjustment = 0,
  isNight = false,
}: AssessRiskInput): RiskAssessment {
  const profileAdjustment = calculateProfileAdjustment(health)
  const thresholdAdjustment = profileAdjustment + customThresholdOffset + neighborhoodAdjustment
  const effectiveApparentTemperature = apparentTemperature + thresholdAdjustment
  const level = classifyRiskLevel(effectiveApparentTemperature)
  const recommendations = buildRecommendations(level, health, isNight)

  return {
    level,
    effectiveApparentTemperature,
    thresholdAdjustment,
    recommendations,
  }
}
