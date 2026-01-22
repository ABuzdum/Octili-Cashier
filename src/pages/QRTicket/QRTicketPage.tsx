/**
 * ============================================================================
 * QR TICKET HUB PAGE - TICKET & ACCOUNT OPERATIONS
 * ============================================================================
 *
 * Purpose: Hub page for ticket-related operations accessed from bottom navigation.
 * Provides quick access to Physical Ticket, QR Ticket, and Account features.
 *
 * Features:
 * - Physical Ticket: Issue and payout physical lottery tickets with QR codes
 * - QR Ticket: Scan QR codes for instant ticket operations
 * - Account: Player account management (deposit/withdraw)
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ticket, QrCode, Wallet, ArrowRight, Sparkles } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNavigation } from '@/components/layout/BottomNavigation'

/**
 * Menu option card component
 */
function OptionCard({
  icon: Icon,
  title,
  description,
  gradient,
  onClick,
}: {
  icon: typeof Ticket
  title: string
  description: string
  gradient: string
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: isHovered
          ? '0 12px 32px rgba(0,0,0,0.12)'
          : '0 4px 16px rgba(0,0,0,0.06)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient on hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: gradient,
          opacity: isHovered ? 0.05 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: '64px',
          height: '64px',
          background: gradient,
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          transform: isHovered ? 'scale(1.05) rotate(-3deg)' : 'scale(1) rotate(0deg)',
          transition: 'transform 0.3s ease',
        }}
      >
        <Icon size={28} color="white" strokeWidth={2} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '6px',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: '#64748b',
            lineHeight: 1.4,
          }}
        >
          {description}
        </p>
      </div>

      {/* Arrow */}
      <div
        style={{
          width: '40px',
          height: '40px',
          background: isHovered ? gradient : '#f1f5f9',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.3s ease',
        }}
      >
        <ArrowRight
          size={20}
          color={isHovered ? 'white' : '#94a3b8'}
          style={{
            transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>

      {/* Sparkle on hover */}
      {isHovered && (
        <Sparkles
          size={16}
          color="#f59e0b"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
          }}
        />
      )}
    </button>
  )
}

/**
 * QRTicketPage Component
 *
 * Hub page for ticket and account operations.
 * Accessible from the bottom navigation "QR Ticket" tab.
 */
export function QRTicketPage() {
  const navigate = useNavigate()

  const options = [
    {
      icon: Ticket,
      title: 'Physical Ticket',
      description: 'Issue new tickets with deposit or pay out existing tickets',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      onClick: () => navigate('/physical-ticket/new'),
    },
    {
      icon: QrCode,
      title: 'QR Ticket',
      description: 'Scan QR codes to check and pay out lottery tickets',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      onClick: () => navigate('/physical-ticket/payout'),
    },
    {
      icon: Wallet,
      title: 'Account',
      description: 'Player account operations - deposit and withdraw funds',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      onClick: () => navigate('/account'),
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* AppHeader with balance and menu */}
      <AppHeader
        title="QR Ticket"
        subtitle="Ticket and account operations"
      />

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '24px 20px',
          paddingBottom: '120px',
        }}
      >
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {options.map((option) => (
            <OptionCard
              key={option.title}
              icon={option.icon}
              title={option.title}
              description={option.description}
              gradient={option.gradient}
              onClick={option.onClick}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="sellticket" />
    </div>
  )
}

export default QRTicketPage
