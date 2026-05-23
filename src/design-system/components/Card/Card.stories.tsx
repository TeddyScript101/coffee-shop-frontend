import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardFooter, CardHeader } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Card>

const SampleContent = () => (
  <>
    <CardHeader>
      <h3 className="font-[var(--font-serif)] text-[var(--text-product-lg)] text-[var(--color-text)]">
        Ethiopia Yirgacheffe
      </h3>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-[var(--color-text-muted)]">
        Delicate floral notes with citrus brightness and a clean, tea-like finish.
      </p>
    </CardContent>
    <CardFooter>
      <span className="text-[var(--color-primary)] font-medium">$28.00</span>
    </CardFooter>
  </>
)

export const Default: Story = {
  render: () => <Card className="w-72"><SampleContent /></Card>,
}

export const Elevated: Story = {
  render: () => <Card variant="elevated" className="w-72"><SampleContent /></Card>,
}

export const Flat: Story = {
  render: () => <Card variant="flat" className="w-72"><SampleContent /></Card>,
}

export const Interactive: Story = {
  render: () => <Card interactive className="w-72"><SampleContent /></Card>,
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-8 bg-[var(--color-surface)] rounded-3xl">
      <Card className="w-64"><SampleContent /></Card>
      <Card variant="elevated" className="w-64"><SampleContent /></Card>
      <Card variant="flat" className="w-64"><SampleContent /></Card>
    </div>
  ),
}
