import type { Meta, StoryObj } from '@storybook/react'
import { LoginForm } from './LoginForm'

const meta: Meta<typeof LoginForm> = {
  title: 'Components/Auth/LoginForm',
  component: LoginForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof LoginForm>

export const Default: Story = {
  args: {
    onSubmit: async (values) => { console.log(values) },
  },
  decorators: [(Story) => (
    <div className="w-96 p-8 bg-white rounded-3xl shadow-[var(--shadow-soft-md)]">
      <h2 className="font-[var(--font-serif)] text-2xl text-[var(--color-text)] mb-6 text-center">
        Welcome back
      </h2>
      <Story />
    </div>
  )],
}

export const Loading: Story = {
  args: {
    onSubmit: async () => {},
    isLoading: true,
  },
  decorators: [(Story) => (
    <div className="w-96 p-8 bg-white rounded-3xl shadow-[var(--shadow-soft-md)]"><Story /></div>
  )],
}

export const WithError: Story = {
  args: {
    onSubmit: async () => {},
    error: 'Invalid email or password. Please try again.',
  },
  decorators: [(Story) => (
    <div className="w-96 p-8 bg-white rounded-3xl shadow-[var(--shadow-soft-md)]"><Story /></div>
  )],
}
