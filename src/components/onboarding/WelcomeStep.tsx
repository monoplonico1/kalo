import { Sun } from 'lucide-react'
import { Button } from '../ui/Button'

interface WelcomeStepProps {
  onContinue: () => void
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <div className="hero-float relative flex h-28 w-28 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle, var(--color-system-orange) 0%, transparent 70%)', opacity: 0.35 }}
          aria-hidden
        />
        <Sun size={84} strokeWidth={1.5} className="relative text-[var(--color-system-orange)]" aria-hidden />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-[34px] font-bold leading-tight">Kaló</h1>
        <p className="text-[17px] leading-normal text-[var(--color-secondary-label)]">
          Te ayudamos a sobrellevar los días de calor con recomendaciones pensadas para tu situación, no solo un
          número de temperatura.
        </p>
      </div>

      <Button className="w-full max-w-xs" onClick={onContinue}>
        Comenzar
      </Button>
    </div>
  )
}
