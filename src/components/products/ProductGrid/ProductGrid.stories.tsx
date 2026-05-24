import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { ProductGrid } from './ProductGrid'
import { CoffeeBeanCard } from '../CoffeeBeanCard/CoffeeBeanCard'
import { EquipmentCard } from '../EquipmentCard/EquipmentCard'
import type { CoffeeBeanDto, EquipmentDto } from '@/types/api'

const beans: CoffeeBeanDto[] = [
  {
    id: '1', name: 'Ethiopia Yirgacheffe', sku: 'CB-001', price: 28.0,
    stockQuantity: 50, imageUrl: 'https://picsum.photos/seed/bean1/400/400',
    productType: 'CoffeeBean', createdAt: '2025-01-01',
    roastLevel: 'Light', tastingNotes: 'Floral, Citrus, Bergamot',
    originCountry: 'Ethiopia', originRegion: 'Yirgacheffe',
  },
  {
    id: '2', name: 'Colombia Huila', sku: 'CB-002', price: 30.0,
    stockQuantity: 35, imageUrl: 'https://picsum.photos/seed/bean2/400/400',
    productType: 'CoffeeBean', createdAt: '2025-01-01',
    roastLevel: 'Medium', tastingNotes: 'Caramel, Red Apple, Hazelnut',
    originCountry: 'Colombia', originRegion: 'Huila',
  },
  {
    id: '3', name: 'Sumatra Mandheling', sku: 'CB-003', price: 32.0,
    stockQuantity: 4, imageUrl: 'https://picsum.photos/seed/bean3/400/400',
    productType: 'CoffeeBean', createdAt: '2025-01-01',
    roastLevel: 'Dark', tastingNotes: 'Dark Chocolate, Earthy, Cedar',
    originCountry: 'Indonesia', originRegion: 'Sumatra',
  },
  {
    id: '4', name: 'Guatemala Antigua', sku: 'CB-004', price: 27.0,
    stockQuantity: 0, imageUrl: 'https://picsum.photos/seed/bean4/400/400',
    productType: 'CoffeeBean', createdAt: '2025-01-01',
    roastLevel: 'Medium', tastingNotes: 'Brown Sugar, Pecan, Milk Chocolate',
    originCountry: 'Guatemala', originRegion: 'Antigua',
  },
]

const equipments: EquipmentDto[] = [
  {
    id: '10', name: 'Comandante C40 MK4', sku: 'EQ-001', price: 220.0,
    stockQuantity: 15, imageUrl: '/images/equipment/grinder.png',
    productType: 'Equipment', createdAt: '2025-01-01',
    brand: 'Comandante', equipmentType: 'Grinder',
  },
  {
    id: '11', name: 'Hario V60 Dripper', sku: 'EQ-002', price: 18.0,
    stockQuantity: 80, imageUrl: '/images/equipment/v60.png',
    productType: 'Equipment', createdAt: '2025-01-01',
    brand: 'Hario', equipmentType: 'Brewer',
  },
]

const meta: Meta<typeof ProductGrid> = {
  title: 'Components/Products/ProductGrid',
  component: ProductGrid,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ProductGrid>

export const CoffeeBeans: Story = {
  render: () => (
    <ProductGrid>
      {beans.map((bean) => <CoffeeBeanCard key={bean.id} bean={bean} />)}
    </ProductGrid>
  ),
}

export const Equipment: Story = {
  render: () => (
    <ProductGrid>
      {equipments.map((eq) => <EquipmentCard key={eq.id} equipment={eq} />)}
    </ProductGrid>
  ),
}

export const Mixed: Story = {
  render: () => (
    <ProductGrid>
      {beans.slice(0, 2).map((bean) => <CoffeeBeanCard key={bean.id} bean={bean} />)}
      {equipments.map((eq) => <EquipmentCard key={eq.id} equipment={eq} />)}
    </ProductGrid>
  ),
}

export const SingleItem: Story = {
  render: () => (
    <ProductGrid>
      <CoffeeBeanCard bean={beans[0]} />
    </ProductGrid>
  ),
}
