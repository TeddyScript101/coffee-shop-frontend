import { cn } from '@/utils/cn'
import { Button } from '@ds/components/Button/Button'

interface ErrorStateProps {
  heading?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  heading = 'Something went wrong',
  description = 'We could not load this content. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-8', className)}>
      <div className="text-red-300 mb-5">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M24 16v12M24 33v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="font-[var(--font-serif)] text-xl text-[var(--color-text)] mb-2">{heading}</h3>
      <p className="text-sm text-[var(--color-text-muted)] max-w-xs leading-relaxed mb-6">{description}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>Try again</Button>
      )}
    </div>
  )
}
