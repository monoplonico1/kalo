import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return <div className={`glass-surface rounded-[14px] p-4 ${className}`}>{children}</div>
}

interface GroupedListProps {
  children: ReactNode
  className?: string
}

/** Lista tipo "inset grouped" de iOS Settings: filas separadas por lineas finas dentro de una card. */
export function GroupedList({ children, className = '' }: GroupedListProps) {
  return <div className={`glass-surface divide-y divide-white/8 rounded-[14px] ${className}`}>{children}</div>
}

interface GroupedRowProps {
  children: ReactNode
  className?: string
}

export function GroupedRow({ children, className = '' }: GroupedRowProps) {
  return <div className={`flex min-h-11 items-center gap-3 px-4 py-3 ${className}`}>{children}</div>
}
