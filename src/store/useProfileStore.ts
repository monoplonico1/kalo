import { create } from 'zustand'
import type { AlertPreferences, HealthProfile, Location, UserProfile } from '../types'
import { defaultProfile, loadProfile, saveProfile } from '../lib/storage/profile'

interface ProfileState extends UserProfile {
  setLocation: (location: Location) => void
  updateHealth: (health: Partial<HealthProfile>) => void
  updateAlerts: (alerts: Partial<AlertPreferences>) => void
  completeOnboarding: () => void
  reset: () => void
}

function persist(state: UserProfile): void {
  saveProfile(state)
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  ...loadProfile(),

  setLocation: (location) => {
    set({ location })
    persist({ ...get(), location })
  },

  updateHealth: (health) => {
    const next = { ...get().health, ...health }
    set({ health: next })
    persist({ ...get(), health: next })
  },

  updateAlerts: (alerts) => {
    const next = { ...get().alerts, ...alerts }
    set({ alerts: next })
    persist({ ...get(), alerts: next })
  },

  completeOnboarding: () => {
    set({ onboardingCompleted: true })
    persist({ ...get(), onboardingCompleted: true })
  },

  reset: () => {
    set(defaultProfile)
    persist(defaultProfile)
  },
}))
