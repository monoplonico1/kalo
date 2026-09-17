import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

/** Bloque de texto sin caja: solo un acento vertical para separarlo del gradiente de fondo. */
export function Card({ children, className = '' }: CardProps) {
  return <div className={`border-l-2 border-white/15 py-1 pl-4 ${className}`}>{children}</div>
}

interface GroupedListProps {
  children: ReactNode
  className?: string
}

/** Lista tipo "inset grouped" de iOS Settings, pero sin relleno: solo lineas finas entre filas. */
export function GroupedList({ children, className = '' }: GroupedListProps) {
  return (
    <div className={`divide-y divide-white/10 border-y border-white/10 ${className}`}>{children}</div>
  )
}

interface GroupedRowProps {
  children: ReactNode
  className?: string
}

export function GroupedRow({ children, className = '' }: GroupedRowProps) {
  return <div className={`flex min-h-11 items-center gap-3 py-3 ${className}`}>{children}</div>
}
