import { Badge } from '@ds/components/Badge/Badge'
import type { RoastLevel } from '@/types/api'

interface RoastBadgeProps {
  roastLevel: RoastLevel
  size?: 'sm' | 'md'
  className?: string
}

const roastLabels: Record<RoastLevel, string> = {
  Light: 'Light Roast',
  Medium: 'Medium Roast',
  Dark: 'Dark Roast',
}

const roastVariants = {
  Light: 'roast-light',
  Medium: 'roast-medium',
  Dark: 'roast-dark',
} as const

export function RoastBadge({ roastLevel, size = 'sm', className }: RoastBadgeProps) {
  return (
    <Badge variant={roastVariants[roastLevel]} size={size} className={className}>
      {roastLabels[roastLevel]}
    </Badge>
  )
}
