import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  variant?: 'default' | 'search'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, variant = 'default', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {variant === 'search' && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-10 rounded-xl border text-sm',
              'bg-[var(--color-surface-elevated)] text-[var(--color-text)]',
              'placeholder:text-[var(--color-text-subtle)]',
              'transition-all duration-[250ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]',
              'focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-300'
                : 'border-[var(--color-border)] hover:border-[var(--color-text-subtle)]',
              variant === 'search' ? 'pl-9 pr-4' : 'px-4',
              className,
            )}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="text-xs text-[var(--color-text-subtle)]">{hint}</p>
        )}
        {error && (
          <p role="alert" className="text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
