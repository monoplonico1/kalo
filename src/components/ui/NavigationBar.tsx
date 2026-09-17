import type { ReactNode } from 'react'

interface NavigationBarProps {
  title: string
  large?: boolean
  trailing?: ReactNode
}

export function NavigationBar({ title, large = true, trailing }: NavigationBarProps) {
  return (
    <header className="safe-top sticky top-0 z-10 border-b border-white/8 bg-[var(--color-system-background)]/80 px-4 pb-3 pt-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className={large ? 'text-[34px] font-bold leading-tight' : 'text-[17px] font-semibold'}>{title}</h1>
        {trailing}
      </div>
    </header>
  )
}
