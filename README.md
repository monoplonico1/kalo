# Kaló

PWA mobile-first, con estética iOS, que ayuda a adaptarse al calor extremo del día a
día con recomendaciones personalizadas según tu perfil de salud (edad, condiciones
médicas, si trabajás al aire libre, si tenés aire acondicionado).

No es una herramienta contra el cambio climático: es una guía práctica para decidir
cómo organizar tu día cuando el calor es riesgoso para tu situación particular.

Ver [`CLAUDE.md`](./CLAUDE.md) para el brief completo de producto y las decisiones de
diseño/arquitectura.

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Stack

Vite + React + TypeScript, Tailwind CSS v4, Zustand, TanStack Query, Open-Meteo (sin
API key), `vite-plugin-pwa`. Sin backend: todo el estado vive en el dispositivo.
