/**
 * ============================================================================
 * BOTTOM NAVIGATION - LOTTERY POS TERMINAL
 * ============================================================================
 *
 * Purpose: Beautiful bottom navigation bar for cashier terminals
 * Design: Octili brand with Montserrat font, clean white background
 *
 * Layout: Draw | Results | (divider) | Sell Ticket | Top Up
 *
 * @author Octili Development Team
 * @version 6.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ticket, Trophy, ShoppingBag, Wallet, ShoppingCart, CreditCard, FileText, Settings, Tv, User, Receipt, DollarSign, Monitor } from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'

export type NavTab = 'draw' | 'results' | 'sellticket' | 'topup' | 'cart' | 'checkout' | 'transactions' | 'settings' | 'tvbox' | 'account' | 'newticket' | 'payout' | 'seconddisplay'

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
 * Left navigation items: Draw & Results
 */
const leftNavItems: NavItem[] = [
  {
    id: 'draw',
    label: 'Draw',
    icon: Ticket,
    path: '/pos',
    color: '#8b5cf6',
    activeColor: '#7c3aed',
  },
  {
    id: 'results',
    label: 'Results',
    icon: Trophy,
    path: '/results',
    color: '#f59e0b',
    activeColor: '#d97706',
  },
]

/**
 * Right navigation items: Sell Ticket & Top Up
 */
const rightNavItems: NavItem[] = [
  {
    id: 'sellticket',
    label: 'Sell Ticket',
    icon: ShoppingBag,
    path: '/qr-ticket',
    color: '#10b981',
    activeColor: '#059669',
  },
  {
    id: 'topup',
    label: 'Top Up',
    icon: Wallet,
    path: '/qr-ticket',
    color: '#3b82f6',
    activeColor: '#2563eb',
  },
]

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

  const renderNavButton = (item: NavItem, showBadge: boolean = false) => {
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
          gap: '6px',
          padding: '10px 16px',
          background: isActive
            ? `linear-gradient(135deg, ${item.color} 0%, ${item.activeColor} 100%)`
            : isHovered
            ? `${item.color}15`
            : 'transparent',
          border: 'none',
          borderRadius: '14px',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          transform: isActive ? 'scale(1.05)' : isHovered ? 'scale(1.02)' : 'scale(1)',
          boxShadow: isActive ? `0 6px 20px ${item.color}40` : 'none',
          minWidth: '70px',
        }}
      >
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon
            size={22}
            color={isActive ? 'white' : isHovered ? item.color : '#64748b'}
            strokeWidth={isActive ? 2.5 : 2}
            style={{
              transition: 'all 0.3s ease',
              filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
            }}
          />

          {/* Cart badge */}
          {showBadge && cartCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-12px',
              minWidth: '18px',
              height: '18px',
              padding: '0 5px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
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
          fontSize: '11px',
          fontWeight: isActive ? 700 : 600,
          fontFamily: 'Montserrat, sans-serif',
          color: isActive ? 'white' : isHovered ? item.color : '#64748b',
          transition: 'all 0.3s ease',
          letterSpacing: '0.2px',
          whiteSpace: 'nowrap',
        }}>
          {item.label}
        </span>
      </button>
    )
  }

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '8px 16px',
      paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
      borderTop: '1px solid rgba(0,0,0,0.05)',
      zIndex: 100,
      gap: '4px',
    }}>
      {/* Left Section: Draw & Results */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        {leftNavItems.map((item) => renderNavButton(item, item.id === 'draw'))}
      </div>

      {/* Vertical Divider */}
      <div style={{
        width: '2px',
        height: '44px',
        background: 'linear-gradient(180deg, transparent 0%, #e2e8f0 20%, #e2e8f0 80%, transparent 100%)',
        margin: '0 12px',
        borderRadius: '1px',
      }} />

      {/* Right Section: Sell Ticket & Top Up */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        {rightNavItems.map((item) => renderNavButton(item))}
      </div>

      {/* Red Vertical Divider - Legacy Section */}
      <div style={{
        width: '3px',
        height: '44px',
        background: 'linear-gradient(180deg, transparent 0%, #ef4444 20%, #ef4444 80%, transparent 100%)',
        margin: '0 12px',
        borderRadius: '2px',
        boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)',
      }} />

      {/* Legacy Label */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '8px',
      }}>
        <span style={{
          fontSize: '8px',
          fontWeight: 700,
          fontFamily: 'Montserrat, sans-serif',
          color: '#ef4444',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
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
