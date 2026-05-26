import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductType } from '@/types/api'

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string | null
  productType: ProductType
  // Coffee bean specific fields (for TasteNoteImage in cart)
  originCountry?: string
  originRegion?: string
  tastingNotes?: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const existing = get().items.find((i) => i.productId === newItem.productId)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === newItem.productId
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i,
            ),
          })
        } else {
          set({ items: [...get().items, newItem] })
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        })
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: 'coffee_shop_cart' },
  ),
)

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
