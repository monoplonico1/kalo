import { useQuery } from '@tanstack/react-query'
import { fetchAirQuality } from '../lib/api/openMeteo'
import type { Location } from '../types'

const STALE_TIME_MS = 30 * 60 * 1000

export function useAirQuality(location: Location | null) {
  return useQuery({
    queryKey: ['air-quality', location?.latitude, location?.longitude],
    queryFn: () => fetchAirQuality(location!.latitude, location!.longitude),
    enabled: location !== null,
    staleTime: STALE_TIME_MS,
    retry: 2,
  })
}
