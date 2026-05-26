import type { Meta, StoryObj } from '@storybook/react'
import { TasteNoteImage } from './TasteNoteImage'

const meta: Meta<typeof TasteNoteImage> = {
  title: 'Components/Products/TasteNoteImage',
  component: TasteNoteImage,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[400px] h-[400px] shadow-xl rounded-3xl overflow-hidden">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof TasteNoteImage>

export const Ethiopia: Story = {
  args: {
    originCountry: 'Ethiopia',
    originRegion: 'Yirgacheffe',
    tastingNotes: 'Floral, Citrus, Bergamot',
  }
}

export const Colombia: Story = {
  args: {
    originCountry: 'Colombia',
    originRegion: 'Huila',
    tastingNotes: 'Dark Cocoa, Caramel, Stone Fruit',
  }
}

export const Brazil: Story = {
  args: {
    originCountry: 'Brazil',
    originRegion: 'Minas Gerais',
    tastingNotes: 'Dark Chocolate, Roasted Almonds',
  }
}

export const CostaRica: Story = {
  args: {
    originCountry: 'Costa Rica',
    originRegion: 'Tarrazu',
    tastingNotes: 'Honey, Cherry, Toffee',
  }
}
