import type { Meta, StoryObj } from '@storybook/react'
import { Heading } from './Heading'

const meta: Meta<typeof Heading> = {
  title: 'Design System/Typography/Heading',
  component: Heading,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Heading>

export const AllLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-8 bg-[var(--color-surface)] rounded-2xl w-[500px]">
      <Heading level="h1">Display XL — Yirgacheffe</Heading>
      <Heading level="h2">Display LG — Yirgacheffe</Heading>
      <Heading level="h3">Display — Yirgacheffe</Heading>
      <Heading level="h4">Product LG — Yirgacheffe</Heading>
      <Heading level="h5">Product — Yirgacheffe</Heading>
      <Heading level="h6">Base — Yirgacheffe</Heading>
    </div>
  ),
}
