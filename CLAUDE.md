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
- Dark mode como identidad visual **por defecto** (`theme: 'dark'` en el perfil), con
  un modo claro explícito que el usuario elige en Perfil → Apariencia. Ninguno de los
  dos sigue `prefers-color-scheme`: es una elección del usuario, no del sistema.
- El texto vive directo sobre el gradiente de fondo, separado con líneas finas
  (`border-[var(--hairline)]`, `divide-y`) en vez de cajas rellenas. La única
  superficie real (`.sheet-surface`: vidrio esmerilado con `backdrop-filter: blur(20px)`
  y doble sombra) es el `BottomSheet`, porque un modal sí necesita distinguirse del
  contenido de atrás — y sí se tematiza, a diferencia de `.map-panel-surface` (ver
  "Tema claro/oscuro" más abajo).
- **Sin `NavigationBar`/headers en ninguna pantalla**: se probó y se sacó — un título
  grande arriba de cada pantalla no agregaba nada (la pestaña activa del `TabBar` ya
  dice dónde estás) y en modo claro el brillo del gradiente detrás del texto se veía
  sucio. El componente `NavigationBar` queda en `components/ui/` sin uso por ahora;
  no reintroducirlo salvo que haga falta un botón de acción en el header.
  Cada pantalla arranca con `<main className="safe-top ...">` directo.
- **La jerarquía la dan tamaño y color de texto, no líneas decorativas**: `GroupedList`
  (`Card.tsx`) solo pone `divide-y` *entre* filas cuando hay más de una — un grupo de
  un solo item no lleva ninguna línea, ni de encierre arriba/abajo. Antes tenía
  `border-y` enmarcando incluso grupos de 1 fila; se sacó porque no separaba nada, solo
  decoraba. El label chico en mayúsculas/gris arriba de cada grupo ya hace ese trabajo.
- El dato hero (temperatura, sensación térmica) domina la pantalla: 72–96px, bold/black.
- Icono hero con animación sutil de flotación (`.hero-float`), desactivada
  automáticamente con `prefers-reduced-motion`.
- Tokens de color, tipografía y spacing en `src/lib/designTokens.ts` y `src/index.css`.

## Tema claro/oscuro

`theme: 'dark' | 'light'` vive en el perfil (persistido en `localStorage`, igual que
el resto), con el toggle en `ProfileScreen` (sección "Apariencia"). `App.tsx` sincroniza
`document.documentElement.dataset.theme` con un `useEffect`, y `src/index.css` define
los tokens de color dos veces: una vez en `:root` (oscuro, el default) y otra vez bajo
`:root[data-theme='light']`.

- **Los colores de sistema se oscurecen en claro**: `--color-system-green/yellow/
  orange/red/blue` no son los mismos hex en los dos temas. El amarillo/verde/naranja
  vivos de iOS no llegan a 4.5:1 de contraste sobre fondo blanco usados como texto
  (`Badge`, `Button` tinted/plain) — se verificó con la fórmula de luminancia relativa
  de WCAG, no a ojo (verde 5.0:1, ámbar 6.4:1, naranja 5.4:1, rojo 5.7:1, azul 6.7:1
  contra blanco). Como `--risk-low/moderate/high/extreme` son alias de estos mismos
  tokens, el `Badge` de riesgo queda accesible en los dos temas sin tocar su código.
- **Líneas y superficies pasan por variables, nunca `white/NN` literal**: `--hairline`,
  `--hairline-strong` y `--toggle-track-off` son blancos translúcidos en oscuro y
  negros translúcidos en claro. Si agregás un divisor nuevo, usá
  `border-[var(--hairline)]`, no `border-white/10` — ese literal no se ve en claro.
- **El mapa se queda oscuro en los dos temas**: los tiles de CARTO (`dark_all`) y el
  choropleth de barrios no cambian con el tema de la app — es un basemap, no chrome.
  `.map-panel-surface` (el panel flotante del mapa) sí se tematiza, pero por separado
  de `.sheet-surface`, con su propio `--map-panel-bg`, porque necesita quedar legible
  flotando sobre ese basemap oscuro fijo en los dos temas.
- `BottomSheet` (`.sheet-surface`) sí sigue el tema de la app normalmente, como
  cualquier hoja nativa de iOS.

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

