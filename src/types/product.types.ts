/**
 * ============================================================================
 * PRODUCT TYPES
 * ============================================================================
 *
 * Purpose: Type definitions for products and categories
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

export interface Product {
  id: string
  name: string
  price: number
  categoryId: string
  image?: string
  barcode?: string
  sku?: string
  stock?: number
  isActive: boolean
}

export interface Category {
  id: string
  name: string
  color: string
  icon?: string
  order: number
}
