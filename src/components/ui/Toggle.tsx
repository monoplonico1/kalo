interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-[51px] shrink-0 rounded-full transition-colors duration-200 ease-out ${
        checked ? 'bg-[var(--color-system-green)]' : 'bg-white/16'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-7 w-7 rounded-full bg-white shadow transition-transform duration-200 ease-out ${
          checked ? 'translate-x-[19px]' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
