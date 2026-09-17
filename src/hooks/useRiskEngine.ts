import { useMemo } from 'react'
import { assessRisk, classifyRiskLevel, calculateProfileAdjustment } from '../lib/riskEngine'
import type { ForecastResult } from '../lib/api/openMeteo'
import type { HealthProfile, HourlyPoint, RiskAssessment } from '../types'

function isNightHour(isoTime: string): boolean {
  const hour = new Date(isoTime).getHours()
  return hour >= 20 || hour < 7
}

export interface RiskEngineResult {
  today: RiskAssessment | null
  hourly: HourlyPoint[]
}

export function useRiskEngine(
  forecast: ForecastResult | undefined,
  health: HealthProfile,
  customThresholdOffset: number,
): RiskEngineResult {
  return useMemo(() => {
    if (!forecast) return { today: null, hourly: [] }

    const today = assessRisk({
      apparentTemperature: forecast.current.apparentTemperature,
      health,
      customThresholdOffset,
      isNight: isNightHour(new Date().toISOString()),
    })

    const profileAdjustment = calculateProfileAdjustment(health)
    const totalAdjustment = profileAdjustment + customThresholdOffset

    const hourly: HourlyPoint[] = forecast.hourly.map((point) => ({
      ...point,
      risk: classifyRiskLevel(point.apparentTemperature + totalAdjustment),
    }))

    return { today, hourly }
  }, [forecast, health, customThresholdOffset])
}
