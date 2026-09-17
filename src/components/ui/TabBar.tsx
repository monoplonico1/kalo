import type { ComponentType } from 'react'

export type TabKey = 'today' | 'alerts' | 'profile'

interface Tab {
  key: TabKey
  label: string
  icon: ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>
}

interface TabBarProps {
  tabs: Tab[]
  activeTab: TabKey
  onChange: (tab: TabKey) => void
}

export function TabBar({ tabs, activeTab, onChange }: TabBarProps) {
  return (
    <nav
      className="safe-bottom sticky bottom-0 z-10 flex border-t border-white/8 bg-[var(--color-system-background)]/80 backdrop-blur-xl"
      aria-label="Navegación principal"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab
        const Icon = tab.icon
        return (
          <button
            key={tab.key}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            aria-label={tab.label}
            onClick={() => onChange(tab.key)}
            className="flex min-h-11 flex-1 flex-col items-center gap-1 px-2 py-2 text-center"
          >
            <Icon size={24} strokeWidth={isActive ? 2.4 : 1.8} aria-hidden />
            <span
              className={`text-[12px] ${isActive ? 'font-semibold text-[var(--color-system-blue)]' : 'text-[var(--color-secondary-label)]'}`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
