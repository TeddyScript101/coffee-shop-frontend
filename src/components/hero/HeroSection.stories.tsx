import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { HeroSection } from './HeroSection'

const meta: Meta<typeof HeroSection> = {
  title: 'Components/Hero/HeroSection',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <MemoryRouter><div className="bg-[var(--color-surface)]"><Story /></div></MemoryRouter>],
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof HeroSection>

export const CoffeeHero: Story = {
  args: {
    title: 'Coffee Roasted at Peak.',
    subtitle: 'Single-origin beans sourced from the world\'s finest growing regions. Every cup tells a story of place and craft.',
    ctaPrimary: { label: 'Shop Coffee', to: '/coffee' },
    ctaSecondary: { label: 'Our Story', to: '/about' },
    imageUrl: 'https://picsum.photos/seed/hero-coffee/600/600',
    imageAlt: 'Premium coffee beans',
  },
}

export const EquipmentHero: Story = {
  args: {
    title: 'Brew with Precision.',
    subtitle: 'Professional-grade equipment for the discerning home barista. Curated tools that elevate every ritual.',
    ctaPrimary: { label: 'Shop Equipment', to: '/equipment' },
    imageUrl: 'https://picsum.photos/seed/hero-equipment/600/600',
    imageAlt: 'Coffee brewing equipment',
  },
}
