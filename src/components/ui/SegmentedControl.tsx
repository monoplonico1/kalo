interface Segment<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[]
  value: T
  onChange: (value: T) => void
  'aria-label': string
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="glass-surface flex gap-1 rounded-xl p-1"
    >
      {segments.map((segment) => {
        const isActive = segment.value === value
        return (
          <button
            key={segment.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(segment.value)}
            className={`min-h-9 flex-1 rounded-[10px] px-3 text-[15px] font-semibold transition-colors duration-200 ease-out ${
              isActive ? 'bg-white/12 text-[var(--color-label)]' : 'text-[var(--color-secondary-label)]'
            }`}
          >
            {segment.label}
          </button>
        )
      })}
    </div>
  )
}
