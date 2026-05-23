import { cn } from '@/utils/cn'
import { Button } from '@ds/components/Button/Button'
import { Link } from 'react-router-dom'

interface EmptyStateProps {
  icon?: React.ReactNode
  heading: string
  description?: string
  action?: { label: string; to?: string; onClick?: () => void }
  className?: string
}

function DefaultIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
      <path d="M24 16v8M24 30v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function EmptyState({ icon, heading, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-8',
        className,
      )}
    >
      <div className="text-[var(--color-text-subtle)] mb-5">
        {icon ?? <DefaultIcon />}
      </div>
      <h3 className="font-[var(--font-serif)] text-xl text-[var(--color-text)] mb-2">
        {heading}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-text-muted)] max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && (
        action.to ? (
          <Link to={action.to}>
            <Button variant="secondary">{action.label}</Button>
          </Link>
        ) : (
          <Button variant="secondary" onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  )
}
