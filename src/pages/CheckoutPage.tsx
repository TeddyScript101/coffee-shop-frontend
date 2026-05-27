import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PageLayout } from '@components/layout/PageLayout'
import { Button } from '@ds/components/Button/Button'
import { Input } from '@ds/components/Input/Input'
import { useCartStore, cartTotal } from '@store/cartStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { createOrder } from '@/api/orders'
import { getProfile } from '@/api/account'
import { StepBar } from '@components/checkout/StepBar/StepBar'
import { OrderSummary } from '@components/checkout/OrderSummary/OrderSummary'
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

// ---- Helpers ----

function formatCardNumber(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
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
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
      <div className="flex items-start sm:items-center justify-between gap-2 mb-5 sm:mb-6">
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)]">Payment Details</h2>
        <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] px-3 py-1.5 rounded-full shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M9 5V4C9 2.34 7.66 1 6 1C4.34 1 3 2.34 3 4V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <rect x="1.5" y="5" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          Simulated
        </span>
      </div>

      {/* Card visual */}
      <div className="relative h-36 sm:h-44 rounded-2xl bg-gradient-to-br from-[var(--color-brand-charcoal)] to-[#4a3728] p-4 sm:p-6 mb-5 sm:mb-6 overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-8 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />
        <p className="font-mono text-white/90 tracking-wider sm:tracking-widest text-sm sm:text-lg mt-2 sm:mt-4 truncate">
          {values.cardNumber || '•••• •••• •••• ••••'}
        </p>
        <div className="flex items-end justify-between mt-3 sm:mt-5">
          <div className="min-w-0 mr-4">
            <p className="text-white/50 text-xs uppercase tracking-wider">Card Holder</p>
            <p className="text-white font-medium text-sm mt-0.5 truncate">
              {values.cardholderName || 'Your Name'}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-white/50 text-xs uppercase tracking-wider">Expires</p>
            <p className="text-white font-medium text-sm mt-0.5">{values.cardExpiry || 'MM/YY'}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
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
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-7 rounded bg-[var(--color-brand-charcoal)] flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold tracking-wider">CARD</span>
          </div>
          <p className="text-[var(--color-text)] truncate">
            {payment.cardholderName} &middot; ending in {payment.cardNumber.replace(/\s/g, '').slice(-4)}
          </p>
        </div>
      </div>

      <div className="bg-[var(--color-surface-elevated)] rounded-2xl p-4 sm:p-5 border border-[var(--color-border-subtle)]">
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
