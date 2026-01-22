/**
 * ============================================================================
 * USE SWIPE NAVIGATION HOOK
 * ============================================================================
 *
 * Purpose: Enable swipe left/right gestures to navigate between pages
 * Designed for POS terminal touch screens
 *
 * Features:
 * - Detect horizontal swipe gestures
 * - Navigate to next/previous page in sequence
 * - Configurable swipe threshold
 * - Works with touch screens and mouse drag
 *
 * Usage:
 * ```tsx
 * const swipeHandlers = useSwipeNavigation({
 *   currentPage: 'draw',
 *   pages: ['draw', 'results', 'sell', 'payout'],
 *   onNavigate: (page) => navigate(routes[page])
 * })
 *
 * return <div {...swipeHandlers}>...</div>
 * ```
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { NavTab } from '@/components/layout/BottomNavigation'

/**
 * Page sequence for swipe navigation
 * Defines the order of pages when swiping left/right
 */
const PAGE_SEQUENCE: NavTab[] = [
  'draw',
  'results',
  'qrticket-sell',
  'qrticket-payout',
]

/**
 * Route mapping for each page
 */
const PAGE_ROUTES: Record<NavTab, string> = {
  'draw': '/pos',
  'results': '/results',
  'qrticket-sell': '/physical-ticket/new',
  'qrticket-payout': '/physical-ticket/payout',
  'cart': '/cart',
  'checkout': '/checkout',
  'transactions': '/transactions',
  'settings': '/settings',
  'tvbox': '/tvbox-control',
  'account': '/account',
  'newticket': '/physical-ticket/new',
  'payout': '/payment',
  'seconddisplay': '/second-display',
}

interface SwipeConfig {
  /** Current active page/tab */
  currentPage: NavTab
  /** Minimum distance in pixels to trigger swipe (default: 50) */
  threshold?: number
  /** Whether swipe navigation is enabled (default: true) */
  enabled?: boolean
}

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: (e: React.MouseEvent) => void
}

/**
 * Hook for handling swipe navigation between pages
 *
 * @param config - Configuration options
 * @returns Object with touch/mouse event handlers to spread on container
 */
export function useSwipeNavigation(config: SwipeConfig): SwipeHandlers {
  const { currentPage, threshold = 50, enabled = true } = config
  const navigate = useNavigate()

  // Track touch/mouse position
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)
  const isDragging = useRef(false)

  /**
   * Get the next page in sequence (swipe left = go right)
   */
  const getNextPage = useCallback((): NavTab | null => {
    const currentIndex = PAGE_SEQUENCE.indexOf(currentPage)
    if (currentIndex === -1 || currentIndex >= PAGE_SEQUENCE.length - 1) {
      return null
    }
    return PAGE_SEQUENCE[currentIndex + 1]
  }, [currentPage])

  /**
   * Get the previous page in sequence (swipe right = go left)
   */
  const getPrevPage = useCallback((): NavTab | null => {
    const currentIndex = PAGE_SEQUENCE.indexOf(currentPage)
    if (currentIndex <= 0) {
      return null
    }
    return PAGE_SEQUENCE[currentIndex - 1]
  }, [currentPage])

  /**
   * Handle swipe gesture completion
   */
  const handleSwipe = useCallback((deltaX: number, deltaY: number) => {
    if (!enabled) return

    // Only trigger if horizontal movement is greater than vertical
    // This prevents accidental swipes while scrolling
    if (Math.abs(deltaX) < Math.abs(deltaY)) return
    if (Math.abs(deltaX) < threshold) return

    if (deltaX < 0) {
      // Swipe left -> go to next page
      const nextPage = getNextPage()
      if (nextPage) {
        navigate(PAGE_ROUTES[nextPage])
      }
    } else {
      // Swipe right -> go to previous page
      const prevPage = getPrevPage()
      if (prevPage) {
        navigate(PAGE_ROUTES[prevPage])
      }
    }
  }, [enabled, threshold, getNextPage, getPrevPage, navigate])

  // Touch event handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }, [])

  const onTouchMove = useCallback((_e: React.TouchEvent) => {
    // Could add visual feedback here (e.g., page sliding animation)
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (startX.current === null || startY.current === null) return

    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const deltaX = endX - startX.current
    const deltaY = endY - startY.current

    handleSwipe(deltaX, deltaY)

    startX.current = null
    startY.current = null
  }, [handleSwipe])

  // Mouse event handlers (for desktop testing)
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.clientX
    startY.current = e.clientY
  }, [])

  const onMouseMove = useCallback((_e: React.MouseEvent) => {
    // Could add visual feedback here
  }, [])

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || startX.current === null || startY.current === null) return

    const deltaX = e.clientX - startX.current
    const deltaY = e.clientY - startY.current

    handleSwipe(deltaX, deltaY)

    isDragging.current = false
    startX.current = null
    startY.current = null
  }, [handleSwipe])

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  }
}

/**
 * Get the page sequence for reference
 */
export function getPageSequence(): NavTab[] {
  return [...PAGE_SEQUENCE]
}

/**
 * Get route for a specific page
 */
export function getPageRoute(page: NavTab): string {
  return PAGE_ROUTES[page]
}

export default useSwipeNavigation
