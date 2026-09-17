import { Button } from '../ui/Button'
import { GroupedList, GroupedRow } from '../ui/Card'
import { Toggle } from '../ui/Toggle'
import { SegmentedControl } from '../ui/SegmentedControl'
import type { HealthProfile } from '../../types'

interface ProfileStepProps {
  health: HealthProfile
  onChange: (health: Partial<HealthProfile>) => void
  onContinue?: () => void
  title?: string
  description?: string
}

export function ProfileStep({
  health,
  onChange,
  onContinue,
  title = 'Contanos sobre vos',
  description = 'Con esto ajustamos cuándo avisarte que el calor es riesgoso para tu situación.',
}: ProfileStepProps) {
  return (
    <div className="flex min-h-full flex-col gap-5 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold">{title}</h1>
        <p className="text-[16px] text-[var(--color-secondary-label)]">{description}</p>
      </div>

      <div>
        <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">Edad</h2>
        <SegmentedControl
          aria-label="Rango de edad"
          value={health.ageBand}
          onChange={(ageBand) => onChange({ ageBand })}
          segments={[
            { value: 'under-65', label: 'Menos de 65' },
            { value: '65-plus', label: '65 o más' },
          ]}
        />
      </div>

      <div>
        <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">Condiciones de salud</h2>
        <GroupedList>
          <GroupedRow className="justify-between">
            <span className="text-[17px]">Condición respiratoria o cardiovascular</span>
            <Toggle
              label="Condición respiratoria o cardiovascular"
              checked={health.hasRespiratoryOrCardiacCondition}
              onChange={(checked) => onChange({ hasRespiratoryOrCardiacCondition: checked })}
            />
          </GroupedRow>
          <GroupedRow className="justify-between">
            <span className="text-[17px]">Embarazo</span>
            <Toggle
              label="Embarazo"
              checked={health.isPregnant}
              onChange={(checked) => onChange({ isPregnant: checked })}
            />
          </GroupedRow>
        </GroupedList>
      </div>

      <div>
        <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">Tu día a día</h2>
        <GroupedList>
          <GroupedRow className="justify-between">
            <span className="text-[17px]">Trabajo o hago actividad al aire libre</span>
            <Toggle
              label="Trabajo o hago actividad al aire libre"
              checked={health.worksOutdoors}
              onChange={(checked) => onChange({ worksOutdoors: checked })}
            />
          </GroupedRow>
          <GroupedRow className="justify-between">
            <span className="text-[17px]">Tengo aire acondicionado en casa</span>
            <Toggle
              label="Tengo aire acondicionado en casa"
              checked={health.hasHomeAC}
              onChange={(checked) => onChange({ hasHomeAC: checked })}
            />
          </GroupedRow>
        </GroupedList>
      </div>

      {onContinue && (
        <Button className="mt-auto w-full" onClick={onContinue}>
          Continuar
        </Button>
      )}
    </div>
  )
}
