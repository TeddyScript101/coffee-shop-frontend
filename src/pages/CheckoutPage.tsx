import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PageLayout } from '@components/layout/PageLayout'
import { Button } from '@ds/components/Button/Button'
import { Input } from '@ds/components/Input/Input'
import { useCartStore, cartTotal } from '@store/cartStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { createOrder } from '@/api/orders'
import { getProfile } from '@/api/account'
import type { AxiosError } from 'axios'

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

interface PaymentForm {
  cardholderName: string
  cardNumber: string
  cardExpiry: string
  cardCvc: string
}

const STEPS = ['Shipping', 'Payment', 'Review'] as const

// ---- Helpers ----

function formatCardNumber(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

// ---- Step indicator ----

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                done ? 'bg-[var(--color-primary)] text-white'
                  : active ? 'bg-[var(--color-primary)] text-white ring-2 ring-[var(--color-primary)]/30 ring-offset-2'
                    : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]',
              ].join(' ')}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={[
                'text-xs mt-1.5 whitespace-nowrap',
                active ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-text-muted)]',
              ].join(' ')}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={[
                'h-px w-12 sm:w-20 mx-2 mt-[-12px] transition-colors',
                done ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]',
              ].join(' ')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---- Order summary sidebar ----

function OrderSummary() {
  const items = useCartStore((s) => s.items)
  const subtotal = cartTotal(items)
  const shippingCost = subtotal >= 100 ? 0 : 10
  const total = subtotal + shippingCost

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
      <h3 className="font-[var(--font-serif)] text-lg text-[var(--color-text)] mb-4">Your Order</h3>
      <div className="flex flex-col gap-3 mb-4">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-elevated)] flex items-center justify-center">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--color-text-subtle)]" aria-hidden="true">
                  <path d="M4 4H6L8 12H12L14 7H5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text)] truncate">{item.name}</p>
              <p className="text-xs text-[var(--color-text-subtle)]">Qty {item.quantity}</p>
            </div>
            <p className="text-sm text-[var(--color-text)] shrink-0">{formatCurrency(item.price * item.quantity)}</p>
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

// ---- Main component ----

