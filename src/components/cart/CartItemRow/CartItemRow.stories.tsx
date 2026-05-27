import type { Meta, StoryObj } from '@storybook/react'
import { CartItemRow } from './CartItemRow'
import type { CartItem } from '@store/cartStore'

const ethiopia: CartItem = {
  productId: 'cb-1',
  name: 'Ethiopia Yirgacheffe',
  price: 28.0,
  quantity: 2,
  imageUrl: null,
  productType: 'CoffeeBean',
  originCountry: 'Ethiopia',
  originRegion: 'Yirgacheffe',
  tastingNotes: 'Floral, Citrus, Bergamot',
}

const kenya: CartItem = {
  productId: 'cb-2',
  name: 'Kenya AA Single Origin — Nyeri',
  price: 34.0,
  quantity: 1,
  imageUrl: null,
  productType: 'CoffeeBean',
  originCountry: 'Kenya',
  originRegion: 'Nyeri',
  tastingNotes: 'Blackcurrant, Tomato, Citrus',
}

const equipment: CartItem = {
  productId: 'eq-1',
  name: 'Comandante C40 MK4',
  price: 220.0,
  quantity: 1,
  imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=160&h=160&fit=crop',
  productType: 'Equipment',
}

const meta: Meta<typeof CartItemRow> = {
  title: 'Cart/CartItemRow',
  component: CartItemRow,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div className="w-[600px]"><Story /></div>],
  args: {
    onUpdateQuantity: () => {},
    onRemove: () => {},
  },
}

export default meta
type Story = StoryObj<typeof CartItemRow>

export const CoffeeBean: Story = {
  name: 'Coffee bean',
  args: { item: ethiopia },
}

export const CoffeeBeanHighQty: Story = {
  name: 'Coffee bean — high quantity',
  args: { item: { ...kenya, quantity: 5 } },
}

export const CoffeeBeanQuantityOne: Story = {
  name: 'Coffee bean — qty 1 (min)',
  args: { item: { ...ethiopia, quantity: 1 } },
}

export const EquipmentWithImage: Story = {
  name: 'Equipment — with image',
  args: { item: equipment },
}

export const EquipmentNoImage: Story = {
  name: 'Equipment — no image',
  args: { item: { ...equipment, imageUrl: null } },
}

export const LongName: Story = {
  name: 'Long product name (truncate)',
  args: {
    item: {
      ...ethiopia,
      name: 'Ethiopia Yirgacheffe Natural Process Grade 1 Single-Origin Specialty Coffee',
    },
  },
}
