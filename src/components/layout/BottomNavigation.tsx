/**
 * ============================================================================
 * BOTTOM NAVIGATION - LOTTERY POS TERMINAL
 * ============================================================================
 *
 * Purpose: Bottom navigation bar for the POS terminal
 * Based on SUMUS POS Terminal design
 *
 * Tabs: Games | Results | Menu | QR | Cart
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useNavigate } from 'react-router-dom'
import { LayoutGrid, Target, Menu, QrCode, ShoppingCart } from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'

// Brand colors
const BRAND = {
  green: '#24BD68',
  teal: '#00A77E',
  deepTeal: '#006E7E',
  darkBlue: '#28455B',
  charcoal: '#282E3A',
}

export type NavTab = 'games' | 'results' | 'menu' | 'qr' | 'cart'

interface BottomNavigationProps {
  activeTab: NavTab
}

interface NavItem {
  id: NavTab
  label: string
  icon: typeof LayoutGrid
  path: string
}

const navItems: NavItem[] = [
  { id: 'games', label: 'Games', icon: LayoutGrid, path: '/pos' },
  { id: 'results', label: 'Results', icon: Target, path: '/results' },
  { id: 'menu', label: 'Menu', icon: Menu, path: '/menu' },
  { id: 'qr', label: 'QR', icon: QrCode, path: '/qr' },
  { id: 'cart', label: 'Cart', icon: ShoppingCart, path: '/cart' },
]

export function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const navigate = useNavigate()
  const { cartTickets } = useGameStore()
  const cartCount = cartTickets.length

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: BRAND.darkBlue,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0',
      paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
      zIndex: 100,
    }}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id
        const Icon = item.icon

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              background: isActive ? BRAND.green : 'transparent',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
            }}
          >
            <Icon
              size={24}
              color={isActive ? 'white' : '#94a3b8'}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span style={{
              fontSize: '11px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'white' : '#94a3b8',
            }}>
              {item.label}
            </span>

            {/* Cart badge */}
            {item.id === 'cart' && cartCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '8px',
                width: '18px',
                height: '18px',
                background: '#ef4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                color: 'white',
              }}>
                {cartCount > 9 ? '9+' : cartCount}
              </div>
            )}
          </button>
        )
      })}
    </nav>
  )
}
