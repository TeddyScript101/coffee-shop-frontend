import { ProductThumbnail } from '@components/products/ProductThumbnail/ProductThumbnail'
import { formatCurrency } from '@/utils/formatCurrency'
import type { CartItem } from '@store/cartStore'

export interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  return (
    <div className="flex gap-4 bg-white rounded-2xl p-5 shadow-[var(--shadow-soft-sm)] border border-[var(--color-border-subtle)]">
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
        <ProductThumbnail
          productType={item.productType}
          name={item.name}
          originCountry={item.originCountry}
          imageUrl={item.imageUrl}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[var(--color-text)] truncate">{item.name}</p>
        <p className="text-xs text-[var(--color-text-subtle)] mt-0.5 mb-3">
          {item.productType === 'CoffeeBean' ? 'Coffee Bean' : 'Equipment'}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-[var(--color-border)] overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] transition-colors"
              aria-label="Decrease quantity"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm font-medium text-[var(--color-text)]">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] transition-colors"
              aria-label="Increase quantity"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => onRemove(item.productId)}
            className="text-xs text-[var(--color-text-subtle)] hover:text-red-500 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="shrink-0 text-right">
        <p className="font-medium text-[var(--color-text)]">
          {formatCurrency(item.price * item.quantity)}
        </p>
        <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">
          {formatCurrency(item.price)} each
        </p>
      </div>
    </div>
  )
}
