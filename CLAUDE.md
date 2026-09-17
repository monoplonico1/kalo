# Kaló — guía de proyecto

Web app **mobile-first** con estética iOS (Human Interface Guidelines), pensada para
empaquetarse a futuro como app de iPhone (Capacitor) con el mínimo rediseño posible.

**Qué NO es:** no combate el cambio climático (sin huella de carbono, sin reciclaje).
Es una herramienta de **adaptación al día a día**: ayuda a decidir cómo actuar frente a
calor extremo, según el perfil de salud de cada persona.

## Hipótesis del MVP

> Las personas cambian su rutina diaria cuando reciben una alerta personalizada —según
> su perfil de salud— en lugar de un dato meteorológico genérico.

Métricas: % que reporta haber cambiado su rutina, retención a 7/14 días, % que completa
el perfil de salud.

## Alcance v1

Onboarding corto (ubicación + 4 preguntas de salud), pantalla "Hoy" (sensación térmica +
riesgo + recomendaciones), franja horaria de 24h, umbral de alerta configurable, tab
"Mapa" (heatmap por barrio + fuentes/parques/playa, solo Valencia), PWA instalable.
Local-first: **sin backend**, todo vive en `localStorage` del dispositivo.

Fuera de alcance v1: multi-idioma, cuentas/login, frío extremo o calidad de aire por
incendios, empaquetado nativo real. La excepción es Valencia: ver "Capa de barrio
(Valencia)" más abajo — ahí sí hay una primera versión de contexto hiperlocal y
fuentes de agua cercanas, porque el ayuntamiento ya publica esos datos abiertos.

## Usuario objetivo

Adultos en ciudades con olas de calor, con al menos un factor de vulnerabilidad: 65+,
condición respiratoria/cardiovascular, embarazo, trabajo al aire libre, sin AC en casa.
El diseño debe ser legible y usable por adultos mayores: tipografía grande, alto
contraste, poca fricción.

## Stack

Vite + React 18/19 + TypeScript estricto, Tailwind CSS v4 (`@tailwindcss/vite`),
Zustand para estado, TanStack Query para cachear Open-Meteo, `vite-plugin-pwa` para
manifest/service worker, `lucide-react` para iconografía de sistema.

## Sistema de diseño

- Tipografía: font stack de sistema (`-apple-system, ...`), nunca se embebe SF Pro.
- Dark mode como identidad visual por defecto: fondo casi negro con temperatura de
  color (`#0B0E14`), gradiente radial sutil (`src/index.css`).
- El texto vive directo sobre el gradiente de fondo, separado con líneas finas
  (`border-white/10`, `divide-y`) en vez de cajas rellenas. La única superficie real
  (`.sheet-surface`: vidrio esmerilado con `backdrop-filter: blur(20px)` y doble
  sombra) es el `BottomSheet`, porque un modal sí necesita distinguirse del
  contenido de atrás.
- El dato hero (temperatura, sensación térmica) domina la pantalla: 72–96px, bold/black.
- Icono hero con animación sutil de flotación (`.hero-float`), desactivada
  automáticamente con `prefers-reduced-motion`.
- Tokens de color, tipografía y spacing en `src/lib/designTokens.ts` y `src/index.css`.

## Accesibilidad (no es opcional)

- Contraste real, no solo estético (WCAG 2.1 AA como mínimo).
- Cada nivel de riesgo lleva **color + ícono distinto + texto**, nunca solo color
  (ver `src/components/ui/Badge.tsx`).
- Texto en `px`/`rem` de Tailwind, pero probar siempre con Dynamic Type al máximo.
- Objetivos táctiles mínimo 44×44pt (`min-h-11` en botones/toggles/filas).
- `role="alert"` en el mensaje de riesgo del día; no debe autodesaparecer.
- `aria-label` descriptivo en todo ícono/botón interactivo.
- Recomendaciones en lenguaje simple, sin jerga meteorológica.

## Motor de riesgo (`src/lib/riskEngine.ts`)

Módulo puro y testeable, sin fetch ni dependencias de UI. Los umbrales son un punto de
partida de producto, **no son guía médica**; ajustar contra un protocolo oficial antes
de un lanzamiento real.

- Niveles base por sensación térmica: `<27°` bajo, `27–32°` moderado, `32–38°` alto,
  `>38°` extremo.
- Modificadores de perfil (suman sensibilidad, tope acumulado de 6°): 65+ (+3),
  condición respiratoria/cardiovascular (+3), embarazo (+2), actividad al aire libre
  (+2), sin AC en casa (+2, más relevante de noche).
- El usuario puede sumar un ajuste manual (`alerts.customThresholdOffset`) desde la
  pantalla de Alertas.
- Si hay contexto de barrio (ver abajo), su `thresholdAdjustment` se suma por separado
  (no está capado junto con el de perfil): ver `useRiskEngine`.

## Capa de barrio (Valencia)

Kaló empezó como "Open-Meteo con mejor diseño" — un dato genérico, igual que la alerta
que ya manda el ayuntamiento. `src/lib/geo/valenciaNeighborhoods.ts` es el primer paso
hacia algo hiperlocal: usa datos abiertos reales del Ajuntament de València
(`opendata.vlci.valencia.es`, plataforma CKAN) para saber en qué barrio cae la
ubicación del usuario y ajustar la sensación térmica con eso.

- **Datos**: `public/data/valencia-barrios.geojson` (88 barrios: límites, cobertura de
  sombra/arbolado, vulnerabilidad social) y `public/data/valencia-fuentes.geojson` (832
  fuentes de agua pública). Son una foto simplificada y fusionada de datasets públicos
  del ayuntamiento, procesados igual que el proyecto open source
  [`valencia-refresca`](https://github.com/celiarozalenm/valencia-refresca) (misma
  fuente, mismo criterio). **No son en tiempo real**: hay que re-descargarlos
  periódicamente si el ayuntamiento actualiza sus datasets.
