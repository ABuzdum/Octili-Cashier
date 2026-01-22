/**
 * ============================================================================
 * BOTTOM NAVIGATION - LOTTERY POS TERMINAL
 * ============================================================================
 *
 * Purpose: Clean bottom navigation bar for cashier terminals
 * Uses international, easy-to-understand naming for any cashier
 *
 * Tabs: Tickets | Results | Scan | QR Ticket
 *
 * Naming designed for clarity:
 * - Tickets = Main hub with QR Ticket and Draw Ticket options + games
 * - Results = View draw results
 * - Scan = Scan lottery tickets and instant cards for payout
 * - QR Ticket = Physical QR ticket operations
 *
 * @author Octili Development Team
 * @version 4.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Trophy, ScanLine, QrCode } from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'

export type NavTab = 'tickets' | 'results' | 'scan' | 'qrticket'

interface BottomNavigationProps {
  activeTab: NavTab
}

interface NavItem {
  id: NavTab
  label: string
  icon: typeof Grid
  path: string
  gradient: string
}

/**
 * Navigation items with clear, international naming
 * Each label is designed to be understood by any cashier worldwide
 */
const navItems: NavItem[] = [
  {
    id: 'tickets',
    label: 'Tickets',
    icon: Grid,
    path: '/pos',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'results',
    label: 'Results',
    icon: Trophy,
    path: '/results',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'scan',
    label: 'Scan',
    icon: ScanLine,
    path: '/payment',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    id: 'qrticket',
    label: 'QR Ticket',
    icon: QrCode,
    path: '/qr-ticket',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },
]

export function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const navigate = useNavigate()
  const { cartTickets } = useGameStore()
  const cartCount = cartTickets.length
  const [hoveredTab, setHoveredTab] = useState<NavTab | null>(null)

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '12px 8px',
      paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
      zIndex: 100,
    }}>
      {navItems.map((item) => {
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
              gap: '4px',
              padding: '10px 16px',
              background: isActive ? item.gradient : isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              transform: isActive ? 'scale(1.05)' : isHovered ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isActive ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
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
                color={isActive ? 'white' : isHovered ? '#e2e8f0' : '#94a3b8'}
                strokeWidth={isActive ? 2.5 : 2}
                style={{
                  transition: 'all 0.3s ease',
                  filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
                }}
              />

              {/* Cart badge on Tickets tab */}
              {item.id === 'tickets' && cartCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
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
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                  border: '2px solid #1e293b',
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </div>
              )}
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'white' : isHovered ? '#e2e8f0' : '#94a3b8',
              transition: 'all 0.3s ease',
              letterSpacing: isActive ? '0.3px' : '0',
            }}>
              {item.label}
            </span>

            {/* Active indicator dot */}
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '4px',
                height: '4px',
                background: 'white',
                borderRadius: '50%',
                boxShadow: '0 0 8px rgba(255,255,255,0.6)',
              }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
