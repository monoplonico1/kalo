import type { HourlyPoint } from '../../types'
import { riskColors } from '../../lib/designTokens'

interface HourlyForecastStripProps {
  hours: HourlyPoint[]
}

function formatHour(isoTime: string): string {
  const date = new Date(isoTime)
  return date.toLocaleTimeString('es', { hour: '2-digit' }).replace(/\s|\./g, '')
}

export function HourlyForecastStrip({ hours }: HourlyForecastStripProps) {
  if (hours.length === 0) return null

  return (
    <div>
      <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">Próximas 24 horas</h2>
      <ul className="flex gap-3 overflow-x-auto pb-2" aria-label="Pronóstico horario de las próximas 24 horas">
        {hours.map((hour) => (
          <li
            key={hour.time}
            className="glass-surface flex min-w-16 shrink-0 flex-col items-center gap-2 rounded-[14px] px-3 py-3"
          >
            <span className="text-[13px] text-[var(--color-secondary-label)]">{formatHour(hour.time)}</span>
            <span className="text-[17px] font-semibold">{Math.round(hour.apparentTemperature)}°</span>
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: riskColors[hour.risk] }}
              aria-hidden
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
