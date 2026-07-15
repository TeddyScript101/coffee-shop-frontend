import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@ds/components/Card/Card'
import { Button } from '@ds/components/Button/Button'
import { Badge } from '@ds/components/Badge/Badge'
import { useCartStore } from '@store/cartStore'
import { formatCurrency } from '@/utils/formatCurrency'
import type { EquipmentDto } from '@/types/api'
import { cn } from '@/utils/cn'
import { toWebp } from '@/utils/toWebp'

interface EquipmentCardProps {
  equipment: EquipmentDto
  className?: string
}

export function EquipmentCard({ equipment, className }: EquipmentCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      productId: equipment.id,
      name: equipment.name,
      price: equipment.price,
      quantity: 1,
      imageUrl: equipment.imageUrl,
      productType: 'Equipment',
    })
  }

  const isLowStock = equipment.stockQuantity > 0 && equipment.stockQuantity < 10
  const isOutOfStock = equipment.stockQuantity === 0

  return (
    <Card
      interactive
      className={cn('group flex flex-col w-full max-w-[320px] mx-auto h-full', className)}
    >
      <Link to={`/product/${equipment.id}`} className="flex flex-col flex-1">
        <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-elevated)]">
          {equipment.imageUrl && (
            <picture>
              <source srcSet={toWebp(equipment.imageUrl)} type="image/webp" />
              <img
                src={equipment.imageUrl}
                alt={equipment.name}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  'w-full h-full object-cover transition-all duration-[350ms]',
                  'group-hover:scale-[1.03]',
                  imageLoaded ? 'opacity-100' : 'opacity-0',
                )}
              />
            </picture>
          )}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-shimmer" />
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="equipment-type">{equipment.equipmentType}</Badge>
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
              {equipment.brand}
            </p>
            <h3 className="font-[var(--font-serif)] text-[var(--text-product-lg)] text-[var(--color-text)] mb-2 leading-snug">
              {equipment.name}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--color-border-subtle)]">
            <span className="text-[var(--color-primary)] font-semibold text-base">
              {formatCurrency(equipment.price)}
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
