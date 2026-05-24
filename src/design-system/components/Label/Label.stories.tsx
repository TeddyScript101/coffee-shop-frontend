import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './Label'
import { Input } from '../Input/Input'

const meta: Meta<typeof Label> = {
  title: 'Design System/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: { children: 'Email address' },
}

export const Required: Story = {
  args: { children: 'Email address', required: true },
}

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-72">
      <Label htmlFor="email-input" required>
        Email address
      </Label>
      <Input id="email-input" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const WithInputOptional: Story = {
  name: 'With Input (optional)',
  render: () => (
    <div className="flex flex-col gap-1.5 w-72">
      <Label htmlFor="phone-input">Phone number</Label>
      <Input id="phone-input" type="tel" placeholder="+1 555 000 0000" />
    </div>
  ),
}

export const FormGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-5 w-80 p-6 bg-white rounded-2xl shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="first" required>First name</Label>
        <Input id="first" placeholder="Alex" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="last" required>Last name</Label>
        <Input id="last" placeholder="Chen" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" placeholder="+1 555 000 0000" />
      </div>
    </div>
  ),
}
