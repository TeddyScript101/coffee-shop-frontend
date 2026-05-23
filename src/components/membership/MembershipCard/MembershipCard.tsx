import { TierBadge } from '../TierBadge/TierBadge'
import { formatDateShort } from '@/utils/formatDate'
import { cn } from '@/utils/cn'
import type { MembershipDto } from '@/types/api'

interface MembershipCardProps {
  membership: MembershipDto
  memberName: string
  className?: string
}

export function MembershipCard({ membership, memberName, className }: MembershipCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-4xl overflow-hidden p-8',
        'bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface)]',
        'shadow-[var(--shadow-soft-lg)]',
        'border border-[var(--color-border-subtle)]',
        className,
      )}
      style={{ borderRadius: 'var(--radius-4xl)' }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-widest mb-1">
            Cheeky Ember
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">Member Card</p>
        </div>
        <TierBadge tier={membership.tier} size="md" />
      </div>

      <div className="mb-6">
        <p className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wide mb-1">Points Balance</p>
        <p className="font-[var(--font-serif)] text-5xl text-[var(--color-text)] leading-none">
          {membership.points.toLocaleString()}
        </p>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wide mb-0.5">Member</p>
          <p className="font-medium text-[var(--color-text)]">{memberName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wide mb-0.5">Member since</p>
          <p className="text-sm text-[var(--color-text-muted)]">{formatDateShort(membership.joinedAt)}</p>
        </div>
      </div>

      <div
        className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }}
        aria-hidden="true"
      />
    </div>
  )
}
