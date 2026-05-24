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
    bean: {
      id: 1,
      name: 'Ethiopian Yirgacheffe',
      sku: 'BEAN-ETH-001',
      price: 18.99,
      stockQuantity: 50,
      imageUrl: '',
      productType: 'CoffeeBean',
      roastLevel: 'Light',
      tastingNotes: 'Floral, Citrus, Bergamot',
      originCountry: 'Ethiopia',
      originRegion: 'Yirgacheffe'
    } as any
  }
}

export const Colombia: Story = {
  args: {
    bean: {
      id: 2,
      name: 'Colombia Supremo',
      sku: 'BEAN-COL-001',
      price: 16.50,
      stockQuantity: 100,
      imageUrl: '',
      productType: 'CoffeeBean',
      roastLevel: 'Medium',
      tastingNotes: 'Dark Cocoa, Caramel, Stone Fruit',
      originCountry: 'Colombia',
      originRegion: 'Huila'
    } as any
  }
}

export const Brazil: Story = {
  args: {
    bean: {
      id: 3,
      name: 'Brazil Cerrado',
      sku: 'BEAN-BRA-001',
      price: 14.00,
      stockQuantity: 120,
      imageUrl: '',
      productType: 'CoffeeBean',
      roastLevel: 'Dark',
      tastingNotes: 'Dark Chocolate, Roasted Almonds',
      originCountry: 'Brazil',
      originRegion: 'Minas Gerais'
    } as any
  }
}

export const CostaRica: Story = {
  args: {
    bean: {
      id: 5,
      name: 'Costa Rica Tarrazu',
      sku: 'BEAN-COS-001',
      price: 19.00,
      stockQuantity: 45,
      imageUrl: '',
      productType: 'CoffeeBean',
      roastLevel: 'Light',
      tastingNotes: 'Honey, Cherry, Toffee',
      originCountry: 'Costa Rica',
      originRegion: 'Tarrazu'
    } as any
  }
}
