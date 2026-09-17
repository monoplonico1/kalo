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
riesgo + recomendaciones), franja horaria de 24h, umbral de alerta configurable, PWA
instalable. Local-first: **sin backend**, todo vive en `localStorage` del dispositivo.

Fuera de alcance v1: mapa de refugios, multi-idioma, cuentas/login, frío extremo o
calidad de aire por incendios, empaquetado nativo real.

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
- Cards en vidrio esmerilado: `backdrop-filter: blur(20px)`, doble sombra
  (ambiental + contacto). Ver clase `.glass-surface`.
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

## Estructura

```
src/
  components/ui/        # Componentes de sistema, sin fetch ni lógica de negocio
  components/home/       # Pantalla "Hoy"
  components/onboarding/ # Flujo de bienvenida
  components/settings/   # Alertas y Perfil
  hooks/                 # useWeather, useAirQuality, useGeolocation, useRiskEngine
  lib/api/               # Cliente de Open-Meteo (forecast, air quality, geocoding)
  lib/storage/           # Persistencia en localStorage
  lib/riskEngine.ts      # Motor de riesgo puro
  store/                 # Zustand (useProfileStore)
  types/                 # Tipos compartidos
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
