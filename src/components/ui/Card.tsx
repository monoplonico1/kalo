import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

/** Bloque de texto sin caja: solo un acento vertical para separarlo del gradiente de fondo. */
export function Card({ children, className = '' }: CardProps) {
  return <div className={`border-l-2 border-[var(--hairline-strong)] py-1 pl-4 ${className}`}>{children}</div>
}

interface GroupedListProps {
  children: ReactNode
  className?: string
}

/**
 * Filas agrupadas bajo un mismo label. Solo lleva linea entre filas cuando hay
 * mas de una — un grupo de un solo item no necesita encierre, la jerarquia la
 * da el label de arriba (tamaño/color), no una caja.
 */
export function GroupedList({ children, className = '' }: GroupedListProps) {
  return <div className={`divide-y divide-[var(--hairline)] ${className}`}>{children}</div>
}

interface GroupedRowProps {
  children: ReactNode
  className?: string
}

export function GroupedRow({ children, className = '' }: GroupedRowProps) {
  return <div className={`flex min-h-11 items-center gap-3 py-3 ${className}`}>{children}</div>
}
