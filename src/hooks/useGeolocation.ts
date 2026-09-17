import { useCallback, useState } from 'react'

interface GeolocationState {
  isLoading: boolean
  error: string | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ isLoading: false, error: null })

  const requestLocation = useCallback((): Promise<GeolocationCoordinates | null> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setState({ isLoading: false, error: 'Tu navegador no soporta ubicación. Buscá tu ciudad manualmente.' })
        resolve(null)
        return
      }

      setState({ isLoading: true, error: null })

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({ isLoading: false, error: null })
          resolve(position.coords)
        },
        () => {
          setState({
            isLoading: false,
            error: 'No pudimos acceder a tu ubicación. Buscá tu ciudad manualmente.',
          })
          resolve(null)
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
      )
    })
  }, [])

  return { ...state, requestLocation }
}
