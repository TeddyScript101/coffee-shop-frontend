import { Badge } from '@ds/components/Badge/Badge'
import type { MembershipTier } from '@/types/api'

interface TierBadgeProps {
  tier: MembershipTier
  size?: 'sm' | 'md'
  className?: string
}

const tierVariants = {
  Bronze: 'tier-bronze',
  Silver: 'tier-silver',
  Gold: 'tier-gold',
} as const

export function TierBadge({ tier, size = 'sm', className }: TierBadgeProps) {
  return (
    <Badge variant={tierVariants[tier]} size={size} className={className}>
      {tier}
    </Badge>
  )
}
