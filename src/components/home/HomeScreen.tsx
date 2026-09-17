import { useMemo, useState } from 'react'
import { NavigationBar } from '../ui/NavigationBar'
import { SegmentedControl } from '../ui/SegmentedControl'
import { Badge } from '../ui/Badge'
import { RiskCard } from './RiskCard'
import { HourlyForecastStrip } from './HourlyForecastStrip'
import { RecommendationList } from './RecommendationList'
import { useProfileStore } from '../../store/useProfileStore'
import { useWeather } from '../../hooks/useWeather'
import { useRiskEngine } from '../../hooks/useRiskEngine'
import type { HourlyPoint } from '../../types'

type ViewMode = 'today' | 'upcoming'

interface DailySummary {
  dateLabel: string
  maxApparentTemperature: number
  risk: HourlyPoint['risk']
}

function summarizeByDay(hourly: HourlyPoint[]): DailySummary[] {
  const today = new Date().toDateString()
  const byDay = new Map<string, HourlyPoint[]>()

  for (const point of hourly) {
    const dateKey = new Date(point.time).toDateString()
    if (dateKey === today) continue
    const bucket = byDay.get(dateKey) ?? []
    bucket.push(point)
    byDay.set(dateKey, bucket)
  }

  return Array.from(byDay.entries()).map(([dateKey, points]) => {
    const maxPoint = points.reduce((max, p) => (p.apparentTemperature > max.apparentTemperature ? p : max))
    return {
      dateLabel: new Date(dateKey).toLocaleDateString('es', { weekday: 'long', day: 'numeric' }),
      maxApparentTemperature: maxPoint.apparentTemperature,
      risk: maxPoint.risk,
    }
  })
}

export function HomeScreen() {
  const [view, setView] = useState<ViewMode>('today')
  const location = useProfileStore((s) => s.location)
  const health = useProfileStore((s) => s.health)
  const customThresholdOffset = useProfileStore((s) => s.alerts.customThresholdOffset)

  const { data: forecast, isLoading, isError } = useWeather(location)
  const { today, hourly } = useRiskEngine(forecast, health, customThresholdOffset)
  const upcoming = useMemo(() => summarizeByDay(hourly), [hourly])

  const cityLabel = location?.name ?? 'tu ubicación'

  return (
    <div className="flex min-h-full flex-col">
      <NavigationBar title={cityLabel} />
      <main className="flex flex-1 flex-col gap-5 px-4 py-4 pb-24">
        <SegmentedControl
          aria-label="Vista de pronóstico"
          value={view}
          onChange={setView}
          segments={[
            { value: 'today', label: 'Hoy' },
            { value: 'upcoming', label: 'Próximos días' },
          ]}
        />

        {isLoading && <p className="text-center text-[16px] text-[var(--color-secondary-label)]">Cargando el clima…</p>}
        {isError && (
          <p className="text-center text-[16px] text-[var(--color-system-red)]">
            No pudimos cargar el clima. Revisá tu conexión e intentá de nuevo.
          </p>
        )}

        {view === 'today' && forecast && today && (
          <>
            <RiskCard cityLabel={cityLabel} apparentTemperature={forecast.current.apparentTemperature} assessment={today} />
            <HourlyForecastStrip hours={hourly} />
            <RecommendationList recommendations={today.recommendations} />
          </>
        )}

        {view === 'upcoming' && (
          <ul className="divide-y divide-white/10 border-y border-white/10" aria-label="Pronóstico de próximos días">
            {upcoming.map((day) => (
              <li key={day.dateLabel} className="flex items-center justify-between py-4">
                <span className="text-[17px] font-semibold capitalize">{day.dateLabel}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[17px]">{Math.round(day.maxApparentTemperature)}°</span>
                  <Badge level={day.risk} />
                </div>
              </li>
            ))}
            {upcoming.length === 0 && (
              <p className="text-center text-[16px] text-[var(--color-secondary-label)]">
                Todavía no hay datos de próximos días.
              </p>
            )}
          </ul>
        )}
      </main>
    </div>
  )
}
