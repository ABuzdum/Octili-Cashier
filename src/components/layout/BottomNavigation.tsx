/**
 * ============================================================================
 * BOTTOM NAVIGATION - LOTTERY POS TERMINAL
 * ============================================================================
 *
 * Purpose: Beautiful bottom navigation bar for cashier terminals
 * Design: Octili brand with Montserrat font, clean white background
 *
 * Layout: QR Tickets | Draw Games (large) | Draw Results | (divider) | Payout
 *
 * @author Octili Development Team
 * @version 7.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ticket, Trophy, ShoppingCart, CreditCard, Settings, Tv, User, Receipt, DollarSign, Monitor, QrCode, Banknote, Sliders } from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'

export type NavTab = 'games' | 'results' | 'qrticket-sell' | 'qrticket-payout' | 'cart' | 'checkout' | 'transactions' | 'settings' | 'tvbox' | 'account' | 'newticket' | 'payout' | 'seconddisplay' | 'menu'

interface BottomNavigationProps {
  activeTab: NavTab
}

interface NavItem {
  id: NavTab
  label: string
  icon: typeof Ticket
  path: string
  color: string
  activeColor: string
}

/**
 * QR Tickets button - PRIMARY main page of the system
 */
const qrTicketsItem: NavItem = {
  id: 'qrticket-sell',
  label: 'QR Tickets',
  icon: QrCode,
  path: '/physical-ticket/new',
  color: '#24BD68',
  activeColor: '#00A77E',
}

/**
 * Draw Games & Draw Results - middle section
 */
const drawNavItems: NavItem[] = [
  {
    id: 'games',
    label: 'Draw Games',
    icon: Ticket,
    path: '/games',
    color: '#8b5cf6',
    activeColor: '#7c3aed',
  },
  {
    id: 'results',
    label: 'Draw Results',
    icon: Trophy,
    path: '/results',
    color: '#f59e0b',
    activeColor: '#d97706',
  },
]

/**
 * Payout button - unified payout for both QR and Draw tickets
 */
const payoutItem: NavItem = {
  id: 'payout',
  label: 'Payout',
  icon: Banknote,
  path: '/payout',
  color: '#f59e0b',
  activeColor: '#d97706',
}

/**
 * Control Center button - operator menu for shift & operations
 */
const controlCenterItem: NavItem = {
  id: 'menu',
  label: 'Control',
  icon: Sliders,
  path: '/menu',
  color: '#28455B',
  activeColor: '#1e293b',
}

/**
 * Legacy navigation items - pages not currently in main navigation
 * These are shown after a red divider for visibility during development
 */
const legacyNavItems: NavItem[] = [
  {
    id: 'cart',
    label: 'Cart',
    icon: ShoppingCart,
    path: '/cart',
    color: '#64748b',
    activeColor: '#475569',
  },
  {
    id: 'checkout',
    label: 'Checkout',
    icon: CreditCard,
    path: '/checkout',
    color: '#64748b',
    activeColor: '#475569',
  },
  {
    id: 'transactions',
    label: 'Trans',
    icon: Receipt,
    path: '/transactions',
    color: '#64748b',
    activeColor: '#475569',
  },
  {
    id: 'payout',
    label: 'Payout',
    icon: DollarSign,
    path: '/payment',
    color: '#64748b',
    activeColor: '#475569',
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    path: '/account',
    color: '#64748b',
    activeColor: '#475569',
  },
  {
    id: 'tvbox',
    label: 'TV Box',
    icon: Tv,
    path: '/tvbox-control',
    color: '#64748b',
    activeColor: '#475569',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    color: '#64748b',
    activeColor: '#475569',
  },
  {
    id: 'seconddisplay',
    label: '2nd Disp',
    icon: Monitor,
    path: '/second-display',
    color: '#64748b',
    activeColor: '#475569',
  },
]

