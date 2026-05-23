import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Spinner } from '../Spinner/Spinner'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
    'transition-all duration-[250ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
    'select-none cursor-pointer',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-primary)] text-white',
          'hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-soft)]',
          'active:scale-[0.98]',
        ],
        secondary: [
          'bg-[var(--color-surface-elevated)] text-[var(--color-text)]',
          'border border-[var(--color-border)]',
          'hover:bg-[var(--color-border)] hover:border-[var(--color-border)]',
        ],
        ghost: [
          'bg-transparent text-[var(--color-text)]',
          'hover:bg-[var(--color-surface-elevated)]',
        ],
        danger: [
          'bg-red-50 text-red-700 border border-red-200',
          'hover:bg-red-100 hover:border-red-300',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-lg',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base rounded-2xl',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      block: false,
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, block }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner size="sm" color={variant === 'primary' ? 'white' : 'primary'} />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
