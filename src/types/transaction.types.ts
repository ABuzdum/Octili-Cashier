/**
 * ============================================================================
 * TRANSACTION TYPES
 * ============================================================================
 *
 * Purpose: Type definitions for transactions and payments
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import type { CartItem } from './cart.types'

export type PaymentMethod = 'cash' | 'card' | 'voucher' | 'mixed'
export type TransactionStatus = 'completed' | 'pending' | 'cancelled' | 'refunded'

export interface Payment {
  method: PaymentMethod
  amount: number
  reference?: string
}

export interface Transaction {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  payments: Payment[]
  status: TransactionStatus
  cashierId: string
  createdAt: string
  completedAt?: string
  receiptNumber: string
}
