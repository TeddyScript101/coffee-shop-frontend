import { useCartStore, cartTotal } from '@store/cartStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { ProductThumbnail } from '@components/products/ProductThumbnail/ProductThumbnail'

export function OrderSummary() {
  const items = useCartStore((s) => s.items)
  const subtotal = cartTotal(items)
  const shippingCost = subtotal >= 100 ? 0 : 10
  const total = subtotal + shippingCost

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
      <h3 className="font-[var(--font-serif)] text-lg text-[var(--color-text)] mb-4">Your Order</h3>

      <div className="flex flex-col gap-3 mb-4">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
              <ProductThumbnail
                productType={item.productType}
                name={item.name}
                originCountry={item.originCountry}
                imageUrl={item.imageUrl}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text)] truncate">{item.name}</p>
              <p className="text-xs text-[var(--color-text-subtle)]">Qty {item.quantity}</p>
            </div>
            <p className="text-sm text-[var(--color-text)] shrink-0">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-border-subtle)] pt-3 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-text-muted)]">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-text-muted)]">Shipping</span>
          <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
            {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between font-medium mt-1 pt-2 border-t border-[var(--color-border-subtle)]">
          <span>Total</span>
          <span className="text-[var(--color-primary)]">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
