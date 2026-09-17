import type { AirQuality, CurrentWeather, HourlyPoint, Location } from '../../types'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

interface ForecastResponse {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    uv_index: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    apparent_temperature: number[]
    relative_humidity_2m: number[]
    uv_index: number[]
  }
}

export interface ForecastResult {
  current: CurrentWeather
  hourly: Omit<HourlyPoint, 'risk'>[]
}

export async function fetchForecast(latitude: number, longitude: number): Promise<ForecastResult> {
  const url = new URL(FORECAST_URL)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,uv_index')
  url.searchParams.set('hourly', 'temperature_2m,apparent_temperature,relative_humidity_2m,uv_index')
  url.searchParams.set('forecast_days', '2')
  url.searchParams.set('timezone', 'auto')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Open-Meteo forecast fallo con estado ${response.status}`)
  }
  const data = (await response.json()) as ForecastResponse

  const hourly: Omit<HourlyPoint, 'risk'>[] = data.hourly.time.map((time, i) => ({
    time,
    temperature: data.hourly.temperature_2m[i],
    apparentTemperature: data.hourly.apparent_temperature[i],
    humidity: data.hourly.relative_humidity_2m[i],
    uvIndex: data.hourly.uv_index[i],
  }))

  return {
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      uvIndex: data.current.uv_index,
    },
    hourly,
  }
}

interface AirQualityResponse {
  current: {
    us_aqi: number | null
    pm2_5: number | null
    pm10: number | null
    ozone: number | null
  }
}

export async function fetchAirQuality(latitude: number, longitude: number): Promise<AirQuality> {
  const url = new URL(AIR_QUALITY_URL)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('current', 'us_aqi,pm2_5,pm10,ozone')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Open-Meteo air quality fallo con estado ${response.status}`)
  }
  const data = (await response.json()) as AirQualityResponse

  return {
    usAqi: data.current.us_aqi,
    pm2_5: data.current.pm2_5,
    pm10: data.current.pm10,
    ozone: data.current.ozone,
  }
}

interface GeocodingResponse {
  results?: {
    name: string
    admin1?: string
    country?: string
    latitude: number
    longitude: number
  }[]
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (query.trim().length < 2) return []

  const url = new URL(GEOCODING_URL)
  url.searchParams.set('name', query)
  url.searchParams.set('count', '8')
  url.searchParams.set('language', 'es')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Open-Meteo geocoding fallo con estado ${response.status}`)
  }
  const data = (await response.json()) as GeocodingResponse

  return (data.results ?? []).map((r) => ({
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  }))
}
