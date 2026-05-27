import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PageLayout } from '@components/layout/PageLayout'
import { Button } from '@ds/components/Button/Button'
import { useCartStore, cartTotal, cartItemCount } from '@store/cartStore'
import { useAuthStore } from '@store/authStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { CartItemRow } from '@components/cart/CartItemRow/CartItemRow'

export function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const subtotal = cartTotal(items)
  const shippingCost = subtotal >= 100 ? 0 : 10
  const total = subtotal + shippingCost
  const count = cartItemCount(items)

  function handleCheckout() {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-[var(--font-serif)] text-3xl text-[var(--color-text)] mb-8">
          Shopping Cart
          {count > 0 && (
            <span className="ml-3 text-lg font-normal text-[var(--color-text-muted)]">
              ({count} {count === 1 ? 'item' : 'items'})
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-[var(--color-text-subtle)] opacity-40" aria-hidden="true">
              <path d="M10 10H15L22 44H50L58 22H18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="27" cy="52" r="3.5" fill="currentColor"/>
              <circle cx="43" cy="52" r="3.5" fill="currentColor"/>
            </svg>
            <div>
              <p className="text-xl font-[var(--font-serif)] text-[var(--color-text)] mb-2">Your cart is empty</p>
              <p className="text-[var(--color-text-muted)] text-sm">Add some coffee beans or equipment to get started.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/coffee">
                <Button variant="primary" size="sm">Shop Coffee</Button>
              </Link>
              <Link to="/equipment">
                <Button variant="secondary" size="sm">Shop Equipment</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    exit={{ opacity: 0, x: -24, scale: 0.97, transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] } }}
                  >
                    <CartItemRow
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)] sticky top-24">
                <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)] mb-5">Order Summary</h2>

                <div className="flex flex-col gap-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Subtotal</span>
                    <span className="text-[var(--color-text)]">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-medium' : 'text-[var(--color-text)]'}>
                      {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-[var(--color-text-subtle)]">
                      Free shipping on orders over {formatCurrency(100)}
                    </p>
                  )}
                </div>

                <div className="border-t border-[var(--color-border-subtle)] pt-4 mb-6">
                  <div className="flex justify-between font-medium">
                    <span className="text-[var(--color-text)]">Total</span>
                    <span className="text-[var(--color-text)] text-lg">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={handleCheckout}
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                </Button>

                <Link to="/coffee" className="block text-center text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mt-4 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
