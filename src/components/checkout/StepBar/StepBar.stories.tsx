import type { Meta, StoryObj } from '@storybook/react'
import { StepBar } from './StepBar'

const meta: Meta<typeof StepBar> = {
  title: 'Checkout/StepBar',
  component: StepBar,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}

export default meta
type Story = StoryObj<typeof StepBar>

export const Shipping: Story = {
  name: 'Step 1 — Shipping active',
  args: { current: 0 },
}

export const Payment: Story = {
  name: 'Step 2 — Payment active',
  args: { current: 1 },
}

export const Review: Story = {
  name: 'Step 3 — Review active',
  args: { current: 2 },
}

export const AllComplete: Story = {
  name: 'All complete',
  args: { current: 3 },
}
