import type { Meta, StoryObj } from '@storybook/react'
import { ProductCardSkeleton, ProductDetailSkeleton, MembershipCardSkeleton } from './LoadingSkeleton'

const meta: Meta = {
  title: 'Components/Feedback/LoadingSkeleton',
  parameters: { layout: 'centered' },
}
export default meta

export const ProductCard: StoryObj = {
  render: () => (
    <div className="grid grid-cols-3 gap-6 w-[800px]">
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
    </div>
  ),
}

export const ProductDetail: StoryObj = {
  render: () => (
    <div className="w-[800px] p-8 bg-[var(--color-surface)] rounded-2xl">
      <ProductDetailSkeleton />
    </div>
  ),
}

export const MemberCard: StoryObj = {
  render: () => (
    <div className="w-96">
      <MembershipCardSkeleton />
    </div>
  ),
}
