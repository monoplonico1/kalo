import { useState } from 'react'
import { WelcomeStep } from './WelcomeStep'
import { LocationStep } from './LocationStep'
import { ProfileStep } from './ProfileStep'
import { ConfirmStep } from './ConfirmStep'
import { useProfileStore } from '../../store/useProfileStore'
import type { Location } from '../../types'

type Step = 'welcome' | 'location' | 'profile' | 'confirm'

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>('welcome')
  const [pendingLocation, setPendingLocation] = useState<Location | null>(null)

  const health = useProfileStore((s) => s.health)
  const setLocation = useProfileStore((s) => s.setLocation)
  const updateHealth = useProfileStore((s) => s.updateHealth)
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding)

  function handleLocationSelect(location: Location) {
    setPendingLocation(location)
    setStep('profile')
  }

  function handleFinish() {
    if (pendingLocation) setLocation(pendingLocation)
    completeOnboarding()
  }

  return (
    <div className="min-h-full">
      {step === 'welcome' && <WelcomeStep onContinue={() => setStep('location')} />}
      {step === 'location' && <LocationStep onSelect={handleLocationSelect} />}
      {step === 'profile' && (
        <ProfileStep health={health} onChange={updateHealth} onContinue={() => setStep('confirm')} />
      )}
      {step === 'confirm' && pendingLocation && <ConfirmStep location={pendingLocation} onFinish={handleFinish} />}
    </div>
  )
}
