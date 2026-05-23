import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <MemoryRouter><div className="bg-[var(--color-surface)] w-[500px] rounded-2xl"><Story /></div></MemoryRouter>],
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const NoProducts: Story = {
  args: {
    heading: 'No coffees found',
    description: 'Try adjusting your filters or check back later for new arrivals.',
    action: { label: 'Clear filters', onClick: () => {} },
  },
}

export const EmptyCart: Story = {
  args: {
    heading: 'Your cart is empty',
    description: 'Discover our range of single-origin coffees and brewing equipment.',
    action: { label: 'Shop now', to: '/coffee' },
  },
}
