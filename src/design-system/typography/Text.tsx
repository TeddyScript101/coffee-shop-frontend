import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const textVariants = cva(
  'font-[var(--font-sans)]',
  {
    variants: {
      variant: {
        body: 'text-base text-[var(--color-text)] leading-relaxed',
        lead: 'text-lg text-[var(--color-text-muted)] leading-relaxed',
        small: 'text-sm text-[var(--color-text-muted)]',
        caption: 'text-xs text-[var(--color-text-subtle)]',
        label: 'text-sm font-medium text-[var(--color-text)]',
      },
    },
    defaultVariants: {
      variant: 'body',
    },
  },
)

type TextTag = 'p' | 'span' | 'div' | 'label'

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: TextTag
}

export function Text({ className, variant, as = 'p', children, ...props }: TextProps) {
  const Tag = as
  return (
    <Tag className={cn(textVariants({ variant }), className)} {...(props as React.HTMLAttributes<HTMLElement>)}>
      {children}
    </Tag>
  )
}
