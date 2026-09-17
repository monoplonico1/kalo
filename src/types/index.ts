export type RiskLevel = 'low' | 'moderate' | 'high' | 'extreme'

export interface HealthProfile {
  ageBand: 'under-65' | '65-plus'
  hasRespiratoryOrCardiacCondition: boolean
  isPregnant: boolean
  worksOutdoors: boolean
  hasHomeAC: boolean
}

export interface Location {
  name: string
  admin1?: string
  country?: string
  latitude: number
  longitude: number
}

export interface AlertPreferences {
  notificationsEnabled: boolean
  /** Ajuste manual en °C sobre el umbral calculado por perfil (seccion 8). Positivo = mas tolerante. */
  customThresholdOffset: number
}

export interface UserProfile {
  onboardingCompleted: boolean
  location: Location | null
  health: HealthProfile
  alerts: AlertPreferences
}

export interface HourlyPoint {
  time: string
  temperature: number
  apparentTemperature: number
  humidity: number
  uvIndex: number
  risk: RiskLevel
}

export interface CurrentWeather {
  temperature: number
  apparentTemperature: number
  humidity: number
  uvIndex: number
}

export interface AirQuality {
  usAqi: number | null
  pm2_5: number | null
  pm10: number | null
  ozone: number | null
}

export interface RiskAssessment {
  level: RiskLevel
  effectiveApparentTemperature: number
  thresholdAdjustment: number
  recommendations: string[]
}

export type ShadeBucket = 'muy_baja' | 'baja' | 'media' | 'alta' | 'muy_alta'
export type VulnerabilityLevel = 'Vulnerabilidad Baja' | 'Vulnerabilidad Media' | 'Vulnerabilidad Alta'

/**
 * Contexto de barrio para Valencia, a partir de datos abiertos del Ajuntament
 * (ver src/lib/geo/valenciaNeighborhoods.ts). No existe para otras ciudades.
 */
export interface NeighborhoodContext {
  nombre: string
  distrito: string | null
  sombraBucket: ShadeBucket | null
  arbolesPerKm2: number | null
  vulnerabilidadGlobal: VulnerabilityLevel | null
  /** Ajuste estimado en °C por baja cobertura arbórea, ya limitado a un rango conservador. */
  thresholdAdjustment: number
}

export interface NearbyFountain {
  calle: string | null
  distanceMeters: number
}
