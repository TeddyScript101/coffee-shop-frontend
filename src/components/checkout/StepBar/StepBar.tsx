import { cn } from '@/utils/cn'

const STEPS = ['Shipping', 'Payment', 'Review'] as const

export interface StepBarProps {
  current: number
  className?: string
}

export function StepBar({ current, className }: StepBarProps) {
  return (
    <div className={cn('flex items-center justify-center gap-0', className)}>
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  done
                    ? 'bg-[var(--color-primary)] text-white'
                    : active
                      ? 'bg-[var(--color-primary)] text-white ring-2 ring-[var(--color-primary)]/30 ring-offset-2'
                      : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]',
                ].join(' ')}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={[
                  'text-xs mt-1.5 whitespace-nowrap',
                  active
                    ? 'text-[var(--color-primary)] font-medium'
                    : 'text-[var(--color-text-muted)]',
                ].join(' ')}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  'h-px w-12 sm:w-20 mx-2 mt-[-12px] transition-colors',
                  done ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
