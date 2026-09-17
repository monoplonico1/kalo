import { CheckCircle2, Share } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import type { Location } from '../../types'

interface ConfirmStepProps {
  location: Location
  onFinish: () => void
}

export function ConfirmStep({ location, onFinish }: ConfirmStepProps) {
  return (
    <div className="flex min-h-full flex-col gap-5 px-4 py-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 size={56} className="text-[var(--color-system-green)]" aria-hidden />
        <h1 className="text-[28px] font-bold">Todo listo</h1>
        <p className="text-[16px] text-[var(--color-secondary-label)]">
          Vamos a avisarte cuando el calor en {location.name} sea riesgoso para tu situación.
        </p>
      </div>

      <Card className="flex items-start gap-3">
        <Share size={22} className="mt-0.5 shrink-0 text-[var(--color-system-blue)]" aria-hidden />
        <p className="text-[16px] leading-snug">
          Para recibir alertas, agregá esta app a tu pantalla de inicio: tocá compartir y luego "Agregar a
          pantalla de inicio".
        </p>
      </Card>

      <Button className="mt-auto w-full" onClick={onFinish}>
        Ir a Kaló
      </Button>
    </div>
  )
}
