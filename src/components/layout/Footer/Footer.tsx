import { Link } from 'react-router-dom'
import { Separator } from '@ds/components/Separator/Separator'

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface-elevated)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-[var(--font-serif)] text-lg text-[var(--color-text)] mb-3">
              Cheeky Ember
            </h4>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Premium coffee, sourced with intention. Roasted to order.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-medium text-[var(--color-text)] mb-3 uppercase tracking-wide">
              Shop
            </h5>
            <ul className="flex flex-col gap-2">
              <li><Link to="/coffee" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">Coffee Beans</Link></li>
              <li><Link to="/equipment" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">Equipment</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-medium text-[var(--color-text)] mb-3 uppercase tracking-wide">
              Account
            </h5>
            <ul className="flex flex-col gap-2">
              <li><Link to="/membership" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">Membership</Link></li>
              <li><Link to="/login" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">Sign in</Link></li>
            </ul>
          </div>
        </div>
        <Separator />
        <p className="text-xs text-[var(--color-text-subtle)] mt-6 text-center">
          © {new Date().getFullYear()} Cheeky Ember Coffee. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