export function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const subtotal = cartTotal(items)

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

  const [payment, setPayment] = useState<PaymentForm>({
    cardholderName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  })

  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingForm>>({})
  const [paymentErrors, setPaymentErrors] = useState<Partial<PaymentForm>>({})

  // Pre-fill from saved billing address
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

  // Hidden dev hotkey: Shift+Alt+F — fills the entire form with test data
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
        setPayment({
          cardholderName: 'TEDDY YEE',
          cardNumber: '1234 5678 9012 3456',
          cardExpiry: '08/34',
          cardCvc: '123',
        })
        setShippingErrors({})
        setPaymentErrors({})
        setStep(0)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

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

  function validatePayment(): boolean {
    const errs: Partial<PaymentForm> = {}
    const digits = payment.cardNumber.replace(/\s/g, '')
    if (!payment.cardholderName.trim()) errs.cardholderName = 'Required'
    if (digits.length < 13) errs.cardNumber = 'Invalid card number'
    if (!/^\d{2}\/\d{2}$/.test(payment.cardExpiry)) errs.cardExpiry = 'MM/YY format'
    if (payment.cardCvc.length < 3) errs.cardCvc = 'Invalid CVC'
    setPaymentErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ---- Navigation ----

  function handleNext() {
    setError(null)
    if (step === 0 && !validateShipping()) return
    if (step === 1 && !validatePayment()) return
    setStep((s) => s + 1)
  }

  function handleBack() {
    setError(null)
    setStep((s) => s - 1)
  }

  // ---- Submit ----

  async function handlePlaceOrder() {
    setSubmitting(true)
    setError(null)
    try {
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
        payment: {
          cardholderName: payment.cardholderName,
          cardNumber: payment.cardNumber.replace(/\s/g, ''),
          cardExpiry: payment.cardExpiry,
          cardCvc: payment.cardCvc,
        },
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-[var(--font-serif)] text-3xl text-[var(--color-text)] mb-8">Checkout</h1>

        <StepBar current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form area */}
          <div className="lg:col-span-2">
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
            {step === 1 && (
              <PaymentStep
                values={payment}
                errors={paymentErrors}
                onChange={(field, value) => {
                  setPayment((p) => ({ ...p, [field]: value }))
                  setPaymentErrors((e) => ({ ...e, [field]: undefined }))
                }}
              />
            )}
            {step === 2 && (
              <ReviewStep
                shipping={shipping}
                payment={payment}
                subtotal={subtotal}
                shippingCost={subtotal >= 100 ? 0 : 10}
              />
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-between mt-8">
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
                  disabled={submitting}
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
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
    <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
      <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)] mb-6">Shipping Address</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

// ---- Step 2: Payment ----

function PaymentStep({
  values,
  errors,
  onChange,
}: {
  values: PaymentForm
  errors: Partial<PaymentForm>
  onChange: (field: keyof PaymentForm, value: string) => void
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)]">Payment Details</h2>
        <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] px-3 py-1.5 rounded-full">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M9 5V4C9 2.34 7.66 1 6 1C4.34 1 3 2.34 3 4V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <rect x="1.5" y="5" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          Simulated payment
        </span>
      </div>

      {/* Card visual */}
      <div className="relative h-44 rounded-2xl bg-gradient-to-br from-[var(--color-brand-charcoal)] to-[#4a3728] p-6 mb-6 overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-8 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />
        <p className="font-mono text-white/90 tracking-widest text-lg mt-4">
          {values.cardNumber || '•••• •••• •••• ••••'}
        </p>
        <div className="flex items-end justify-between mt-5">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider">Card Holder</p>
            <p className="text-white font-medium text-sm mt-0.5 truncate max-w-[160px]">
              {values.cardholderName || 'Your Name'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs uppercase tracking-wider">Expires</p>
            <p className="text-white font-medium text-sm mt-0.5">{values.cardExpiry || 'MM/YY'}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Cardholder Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={values.cardholderName}
            onChange={(e) => onChange('cardholderName', e.target.value.toUpperCase())}
            placeholder="TARO YAMAMOTO"
          />
          {errors.cardholderName && <p className="text-xs text-red-500 mt-1">{errors.cardholderName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Card Number <span className="text-red-500">*</span>
          </label>
          <Input
            value={values.cardNumber}
            onChange={(e) => onChange('cardNumber', formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="font-mono tracking-widest"
          />
          {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <Input
              value={values.cardExpiry}
              onChange={(e) => onChange('cardExpiry', formatExpiry(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
            />
            {errors.cardExpiry && <p className="text-xs text-red-500 mt-1">{errors.cardExpiry}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              CVC <span className="text-red-500">*</span>
            </label>
            <Input
              value={values.cardCvc}
              onChange={(e) => onChange('cardCvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="123"
              maxLength={4}
            />
            {errors.cardCvc && <p className="text-xs text-red-500 mt-1">{errors.cardCvc}</p>}
          </div>
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-subtle)] mt-5">
        This is a demo. No real transaction will be processed.
      </p>
    </div>
  )
}

// ---- Step 3: Review ----

function ReviewStep({
  shipping,
  payment,
  subtotal,
  shippingCost,
}: {
  shipping: ShippingForm
  payment: PaymentForm
  subtotal: number
  shippingCost: number
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)] mb-4">Shipping To</h2>
        <p className="text-[var(--color-text)] font-medium">{shipping.firstName} {shipping.lastName}</p>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">{shipping.address}</p>
        <p className="text-[var(--color-text-muted)] text-sm">
          {[shipping.city, shipping.state, shipping.postalCode].filter(Boolean).join(', ')}
        </p>
        <p className="text-[var(--color-text-muted)] text-sm">{shipping.country}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)] mb-4">Payment</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-7 rounded bg-[var(--color-brand-charcoal)] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold tracking-wider">CARD</span>
          </div>
          <p className="text-[var(--color-text)]">
            {payment.cardholderName} &middot; ending in {payment.cardNumber.replace(/\s/g, '').slice(-4)}
          </p>
        </div>
      </div>

      <div className="bg-[var(--color-surface-elevated)] rounded-2xl p-5 border border-[var(--color-border-subtle)]">
        <p className="text-sm text-[var(--color-text-muted)]">
          By placing your order you agree to our (hypothetical) terms of service. This is a demo order and no real charge will occur.
        </p>
        <div className="flex justify-between mt-3 font-medium">
          <span className="text-[var(--color-text)]">Total charged</span>
          <span className="text-[var(--color-primary)] text-lg">{formatCurrency(subtotal + shippingCost)}</span>
        </div>
      </div>
    </div>
  )
}
