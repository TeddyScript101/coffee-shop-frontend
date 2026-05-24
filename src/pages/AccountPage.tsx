import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PageLayout } from '@components/layout/PageLayout'
import { Input } from '@ds/components/Input/Input'
import { Button } from '@ds/components/Button/Button'
import { useAuthStore } from '@store/authStore'
import { getProfile, updateProfile, changePassword } from '@/api/account'
import { getMyOrders } from '@/api/orders'
import { formatCurrency } from '@/utils/formatCurrency'
import { cn } from '@/utils/cn'
import type { UserProfileDto, OrderDto } from '@/types/api'
import type { AxiosError } from 'axios'

type TabId = 'profile' | 'password' | 'orders'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: 'profile',
    label: 'Profile & Address',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M2.5 13.5C2.5 11.015 5.015 9 8 9C10.985 9 13.5 11.015 13.5 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'password',
    label: 'Change Password',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M11 7V5.5C11 3.567 9.433 2 7.5 2C5.567 2 4 3.567 4 5.5V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <rect x="2.5" y="7" width="11" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="7.5" cy="10.5" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'Order History',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="1.5" width="12" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 5.5H11M5 8H11M5 10.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
]

// ---- Status pill ----

const STATUS_COLOR: Record<string, string> = {
  Processing: 'bg-blue-50 text-blue-700',
  Pending: 'bg-amber-50 text-amber-700',
  Shipped: 'bg-violet-50 text-violet-700',
  Delivered: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700',
}

// ---- Feedback toast ----

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium border',
        type === 'success'
          ? 'bg-green-50 text-green-800 border-green-200'
          : 'bg-red-50 text-red-800 border-red-200',
      )}
    >
      {type === 'success' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M8 5V8.5M8 11H8.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      )}
      {message}
    </div>
  )
}

// ---- Profile + Billing tab ----

