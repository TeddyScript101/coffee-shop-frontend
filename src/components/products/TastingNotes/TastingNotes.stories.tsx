import type { Meta, StoryObj } from '@storybook/react'
import { TastingNotes } from './TastingNotes'

const meta: Meta<typeof TastingNotes> = {
  title: 'Components/Products/TastingNotes',
  component: TastingNotes,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof TastingNotes>

export const Default: Story = {
  args: { notes: 'Floral, Citrus, Bergamot, Peach, Honey' },
  decorators: [(Story) => <div className="p-6 bg-[var(--color-surface)] rounded-2xl w-80"><Story /></div>],
}

export const WithLimit: Story = {
  args: { notes: 'Floral, Citrus, Bergamot, Peach, Honey', maxVisible: 3 },
  decorators: [(Story) => <div className="p-6 bg-[var(--color-surface)] rounded-2xl w-80"><Story /></div>],
}

export const FewNotes: Story = {
  args: { notes: 'Dark Chocolate, Smoky' },
  decorators: [(Story) => <div className="p-6 bg-[var(--color-surface)] rounded-2xl w-80"><Story /></div>],
}
