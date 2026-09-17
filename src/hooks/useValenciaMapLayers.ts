import { useQuery } from '@tanstack/react-query'
import {
  loadBarriosLayer,
  loadBeachAmenitiesLayer,
  loadFountainsLayer,
  loadParksLayer,
} from '../lib/geo/valenciaMapLayers'

const STALE_TIME_MS = 24 * 60 * 60 * 1000

export function useValenciaMapLayers(enabled: boolean) {
  const barrios = useQuery({
    queryKey: ['map-layer', 'barrios'],
    queryFn: loadBarriosLayer,
    enabled,
    staleTime: STALE_TIME_MS,
  })

  const fountains = useQuery({
    queryKey: ['map-layer', 'fountains'],
    queryFn: loadFountainsLayer,
    enabled,
    staleTime: STALE_TIME_MS,
  })

  const parks = useQuery({
    queryKey: ['map-layer', 'parks'],
    queryFn: loadParksLayer,
    enabled,
    staleTime: STALE_TIME_MS,
  })

  const beachAmenities = useQuery({
    queryKey: ['map-layer', 'beach'],
    queryFn: loadBeachAmenitiesLayer,
    enabled,
    staleTime: STALE_TIME_MS,
  })

  return {
    barrios: barrios.data,
    fountains: fountains.data,
    parks: parks.data,
    beachAmenities: beachAmenities.data,
    isLoading: barrios.isLoading || fountains.isLoading || parks.isLoading || beachAmenities.isLoading,
  }
}
