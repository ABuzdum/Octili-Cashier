/**
 * ============================================================================
 * MOCK DATA
 * ============================================================================
 *
 * Purpose: Sample data for development and testing
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import type { Product, Category } from '@/types/product.types'
import type { Transaction } from '@/types/transaction.types'

export const categories: Category[] = [
  { id: '1', name: 'Drinks', color: '#3b82f6', icon: 'coffee', order: 1 },
  { id: '2', name: 'Food', color: '#22c55e', icon: 'utensils', order: 2 },
  { id: '3', name: 'Snacks', color: '#f59e0b', icon: 'cookie', order: 3 },
  { id: '4', name: 'Lottery', color: '#ef4444', icon: 'ticket', order: 4 },
  { id: '5', name: 'Tobacco', color: '#8b5cf6', icon: 'cigarette', order: 5 },
  { id: '6', name: 'Other', color: '#6b7280', icon: 'box', order: 6 },
]

export const products: Product[] = [
  // Drinks
  { id: '1', name: 'Coca Cola 500ml', price: 2.50, categoryId: '1', isActive: true, barcode: '5449000000996' },
  { id: '2', name: 'Pepsi 500ml', price: 2.30, categoryId: '1', isActive: true, barcode: '4060800001234' },
  { id: '3', name: 'Water 500ml', price: 1.20, categoryId: '1', isActive: true, barcode: '8001234567890' },
  { id: '4', name: 'Orange Juice 1L', price: 3.50, categoryId: '1', isActive: true, barcode: '8002345678901' },
  { id: '5', name: 'Coffee Large', price: 3.00, categoryId: '1', isActive: true },
  { id: '6', name: 'Coffee Small', price: 2.00, categoryId: '1', isActive: true },
  { id: '7', name: 'Red Bull 250ml', price: 2.80, categoryId: '1', isActive: true, barcode: '9002490100070' },
  { id: '8', name: 'Beer 500ml', price: 3.50, categoryId: '1', isActive: true },

  // Food
  { id: '9', name: 'Sandwich Ham', price: 4.50, categoryId: '2', isActive: true },
  { id: '10', name: 'Sandwich Cheese', price: 4.00, categoryId: '2', isActive: true },
  { id: '11', name: 'Hot Dog', price: 3.50, categoryId: '2', isActive: true },
  { id: '12', name: 'Pizza Slice', price: 3.00, categoryId: '2', isActive: true },
  { id: '13', name: 'Salad Bowl', price: 5.50, categoryId: '2', isActive: true },

  // Snacks
  { id: '14', name: 'Chips Original', price: 2.00, categoryId: '3', isActive: true, barcode: '8003456789012' },
  { id: '15', name: 'Chocolate Bar', price: 1.50, categoryId: '3', isActive: true, barcode: '8004567890123' },
  { id: '16', name: 'Candy Pack', price: 1.20, categoryId: '3', isActive: true },
  { id: '17', name: 'Nuts Mix', price: 3.00, categoryId: '3', isActive: true },
  { id: '18', name: 'Cookies', price: 2.50, categoryId: '3', isActive: true },

  // Lottery
  { id: '19', name: 'Lottery Ticket A', price: 2.00, categoryId: '4', isActive: true },
  { id: '20', name: 'Lottery Ticket B', price: 5.00, categoryId: '4', isActive: true },
  { id: '21', name: 'Scratch Card 1', price: 1.00, categoryId: '4', isActive: true },
  { id: '22', name: 'Scratch Card 5', price: 5.00, categoryId: '4', isActive: true },

  // Tobacco
  { id: '23', name: 'Cigarettes Brand A', price: 8.00, categoryId: '5', isActive: true },
  { id: '24', name: 'Cigarettes Brand B', price: 7.50, categoryId: '5', isActive: true },
  { id: '25', name: 'Rolling Tobacco', price: 12.00, categoryId: '5', isActive: true },

  // Other
  { id: '26', name: 'Phone Charger', price: 15.00, categoryId: '6', isActive: true },
  { id: '27', name: 'Umbrella', price: 10.00, categoryId: '6', isActive: true },
  { id: '28', name: 'Newspaper', price: 2.50, categoryId: '6', isActive: true },
]

export const recentTransactions: Transaction[] = [
  {
    id: '1',
    items: [],
    subtotal: 15.50,
    tax: 3.26,
    total: 18.76,
    payments: [{ method: 'cash', amount: 20.00 }],
    status: 'completed',
    cashierId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    receiptNumber: 'REC-001',
  },
  {
    id: '2',
    items: [],
    subtotal: 8.30,
    tax: 1.74,
    total: 10.04,
    payments: [{ method: 'card', amount: 10.04, reference: 'AUTH123' }],
    status: 'completed',
    cashierId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    receiptNumber: 'REC-002',
  },
  {
    id: '3',
    items: [],
    subtotal: 25.00,
    tax: 5.25,
    total: 30.25,
    payments: [{ method: 'cash', amount: 30.25 }],
    status: 'completed',
    cashierId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    receiptNumber: 'REC-003',
  },
]
