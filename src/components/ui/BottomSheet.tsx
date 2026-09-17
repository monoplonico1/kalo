import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 transition-opacity duration-200 ease-out"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="safe-bottom glass-surface relative w-full max-w-md rounded-t-[20px] rounded-b-none p-4 transition-transform duration-300 ease-out"
      >
        <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-white/20" aria-hidden />
        <h2 className="mb-3 text-[22px] font-bold">{title}</h2>
        {children}
      </div>
    </div>
  )
}
