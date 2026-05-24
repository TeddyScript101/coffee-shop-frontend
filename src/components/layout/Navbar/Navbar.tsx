import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '@ds/components/Button/Button'
import { useAuthStore } from '@store/authStore'
import { useCartStore, cartItemCount } from '@store/cartStore'
import { cn } from '@/utils/cn'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, user, logout } = useAuthStore()
  const items = useCartStore((s) => s.items)
  const itemCount = cartItemCount(items)
  const { pathname } = useLocation()

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close user menu on route change
  useEffect(() => {
    setUserMenuOpen(false)
  }, [pathname])

  const isHome = pathname === '/'
  // Transparent-glass mode: only on the home page before the user scrolls 80px
  const isTransparent = isHome && !scrolled

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    // Initialise immediately so SSR-like fast loads are correct
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { to: '/coffee', label: 'Coffee' },
    { to: '/equipment', label: 'Equipment' },
    { to: '/membership', label: 'Membership' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
        isTransparent
          ? [
              'bg-white/[0.07] backdrop-blur-[14px]',
              'border-b border-white/[0.1]',
            ]
          : [
              'bg-[var(--color-surface)]/[0.9] backdrop-blur-xl',
              'border-b border-[var(--color-border-subtle)]',
              'shadow-[var(--shadow-soft-sm)]',
            ],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className={cn(
              'font-[var(--font-serif)] text-xl transition-colors duration-300',
              isTransparent
                ? 'text-white hover:text-white/80'
                : 'text-[var(--color-text)] hover:text-[var(--color-primary)]',
            )}
          >
            BeanWorks
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'text-sm transition-colors duration-300',
                    isTransparent
                      ? isActive
                        ? 'text-white font-medium'
                        : 'text-white/65 hover:text-white'
                      : isActive
                        ? 'text-[var(--color-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart icon */}
            <Link
              to="/cart"
              className={cn(
                'relative p-2 transition-colors duration-300',
                isTransparent
                  ? 'text-white/75 hover:text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
              )}
              aria-label={`Cart (${itemCount} items)`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 3H4.5L6 13H15L17 7H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="16" r="1" fill="currentColor"/>
                <circle cx="13" cy="16" r="1" fill="currentColor"/>
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--color-primary)] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                {/* Trigger button */}
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200',
                    isTransparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)]',
                  )}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  {/* Avatar */}
                  <span className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0',
                    isTransparent
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--color-primary)] text-white',
                  )}>
                    {(user?.firstName?.[0] ?? '?').toUpperCase()}
                  </span>
                  <span className="text-sm font-medium">{user?.firstName}</span>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={cn('transition-transform duration-200', userMenuOpen && 'rotate-180')}
                    aria-hidden="true"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Dropdown panel */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-soft-md)] border border-[var(--color-border-subtle)] overflow-hidden z-50">
                    {/* User info header */}
                    <div className="px-4 py-3 bg-[var(--color-surface-elevated)] border-b border-[var(--color-border-subtle)]">
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">{user?.firstName}</p>
                      <p className="text-xs text-[var(--color-text-subtle)] truncate">{user?.email}</p>
                    </div>

                    {/* Menu items */}
                    <nav className="p-1.5 flex flex-col">
                      <Link
                        to="/account?tab=profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M2 14C2 11.2386 4.68629 9 8 9C11.3137 9 14 11.2386 14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                        Profile &amp; Address
                      </Link>
                      <Link
                        to="/account?tab=password"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M11 7.5V5.5C11 3.567 9.657 2 8 2C6.343 2 5 3.567 5 5.5V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                          <rect x="3" y="7.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                          <circle cx="8" cy="11" r="1" fill="currentColor"/>
                        </svg>
                        Change Password
                      </Link>
                      <Link
                        to="/account?tab=orders"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M5 5.5H11M5 8H11M5 10.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                        Order History
                      </Link>
                    </nav>

                    <div className="p-1.5 border-t border-[var(--color-border-subtle)]">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false) }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                          <path d="M11 11L14 8L11 5M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="secondary"
                  size="sm"
                  className={cn(
                    'transition-colors duration-300',
                    isTransparent && 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50',
                  )}
                >
                  Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={cn(
              'md:hidden p-2 transition-colors duration-300',
              isTransparent
                ? 'text-white/80 hover:text-white'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
            )}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className={cn(
          'md:hidden border-t px-4 pb-4',
          isTransparent
            ? 'border-white/[0.1] bg-[var(--color-brand-charcoal)]/92 backdrop-blur-xl'
            : 'border-[var(--color-border-subtle)] bg-[var(--color-surface)]/95 backdrop-blur-xl',
        )}>
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-xl text-sm transition-colors',
                    isTransparent
                      ? isActive
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-white/65 hover:bg-white/10 hover:text-white'
                      : isActive
                        ? 'bg-[var(--color-surface-elevated)] text-[var(--color-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className={cn(
            'flex items-center justify-between mt-4 pt-4 border-t',
            isTransparent ? 'border-white/[0.1]' : 'border-[var(--color-border-subtle)]',
          )}>
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-2 text-sm',
                isTransparent ? 'text-white/70' : 'text-[var(--color-text-muted)]',
              )}
            >
              Cart {itemCount > 0 && (
                <span className="px-1.5 py-0.5 bg-[var(--color-primary)] text-white text-xs rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex flex-col gap-1 w-full mt-2">
                <Link
                  to="/account?tab=profile"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm transition-colors',
                    isTransparent
                      ? 'text-white/65 hover:bg-white/10 hover:text-white'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]',
                  )}
                >
                  Profile &amp; Address
                </Link>
                <Link
                  to="/account?tab=password"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm transition-colors',
                    isTransparent
                      ? 'text-white/65 hover:bg-white/10 hover:text-white'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]',
                  )}
                >
                  Change Password
                </Link>
                <Link
                  to="/account?tab=orders"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm transition-colors',
                    isTransparent
                      ? 'text-white/65 hover:bg-white/10 hover:text-white'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]',
                  )}
                >
                  Order History
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false) }}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm text-left transition-colors text-red-500',
                    isTransparent ? 'hover:bg-white/10' : 'hover:bg-red-50',
                  )}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button
                  variant="secondary"
                  size="sm"
                  className={cn(isTransparent && 'bg-white/10 border-white/30 text-white hover:bg-white/20')}
                >
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
