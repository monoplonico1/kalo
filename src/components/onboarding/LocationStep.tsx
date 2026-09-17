import { useEffect, useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import { Button } from '../ui/Button'
import { GroupedList, GroupedRow } from '../ui/Card'
import { useGeolocation } from '../../hooks/useGeolocation'
import { searchLocations } from '../../lib/api/openMeteo'
import type { Location } from '../../types'

interface LocationStepProps {
  onSelect: (location: Location) => void
}

export function LocationStep({ onSelect }: LocationStepProps) {
  const { isLoading, error, requestLocation } = useGeolocation()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Location[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    const timeout = setTimeout(() => {
      setIsSearching(true)
      searchLocations(query)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setIsSearching(false))
    }, 350)
    return () => clearTimeout(timeout)
  }, [query])

  async function handleUseCurrentLocation() {
    const coords = await requestLocation()
    if (coords) {
      onSelect({ name: 'Tu ubicación actual', latitude: coords.latitude, longitude: coords.longitude })
    }
  }

  return (
    <div className="flex min-h-full flex-col gap-5 px-4 py-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-[28px] font-bold">¿Dónde estás?</h1>
        <p className="text-[16px] text-[var(--color-secondary-label)]">
          Usamos tu ubicación para mostrarte el pronóstico y las alertas de tu zona. Nunca se comparte con nadie más.
        </p>
      </div>

      <Button onClick={handleUseCurrentLocation} disabled={isLoading} className="flex w-full items-center justify-center gap-2">
        <MapPin size={20} aria-hidden />
        {isLoading ? 'Buscando ubicación…' : 'Usar mi ubicación actual'}
      </Button>

      {error && <p className="text-center text-[14px] text-[var(--color-system-red)]">{error}</p>}

      <div className="flex items-center gap-2 text-[13px] text-[var(--color-tertiary-label)]">
        <span className="h-px flex-1 bg-white/10" />
        o buscá tu ciudad
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <label className="flex items-center gap-2 border-b border-white/15 px-1 py-3">
        <Search size={20} className="text-[var(--color-secondary-label)]" aria-hidden />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nombre de tu ciudad"
          aria-label="Buscar ciudad"
          className="w-full bg-transparent text-[17px] text-[var(--color-label)] outline-none placeholder:text-[var(--color-tertiary-label)]"
        />
      </label>

      {isSearching && <p className="text-center text-[14px] text-[var(--color-secondary-label)]">Buscando…</p>}

      {results.length > 0 && (
        <GroupedList>
          {results.map((location, i) => (
            <GroupedRow key={`${location.name}-${i}`}>
              <button
                type="button"
                onClick={() => onSelect(location)}
                className="min-h-11 w-full text-left text-[17px]"
              >
                {location.name}
                {location.admin1 ? `, ${location.admin1}` : ''}
                {location.country ? `, ${location.country}` : ''}
              </button>
            </GroupedRow>
          ))}
        </GroupedList>
      )}
    </div>
  )
}
