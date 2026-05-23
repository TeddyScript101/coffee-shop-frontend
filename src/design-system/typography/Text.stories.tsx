import type { Meta, StoryObj } from '@storybook/react'
import { Text } from './Text'

const meta: Meta<typeof Text> = {
  title: 'Design System/Typography/Text',
  component: Text,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Text>

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-8 bg-[var(--color-surface)] rounded-2xl w-[480px]">
      <Text variant="lead">Lead — A premium single-origin Ethiopian selection</Text>
      <Text variant="body">Body — Carefully sourced from high-altitude farms in the Yirgacheffe region, this coffee offers a remarkably clean cup.</Text>
      <Text variant="small">Small — Light roast · Ethiopia · Yirgacheffe</Text>
      <Text variant="caption">Caption — Roasted on 15 May 2025</Text>
      <Text variant="label">Label — Tasting Notes</Text>
    </div>
  ),
}
