import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Design System/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { children: 'Default' },
}

export const RoastLevels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6 bg-[var(--color-surface)] rounded-2xl">
      <Badge variant="roast-light">Light Roast</Badge>
      <Badge variant="roast-medium">Medium Roast</Badge>
      <Badge variant="roast-dark">Dark Roast</Badge>
    </div>
  ),
}

export const EquipmentTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6 bg-[var(--color-surface)] rounded-2xl">
      <Badge variant="equipment-type">Grinder</Badge>
      <Badge variant="equipment-type">Filter</Badge>
      <Badge variant="equipment-type">Machine</Badge>
      <Badge variant="equipment-type">Kettle</Badge>
    </div>
  ),
}

export const MembershipTiers: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6 bg-[var(--color-surface)] rounded-2xl">
      <Badge variant="tier-bronze" size="md">Bronze</Badge>
      <Badge variant="tier-silver" size="md">Silver</Badge>
      <Badge variant="tier-gold" size="md">Gold</Badge>
    </div>
  ),
}
