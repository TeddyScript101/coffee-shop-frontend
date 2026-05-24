import type { Meta, StoryObj } from '@storybook/react'
import { RegisterForm } from './RegisterForm'

const meta: Meta<typeof RegisterForm> = {
  title: 'Components/Auth/RegisterForm',
  component: RegisterForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RegisterForm>

const wrap = (Story: React.ComponentType) => (
  <div className="w-96 p-8 bg-white rounded-3xl shadow-[var(--shadow-soft-md)]">
    <h2 className="font-[var(--font-serif)] text-2xl text-[var(--color-text)] mb-6 text-center">
      Create account
    </h2>
    <Story />
  </div>
)

export const Default: Story = {
  args: {
    onSubmit: async (values) => { console.log(values) },
  },
  decorators: [(Story) => wrap(Story)],
}

export const Loading: Story = {
  args: {
    onSubmit: async () => {},
    isLoading: true,
  },
  decorators: [(Story) => wrap(Story)],
}

export const WithError: Story = {
  args: {
    onSubmit: async () => {},
    error: 'An account with this email already exists.',
  },
  decorators: [(Story) => wrap(Story)],
}
