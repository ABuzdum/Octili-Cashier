/**
 * ============================================================================
 * CART STORE - UNIT TESTS
 * ============================================================================
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cartStore'
import type { Product } from '@/types/product.types'

// Mock product for testing
const mockProduct: Product = {
  id: 'prod-1',
  name: 'Test Product',
  price: 10.0,
  category: 'lottery',
  image: '/test.png',
}

const mockProduct2: Product = {
  id: 'prod-2',
  name: 'Another Product',
  price: 25.0,
  category: 'lottery',
  image: '/test2.png',
}

describe('cartStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.getState().clearCart()
  })

  describe('initial state', () => {
    it('starts with empty cart', () => {
      const state = useCartStore.getState()
      expect(state.items).toEqual([])
      expect(state.subtotal).toBe(0)
      expect(state.tax).toBe(0)
      expect(state.total).toBe(0)
      expect(state.itemCount).toBe(0)
    })
  })

  describe('addItem', () => {
    it('adds a new item to cart', () => {
      useCartStore.getState().addItem(mockProduct)

      const state = useCartStore.getState()
      expect(state.items.length).toBe(1)
      expect(state.items[0].product.id).toBe(mockProduct.id)
      expect(state.items[0].quantity).toBe(1)
    })

    it('adds item with specified quantity', () => {
      useCartStore.getState().addItem(mockProduct, 3)

      const state = useCartStore.getState()
      expect(state.items[0].quantity).toBe(3)
      expect(state.items[0].subtotal).toBe(30) // 10 * 3
    })

    it('increases quantity when adding same product', () => {
      useCartStore.getState().addItem(mockProduct, 2)
      useCartStore.getState().addItem(mockProduct, 3)

      const state = useCartStore.getState()
      expect(state.items.length).toBe(1) // Still one item
      expect(state.items[0].quantity).toBe(5) // 2 + 3
    })

    it('adds different products separately', () => {
      useCartStore.getState().addItem(mockProduct)
      useCartStore.getState().addItem(mockProduct2)

      const state = useCartStore.getState()
      expect(state.items.length).toBe(2)
    })
  })

  describe('removeItem', () => {
    it('removes item from cart', () => {
      useCartStore.getState().addItem(mockProduct)
      const itemId = useCartStore.getState().items[0].id

      useCartStore.getState().removeItem(itemId)

      expect(useCartStore.getState().items.length).toBe(0)
    })

    it('only removes specified item', () => {
      useCartStore.getState().addItem(mockProduct)
      useCartStore.getState().addItem(mockProduct2)
      const firstItemId = useCartStore.getState().items[0].id

      useCartStore.getState().removeItem(firstItemId)

      const state = useCartStore.getState()
      expect(state.items.length).toBe(1)
      expect(state.items[0].product.id).toBe(mockProduct2.id)
    })
  })

  describe('updateQuantity', () => {
    it('updates item quantity', () => {
      useCartStore.getState().addItem(mockProduct)
      const itemId = useCartStore.getState().items[0].id

      useCartStore.getState().updateQuantity(itemId, 5)

      expect(useCartStore.getState().items[0].quantity).toBe(5)
    })

    it('removes item when quantity is 0 or less', () => {
      useCartStore.getState().addItem(mockProduct)
      const itemId = useCartStore.getState().items[0].id

      useCartStore.getState().updateQuantity(itemId, 0)

      expect(useCartStore.getState().items.length).toBe(0)
    })

    it('updates subtotal when quantity changes', () => {
      useCartStore.getState().addItem(mockProduct) // price = 10
      const itemId = useCartStore.getState().items[0].id

      useCartStore.getState().updateQuantity(itemId, 4)

      expect(useCartStore.getState().items[0].subtotal).toBe(40)
    })
  })

  describe('clearCart', () => {
    it('removes all items and resets totals', () => {
      useCartStore.getState().addItem(mockProduct, 2)
      useCartStore.getState().addItem(mockProduct2, 3)

      useCartStore.getState().clearCart()

      const state = useCartStore.getState()
      expect(state.items).toEqual([])
      expect(state.subtotal).toBe(0)
      expect(state.tax).toBe(0)
      expect(state.total).toBe(0)
      expect(state.itemCount).toBe(0)
    })
  })

  describe('recalculateTotals', () => {
    it('calculates correct subtotal', () => {
      useCartStore.getState().addItem(mockProduct, 2) // 10 * 2 = 20
      useCartStore.getState().addItem(mockProduct2, 1) // 25 * 1 = 25

      const state = useCartStore.getState()
      expect(state.subtotal).toBe(45) // 20 + 25
    })

    it('calculates correct tax (21%)', () => {
      useCartStore.getState().addItem(mockProduct, 10) // 10 * 10 = 100

      const state = useCartStore.getState()
      expect(state.tax).toBe(21) // 100 * 0.21
    })

    it('calculates correct total (subtotal + tax)', () => {
      useCartStore.getState().addItem(mockProduct, 10) // 100 subtotal

      const state = useCartStore.getState()
      expect(state.total).toBe(121) // 100 + 21
    })

    it('calculates correct item count', () => {
      useCartStore.getState().addItem(mockProduct, 3)
      useCartStore.getState().addItem(mockProduct2, 2)

      expect(useCartStore.getState().itemCount).toBe(5) // 3 + 2
    })
  })
})
