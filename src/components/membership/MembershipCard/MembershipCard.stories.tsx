import type { Meta, StoryObj } from '@storybook/react'
import { MembershipCard } from './MembershipCard'

const meta: Meta<typeof MembershipCard> = {
  title: 'Components/Membership/MembershipCard',
  component: MembershipCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof MembershipCard>

export const Bronze: Story = {
  args: {
    membership: { id: '1', points: 240, tier: 'Bronze', joinedAt: '2025-01-15' },
    memberName: 'Alex Chen',
  },
  decorators: [(Story) => <div className="w-96"><Story /></div>],
}

export const Silver: Story = {
  args: {
    membership: { id: '2', points: 1850, tier: 'Silver', joinedAt: '2024-06-20' },
    memberName: 'Sarah Tanaka',
  },
  decorators: [(Story) => <div className="w-96"><Story /></div>],
}

export const Gold: Story = {
  args: {
    membership: { id: '3', points: 8450, tier: 'Gold', joinedAt: '2023-03-10' },
    memberName: 'Kenji Watanabe',
  },
  decorators: [(Story) => <div className="w-96"><Story /></div>],
}
