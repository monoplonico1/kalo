import type { ComponentType } from 'react'

interface ActionCardProps {
  icon: ComponentType<{ size?: number; 'aria-hidden'?: boolean }>
  text: string
}

export function ActionCard({ icon: Icon, text }: ActionCardProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 shrink-0 text-[var(--color-system-blue)]">
        <Icon size={22} aria-hidden />
      </span>
      <p className="text-[16px] leading-snug text-[var(--color-label)]">{text}</p>
    </div>
  )
}
