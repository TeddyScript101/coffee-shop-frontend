import type { Meta, StoryObj } from '@storybook/react'
import { ProductThumbnail } from './ProductThumbnail'

const meta: Meta<typeof ProductThumbnail> = {
  title: 'Products/ProductThumbnail',
  component: ProductThumbnail,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-20 h-20 rounded-xl overflow-hidden">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ProductThumbnail>

// Coffee beans — each country gets its accent color
export const Ethiopia: Story = {
  args: { productType: 'CoffeeBean', originCountry: 'Ethiopia', name: 'Ethiopia Yirgacheffe' },
}

export const Colombia: Story = {
  args: { productType: 'CoffeeBean', originCountry: 'Colombia', name: 'Colombia Huila' },
}

export const Brazil: Story = {
  args: { productType: 'CoffeeBean', originCountry: 'Brazil', name: 'Brazil Santos' },
}

export const Kenya: Story = {
  args: { productType: 'CoffeeBean', originCountry: 'Kenya', name: 'Kenya AA' },
}

export const Panama: Story = {
  args: { productType: 'CoffeeBean', originCountry: 'Panama', name: 'Panama Geisha' },
}

export const Indonesia: Story = {
  args: { productType: 'CoffeeBean', originCountry: 'Indonesia', name: 'Sumatra Mandheling' },
}

// Coffee bean without origin (e.g. from OrderItemDto which lacks that field)
export const CoffeeBeanNoOrigin: Story = {
  name: 'CoffeeBean — no origin',
  args: { productType: 'CoffeeBean', name: 'Mystery Blend' },
}

// Equipment
export const EquipmentNoImage: Story = {
  name: 'Equipment',
  args: { productType: 'Equipment', name: 'Hario V60 Dripper' },
}

// Small size (checkout sidebar / order history)
export const SmallSize: Story = {
  name: 'Small (40 × 40)',
  decorators: [
    (Story) => (
      <div className="w-10 h-10 rounded-lg overflow-hidden">
        <Story />
      </div>
    ),
  ],
  args: { productType: 'CoffeeBean', originCountry: 'Kenya', name: 'Kenya AA' },
}
