import { useMemo } from 'react'
import { assessRisk, classifyRiskLevel, calculateProfileAdjustment } from '../lib/riskEngine'
import type { ForecastResult } from '../lib/api/openMeteo'
import type { HealthProfile, HourlyPoint, RiskAssessment } from '../types'

function isNightHour(isoTime: string): boolean {
  const hour = new Date(isoTime).getHours()
  return hour >= 20 || hour < 7
}

const HOURS_TO_SHOW = 24

/** Open-Meteo devuelve el horario desde las 00:00 del dia, no desde "ahora": sin este corte, "Proximas 24 horas" mostraba horas ya pasadas. */
function startOfCurrentHour(): number {
  const now = new Date()
  now.setMinutes(0, 0, 0)
  return now.getTime()
}

export interface RiskEngineResult {
  today: RiskAssessment | null
  hourly: HourlyPoint[]
}

export function useRiskEngine(
  forecast: ForecastResult | undefined,
  health: HealthProfile,
  customThresholdOffset: number,
  neighborhoodAdjustment = 0,
): RiskEngineResult {
  return useMemo(() => {
    if (!forecast) return { today: null, hourly: [] }

    const today = assessRisk({
      apparentTemperature: forecast.current.apparentTemperature,
      health,
      customThresholdOffset,
      neighborhoodAdjustment,
      isNight: isNightHour(new Date().toISOString()),
    })

    const profileAdjustment = calculateProfileAdjustment(health)
    const totalAdjustment = profileAdjustment + customThresholdOffset + neighborhoodAdjustment

    const currentHourStart = startOfCurrentHour()
    const hourly: HourlyPoint[] = forecast.hourly
      .filter((point) => new Date(point.time).getTime() >= currentHourStart)
      .slice(0, HOURS_TO_SHOW)
      .map((point) => ({
        ...point,
        risk: classifyRiskLevel(point.apparentTemperature + totalAdjustment),
      }))

    return { today, hourly }
  }, [forecast, health, customThresholdOffset, neighborhoodAdjustment])
}
