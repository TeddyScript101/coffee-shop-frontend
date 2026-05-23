import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Design System/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Spinner>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-6 bg-[var(--color-surface)] rounded-2xl">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
}

export const WhiteOnDark: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-6 bg-[var(--color-brand-charcoal)] rounded-2xl">
      <Spinner size="sm" color="white" />
      <Spinner size="md" color="white" />
      <Spinner size="lg" color="white" />
    </div>
  ),
}
