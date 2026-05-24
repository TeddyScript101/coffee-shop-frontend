import type { Meta, StoryObj } from '@storybook/react'
import { ErrorState } from './ErrorState'

const meta: Meta<typeof ErrorState> = {
  title: 'Components/Feedback/ErrorState',
  component: ErrorState,
  parameters: { layout: 'centered' },
  decorators: [(Story) => (
    <div className="w-[480px] bg-[var(--color-surface)] rounded-2xl">
      <Story />
    </div>
  )],
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ErrorState>

export const Default: Story = {}

export const WithRetry: Story = {
  args: {
    onRetry: () => alert('Retrying…'),
  },
}

export const ProductsFailure: Story = {
  args: {
    heading: 'Could not load products',
    description: 'Check your connection and try again.',
    onRetry: () => {},
  },
}

export const NetworkFailure: Story = {
  args: {
    heading: 'Network error',
    description: 'You appear to be offline. Reconnect and refresh the page.',
  },
}
