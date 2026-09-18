import { MapPin } from 'lucide-react'
import { Card, GroupedList, GroupedRow } from '../ui/Card'
import { Toggle } from '../ui/Toggle'
import { ProfileStep } from '../onboarding/ProfileStep'
import { useProfileStore } from '../../store/useProfileStore'
import { calculateProfileAdjustment } from '../../lib/riskEngine'
import { useNeighborhoodContext } from '../../hooks/useNeighborhoodContext'

export function ProfileScreen() {
  const location = useProfileStore((s) => s.location)
  const health = useProfileStore((s) => s.health)
  const updateHealth = useProfileStore((s) => s.updateHealth)
  const theme = useProfileStore((s) => s.theme)
  const setTheme = useProfileStore((s) => s.setTheme)
  const { data: neighborhood } = useNeighborhoodContext(location)

  const adjustment = calculateProfileAdjustment(health)

  return (
    <div className="flex min-h-full flex-col">
      <main className="safe-top flex flex-1 flex-col gap-5 px-4 pt-6 pb-24">
        {location && (
          <GroupedList>
            <GroupedRow className="gap-3">
              <MapPin size={20} className="text-[var(--color-secondary-label)]" aria-hidden />
              <span className="text-[17px]">{location.name}</span>
            </GroupedRow>
          </GroupedList>
        )}

        <div>
          <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">Apariencia</h2>
          <GroupedList>
            <GroupedRow className="justify-between">
              <span className="text-[17px]">Modo claro</span>
              <Toggle
                label="Modo claro"
                checked={theme === 'light'}
                onChange={(checked) => setTheme(checked ? 'light' : 'dark')}
              />
            </GroupedRow>
          </GroupedList>
        </div>

        <ProfileStep
          health={health}
          onChange={updateHealth}
          title="Tu perfil de salud"
          description="Podés actualizar esto cuando quieras."
        />

        <div>
          <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">
            Cómo calculamos tu riesgo
          </h2>
          <Card>
            <p className="text-[16px] leading-snug">
              Empezamos con la sensación térmica del día. Como tu perfil suma{' '}
              <strong>{adjustment > 0 ? `${adjustment}° de sensibilidad extra` : 'ninguna sensibilidad extra'}</strong>
              , el nivel de riesgo puede subir con menos temperatura que a otra persona. Esto no es un diagnóstico
              médico: es una guía para ayudarte a decidir cómo organizar tu día.
            </p>
            {neighborhood && (
              <p className="mt-3 text-[16px] leading-snug">
                Además, en {neighborhood.nombre} usamos datos abiertos del Ajuntament de València sobre cobertura de
                sombra y arbolado para estimar si tu barrio suele sentirse un poco más caluroso o más fresco que el
                dato oficial.
              </p>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
