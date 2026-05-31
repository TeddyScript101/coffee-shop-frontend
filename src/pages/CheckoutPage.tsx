import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { PageLayout } from '@components/layout/PageLayout'
import { Button } from '@ds/components/Button/Button'
import { Input } from '@ds/components/Input/Input'
import { useCartStore, cartTotal } from '@store/cartStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { createOrder } from '@/api/orders'
import { createPaymentIntent } from '@/api/payments'
import { getProfile } from '@/api/account'
import { StepBar } from '@components/checkout/StepBar/StepBar'
import { OrderSummary } from '@components/checkout/OrderSummary/OrderSummary'
import type { AxiosError } from 'axios'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// ---- Types ----

interface ShippingForm {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

// ---- Outer wrapper — mounts Elements provider ----

export function CheckoutPage() {
  const items = useCartStore((s) => s.items)

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <p className="text-xl font-[var(--font-serif)] text-[var(--color-text)] mb-4">Your cart is empty</p>
          <Link to="/coffee"><Button variant="primary">Shop Coffee</Button></Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutPageInner />
    </Elements>
  )
}

// ---- Inner component — has access to Stripe hooks ----

function CheckoutPageInner() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const subtotal = cartTotal(items)
  const shippingCost = subtotal >= 100 ? 0 : 10
  const total = subtotal + shippingCost

  const stripe = useStripe()
  const elements = useElements()

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [shipping, setShipping] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })

  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingForm>>({})

  useEffect(() => {
    getProfile().then((p) => {
      setShipping((prev) => ({
        firstName: p.billingFirstName || prev.firstName,
        lastName: p.billingLastName || prev.lastName,
        address: p.billingAddress || prev.address,
        city: p.billingCity || prev.city,
        state: p.billingState || prev.state,
        postalCode: p.billingPostalCode || prev.postalCode,
        country: p.billingCountry || prev.country,
      }))
    }).catch(() => {})
  }, [])

  // Hidden dev hotkey: Shift+Alt+F — fills shipping form with test data
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.shiftKey && e.altKey && e.code === 'KeyF') {
        setShipping({
          firstName: 'Teddy',
          lastName: 'Yee',
          address: 'Box Hill',
          city: 'Box Hill',
          state: 'VIC',
          postalCode: '3129',
          country: 'Australia',
        })
        setShippingErrors({})
        setStep(0)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // ---- Validation ----

  function validateShipping(): boolean {
    const errs: Partial<ShippingForm> = {}
    if (!shipping.firstName.trim()) errs.firstName = 'Required'
    if (!shipping.lastName.trim()) errs.lastName = 'Required'
    if (!shipping.address.trim()) errs.address = 'Required'
    if (!shipping.city.trim()) errs.city = 'Required'
    if (!shipping.postalCode.trim()) errs.postalCode = 'Required'
    if (!shipping.country.trim()) errs.country = 'Required'
    setShippingErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ---- Navigation ----

  function handleNext() {
    setError(null)
    if (step === 0 && !validateShipping()) return
    setStep((s) => s + 1)
  }

  function handleBack() {
    setError(null)
    setStep((s) => s - 1)
  }

  // ---- Submit ----

  async function handlePlaceOrder() {
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)

    try {
      // 1. Create PaymentIntent on the server
      const { clientSecret } = await createPaymentIntent(Math.round(total * 100))

      // 2. Confirm card payment via Stripe
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element unavailable.')

      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: `${shipping.firstName} ${shipping.lastName}` },
        },
      })

      if (stripeError) {
        setError(stripeError.message ?? 'Payment failed. Please try again.')
        return
      }

      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        setError('Payment was not completed. Please try again.')
        return
      }

      // 3. Create order — backend verifies the PaymentIntent with Stripe
      const order = await createOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: {
          firstName: shipping.firstName,
          lastName: shipping.lastName,
          address: shipping.address,
          city: shipping.city,
          state: shipping.state,
          postalCode: shipping.postalCode,
          country: shipping.country,
        },
        payment: { paymentIntentId: paymentIntent.id },
      })

      clearCart()
      navigate(`/order-confirmation/${order.id}`)
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>
      setError(axiosErr.response?.data?.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ---- Render ----

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 overflow-x-hidden">
        <h1 className="font-[var(--font-serif)] text-2xl sm:text-3xl text-[var(--color-text)] mb-6 sm:mb-8">Checkout</h1>

        <StepBar current={step} className="mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Form area */}
          <div className="lg:col-span-2 min-w-0">
            {step === 0 && (
              <ShippingStep
                values={shipping}
                errors={shippingErrors}
                onChange={(field, value) => {
                  setShipping((s) => ({ ...s, [field]: value }))
                  setShippingErrors((e) => ({ ...e, [field]: undefined }))
                }}
              />
            )}

            {/* CardElement stays mounted through all steps so it remains accessible on Place Order */}
            <div style={{ display: step === 1 ? 'block' : 'none' }}>
              <PaymentStep />
            </div>

            {step === 2 && (
              <ReviewStep
                shipping={shipping}
                subtotal={subtotal}
                shippingCost={shippingCost}
              />
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-between mt-6 sm:mt-8">
              {step > 0 ? (
                <Button variant="secondary" onClick={handleBack} disabled={submitting}>
                  Back
                </Button>
              ) : (
                <Link to="/cart">
                  <Button variant="secondary">Back to Cart</Button>
                </Link>
              )}

              {step < 2 ? (
                <Button variant="primary" onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handlePlaceOrder}
                  disabled={submitting || !stripe}
                >
                  {submitting ? 'Processing...' : 'Place Order'}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

// ---- Step 1: Shipping ----

function ShippingStep({
  values,
  errors,
  onChange,
}: {
  values: ShippingForm
  errors: Partial<ShippingForm>
  onChange: (field: keyof ShippingForm, value: string) => void
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
      <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)] mb-5 sm:mb-6">Shipping Address</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={values.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="Taro"
          />
          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={values.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Yamamoto"
          />
          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Street Address <span className="text-red-500">*</span>
          </label>
          <Input
            value={values.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="1-2-3 Shibuya, Shibuya-ku"
          />
          {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <Input
            value={values.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Tokyo"
          />
          {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            State / Prefecture
          </label>
          <Input
            value={values.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="Tokyo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <Input
            value={values.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            placeholder="150-0001"
          />
          {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Country <span className="text-red-500">*</span>
          </label>
          <Input
            value={values.country}
            onChange={(e) => onChange('country', e.target.value)}
            placeholder="Japan"
          />
          {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
        </div>
      </div>
    </div>
  )
}

// ---- Step 2: Payment (Stripe Elements) ----

function PaymentStep() {
  const [copied, setCopied] = useState(false)

  function handleUseTestCard() {
    navigator.clipboard.writeText('4242424242424242').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)]">Payment Details</h2>
        <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] px-3 py-1.5 rounded-full">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M9 5V4C9 2.34 7.66 1 6 1C4.34 1 3 2.34 3 4V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <rect x="1.5" y="5" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          Stripe · Test Mode
        </span>
      </div>

      <div className="p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-elevated)] hover:border-[var(--color-text-subtle)] transition-colors duration-[250ms]">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '14px',
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#2E2E2E',
                '::placeholder': { color: '#B0A89C' },
              },
              invalid: { color: '#ef4444' },
            },
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-[var(--color-text-subtle)]">
          Test card: <span className="font-mono">4242 4242 4242 4242</span> · any future date · any CVC
        </p>
        <button
          type="button"
          onClick={handleUseTestCard}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-[250ms] shrink-0 ml-4"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6L4.5 8.5L10 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <rect x="4" y="1" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1 4H3.5V11H8.5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Use test card
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ---- Step 3: Review ----

function ReviewStep({
  shipping,
  subtotal,
  shippingCost,
}: {
  shipping: ShippingForm
  subtotal: number
  shippingCost: number
}) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)] mb-4">Shipping To</h2>
        <p className="text-[var(--color-text)] font-medium">{shipping.firstName} {shipping.lastName}</p>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">{shipping.address}</p>
        <p className="text-[var(--color-text-muted)] text-sm">
          {[shipping.city, shipping.state, shipping.postalCode].filter(Boolean).join(', ')}
        </p>
        <p className="text-[var(--color-text-muted)] text-sm">{shipping.country}</p>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)] mb-4">Payment</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-7 rounded bg-[var(--color-brand-charcoal)] flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold tracking-wider">CARD</span>
          </div>
          <p className="text-[var(--color-text)] text-sm">Stripe card payment</p>
        </div>
      </div>

      <div className="bg-[var(--color-surface-elevated)] rounded-2xl p-4 sm:p-5 border border-[var(--color-border-subtle)]">
        <p className="text-sm text-[var(--color-text-muted)]">
          By placing your order you agree to our (hypothetical) terms of service. Payment is processed securely via Stripe.
        </p>
        <div className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-[var(--color-text-muted)]">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[var(--color-text-muted)]">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
          </div>
        </div>
        <div className="flex justify-between mt-3 pt-3 border-t border-[var(--color-border-subtle)] font-medium">
          <span className="text-[var(--color-text)]">Total charged</span>
          <span className="text-[var(--color-primary)] text-lg">{formatCurrency(subtotal + shippingCost)}</span>
        </div>
      </div>
    </div>
  )
}
