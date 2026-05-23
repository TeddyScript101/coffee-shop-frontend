import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@ds/components/Card/Card'
import { Button } from '@ds/components/Button/Button'
import { Badge } from '@ds/components/Badge/Badge'
import { RoastBadge } from '../RoastBadge/RoastBadge'
import { TastingNotes } from '../TastingNotes/TastingNotes'
import { useCartStore } from '@store/cartStore'
import { formatCurrency } from '@/utils/formatCurrency'
import type { CoffeeBeanDto } from '@/types/api'
import { cn } from '@/utils/cn'

interface CoffeeBeanCardProps {
  bean: CoffeeBeanDto
  className?: string
}

export function CoffeeBeanCard({ bean, className }: CoffeeBeanCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      productId: bean.id,
      name: bean.name,
      price: bean.price,
      quantity: 1,
      imageUrl: bean.imageUrl,
      productType: 'CoffeeBean',
    })
  }

  const isLowStock = bean.stockQuantity > 0 && bean.stockQuantity < 10
  const isOutOfStock = bean.stockQuantity === 0

  return (
    <Card
      interactive
      className={cn('group flex flex-col', className)}
    >
      <Link to={`/product/${bean.id}`} className="flex flex-col flex-1">
        <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-elevated)]">
          {bean.imageUrl && (
            <img
              src={bean.imageUrl}
              alt={bean.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={cn(
                'w-full h-full object-cover transition-all duration-[350ms]',
                'group-hover:scale-[1.03]',
                imageLoaded ? 'opacity-100' : 'opacity-0',
              )}
            />
          )}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-shimmer" />
          )}
          <div className="absolute top-3 left-3">
            <RoastBadge roastLevel={bean.roastLevel} />
          </div>
          {isLowStock && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning">Low Stock</Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-5">
          <div className="flex-1">
            <p className="text-xs text-[var(--color-text-subtle)] mb-1 uppercase tracking-wide">
              {bean.originCountry} · {bean.originRegion}
            </p>
            <h3 className="font-[var(--font-serif)] text-[var(--text-product-lg)] text-[var(--color-text)] mb-2 leading-snug">
              {bean.name}
            </h3>
            <TastingNotes notes={bean.tastingNotes} maxVisible={3} className="mb-3" />
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--color-border-subtle)]">
            <span className="text-[var(--color-primary)] font-semibold text-base">
              {formatCurrency(bean.price)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]"
            >
              {isOutOfStock ? 'Sold Out' : '+ Add'}
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  )
}
