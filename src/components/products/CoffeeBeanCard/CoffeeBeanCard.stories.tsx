import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { CoffeeBeanCard } from './CoffeeBeanCard'
import type { CoffeeBeanDto } from '@/types/api'

const sampleBean: CoffeeBeanDto = {
  id: '1',
  name: 'Ethiopia Yirgacheffe',
  sku: 'CB-001',
  price: 28.0,
  stockQuantity: 50,
  imageUrl: 'https://picsum.photos/seed/coffee1/400/400',
  productType: 'CoffeeBean',
  createdAt: '2025-01-01',
  roastLevel: 'Light',
  tastingNotes: 'Floral, Citrus, Bergamot, Peach',
  originCountry: 'Ethiopia',
  originRegion: 'Yirgacheffe',
}

const meta: Meta<typeof CoffeeBeanCard> = {
  title: 'Components/Products/CoffeeBeanCard',
  component: CoffeeBeanCard,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof CoffeeBeanCard>

export const Default: Story = {
  args: { bean: sampleBean },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
}

export const DarkRoast: Story = {
  args: {
    bean: {
      ...sampleBean,
      id: '2',
      name: 'Sumatra Mandheling',
      roastLevel: 'Dark',
      tastingNotes: 'Dark Chocolate, Earthy, Smoky, Cedar',
      originCountry: 'Indonesia',
      originRegion: 'Sumatra',
      price: 32.0,
      imageUrl: 'https://picsum.photos/seed/coffee2/400/400',
    },
  },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
}

export const LowStock: Story = {
  args: {
    bean: { ...sampleBean, stockQuantity: 4 },
  },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
}

export const OutOfStock: Story = {
  args: {
    bean: { ...sampleBean, stockQuantity: 0 },
  },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
}
