/**
 * ============================================================================
 * UTILITY FUNCTIONS - UNIT TESTS
 * ============================================================================
 */

import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, generateId } from './utils'

describe('cn (class name merger)', () => {
  it('merges multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active', false && 'hidden')).toBe('base active')
  })

  it('resolves Tailwind conflicts (last wins)', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
  })
})

describe('formatCurrency', () => {
  it('formats USD currency correctly', () => {
    expect(formatCurrency(100)).toBe('$100.00')
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats negative amounts', () => {
    expect(formatCurrency(-50)).toBe('-$50.00')
  })

  it('handles decimal precision', () => {
    expect(formatCurrency(10.5)).toBe('$10.50')
    expect(formatCurrency(10.555)).toBe('$10.56') // rounded
  })

  it('formats other currencies when specified', () => {
    expect(formatCurrency(100, 'EUR')).toContain('100')
    expect(formatCurrency(100, 'GBP')).toContain('100')
  })
})

describe('generateId', () => {
  it('generates a string ID', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('generates unique IDs', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      ids.add(generateId())
    }
    expect(ids.size).toBe(100) // All should be unique
  })
})
