import { useState } from 'react'
import { TierBadge } from '../TierBadge/TierBadge'
import { formatDateShort } from '@/utils/formatDate'
import { cn } from '@/utils/cn'
import type { MembershipDto } from '@/types/api'
import type { MembershipTier } from '@/types/api'

interface MembershipCardProps {
  membership: MembershipDto
  memberName: string
  className?: string
}

const tierStyles: Record<MembershipTier, {
  front: string
  back: string
  stripe: string
  orb: string
}> = {
  Bronze: {
    front: 'linear-gradient(135deg, #7A3A18 0%, #C08050 45%, #E0BC88 100%)',
    back:  'linear-gradient(135deg, #E0BC88 0%, #C08050 55%, #7A3A18 100%)',
    stripe: '#3D1C0A',
    orb: 'rgba(255, 230, 180, 0.4)',
  },
  Silver: {
    front: 'linear-gradient(135deg, #3A3A58 0%, #8080A8 45%, #D0D0E8 100%)',
    back:  'linear-gradient(135deg, #D0D0E8 0%, #8080A8 55%, #3A3A58 100%)',
    stripe: '#1A1A30',
    orb: 'rgba(230, 230, 255, 0.35)',
  },
  Gold: {
    front: 'linear-gradient(135deg, #5A3800 0%, #C89000 45%, #FFE060 100%)',
    back:  'linear-gradient(135deg, #FFE060 0%, #C89000 55%, #5A3800 100%)',
    stripe: '#2A1800',
    orb: 'rgba(255, 245, 140, 0.4)',
  },
}

function FlipIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 4v6h6" />
      <path d="M23 20v-6h-6" />
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
    </svg>
  )
}

export function MembershipCard({ membership, memberName, className }: MembershipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const styles = tierStyles[membership.tier]

  // Build a display-friendly member ID from the raw id
  const raw = membership.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  const padded = raw.padEnd(8, '0').slice(0, 8)
  const memberId = `BW-${padded.slice(0, 4)} ${padded.slice(4, 8)}`

  function toggle() {
    setIsFlipped(f => !f)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Perspective wrapper */}
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: '1200px', aspectRatio: '86 / 54' }}
        onClick={toggle}
        role="button"
        tabIndex={0}
        aria-label={`${membership.tier} membership card. Press Enter or Space to flip.`}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle()}
      >
        {/* Rotating container */}
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 700ms cubic-bezier(0.4, 0.2, 0.2, 1)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* ========== FRONT FACE ========== */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              background: styles.front,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            {/* Decorative orb — top right */}
            <div
              className="absolute -top-14 -right-14 w-52 h-52 rounded-full"
              style={{ background: `radial-gradient(circle, ${styles.orb}, transparent 70%)` }}
              aria-hidden="true"
            />
            {/* Decorative orb — bottom left */}
            <div
              className="absolute -bottom-20 -left-14 w-72 h-72 rounded-full"
              style={{ background: `radial-gradient(circle, ${styles.orb}, transparent 70%)`, opacity: 0.5 }}
              aria-hidden="true"
            />
            {/* Subtle grid lines */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(255,255,255,1) 0, rgba(255,255,255,1) 1px, transparent 1px, transparent 36px), ' +
                  'repeating-linear-gradient(90deg, rgba(255,255,255,1) 0, rgba(255,255,255,1) 1px, transparent 1px, transparent 36px)',
              }}
              aria-hidden="true"
            />

            <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/55 text-sm font-semibold uppercase tracking-[0.22em]">BeanWorks</p>
                  <p className="text-white/45 text-xs mt-0.5 tracking-wide">Member Card</p>
                </div>
                <TierBadge tier={membership.tier} size="md" />
              </div>

              {/* Points */}
              <div>
                <p className="text-white/45 text-[11px] uppercase tracking-[0.2em] mb-1">Points Balance</p>
                <p
                  className="text-white leading-none"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2.8rem, 10vw, 3.75rem)',
                    fontWeight: 600,
                    textShadow: '0 2px 12px rgba(0,0,0,0.25)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {membership.points.toLocaleString()}
                </p>
              </div>

              {/* Bottom row */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/45 text-[11px] uppercase tracking-[0.2em] mb-0.5">Member</p>
                  <p className="text-white font-semibold text-sm tracking-widest">{memberName.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/45 text-[11px] uppercase tracking-[0.2em] mb-0.5">Since</p>
                  <p className="text-white/80 text-sm sm:text-base">{formatDateShort(membership.joinedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ========== BACK FACE ========== */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              background: styles.back,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            {/* Decorative orb — top left (mirrored) */}
            <div
              className="absolute -top-14 -left-14 w-52 h-52 rounded-full"
              style={{ background: `radial-gradient(circle, ${styles.orb}, transparent 70%)` }}
              aria-hidden="true"
            />

            {/* Magnetic stripe */}
            <div
              className="w-full mt-7 sm:mt-9 h-9 sm:h-11"
              style={{ background: styles.stripe }}
              aria-hidden="true"
            />

            <div className="px-6 sm:px-8 pt-3 flex flex-col gap-2 sm:gap-3">
              {/* Signature strip + CVV */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className="flex-1 h-6 sm:h-7 rounded-[3px]"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, rgba(255,255,255,0.88) 0, rgba(255,255,255,0.88) 7px, rgba(180,170,160,0.5) 7px, rgba(180,170,160,0.5) 8px)',
                  }}
                  aria-hidden="true"
                />
                <div
                  className="border border-white/25 px-2 py-1 rounded text-white/80 text-xs font-mono tracking-wider"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  aria-label="CVV placeholder"
                >
                  CVV
                </div>
              </div>

              {/* Member ID */}
              <div>
                <p className="text-white/45 text-[11px] uppercase tracking-[0.2em] mb-0.5">Member ID</p>
                <p className="text-white/90 font-mono text-sm sm:text-base tracking-[0.18em]">{memberId}</p>
              </div>

              {/* Decorative barcode */}
              <div
                className="w-3/4 h-7 sm:h-8 rounded-[2px] opacity-60"
                style={{
                  background:
                    'repeating-linear-gradient(90deg, #111 0,#111 2px, #eee 2px,#eee 3px, #111 3px,#111 5px, #eee 5px,#eee 6px, #111 6px,#111 7px, #eee 7px,#eee 10px, #111 10px,#111 11px, #eee 11px,#eee 13px, #111 13px,#111 14px, #eee 14px,#eee 17px, #111 17px,#111 19px, #eee 19px,#eee 20px, #111 20px,#111 21px, #eee 21px,#eee 24px)',
                }}
                aria-hidden="true"
              />

              {/* Footer info */}
              <div className="flex items-end justify-between">
                <p className="text-white/35 text-[11px] uppercase tracking-widest">beanworks.com.au</p>
                <p className="text-white/35 text-[11px] uppercase tracking-widest">{membership.tier} Rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flip hint */}
      <p
        className="self-center flex items-center gap-1.5 text-[var(--color-text-subtle)] text-xs"
        aria-hidden="true"
      >
        <FlipIcon />
        {isFlipped ? 'Click to see front' : 'Click to flip'}
      </p>
    </div>
  )
}
