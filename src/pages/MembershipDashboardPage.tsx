import { PageLayout } from '@components/layout/PageLayout'
import { MembershipCard } from '@components/membership/MembershipCard/MembershipCard'
import { TierBadge } from '@components/membership/TierBadge/TierBadge'
import { useAuthStore } from '@store/authStore'
import type { MembershipTier } from '@/types/api'

const tierBenefits: Record<MembershipTier, string[]> = {
  Bronze: ['5% off all orders', 'Early access to new arrivals', 'Birthday surprise'],
  Silver: ['10% off all orders', 'Free shipping on orders over $50', 'Exclusive tasting notes PDF', 'Priority support'],
  Gold: ['15% off all orders', 'Free shipping on all orders', 'Monthly coffee subscription (1 bag)', 'Exclusive Gold-tier beans', 'Personal coffee consultant'],
}

const nextTier: Partial<Record<MembershipTier, MembershipTier>> = {
  Bronze: 'Silver',
  Silver: 'Gold',
}

const tierThresholds: Record<MembershipTier, number> = {
  Bronze: 0,
  Silver: 1000,
  Gold: 5000,
}

export function MembershipDashboardPage() {
  const { user } = useAuthStore()

  const mockMembership = {
    id: 'mock-1',
    points: 480,
    tier: 'Bronze' as MembershipTier,
    joinedAt: new Date().toISOString(),
  }

  const currentTier = mockMembership.tier
  const next = nextTier[currentTier]
  const pointsToNext = next ? tierThresholds[next] - mockMembership.points : null

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-[var(--font-serif)] text-[var(--text-display-lg)] text-[var(--color-text)] mb-1">
            Your Membership
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Welcome back, {user?.firstName ?? 'Member'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MembershipCard
            membership={mockMembership}
            memberName={user?.firstName ?? 'Member'}
          />

          <div className="flex flex-col gap-5">
            {next && pointsToNext !== null && pointsToNext > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)]">
                <p className="text-sm text-[var(--color-text-muted)] mb-2">
                  Progress to <TierBadge tier={next} size="sm" />
                </p>
                <div className="w-full h-2 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-[350ms]"
                    style={{
                      width: `${Math.min(100, ((mockMembership.points - tierThresholds[currentTier]) / (tierThresholds[next] - tierThresholds[currentTier])) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-[var(--color-text-subtle)] mt-2">
                  {pointsToNext} more points to unlock {next}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-medium text-[var(--color-text)] mb-4">Your {currentTier} Benefits</h3>
              <ul className="flex flex-col gap-2">
                {tierBenefits[currentTier].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 text-[var(--color-accent)] shrink-0" aria-hidden="true">
                      <path d="M3 8L6 11L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
