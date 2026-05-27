import type { Meta, StoryObj } from '@storybook/react'
import { Toast } from './Toast'

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}

export default meta
type Story = StoryObj<typeof Toast>

export const Success: Story = {
  args: {
    type: 'success',
    message: 'Address saved successfully.',
  },
}

export const Error: Story = {
  args: {
    type: 'error',
    message: 'Save failed. Please try again.',
  },
}

export const PasswordChanged: Story = {
  name: 'Success — password changed',
  args: {
    type: 'success',
    message: 'Your password has been updated.',
  },
}

export const WrongPassword: Story = {
  name: 'Error — wrong password',
  args: {
    type: 'error',
    message: 'Current password is incorrect.',
  },
}

export const LongMessage: Story = {
  name: 'Long message (wraps)',
  args: {
    type: 'success',
    message: 'Your billing address has been saved and will pre-fill the shipping form at your next checkout.',
  },
}
