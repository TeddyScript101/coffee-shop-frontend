import type { Meta, StoryObj } from '@storybook/react'
import { RoastBadge } from './RoastBadge'

const meta: Meta<typeof RoastBadge> = {
  title: 'Components/Products/RoastBadge',
  component: RoastBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RoastBadge>

export const Light: Story = { args: { roastLevel: 'Light' } }
export const Medium: Story = { args: { roastLevel: 'Medium' } }
export const Dark: Story = { args: { roastLevel: 'Dark' } }

export const AllRoastLevels: Story = {
  render: () => (
    <div className="flex gap-3 p-6 bg-[var(--color-surface)] rounded-2xl">
      <RoastBadge roastLevel="Light" />
      <RoastBadge roastLevel="Medium" />
      <RoastBadge roastLevel="Dark" />
    </div>
  ),
}
