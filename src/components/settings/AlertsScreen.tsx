import { useState } from 'react'
import { NavigationBar } from '../ui/NavigationBar'
import { GroupedList, GroupedRow, Card } from '../ui/Card'
import { Toggle } from '../ui/Toggle'
import { BottomSheet } from '../ui/BottomSheet'
import { useProfileStore } from '../../store/useProfileStore'

const MIN_OFFSET = -3
const MAX_OFFSET = 3

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
}

export function AlertsScreen() {
  const alerts = useProfileStore((s) => s.alerts)
  const updateAlerts = useProfileStore((s) => s.updateAlerts)
  const [standalone] = useState(isStandalone)
  const [isThresholdSheetOpen, setIsThresholdSheetOpen] = useState(false)

  return (
    <div className="flex min-h-full flex-col">
      <NavigationBar title="Alertas" />
      <main className="flex flex-1 flex-col gap-5 px-4 py-4 pb-24">
        <GroupedList>
          <GroupedRow className="justify-between">
            <span className="text-[17px]">Notificaciones</span>
            <Toggle
              label="Activar notificaciones"
              checked={alerts.notificationsEnabled}
              onChange={(checked) => updateAlerts({ notificationsEnabled: checked })}
            />
          </GroupedRow>
        </GroupedList>

        {alerts.notificationsEnabled && !standalone && (
          <Card>
            <p className="text-[16px] leading-snug">
              Para recibir alertas en iPhone, agregá Kaló a tu pantalla de inicio desde el botón compartir de
              Safari. Sin ese paso, iOS no entrega notificaciones.
            </p>
          </Card>
        )}

        <div>
          <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">
            Umbral de alerta personalizado
          </h2>
          <GroupedList>
            <GroupedRow className="justify-between">
              <button
                type="button"
                onClick={() => setIsThresholdSheetOpen(true)}
                className="flex min-h-11 w-full items-center justify-between text-left"
              >
                <span className="text-[17px]">Ajustar sensibilidad</span>
                <span className="text-[17px] text-[var(--color-secondary-label)]">
                  {alerts.customThresholdOffset > 0 ? '+' : ''}
                  {alerts.customThresholdOffset}°
                </span>
              </button>
            </GroupedRow>
          </GroupedList>
        </div>
      </main>

      <BottomSheet
        isOpen={isThresholdSheetOpen}
        onClose={() => setIsThresholdSheetOpen(false)}
        title="Umbral de alerta personalizado"
      >
        <Card>
          <p className="mb-3 text-[16px] text-[var(--color-secondary-label)]">
            Ajustá qué tan sensible es tu alerta además de lo que ya calculamos con tu perfil de salud.
          </p>
          <label className="flex flex-col gap-2">
            <span className="text-[17px] font-semibold">
              {alerts.customThresholdOffset > 0 && 'Más tolerante '}
              {alerts.customThresholdOffset < 0 && 'Más sensible '}
              {alerts.customThresholdOffset === 0 && 'Como lo calcula tu perfil '}
              ({alerts.customThresholdOffset > 0 ? '+' : ''}
              {alerts.customThresholdOffset}°)
            </span>
            <input
              type="range"
              min={MIN_OFFSET}
              max={MAX_OFFSET}
              step={1}
              value={alerts.customThresholdOffset}
              onChange={(e) => updateAlerts({ customThresholdOffset: Number(e.target.value) })}
              aria-label="Ajuste de umbral de alerta personalizado en grados"
              className="h-11 w-full accent-[var(--color-system-blue)]"
            />
            <div className="flex justify-between text-[13px] text-[var(--color-tertiary-label)]">
              <span>Más sensible</span>
              <span>Más tolerante</span>
            </div>
          </label>
        </Card>
      </BottomSheet>
    </div>
  )
}
