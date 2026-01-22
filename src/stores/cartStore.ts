/**
 * ============================================================================
 * CART STORE
 * ============================================================================
 *
 * Purpose: Zustand store for shopping cart state management
 *
 * Features:
 * - Add/remove items
 * - Update quantities
 * - Calculate totals
 * - Clear cart
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { create } from 'zustand'
import type { Product } from '@/types/product.types'
import type { CartItem } from '@/types/cart.types'
import { generateId } from '@/lib/utils'

// Tax rate (21% for example)
const TAX_RATE = 0.21

interface CartStore {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  itemCount: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  recalculateTotals: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  itemCount: 0,

  addItem: (product: Product, quantity: number = 1) => {
    const { items } = get()

    // Check if product already in cart
    const existingItem = items.find((item) => item.product.id === product.id)

    if (existingItem) {
      // Update quantity of existing item
      get().updateQuantity(existingItem.id, existingItem.quantity + quantity)
    } else {
      // Add new item
      const newItem: CartItem = {
        id: generateId(),
        product,
        quantity,
        subtotal: product.price * quantity,
      }

      set({ items: [...items, newItem] })
      get().recalculateTotals()
    }
  },

  removeItem: (itemId: string) => {
    const { items } = get()
    set({ items: items.filter((item) => item.id !== itemId) })
    get().recalculateTotals()
  },

  updateQuantity: (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId)
      return
    }

    const { items } = get()
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          subtotal: item.product.price * quantity,
        }
      }
      return item
    })

    set({ items: updatedItems })
    get().recalculateTotals()
  },

  clearCart: () => {
    set({
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      itemCount: 0,
    })
  },

  recalculateTotals: () => {
    const { items } = get()

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const tax = subtotal * TAX_RATE
    const total = subtotal + tax
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    set({ subtotal, tax, total, itemCount })
  },
}))
