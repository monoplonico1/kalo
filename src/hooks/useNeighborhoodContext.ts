import { useQuery } from '@tanstack/react-query'
import { findBarrio, findNearestFountains, isWithinValencia } from '../lib/geo/valenciaNeighborhoods'
import type { Location } from '../types'

const STALE_TIME_MS = 24 * 60 * 60 * 1000
const NEARBY_FOUNTAINS_COUNT = 3

export function useNeighborhoodContext(location: Location | null) {
  const withinValencia = location !== null && isWithinValencia(location.latitude, location.longitude)

  return useQuery({
    queryKey: ['valencia-barrio', location?.latitude, location?.longitude],
    queryFn: () => findBarrio(location!.latitude, location!.longitude),
    enabled: withinValencia,
    staleTime: STALE_TIME_MS,
  })
}

export function useNearbyFountains(location: Location | null) {
  const withinValencia = location !== null && isWithinValencia(location.latitude, location.longitude)

  return useQuery({
    queryKey: ['valencia-fuentes', location?.latitude, location?.longitude],
    queryFn: () => findNearestFountains(location!.latitude, location!.longitude, NEARBY_FOUNTAINS_COUNT),
    enabled: withinValencia,
    staleTime: STALE_TIME_MS,
  })
}
