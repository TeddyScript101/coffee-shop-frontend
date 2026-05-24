import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '@ds/components/Button/Button'
import { useAuthStore } from '@store/authStore'
import { useCartStore, cartItemCount } from '@store/cartStore'
import { cn } from '@/utils/cn'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const items = useCartStore((s) => s.items)
  const itemCount = cartItemCount(items)
  const { pathname } = useLocation()

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
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-sm transition-colors duration-300',
                  isTransparent ? 'text-white/80' : 'text-[var(--color-text-muted)]',
                )}>
                  {user?.firstName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className={cn(
                    'transition-colors duration-300',
                    isTransparent && 'text-white/80 hover:text-white hover:bg-white/10',
                  )}
                >
                  Sign out
                </Button>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { logout(); setMobileOpen(false) }}
                className={cn(isTransparent && 'text-white/80 hover:text-white hover:bg-white/10')}
              >
                Sign out
              </Button>
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
