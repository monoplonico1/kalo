/** Link universal de direcciones: abre la app de mapas del dispositivo o Google Maps en la web, sin API key. */
export function buildDirectionsUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
}