- **Alcance**: solo Valencia. `isWithinValencia(lat, lon)` filtra por bounding box antes
  de cualquier fetch; fuera de esa zona todo el módulo devuelve `null` y el resto de la
  app funciona exactamente igual que para cualquier otra ciudad.
- **Qué SÍ ajustamos**: un offset chico y conservador (±0.5° a +1.5°) según la cobertura
  de sombra/arbolado del barrio — es una estimación basada en el efecto documentado de
  islas de calor urbana, no una medición real de temperatura por barrio.
- **Qué NO ajustamos**: el índice de vulnerabilidad social (`vulnerabilidadGlobal`) es
  demográfico/económico, no térmico — se muestra aparte, nunca se mezcla con la
  sensación térmica, para no confundir "barrio pobre" con "barrio caliente".
- **Nunca inventar ubicaciones de refugios o servicios**: si en el futuro se agrega la
  red oficial de "Refugios Climáticos" (Decreto 150/2025 de la Generalitat, catálogo en
  `dadesobertes.gva.es`), hay que sacar los datos reales de esa fuente — no completar
  direcciones o coordenadas de memoria. Es información de seguridad durante una ola de
  calor; un dato mal recordado ahí es peor que no mostrarlo.
- **Este patrón es reusable**: para agregar otra ciudad con datos abiertos similares,
  el criterio es el mismo: bounding box + polígonos de barrio + point-in-polygon
  (`src/lib/geo/geometry.ts`), sin acoplar nada de esto al risk engine genérico.

### Tab Mapa

`src/components/map/MapScreen.tsx` muestra el mismo choropleth por barrio (sombra/
arbolado, sección anterior) sobre un mapa real con `react-leaflet` + tiles oscuros de
CARTO (`dark_all`, gratis, requiere atribución, sin API key), más tres capas de puntos:

- `public/data/valencia-fuentes.geojson` — las mismas 832 fuentes de agua pública.
- `public/data/valencia-parques.geojson` — 58 parques/jardines grandes (≥20.000 m²,
  ej. Jardín del Turia, Parque de Cabecera), reducidos a su punto centroide para no
  enviar los polígonos completos (el original pesa 6MB con calles y jardines chicos).
- `public/data/valencia-playa.geojson` — duchas y lavapiés de playa.

Todos los puntos se dibujan como `CircleMarker` (capa vectorial de Leaflet), no
`Marker`+ícono: con 800+ fuentes, un nodo del DOM por marcador se nota en el
rendimiento en celulares. Cada categoría tiene color y radio distintos, y un popup con
el nombre al tocar — nunca depende solo del color.

**Deliberadamente NO incluye** piscinas municipales ni la red oficial de "Refugios
Climáticos": no pude verificar un dataset real y vigente para la ciudad de Valencia
(ver la nota de "nunca inventar ubicaciones" arriba). Si se consigue esa fuente,
agregar una capa nueva siguiendo el mismo patrón (`valenciaMapLayers.ts`).

## Estructura

```
src/
  components/ui/        # Componentes de sistema, sin fetch ni lógica de negocio
  components/home/       # Pantalla "Hoy"
  components/map/        # Tab "Mapa" (Leaflet, solo Valencia)
  components/onboarding/ # Flujo de bienvenida
  components/settings/   # Alertas y Perfil
  hooks/                 # useWeather, useAirQuality, useGeolocation, useRiskEngine,
                         # useNeighborhoodContext, useValenciaMapLayers
  lib/api/               # Cliente de Open-Meteo (forecast, air quality, geocoding)
  lib/storage/           # Persistencia en localStorage
  lib/riskEngine.ts      # Motor de riesgo puro
  lib/geo/               # point-in-polygon, haversine, capa de barrio de Valencia
  store/                 # Zustand (useProfileStore)
  types/                 # Tipos compartidos
public/data/             # GeoJSON de Valencia (barrios + fuentes de agua)
```

## APIs (todas gratuitas, sin API key)

- Forecast: `https://api.open-meteo.com/v1/forecast`
- Air quality: `https://air-quality-api.open-meteo.com/v1/air-quality`
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`

Cachear con TanStack Query, `staleTime` mínimo de 15 minutos, para no gastar el límite
de requests.

## Restricciones técnicas conocidas

1. Web Push en iOS Safari solo funciona si la PWA está agregada a la pantalla de
   inicio (iOS 16.4+). El onboarding y Alertas lo comunican explícitamente.
2. `navigator.vibrate()` no funciona en iOS Safari — no depender de haptics reales
   hasta una futura fase con Capacitor.
3. No embeber SF Symbols reales (licencia de Apple); se usa `lucide-react` como
   set equivalente. El swap a SF Symbols queda para una futura fase nativa.
4. No embeber la fuente San Francisco; se invoca vía `-apple-system`.
5. Geolocalización: pedir permiso con contexto claro, y siempre tener fallback de
   búsqueda manual de ciudad (`LocationStep.tsx`).

## Convenciones al trabajar en este repo

- Priorizar simplicidad: es un MVP para validar una hipótesis, no un producto final.
- Todo componente nuevo en `components/ui/` recibe props y no hace fetch.
- TypeScript estricto (`strict: true`).
- Sin backend en esta fase: todo el estado vive en el cliente.
- Probar cada pantalla nueva primero en 375px de ancho (iPhone SE) antes que desktop.
- Mantener el risk engine en un módulo puro y testeable para poder ajustar umbrales
  con datos reales sin tocar UI.
