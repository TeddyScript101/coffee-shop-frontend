import type { Meta, StoryObj } from '@storybook/react'
import { PhilosophyBand } from './PhilosophyBand'

const meta: Meta<typeof PhilosophyBand> = {
  title: 'Components/Home/PhilosophyBand',
  component: PhilosophyBand,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof PhilosophyBand>

export const Default: Story = {}
