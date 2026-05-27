import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageLayout } from '@components/layout/PageLayout'
import { Button } from '@ds/components/Button/Button'
import { getOrder } from '@/api/orders'
import { ProductThumbnail } from '@components/products/ProductThumbnail/ProductThumbnail'
import { formatCurrency } from '@/utils/formatCurrency'
import type { OrderDto } from '@/types/api'

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    getOrder(id)
      .then(setOrder)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto px-4 py-24 flex justify-center">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    )
  }

  if (error || !order) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <p className="text-xl font-[var(--font-serif)] text-[var(--color-text)] mb-4">Order not found</p>
          <Link to="/coffee"><Button variant="primary">Shop Coffee</Button></Link>
        </div>
      </PageLayout>
    )
  }

  const addr = order.shippingAddress
  const shippingLine = [addr.city, addr.state, addr.postalCode].filter(Boolean).join(', ')

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Success hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-green-600" aria-hidden="true">
              <path d="M5 14L10.5 19.5L23 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-[var(--font-serif)] text-3xl text-[var(--color-text)] mb-2">
            Order Confirmed!
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Thank you for your order. We'll get it ready for you soon.
          </p>
          <p className="text-xs text-[var(--color-text-subtle)] mt-2 font-mono">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)] mb-5">
          <h2 className="font-[var(--font-serif)] text-lg text-[var(--color-text)] mb-5">Items Ordered</h2>
          <div className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <ProductThumbnail
                    productType={item.productType}
                    name={item.productName}
                    imageUrl={item.productImageUrl}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text)] truncate">{item.productName}</p>
                  <p className="text-xs text-[var(--color-text-subtle)]">
                    {item.productType === 'CoffeeBean' ? 'Coffee Bean' : 'Equipment'} · SKU {item.productSku}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-[var(--color-text-muted)]">×{item.quantity}</p>
                  <p className="font-medium text-[var(--color-text)]">{formatCurrency(item.lineTotal)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--color-border-subtle)] mt-4 pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-muted)]">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-muted)]">Shipping</span>
              <span className={order.shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                {order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-[var(--color-border-subtle)]">
              <span className="text-[var(--color-text)]">Total Charged</span>
              <span className="text-[var(--color-primary)] text-lg">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping + payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Shipping To
            </h3>
            <p className="font-medium text-[var(--color-text)]">{addr.firstName} {addr.lastName}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{addr.address}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{shippingLine}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{addr.country}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Payment
            </h3>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-6 rounded bg-[var(--color-brand-charcoal)] flex items-center justify-center">
                <span className="text-white text-[9px] font-bold tracking-wide">CARD</span>
              </div>
              <span className="text-[var(--color-text)] text-sm">···· {order.cardLastFour}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full mt-2">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Order status */}
        <div className="flex items-center gap-3 bg-[var(--color-surface-elevated)] rounded-2xl p-4 mb-8">
          <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
          <p className="text-sm text-[var(--color-text-muted)]">
            Order status: <span className="font-medium text-[var(--color-text)]">{order.status}</span>
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/coffee">
            <Button variant="primary" className="w-full sm:w-auto justify-center">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/membership">
            <Button variant="secondary" className="w-full sm:w-auto justify-center">
              View Membership
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
