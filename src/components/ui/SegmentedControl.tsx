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
    <div role="tablist" aria-label={ariaLabel} className="flex gap-1 border-b border-[var(--hairline)]">
      {segments.map((segment) => {
        const isActive = segment.value === value
        return (
          <button
            key={segment.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(segment.value)}
            className={`min-h-11 flex-1 border-b-2 px-3 text-[15px] font-semibold transition-colors duration-200 ease-out ${
              isActive
                ? 'border-[var(--color-system-blue)] text-[var(--color-label)]'
                : 'border-transparent text-[var(--color-secondary-label)]'
            }`}
          >
            {segment.label}
          </button>
        )
      })}
    </div>
  )
}
