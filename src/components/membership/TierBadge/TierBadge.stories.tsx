import type { Meta, StoryObj } from '@storybook/react'
import { TierBadge } from './TierBadge'

const meta: Meta<typeof TierBadge> = {
  title: 'Components/Membership/TierBadge',
  component: TierBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof TierBadge>

export const Bronze: Story = {
  args: { tier: 'Bronze' },
}

export const Silver: Story = {
  args: { tier: 'Silver' },
}

export const Gold: Story = {
  args: { tier: 'Gold' },
}

export const AllTiers: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6 bg-[var(--color-surface)] rounded-2xl">
      <TierBadge tier="Bronze" size="sm" />
      <TierBadge tier="Silver" size="sm" />
      <TierBadge tier="Gold" size="sm" />
    </div>
  ),
}

export const AllTiersMedium: Story = {
  name: 'All Tiers (md)',
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6 bg-[var(--color-surface)] rounded-2xl">
      <TierBadge tier="Bronze" size="md" />
      <TierBadge tier="Silver" size="md" />
      <TierBadge tier="Gold" size="md" />
    </div>
  ),
}