### El número hero es personalizado, no el dato genérico de la ciudad

`RiskCard` muestra `assessment.effectiveApparentTemperature` (oficial + perfil + barrio)
como el número gigante, no `apparentTemperature` cruda. Cuando el ajuste es distinto de
cero, el caption debajo aclara `"Estimado para vos en {ciudad} · oficial {temp}°"`; si no
hay ningún ajuste (perfil sin factores de riesgo, sin datos de barrio), el número
coincide con el oficial y el caption vuelve a ser genérico. Esto es deliberado: Kaló
partió pareciendo "Open-Meteo con mejor diseño" — el mismo dato que cualquier app de
clima, solo que con más diseño encima. Mostrar el ajuste en el número principal (no
solo en el nivel de riesgo, que antes era la única cosa personalizada) es lo que hace
que la personalización se note de entrada, no que haya que leer letra chica para
encontrarla.

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
- **`SHADE_ADJUSTMENT` está exportado** (no es un detalle privado del módulo):
  `MapScreen` lo reusa para calcular la temperatura estimada al tocar un barrio en el
  mapa (ver "Tab Mapa" abajo), así el mismo número (+1.5° a -0.5° según sombra) no se
  duplica con otra constante que se pueda desalinear con el tiempo.

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
rendimiento en celulares. Cada categoría tiene color y radio distintos.

**Panel flotante** (`MapPanel.tsx`, config compartida en `mapCategories.ts`): reemplaza
los popups nativos de Leaflet por un panel propio, con 3 estados:

- *Colapsado* (default): fila de botones grandes con ícono para mostrar/ocultar cada
  capa (`visibleLayers: Set<MapLayerId>` en `MapScreen`), más una flecha para expandir.
- *Expandido*: lo mismo, más la leyenda de sombra/arbolado con su aclaración de que es
  una estimación, no una medición real.
- *Detalle*: al tocar un marcador o un barrio (`selectedPlace` en `MapScreen`,
  vía `eventHandlers.click` en cada `CircleMarker` y un listener en `onEachFeature`
  para el `GeoJSON` de barrios). Muestra nombre, categoría, distancia real a la
  ubicación del usuario (`haversineDistanceMeters`), un texto de "cómo te ayuda con el
  calor" específico por categoría (`helpTextFor` en `mapCategories.ts`), y un botón
  "Cómo llegar" (`buildDirectionsUrl`, deep link universal a Google Maps) — excepto
  para barrios, que no son un punto de destino y en su lugar muestran la nota de
  vulnerabilidad social por separado del dato térmico.
- **Tocar un barrio muestra una temperatura real, no solo la etiqueta de sombra**:
  `MapScreen` llama a `useWeather(location)` (mismo `queryKey` que `HomeScreen`, así
  que react-query lo cachea sin pegarle una segunda vez a Open-Meteo) y calcula
  `estimatedApparentTemperature = oficial + SHADE_ADJUSTMENT[sombraBucket]` al armar el
  `selectedPlace` del barrio tocado. A propósito **no** suma el ajuste de perfil de
  salud del usuario ahí: el mapa compara lugares entre sí (por eso "buscar focos de
  calor y puntos frescos" es el objetivo), no cómo le pega el calor a la persona que
  mira — eso ya lo hace el número personalizado de `RiskCard` en Hoy. Mismo
  `SHADE_ADJUSTMENT` que usa `findBarrio` en `useNeighborhoodContext`, no una copia.

El panel usa `.map-panel-surface` (`src/index.css`), no `.sheet-surface`: flota
directo sobre el choropleth de colores variables del mapa, así que necesita un fondo
casi opaco para que el texto siga siendo legible — `.sheet-surface` (pensado para el
`BottomSheet`, que ya tiene un overlay oscuro detrás) se ve demasiado transparente ahí.

Nota de implementación si se vuelve a tocar el layout del mapa: `.leaflet-container`
tiene `position: relative` pero `z-index: auto`, así que **no** crea su propio
stacking context — los panes internos de Leaflet (z-index 200 a 700) compiten directo
contra el `z-index` del panel en el contexto raíz y ganan si el contenedor del mapa no
tiene también un `z-index` explícito. Por eso `MapContainer` está envuelto en un
`<div className="absolute inset-0 z-0">` en `MapScreen.tsx`.

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
