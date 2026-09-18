import type { HourlyPoint } from '../../types'
import { riskColors } from '../../lib/designTokens'

interface HourlyForecastStripProps {
  hours: HourlyPoint[]
}

function formatHour(isoTime: string): string {
  const date = new Date(isoTime)
  return date.toLocaleTimeString('es', { hour: '2-digit' }).replace(/\s|\./g, '')
}

function isCurrentHour(isoTime: string): boolean {
  const date = new Date(isoTime)
  const now = new Date()
  return date.getHours() === now.getHours() && date.toDateString() === now.toDateString()
}

export function HourlyForecastStrip({ hours }: HourlyForecastStripProps) {
  if (hours.length === 0) return null

  return (
    <div>
      <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">Próximas 24 horas</h2>
      <ul
        className="scrollbar-hidden flex gap-2 overflow-x-auto pb-1"
        aria-label="Pronóstico horario de las próximas 24 horas"
      >
        {hours.map((hour) => {
          const isNow = isCurrentHour(hour.time)
          return (
            <li
              key={hour.time}
              aria-current={isNow ? 'time' : undefined}
              className={`flex min-w-16 shrink-0 flex-col items-center gap-2 rounded-2xl border px-3 py-3 ${
                isNow ? 'border-transparent bg-[var(--color-label)]' : 'border-[var(--hairline)]'
              }`}
            >
              <span
                className={`text-[13px] font-medium ${
                  isNow ? 'text-[var(--color-system-background)]/70' : 'text-[var(--color-secondary-label)]'
                }`}
              >
                {isNow ? 'Ahora' : formatHour(hour.time)}
              </span>
              <span
                className={`text-[17px] font-bold ${isNow ? 'text-[var(--color-system-background)]' : 'text-[var(--color-label)]'}`}
              >
                {Math.round(hour.apparentTemperature)}°
              </span>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: riskColors[hour.risk] }} aria-hidden />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
