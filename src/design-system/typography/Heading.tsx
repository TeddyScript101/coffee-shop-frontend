import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const headingVariants = cva(
  'font-[var(--font-serif)] text-[var(--color-text)] leading-tight',
  {
    variants: {
      level: {
        h1: 'text-[var(--text-display-xl)] tracking-[-0.02em]',
        h2: 'text-[var(--text-display-lg)] tracking-[-0.015em]',
        h3: 'text-[var(--text-display)] tracking-[-0.01em]',
        h4: 'text-[var(--text-product-lg)] tracking-[-0.005em]',
        h5: 'text-[var(--text-product)]',
        h6: 'text-base',
      },
    },
    defaultVariants: {
      level: 'h2',
    },
  },
)

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingLevel
}

export function Heading({ className, level, as, children, ...props }: HeadingProps) {
  const Tag = (as ?? level ?? 'h2') as HeadingLevel
  return (
    <Tag className={cn(headingVariants({ level: level ?? (as as VariantProps<typeof headingVariants>['level']) }), className)} {...props}>
      {children}
    </Tag>
  )
}