function ProfileTab({ profile, onSaved }: { profile: UserProfileDto; onSaved: (p: UserProfileDto) => void }) {
  const [form, setForm] = useState({
    phone: profile.phone ?? '',
    billingFirstName: profile.billingFirstName ?? '',
    billingLastName: profile.billingLastName ?? '',
    billingAddress: profile.billingAddress ?? '',
    billingCity: profile.billingCity ?? '',
    billingState: profile.billingState ?? '',
    billingPostalCode: profile.billingPostalCode ?? '',
    billingCountry: profile.billingCountry ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setToast(null)
    try {
      const updated = await updateProfile(form)
      onSaved(updated)
      setToast({ msg: 'Address saved successfully.', type: 'success' })
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>
      setToast({ msg: e.response?.data?.message ?? 'Save failed. Please try again.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Read-only account info */}
      <div className="bg-[var(--color-surface-elevated)] rounded-2xl p-5 border border-[var(--color-border-subtle)]">
        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Account Info</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-[var(--color-text-subtle)] mb-0.5">Name</p>
            <p className="text-sm font-medium text-[var(--color-text)]">
              {[profile.firstName, profile.lastName].filter(Boolean).join(' ') || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-subtle)] mb-0.5">Email</p>
            <p className="text-sm font-medium text-[var(--color-text)]">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Editable billing address */}
      <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)]">
        <h3 className="font-[var(--font-serif)] text-lg text-[var(--color-text)] mb-1">Billing Address</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Pre-fills the shipping form at checkout.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={form.billingFirstName}
            onChange={(e) => set('billingFirstName', e.target.value)}
            placeholder="Taro"
          />
          <Input
            label="Last Name"
            value={form.billingLastName}
            onChange={(e) => set('billingLastName', e.target.value)}
            placeholder="Yamamoto"
          />
          <div className="sm:col-span-2">
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+81 3-0000-0000"
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Street Address"
              value={form.billingAddress}
              onChange={(e) => set('billingAddress', e.target.value)}
              placeholder="1-2-3 Shibuya, Shibuya-ku"
            />
          </div>
          <Input
            label="City"
            value={form.billingCity}
            onChange={(e) => set('billingCity', e.target.value)}
            placeholder="Tokyo"
          />
          <Input
            label="State / Prefecture"
            value={form.billingState}
            onChange={(e) => set('billingState', e.target.value)}
            placeholder="Tokyo"
          />
          <Input
            label="Postal Code"
            value={form.billingPostalCode}
            onChange={(e) => set('billingPostalCode', e.target.value)}
            placeholder="150-0001"
          />
          <Input
            label="Country"
            value={form.billingCountry}
            onChange={(e) => set('billingCountry', e.target.value)}
            placeholder="Japan"
          />
        </div>

        {toast && (
          <div className="mt-5">
            <Toast message={toast.msg} type={toast.type} />
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Address'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---- Change Password tab ----

function PasswordTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function handleSubmit() {
    const errs: Partial<typeof form> = {}
    if (!form.currentPassword) errs.currentPassword = 'Required'
    if (form.newPassword.length < 6) errs.newPassword = 'At least 6 characters'
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSaving(true)
    setToast(null)
    try {
      const res = await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      setToast({ msg: res.message, type: 'success' })
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>
      setToast({ msg: e.response?.data?.message ?? 'Failed to change password.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border-subtle)] max-w-lg">
      <h3 className="font-[var(--font-serif)] text-lg text-[var(--color-text)] mb-6">Change Password</h3>

      <div className="flex flex-col gap-4">
        <Input
          label="Current Password"
          type="password"
          value={form.currentPassword}
          onChange={(e) => set('currentPassword', e.target.value)}
          error={errors.currentPassword}
          placeholder="••••••••"
        />
        <Input
          label="New Password"
          type="password"
          value={form.newPassword}
          onChange={(e) => set('newPassword', e.target.value)}
          error={errors.newPassword}
          placeholder="••••••••"
          hint="At least 6 characters"
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => set('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          placeholder="••••••••"
        />
      </div>

      {toast && (
        <div className="mt-5">
          <Toast message={toast.msg} type={toast.type} />
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </div>
  )
}

// ---- Order History tab ----

function OrdersTab() {
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-7 h-7 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 text-[var(--color-text-muted)]">
        Failed to load orders. Please refresh.
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 gap-4 text-center">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[var(--color-text-subtle)] opacity-40" aria-hidden="true">
          <rect x="7" y="4" width="34" height="40" rx="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M15 16H33M15 24H33M15 32H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className="text-lg font-[var(--font-serif)] text-[var(--color-text)]">No orders yet</p>
        <p className="text-sm text-[var(--color-text-muted)]">Your past orders will appear here.</p>
        <Link to="/coffee">
          <Button variant="primary" size="sm">Shop Now</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const date = new Date(order.createdAt).toLocaleDateString('en-AU', {
          day: 'numeric', month: 'short', year: 'numeric',
        })
        const statusColor = STATUS_COLOR[order.status] ?? 'bg-gray-50 text-gray-700'

        return (
          <Link
            key={order.id}
            to={`/order-confirmation/${order.id}`}
            className="block bg-white rounded-2xl p-5 shadow-[var(--shadow-soft-sm)] border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-soft)] transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-mono text-[var(--color-text-subtle)]">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{date}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', statusColor)}>
                  {order.status}
                </span>
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className="text-[var(--color-text-subtle)] group-hover:text-[var(--color-primary)] transition-colors"
                  aria-hidden="true"
                >
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Item previews */}
            <div className="flex gap-2 mb-4">
              {order.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-[var(--color-surface-elevated)] flex items-center justify-center"
                >
                  {item.productImageUrl ? (
                    <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[var(--color-text-subtle)]" aria-hidden="true">
                      <path d="M3 3H5L7 10H10L12 6H4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-elevated)] flex items-center justify-center text-xs text-[var(--color-text-muted)] font-medium">
                  +{order.items.length - 3}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--color-text-muted)]">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · ···· {order.cardLastFour}
              </p>
              <p className="font-semibold text-[var(--color-text)]">{formatCurrency(order.total)}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// ---- Main Page ----

export function AccountPage() {
  const { user } = useAuthStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab') as TabId | null
  const activeTab: TabId = TABS.some((t) => t.id === rawTab) ? (rawTab as TabId) : 'profile'

  const [profile, setProfile] = useState<UserProfileDto | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const firstLoad = useRef(true)

  useEffect(() => {
    if (!firstLoad.current) return
    firstLoad.current = false
    getProfile()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setProfileLoading(false))
  }, [])

  function setTab(id: TabId) {
    setSearchParams({ tab: id }, { replace: true })
  }

  const initials = [user?.firstName?.[0]].filter(Boolean).join('').toUpperCase() || '?'

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-semibold text-xl shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="font-[var(--font-serif)] text-2xl text-[var(--color-text)]">
              {user?.firstName ?? 'My Account'}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">{user?.email}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar tabs */}
          <nav className="lg:w-52 shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={cn(
                  'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]',
                )}
              >
                <span className={cn(
                  'shrink-0 transition-colors',
                  activeTab === tab.id ? 'text-white' : 'text-[var(--color-text-subtle)]',
                )}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              profileLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-7 h-7 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : profile ? (
                <ProfileTab profile={profile} onSaved={setProfile} />
              ) : (
                <div className="text-center py-16 text-[var(--color-text-muted)]">Failed to load profile.</div>
              )
            )}
            {activeTab === 'password' && <PasswordTab />}
            {activeTab === 'orders' && <OrdersTab />}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
