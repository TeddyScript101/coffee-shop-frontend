import { cn } from '@/utils/cn'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
}

const colorClasses = {
  primary: 'border-[var(--color-primary)] border-t-transparent',
  white: 'border-white border-t-transparent',
}

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-2 animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
    />
  )
}
