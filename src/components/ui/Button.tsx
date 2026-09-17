import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'filled' | 'tinted' | 'plain'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  filled: 'bg-[var(--color-system-blue)] text-white',
  tinted: 'bg-[var(--color-system-blue)]/15 text-[var(--color-system-blue)]',
  plain: 'bg-transparent text-[var(--color-system-blue)]',
}

export function Button({ variant = 'filled', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`min-h-11 rounded-xl px-5 text-[17px] font-semibold transition-opacity duration-200 ease-out active:opacity-60 disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
