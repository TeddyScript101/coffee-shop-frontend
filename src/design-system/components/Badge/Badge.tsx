import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]',
        'roast-light': 'bg-amber-50 text-amber-700',
        'roast-medium': 'bg-amber-100 text-amber-800',
        'roast-dark': 'bg-stone-700 text-white',
        'equipment-type': 'bg-[var(--color-accent-light)] text-[var(--color-text)]',
        'tier-bronze': 'bg-amber-100 text-amber-800',
        'tier-silver': 'bg-slate-100 text-slate-600',
        'tier-gold': 'bg-yellow-100 text-yellow-700',
        success: 'bg-emerald-50 text-emerald-700',
        warning: 'bg-orange-50 text-orange-700',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  )
}
