import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './Separator'

const meta: Meta<typeof Separator> = {
  title: 'Design System/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  decorators: [(Story) => (
    <div className="w-80 p-6 bg-white rounded-2xl shadow-[var(--shadow-soft)] flex flex-col gap-4">
      <p className="text-sm text-[var(--color-text)]">Section above</p>
      <Story />
      <p className="text-sm text-[var(--color-text)]">Section below</p>
    </div>
  )],
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  decorators: [(Story) => (
    <div className="h-16 p-6 bg-white rounded-2xl shadow-[var(--shadow-soft)] flex items-center gap-4">
      <p className="text-sm text-[var(--color-text)]">Left</p>
      <Story />
      <p className="text-sm text-[var(--color-text)]">Right</p>
    </div>
  )],
}

export const InCard: Story = {
  render: () => (
    <div className="w-80 bg-white rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
      <div className="p-5">
        <p className="font-[var(--font-serif)] text-lg text-[var(--color-text)]">Ethiopia Yirgacheffe</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Light Roast · 250g</p>
      </div>
      <Separator />
      <div className="p-5 flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">Price</p>
        <p className="font-semibold text-[var(--color-primary)]">$28.00</p>
      </div>
    </div>
  ),
}

export const BetweenNavItems: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-xl">
      <span className="text-sm text-[var(--color-text-muted)]">Coffee</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="text-sm text-[var(--color-text-muted)]">Equipment</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="text-sm text-[var(--color-text-muted)]">Membership</span>
    </div>
  ),
}
