/**
 * ============================================================================
 * CART TYPES
 * ============================================================================
 *
 * Purpose: Type definitions for shopping cart functionality
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import type { Product } from './product.types'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  subtotal: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  itemCount: number
}
