import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Design System/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Email address' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}

export const WithLabel: Story = {
  args: { label: 'Email Address', placeholder: 'your@email.com' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}

export const WithHint: Story = {
  args: { label: 'Password', type: 'password', hint: 'Minimum 8 characters' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}

export const ErrorState: Story = {
  args: { label: 'Email', placeholder: 'your@email.com', error: 'Invalid email address' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}

export const Disabled: Story = {
  args: { label: 'Email', value: 'user@example.com', disabled: true },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}

export const SearchVariant: Story = {
  args: { variant: 'search', placeholder: 'Search coffees...' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}
