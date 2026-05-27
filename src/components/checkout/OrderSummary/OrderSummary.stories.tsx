import type { Meta, StoryObj } from '@storybook/react'
import { OrderSummary } from './OrderSummary'
import { useCartStore } from '@store/cartStore'
import type { CartItem } from '@store/cartStore'

// ---- Sample data ----

const beanA: CartItem = {
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

const beanB: CartItem = {
  productId: 'cb-2',
  name: 'Kenya AA',
  price: 34.0,
  quantity: 1,
  imageUrl: null,
  productType: 'CoffeeBean',
  originCountry: 'Kenya',
  originRegion: 'Nyeri',
  tastingNotes: 'Blackcurrant, Tomato, Citrus',
}

const equipmentItem: CartItem = {
  productId: 'eq-1',
  name: 'Hario V60 Dripper',
  price: 45.0,
  quantity: 1,
  imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=80&h=80&fit=crop',
  productType: 'Equipment',
}

const expensiveItem: CartItem = {
  productId: 'eq-2',
  name: 'Comandante C40 MK4',
  price: 220.0,
  quantity: 1,
  imageUrl: null,
  productType: 'Equipment',
}

// ---- Meta ----

const meta: Meta<typeof OrderSummary> = {
  title: 'Checkout/OrderSummary',
  component: OrderSummary,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
}

export default meta
type Story = StoryObj<typeof OrderSummary>

// ---- Stories ----

export const SingleBean: Story = {
  name: 'Single coffee bean',
  decorators: [
    (Story) => {
      useCartStore.setState({ items: [beanA] })
      return <Story />
    },
  ],
}

export const TwoBeans: Story = {
  name: 'Two coffee beans',
  decorators: [
    (Story) => {
      useCartStore.setState({ items: [beanA, beanB] })
      return <Story />
    },
  ],
}

export const MixedCart: Story = {
  name: 'Mixed — beans + equipment',
  decorators: [
    (Story) => {
      useCartStore.setState({ items: [beanA, beanB, equipmentItem] })
      return <Story />
    },
  ],
}

export const FreeShipping: Story = {
  name: 'Free shipping (order ≥ $100)',
  decorators: [
    (Story) => {
      useCartStore.setState({ items: [expensiveItem] })
      return <Story />
    },
  ],
}

export const JustBelowFreeShipping: Story = {
  name: 'Just below free shipping threshold',
  decorators: [
    (Story) => {
      useCartStore.setState({ items: [{ ...beanA, price: 49.0, quantity: 1 }] })
      return <Story />
    },
  ],
}
