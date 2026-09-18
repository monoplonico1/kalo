import type { UserProfile } from '../../types'

const STORAGE_KEY = 'kalo:profile'

export const defaultProfile: UserProfile = {
  onboardingCompleted: false,
  location: null,
  health: {
    ageBand: 'under-65',
    hasRespiratoryOrCardiacCondition: false,
    isPregnant: false,
    worksOutdoors: false,
    hasHomeAC: true,
  },
  alerts: {
    notificationsEnabled: false,
    customThresholdOffset: 0,
  },
  theme: 'dark',
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProfile
    return { ...defaultProfile, ...(JSON.parse(raw) as UserProfile) }
  } catch {
    return defaultProfile
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // Almacenamiento no disponible (modo privado, cuota llena): la sesion sigue funcionando en memoria.
  }
}
