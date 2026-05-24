import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from './Footer'

const meta: Meta<typeof Footer> = {
  title: 'Components/Layout/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Footer>

export const Default: Story = {}
