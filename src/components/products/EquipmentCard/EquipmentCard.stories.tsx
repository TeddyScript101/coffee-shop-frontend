import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { EquipmentCard } from './EquipmentCard'
import type { EquipmentDto } from '@/types/api'

const sampleEquipment: EquipmentDto = {
  id: '10',
  name: 'Comandante C40 MK4',
  sku: 'EQ-001',
  price: 220.0,
  stockQuantity: 15,
  imageUrl: '/images/equipment/grinder.png',
  productType: 'Equipment',
  createdAt: '2025-01-01',
  brand: 'BeanWorks',
  equipmentType: 'Grinder',
}

const meta: Meta<typeof EquipmentCard> = {
  title: 'Components/Products/EquipmentCard',
  component: EquipmentCard,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof EquipmentCard>

export const Default: Story = {
  args: { equipment: sampleEquipment },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
}

export const Machine: Story = {
  args: {
    equipment: {
      ...sampleEquipment,
      id: '11',
      name: 'Bambino Plus Espresso',
      brand: 'BeanWorks',
      equipmentType: 'Machine',
      price: 499.0,
      imageUrl: '/images/equipment/machine.png',
    },
  },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
}

export const LowStock: Story = {
  args: { equipment: { ...sampleEquipment, stockQuantity: 2 } },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
}
