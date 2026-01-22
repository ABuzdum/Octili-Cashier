/**
 * ============================================================================
 * APP HEADER - REUSABLE HEADER COMPONENT
 * ============================================================================
 *
 * Purpose: Consistent header across all pages with balance and menu
 *
 * Features:
 * - Octili branding (logo + title)
 * - Clickable balance display (navigates to account)
 * - Menu button (three lines) for settings/menu
 * - Optional back button
 * - Optional custom center content
 * - Theme support
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'
import { useThemeStore, COLOR_THEMES, VISUAL_STYLES } from '@/stores/themeStore'
import { BalanceOverview } from '@/components/shared/BalanceOverview'

interface AppHeaderProps {
  /** Show back button on the left */
  showBack?: boolean
  /** Custom back navigation path (defaults to -1 / history back) */
  backPath?: string
  /** Optional title to show instead of "Octili" */
  title?: string
  /** Optional subtitle under the title */
  subtitle?: string
  /** Optional custom center content */
  centerContent?: React.ReactNode
  /** Optional left content (replaces logo section) */
  leftContent?: React.ReactNode
}

/**
 * Reusable app header component with balance and menu button
 * Matches the design of the POS page header
 */
export function AppHeader({
  showBack = false,
  backPath,
  title = 'Octili',
  subtitle = 'Lottery Terminal',
  centerContent,
  leftContent,
}: AppHeaderProps) {
  const navigate = useNavigate()
  const { pocketBalances, getTotalBalance, cartTickets } = useGameStore()
  const balance = getTotalBalance()
  const cartCount = cartTickets.length
  const { colorTheme, visualStyle, isDarkMode } = useThemeStore()

  /** State for showing balance details modal */
  const [showBalanceModal, setShowBalanceModal] = useState(false)

  // Get current theme colors
  const theme = COLOR_THEMES[colorTheme]

  // Handle back navigation
  const handleBack = () => {
    if (backPath) {
      navigate(backPath)
    } else {
      navigate(-1)
    }
  }

  // Handle balance click - show balance details modal
  const handleBalanceClick = () => {
    setShowBalanceModal(true)
  }


  // Generate header styles based on visual style
  const getHeaderStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: '16px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }

    switch (visualStyle) {
      case 'glass':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${theme.colors[600]}ee 0%, ${theme.colors[700]}dd 100%)`,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        }
      case 'neumorphic':
        return {
          ...baseStyle,
          background: isDarkMode ? '#1a2332' : '#e8eef5',
          boxShadow: isDarkMode
            ? 'inset 0 2px 4px rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.3)'
            : 'inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 24px rgba(0,0,0,0.08)',
        }
      case 'bold':
        return {
          ...baseStyle,
          background: theme.gradient,
          borderBottom: `3px solid ${theme.colors[800]}`,
          boxShadow: `0 6px 0 ${theme.colors[700]}`,
        }
      case 'minimal':
        return {
          ...baseStyle,
          background: isDarkMode ? '#0f172a' : '#ffffff',
          borderBottom: isDarkMode ? '1px solid #1e293b' : '1px solid #f1f5f9',
        }
      default: // bento
        return {
          ...baseStyle,
          background: theme.gradient,
          boxShadow: `0 4px 24px ${theme.primary}40`,
        }
    }
  }

  // Generate logo style based on visual style
  const getLogoStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }

    switch (visualStyle) {
      case 'glass':
        return {
          ...baseStyle,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }
      case 'neumorphic':
        return {
          ...baseStyle,
          background: theme.gradient,
          borderRadius: '16px',
          boxShadow: isDarkMode
            ? '4px 4px 12px #0d1117, -4px -4px 12px #273549'
            : '4px 4px 12px #c8d0dc, -4px -4px 12px #ffffff',
        }
      case 'bold':
        return {
          ...baseStyle,
          background: 'white',
          borderRadius: '12px',
          border: `3px solid ${theme.colors[800]}`,
          boxShadow: `3px 3px 0 ${theme.colors[800]}`,
        }
      case 'minimal':
        return {
          ...baseStyle,
          background: isDarkMode ? '#1e293b' : theme.colors[50],
          borderRadius: '14px',
          border: isDarkMode ? '1px solid #334155' : `1px solid ${theme.colors[200]}`,
        }
      default: // bento
        return {
          ...baseStyle,
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '14px',
          border: '2px solid rgba(255,255,255,0.25)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }
    }
  }

  // Get text colors based on visual style
  const getHeaderTextColor = () => {
    if (visualStyle === 'neumorphic' && !isDarkMode) return theme.colors[800]
    if (visualStyle === 'minimal') return isDarkMode ? '#f8fafc' : theme.colors[700]
    return 'white'
  }

  const getSubtextColor = () => {
    if (visualStyle === 'neumorphic' && !isDarkMode) return theme.colors[600]
    if (visualStyle === 'minimal') return isDarkMode ? '#94a3b8' : theme.colors[500]
    return 'rgba(255,255,255,0.8)'
  }

  // Get button colors
  const getButtonBackground = () => {
    if (visualStyle === 'neumorphic') return isDarkMode ? '#1e293b' : '#f0f4f8'
    if (visualStyle === 'minimal') return isDarkMode ? '#1e293b' : theme.colors[50]
    if (visualStyle === 'bold') return 'white'
    return 'rgba(255,255,255,0.12)'
  }

  const getButtonBorder = () => {
    if (visualStyle === 'bold') return `2px solid ${theme.colors[700]}`
    if (visualStyle === 'minimal') return isDarkMode ? '1px solid #334155' : `1px solid ${theme.colors[200]}`
    if (visualStyle === 'neumorphic') return 'none'
    return '1px solid rgba(255,255,255,0.15)'
  }

  const getButtonShadow = () => {
    if (visualStyle === 'neumorphic') {
      return isDarkMode ? '4px 4px 8px #0d1117, -4px -4px 8px #273549' : '4px 4px 8px #c8d0dc, -4px -4px 8px #ffffff'
    }
    if (visualStyle === 'bold') return `2px 2px 0 ${theme.colors[700]}`
    if (visualStyle === 'glass') return '0 4px 16px rgba(0,0,0,0.1)'
    return 'none'
  }

  const getIconColor = () => {
    if (visualStyle === 'bold' || (visualStyle === 'neumorphic' && !isDarkMode)) return theme.colors[600]
    if (visualStyle === 'minimal') return isDarkMode ? '#f8fafc' : theme.colors[600]
    return 'white'
  }

  return (
    <>
    <header style={getHeaderStyle()}>
      {/* Decorative gradient orbs for glass/bento styles */}
      {(visualStyle === 'glass' || visualStyle === 'bento') && (
        <>
          <div style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            background: `radial-gradient(circle, ${theme.colors[400]}30 0%, transparent 70%)`,
            borderRadius: '50%',
            top: '-40px',
            right: '60px',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            background: `radial-gradient(circle, ${theme.colors[300]}20 0%, transparent 70%)`,
            borderRadius: '50%',
            bottom: '-30px',
            left: '100px',
            pointerEvents: 'none',
          }} />
        </>
      )}

      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
        {/* Back button (if enabled) - 48px minimum touch target */}
        {showBack && (
          <button
            onClick={handleBack}
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              minHeight: '48px',
              background: getButtonBackground(),
              backdropFilter: visualStyle === 'glass' ? 'blur(12px)' : undefined,
              border: getButtonBorder(),
              borderRadius: visualStyle === 'bold' ? '12px' : '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: getButtonShadow(),
            }}
          >
            <ArrowLeft size={24} color={getIconColor()} />
          </button>
        )}

        {/* Custom left content OR default logo */}
        {leftContent ? (
          leftContent
        ) : (
          <>
            {/* Octili Logo */}
            <div style={getLogoStyle()}>
              <img
                src="/octili-icon.svg"
                alt="Octili"
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain',
                }}
              />
            </div>
            <div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: getHeaderTextColor(),
                textShadow: (visualStyle === 'glass' || visualStyle === 'bento') ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              }}>
                {title}
              </h1>
              <p style={{
                fontSize: '11px',
                color: getSubtextColor(),
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}>
                {subtitle}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Center Content (optional) */}
      {centerContent && (
        <div style={{ zIndex: 1 }}>
          {centerContent}
        </div>
      )}

      {/* Right Section: Balance + Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
        {/* Balance Card - Clickable - 48px minimum height */}
        <button
          onClick={handleBalanceClick}
          style={{
            background: getButtonBackground(),
            backdropFilter: visualStyle === 'glass' ? 'blur(12px)' : undefined,
            padding: '12px 20px',
            minHeight: '48px',
            borderRadius: visualStyle === 'bold' ? '12px' : '16px',
            border: getButtonBorder(),
            boxShadow: getButtonShadow(),
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'left',
          }}
        >
          <p style={{
            fontSize: '11px',
            color: visualStyle === 'bold' || (visualStyle === 'neumorphic' && !isDarkMode) || visualStyle === 'minimal'
              ? theme.colors[500]
              : 'rgba(255,255,255,0.75)',
            marginBottom: '2px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Balance
          </p>
          <p style={{
            fontSize: '18px',
            fontWeight: 800,
            color: visualStyle === 'bold' || (visualStyle === 'neumorphic' && !isDarkMode)
              ? theme.colors[700]
              : visualStyle === 'minimal'
              ? (isDarkMode ? '#f8fafc' : theme.colors[700])
              : 'white',
            fontFamily: 'ui-monospace, monospace',
          }}>
            {balance.toFixed(2)} <span style={{ fontSize: '12px', opacity: 0.8 }}>BRL</span>
          </p>
        </button>

        {/* Cart Button - Only visible when cart has items */}
        {cartCount > 0 && (
          <button
            onClick={() => navigate('/cart')}
            className="cart-glow-animation"
            style={{
              position: 'relative',
              width: '48px',
              height: '48px',
              minWidth: '48px',
              minHeight: '48px',
              background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
              backdropFilter: visualStyle === 'glass' ? 'blur(12px)' : undefined,
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: visualStyle === 'bold' ? '12px' : '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 20px rgba(36, 189, 104, 0.6), 0 4px 12px rgba(36, 189, 104, 0.4)',
              animation: 'cartPulse 2s ease-in-out infinite',
            }}
            title={`Cart (${cartCount} items)`}
          >
            <ShoppingCart size={22} color="white" strokeWidth={2.5} />
            {/* Badge showing count */}
            <div style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              minWidth: '22px',
              height: '22px',
              padding: '0 6px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 800,
              color: 'white',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
              border: '2px solid white',
            }}>
              {cartCount > 9 ? '9+' : cartCount}
            </div>
          </button>
        )}
      </div>
    </header>

    {/* Cart Glow Animation Styles */}
    <style>{`
      @keyframes cartPulse {
        0%, 100% {
          box-shadow: 0 0 20px rgba(36, 189, 104, 0.6), 0 4px 12px rgba(36, 189, 104, 0.4);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 30px rgba(36, 189, 104, 0.8), 0 6px 16px rgba(36, 189, 104, 0.6);
          transform: scale(1.05);
        }
      }
    `}</style>

    {/* Balance Details Modal */}
    {showBalanceModal && (
      <BalanceOverview
        pocketBalances={pocketBalances}
        isModal
        onClose={() => setShowBalanceModal(false)}
      />
    )}
    </>
  )
}
