/**
 * ============================================================================
 * SWIPE PAGE WRAPPER - ANIMATED PAGE TRANSITIONS
 * ============================================================================
 *
 * Purpose: Wraps page content to provide smooth sliding animations
 * when swiping between pages on POS terminals.
 *
 * Features:
 * - Slide left/right animation on swipe
 * - Real-time drag feedback during swipe
 * - Spring-like animation easing
 * - Works with touch and mouse
 *
 * Usage:
 * ```tsx
 * <SwipePageWrapper currentPage="draw">
 *   <YourPageContent />
 * </SwipePageWrapper>
 * ```
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState, useRef, useCallback, type ReactNode, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import type { NavTab } from '@/components/layout/BottomNavigation'

/**
 * Page sequence for swipe navigation
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
const PAGE_ROUTES: Record<string, string> = {
  'draw': '/pos',
  'results': '/results',
  'qrticket-sell': '/physical-ticket/new',
  'qrticket-payout': '/physical-ticket/payout',
}

interface SwipePageWrapperProps {
  children: ReactNode
  currentPage: NavTab
  /** Custom styles for the container */
  style?: CSSProperties
  /** Background color/gradient */
  background?: string
  /** Minimum swipe distance to trigger navigation (default: 80) */
  threshold?: number
  /** Whether swipe is enabled (default: true) */
  enabled?: boolean
}

/**
 * SwipePageWrapper Component
 *
 * Wraps page content and provides animated swipe transitions.
 * Shows real-time drag feedback and animates page sliding in/out.
 */
export function SwipePageWrapper({
  children,
  currentPage,
  style = {},
  background = 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
  threshold = 80,
  enabled = true,
}: SwipePageWrapperProps) {
  const navigate = useNavigate()

  // Touch/drag state
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animateDirection, setAnimateDirection] = useState<'left' | 'right' | null>(null)

  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Get the next page in sequence
   */
  const getNextPage = useCallback((): NavTab | null => {
    const currentIndex = PAGE_SEQUENCE.indexOf(currentPage)
    if (currentIndex === -1 || currentIndex >= PAGE_SEQUENCE.length - 1) {
      return null
    }
    return PAGE_SEQUENCE[currentIndex + 1]
  }, [currentPage])

  /**
   * Get the previous page in sequence
   */
  const getPrevPage = useCallback((): NavTab | null => {
    const currentIndex = PAGE_SEQUENCE.indexOf(currentPage)
    if (currentIndex <= 0) {
      return null
    }
    return PAGE_SEQUENCE[currentIndex - 1]
  }, [currentPage])

  /**
   * Handle touch/drag start
   */
  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!enabled) return
    startX.current = clientX
    startY.current = clientY
    setIsDragging(true)
  }, [enabled])

  /**
   * Handle touch/drag move - update offset for real-time feedback
   */
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!enabled || !isDragging || startX.current === null || startY.current === null) return

    const deltaX = clientX - startX.current
    const deltaY = clientY - startY.current

    // Only register horizontal movement if it's more than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      // Apply resistance at the edges
      const canGoLeft = getNextPage() !== null
      const canGoRight = getPrevPage() !== null

      let constrainedOffset = deltaX

      // Add resistance if trying to swipe in a direction that can't navigate
      if (deltaX < 0 && !canGoLeft) {
        constrainedOffset = deltaX * 0.2 // Heavy resistance
      } else if (deltaX > 0 && !canGoRight) {
        constrainedOffset = deltaX * 0.2 // Heavy resistance
      } else {
        // Normal drag with slight resistance
        constrainedOffset = deltaX * 0.6
      }

      setDragOffset(constrainedOffset)
    }
  }, [enabled, isDragging, getNextPage, getPrevPage])

  /**
   * Handle touch/drag end - decide whether to navigate
   */
  const handleEnd = useCallback(() => {
    if (!enabled || !isDragging) return

    setIsDragging(false)

    // Check if swipe exceeded threshold
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset < 0) {
        // Swipe left -> go to next page
        const nextPage = getNextPage()
        if (nextPage) {
          setAnimateDirection('left')
          setIsAnimating(true)
          // Animate out then navigate
          setTimeout(() => {
            navigate(PAGE_ROUTES[nextPage])
          }, 200)
        }
      } else {
        // Swipe right -> go to previous page
        const prevPage = getPrevPage()
        if (prevPage) {
          setAnimateDirection('right')
          setIsAnimating(true)
          // Animate out then navigate
          setTimeout(() => {
            navigate(PAGE_ROUTES[prevPage])
          }, 200)
        }
      }
    }

    // Reset offset (with animation if not navigating)
    setDragOffset(0)
  }, [enabled, isDragging, dragOffset, threshold, getNextPage, getPrevPage, navigate])

  // Touch event handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY)
  }, [handleStart])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }, [handleMove])

  const onTouchEnd = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // Mouse event handlers (for desktop testing)
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX, e.clientY)
    }
  }, [isDragging, handleMove])

  const onMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  const onMouseLeave = useCallback(() => {
    if (isDragging) {
      handleEnd()
    }
  }, [isDragging, handleEnd])

  // Calculate transform based on current state
  const getTransform = (): string => {
    if (isAnimating) {
      // Animate fully off-screen
      return animateDirection === 'left'
        ? 'translateX(-100%)'
        : 'translateX(100%)'
    }
    if (isDragging && dragOffset !== 0) {
      return `translateX(${dragOffset}px)`
    }
    return 'translateX(0)'
  }

  // Calculate opacity based on drag distance
  const getOpacity = (): number => {
    if (isAnimating) return 0
    const maxDrag = 200
    const dragPercent = Math.min(Math.abs(dragOffset) / maxDrag, 1)
    return 1 - (dragPercent * 0.3) // Fade to 0.7 at max drag
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{
        minHeight: '100vh',
        background,
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'pan-y',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {/* Animated content wrapper */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          transform: getTransform(),
          opacity: getOpacity(),
          transition: isDragging
            ? 'none'
            : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>

      {/* Swipe indicator dots */}
      <div
        style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 50,
          opacity: isDragging ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        {PAGE_SEQUENCE.map((page, index) => {
          const isCurrent = page === currentPage
          const isTarget =
            (dragOffset < -threshold && index === PAGE_SEQUENCE.indexOf(currentPage) + 1) ||
            (dragOffset > threshold && index === PAGE_SEQUENCE.indexOf(currentPage) - 1)

          return (
            <div
              key={page}
              style={{
                width: isCurrent ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: isCurrent
                  ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
                  : isTarget
                  ? '#24BD68'
                  : '#e2e8f0',
                transition: 'all 0.2s ease',
                transform: isTarget ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          )
        })}
      </div>

      {/* Direction hint arrows (shown during drag) */}
      {isDragging && Math.abs(dragOffset) > 20 && (
        <>
          {dragOffset < 0 && getNextPage() && (
            <div
              style={{
                position: 'fixed',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: Math.abs(dragOffset) > threshold
                  ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
                  : 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease',
                zIndex: 100,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={Math.abs(dragOffset) > threshold ? 'white' : '#64748b'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          )}
          {dragOffset > 0 && getPrevPage() && (
            <div
              style={{
                position: 'fixed',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: Math.abs(dragOffset) > threshold
                  ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
                  : 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease',
                zIndex: 100,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={Math.abs(dragOffset) > threshold ? 'white' : '#64748b'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SwipePageWrapper
