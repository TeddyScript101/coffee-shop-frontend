import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const cardVariants = cva(
  'rounded-2xl overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-white shadow-[var(--shadow-soft)]',
        elevated: 'bg-white shadow-[var(--shadow-soft-md)] border border-[var(--color-border-subtle)]',
        flat: 'bg-[var(--color-surface-elevated)]',
      },
      interactive: {
        true: [
          'cursor-pointer',
          'transition-all duration-[250ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          'hover:shadow-[var(--shadow-soft-md)] hover:-translate-y-0.5',
        ],
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
    },
  },
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, interactive, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, interactive }), className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 pt-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 pb-6', className)} {...props}>
      {children}
    </div>
  )
}
