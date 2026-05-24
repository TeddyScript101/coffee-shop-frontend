import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout } from '@components/layout/PageLayout'
import { RoastBadge } from '@components/products/RoastBadge/RoastBadge'
import { TastingNotes } from '@components/products/TastingNotes/TastingNotes'
import { TasteNoteImage } from '@components/products/CoffeeBeanCard/TasteNoteImage'
import { ProductDetailSkeleton } from '@components/feedback/LoadingSkeleton/LoadingSkeleton'
import { ErrorState } from '@components/feedback/ErrorState/ErrorState'
import { Button } from '@ds/components/Button/Button'
import { Badge } from '@ds/components/Badge/Badge'
import { Separator } from '@ds/components/Separator/Separator'
import { useProduct } from '@hooks/useProduct'
import { useCartStore } from '@store/cartStore'
import { formatCurrency } from '@/utils/formatCurrency'
import type { CoffeeBeanDto, EquipmentDto } from '@/types/api'

function isCoffeeBean(p: CoffeeBeanDto | EquipmentDto): p is CoffeeBeanDto {
  return p.productType === 'CoffeeBean'
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading, isError, refetch } = useProduct(id ?? '')
  const [quantity, setQuantity] = useState(1)
  const [imageLoaded, setImageLoaded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
      productType: product.productType,
    })
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-8 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        {isLoading && <ProductDetailSkeleton />}
        {isError && <ErrorState onRetry={() => refetch()} />}

        {product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[var(--color-surface-elevated)] shadow-[var(--shadow-soft-md)]">
              {isCoffeeBean(product) ? (
                <TasteNoteImage bean={product} />
              ) : (
                <>
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-opacity duration-[350ms] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setImageLoaded(true)}
                    />
                  )}
                  {!imageLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
                </>
              )}
            </div>

            <div className="flex flex-col gap-5">
              {isCoffeeBean(product) ? (
                <>
                  <div className="flex items-center gap-2">
                    <RoastBadge roastLevel={product.roastLevel} size="md" />
                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                      <Badge variant="warning">Low Stock</Badge>
                    )}
                    {product.stockQuantity === 0 && (
                      <Badge>Sold Out</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-subtle)] uppercase tracking-wide mb-1">
                      {product.originCountry} · {product.originRegion}
                    </p>
                    <h1 className="font-[var(--font-serif)] text-[var(--text-display)] text-[var(--color-text)]">
                      {product.name}
                    </h1>
                  </div>
                  <p className="text-2xl font-semibold text-[var(--color-primary)]">
                    {formatCurrency(product.price)}
                  </p>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wider mb-3">
                      Tasting Notes
                    </p>
                    <TastingNotes notes={product.tastingNotes} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="equipment-type" size="md">{(product as EquipmentDto).equipmentType}</Badge>
                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                      <Badge variant="warning">Low Stock</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-subtle)] uppercase tracking-wide mb-1">
                      {(product as EquipmentDto).brand}
                    </p>
                    <h1 className="font-[var(--font-serif)] text-[var(--text-display)] text-[var(--color-text)]">
                      {product.name}
                    </h1>
                  </div>
                  <p className="text-2xl font-semibold text-[var(--color-primary)]">
                    {formatCurrency(product.price)}
                  </p>
                  <Separator />
                </>
              )}

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center border border-[var(--color-border)] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-[var(--color-text)]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  size="lg"
                  className="flex-1"
                >
                  {product.stockQuantity === 0 ? 'Sold Out' : 'Add to Cart'}
                </Button>
              </div>

              <p className="text-xs text-[var(--color-text-subtle)]">
                {product.stockQuantity} in stock · SKU: {product.sku}
              </p>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
