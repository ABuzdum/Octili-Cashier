/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 *
 * Purpose: Common utility functions used throughout the application
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with conflict resolution
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 *
 * @example
 * cn('px-4 py-2', 'px-6') // Returns 'py-2 px-6'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency value
 *
 * @param amount - Amount to format
 * @param currency - Currency code (default: EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date to localized string
 *
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-EU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

/**
 * Generate a unique ID
 *
 * @returns Unique ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