export function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const navigate = useNavigate()
  const { cartTickets } = useGameStore()
  const cartCount = cartTickets.length
  const [hoveredTab, setHoveredTab] = useState<NavTab | null>(null)

  /**
   * Render a standard navigation button
   */
  const renderNavButton = (item: NavItem, options: { large?: boolean; showBadge?: boolean } = {}) => {
    const { large = false, showBadge = false } = options
    const isActive = activeTab === item.id
    const isHovered = hoveredTab === item.id
    const Icon = item.icon

    return (
      <button
        key={item.id}
        onClick={() => navigate(item.path)}
        onMouseEnter={() => setHoveredTab(item.id)}
        onMouseLeave={() => setHoveredTab(null)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: large ? '6px' : '4px',
          padding: large ? '12px 24px' : '10px 14px',
          minWidth: large ? '90px' : '64px',
          minHeight: large ? '64px' : '56px',
          background: isActive
            ? `linear-gradient(135deg, ${item.color} 0%, ${item.activeColor} 100%)`
            : isHovered
            ? `${item.color}15`
            : 'transparent',
          border: 'none',
          borderRadius: large ? '16px' : '14px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative',
          transform: isActive ? 'scale(1.02)' : 'scale(1)',
          boxShadow: isActive ? `0 4px 12px ${item.color}40` : 'none',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon
            size={large ? 28 : 24}
            color={isActive ? 'white' : isHovered ? item.color : '#64748b'}
            strokeWidth={isActive ? 2.5 : 2}
            style={{
              transition: 'all 0.2s ease',
              filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
            }}
          />

          {/* Cart badge */}
          {showBadge && cartCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-12px',
              minWidth: '20px',
              height: '20px',
              padding: '0 6px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'Montserrat, sans-serif',
              color: 'white',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
              border: '2px solid white',
            }}>
              {cartCount > 9 ? '9+' : cartCount}
            </div>
          )}
        </div>

        <span style={{
          fontSize: large ? '13px' : '11px',
          fontWeight: isActive ? 700 : 600,
          fontFamily: 'Montserrat, sans-serif',
          color: isActive ? 'white' : isHovered ? item.color : '#64748b',
          transition: 'all 0.2s ease',
          letterSpacing: '0.1px',
          whiteSpace: 'nowrap',
        }}>
          {item.label}
        </span>
      </button>
    )
  }

  return (
    <nav
      className="bottom-nav-container"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '10px 16px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        zIndex: 100,
        gap: '6px',
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
      {/* QR Tickets - PRIMARY main page (large button) */}
      {renderNavButton(qrTicketsItem, { large: true })}

      {/* Vertical Divider - separates QR Tickets from Draw Games */}
      <div style={{
        width: '2px',
        height: '56px',
        background: 'linear-gradient(180deg, transparent 0%, #24BD68 20%, #24BD68 80%, transparent 100%)',
        margin: '0 12px',
        borderRadius: '1px',
        boxShadow: '0 0 6px rgba(36, 189, 104, 0.3)',
        flexShrink: 0,
      }} />

      {/* Draw Games & Draw Results Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
      }}>
        {drawNavItems.map((item) => renderNavButton(item))}
      </div>

      {/* Vertical Divider before Payout */}
      <div style={{
        width: '2px',
        height: '56px',
        background: 'linear-gradient(180deg, transparent 0%, #e2e8f0 20%, #e2e8f0 80%, transparent 100%)',
        margin: '0 12px',
        borderRadius: '1px',
        flexShrink: 0,
      }} />

      {/* Payout - Single button */}
      {renderNavButton(payoutItem)}

      {/* Control Center - Operator menu */}
      {renderNavButton(controlCenterItem)}

      {/* Red Vertical Divider - Legacy Section */}
      <div style={{
        width: '2px',
        height: '36px',
        background: 'linear-gradient(180deg, transparent 0%, #ef4444 20%, #ef4444 80%, transparent 100%)',
        margin: '0 6px',
        borderRadius: '1px',
        boxShadow: '0 0 6px rgba(239, 68, 68, 0.3)',
        flexShrink: 0,
      }} />

      {/* Legacy Label */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '4px',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '7px',
          fontWeight: 700,
          fontFamily: 'Montserrat, sans-serif',
          color: '#ef4444',
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
        }}>
          Legacy
        </span>
      </div>

      {/* Legacy Section: Hidden pages */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        opacity: 0.7,
      }}>
        {legacyNavItems.map((item) => renderNavButton(item))}
      </div>
    </nav>
  )
}
