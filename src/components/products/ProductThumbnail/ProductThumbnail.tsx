import { cn } from '@/utils/cn'
import type { ProductType } from '@/types/api'

export interface ProductThumbnailProps {
  productType: ProductType | string
  name: string
  // Coffee beans only: determines the country accent color on the tile
  originCountry?: string
  // Equipment only: real photo URL (coffee bean imageUrls are placeholder and should be ignored)
  imageUrl?: string | null
  className?: string
}

// Maps origin country to a background color class.
// Mirrors the palette used in TasteNoteImage so beans look consistent everywhere.
function getCountryBg(country: string): string {
  const upper = country.toUpperCase()
  if (upper.includes('COLOMBIA')) return 'bg-amber-500'
  if (upper.includes('COSTA RICA')) return 'bg-[#3F2B1E]'
  if (upper.includes('MEXICO') || upper.includes('MEXICAN')) return 'bg-[#78C25B]'
  if (upper.includes('BRAZIL')) return 'bg-yellow-400'
  if (upper.includes('ETHIOPIA')) return 'bg-rose-500'
  if (upper.includes('KENYA')) return 'bg-red-700'
  if (upper.includes('PANAMA')) return 'bg-sky-500'
  if (upper.includes('INDONESIA')) return 'bg-emerald-700'
  if (upper.includes('JAMAICA')) return 'bg-blue-600'
  if (upper.includes('YEMEN')) return 'bg-orange-700'
  if (upper.includes('BLEND')) return 'bg-zinc-900'
  return 'bg-[var(--color-primary)]'
}

// Classic coffee bean silhouette: oval + center crease
function CoffeeBeanSvg() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-1/2 h-1/2"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="12" rx="6.5" ry="9" fill="white" fillOpacity="0.85" />
      <path
        d="M12 3.5 C9 7.5 9 16.5 12 20.5"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Generic equipment icon (wrench silhouette)
function EquipmentSvg() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-1/2 h-1/2 text-[var(--color-text-subtle)]"
      aria-hidden="true"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

/**
 * Consistent product thumbnail for use in cart, checkout, order confirmation, and order history.
 *
 * CoffeeBean → colored tile (country accent) + bean icon
 * Equipment / unknown → neutral surface tile + wrench icon
 *
 * The component fills its parent container (w-full h-full).
 * Wrap it in a sized, overflow-hidden div to control the final dimensions.
 */
export function ProductThumbnail({
  productType,
  name,
  originCountry,
  imageUrl,
  className,
}: ProductThumbnailProps) {
  // Coffee beans always use the colored tile — imageUrls in the DB are placeholders
  if (productType === 'CoffeeBean') {
    const bg = originCountry ? getCountryBg(originCountry) : 'bg-[var(--color-primary)]'
    return (
      <div className={cn('w-full h-full flex items-center justify-center', bg, className)}>
        <CoffeeBeanSvg />
      </div>
    )
  }

  // Equipment has real photos — show them when available
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn('w-full h-full object-cover', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'w-full h-full flex items-center justify-center bg-[var(--color-surface-elevated)]',
        className,
      )}
    >
      <EquipmentSvg />
    </div>
  )
}
