import { useQuery } from '@tanstack/react-query'
import { fetchForecast } from '../lib/api/openMeteo'
import type { Location } from '../types'

const STALE_TIME_MS = 15 * 60 * 1000

export function useWeather(location: Location | null) {
  return useQuery({
    queryKey: ['forecast', location?.latitude, location?.longitude],
    queryFn: () => fetchForecast(location!.latitude, location!.longitude),
    enabled: location !== null,
    staleTime: STALE_TIME_MS,
    retry: 2,
  })
}
