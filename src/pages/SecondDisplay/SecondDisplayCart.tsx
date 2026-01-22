/**
 * ============================================================================
 * SECOND DISPLAY CART - LIVE CART VIEW FOR PLAYER DISPLAY
 * ============================================================================
 *
 * Purpose: Shows the current cart contents on the second display (player-facing).
 * Displays all pending tickets and total amount in a beautiful, read-only format.
 *
 * Features:
 * - Real-time sync with main cashier display
 * - Beautiful ticket card display with game details
 * - Running total prominently displayed
 * - Animated updates when cart changes
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { ArrowLeft, ShoppingCart, Ticket, Sparkles, CreditCard } from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'
import type { CartTicket } from '@/types/game.types'
import type { DisplayMessageType, DisplayMessagePayload } from '@/hooks/useBroadcastSync'

/**
 * Game gradients - matching the main display
 */
const GAME_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
]

/**
 * Get gradient by game ID
 */
function getGradientByGameId(gameId: string): string {
  const index = parseInt(gameId.replace('game-', '') || '0') - 1
  return GAME_GRADIENTS[Math.abs(index) % GAME_GRADIENTS.length]
}

/**
 * Props for SecondDisplayCart component
 */
interface SecondDisplayCartProps {
  /** Callback to go back to games list */
  onBack: () => void
  /** Function to send messages to main display */
  sendMessage: (type: DisplayMessageType, payload?: DisplayMessagePayload) => void
}

/**
 * Cart ticket item component
 */
function CartTicketItem({ ticket, index }: { ticket: CartTicket; index: number }) {
  const gradient = getGradientByGameId(ticket.bet.gameId)

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        animation: `slideIn 0.3s ease-out ${index * 0.1}s both`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        {/* Game Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            background: gradient,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flexShrink: 0,
          }}
        >
          {ticket.bet.gameType === 'keno'
            ? '🎱'
            : ticket.bet.gameType === 'roulette'
            ? '🎰'
            : '🎈'}
        </div>

        {/* Ticket Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '8px',
            }}
          >
            {ticket.bet.gameName}
          </h3>

          {/* Selections */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            {ticket.bet.selections.slice(0, 6).map((selection) => (
              <span
                key={selection}
                style={{
                  padding: '4px 10px',
                  background: gradient,
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {selection}
              </span>
            ))}
            {ticket.bet.selections.length > 6 && (
              <span
                style={{
                  padding: '4px 10px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                +{ticket.bet.selections.length - 6}
              </span>
            )}
          </div>

          {/* Bet Details */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                color: '#64748b',
              }}
            >
              {ticket.bet.numberOfDraws} draw{ticket.bet.numberOfDraws > 1 ? 's' : ''} ×{' '}
              {ticket.bet.betAmount} BRL
            </span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                background: gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {ticket.bet.totalCost.toFixed(2)} BRL
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Empty cart state component
 */
function EmptyCartState({ onBack }: { onBack: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          borderRadius: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <ShoppingCart size={56} color="#94a3b8" />
      </div>

      <h2
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '12px',
        }}
      >
        Your Cart is Empty
      </h2>

      <p
        style={{
          fontSize: '16px',
          color: '#64748b',
          marginBottom: '32px',
          maxWidth: '300px',
        }}
      >
        Select a game and add tickets to your cart to see them here
      </p>

      <button
        onClick={onBack}
        style={{
          padding: '16px 40px',
          background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '18px',
          fontSize: '17px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(36, 189, 104, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.2s',
        }}
      >
        <Sparkles size={20} />
        Browse Games
      </button>
    </div>
  )
}

/**
 * Second Display Cart Component
 *
 * Shows all pending tickets in the cart with a prominent total.
 * Read-only view - players see what's being purchased.
 */
export function SecondDisplayCart({ onBack, sendMessage }: SecondDisplayCartProps) {
  const { cartTickets, getCartTotal } = useGameStore()
  const total = getCartTotal()

  // If cart is empty
  if (cartTickets.length === 0) {
    return <EmptyCartState onBack={onBack} />
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            width: '180px',
            height: '180px',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '50%',
            top: '-70px',
            right: '-50px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '50%',
            bottom: '-50px',
            left: '15%',
          }}
        />

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            color: 'white',
            zIndex: 1,
          }}
        >
          <ArrowLeft size={22} />
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <h1
            style={{
              color: 'white',
              fontSize: '22px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <ShoppingCart size={24} />
            My Cart
          </h1>
        </div>

        {/* Item count */}
        <div
          style={{
            background: 'white',
            color: '#f59e0b',
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '15px',
            zIndex: 1,
          }}
        >
          {cartTickets.length} item{cartTickets.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Cart Items */}
      <div
        style={{
          flex: 1,
          padding: '24px',
          overflow: 'auto',
          paddingBottom: '180px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {cartTickets.map((ticket, index) => (
            <CartTicketItem key={ticket.id} ticket={ticket} index={index} />
          ))}
        </div>
      </div>

      {/* Total Footer */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '24px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          boxShadow: '0 -12px 48px rgba(0,0,0,0.12)',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {/* Summary */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '2px dashed #e2e8f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Ticket size={20} color="#64748b" />
              <span
                style={{
                  fontSize: '16px',
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                {cartTickets.length} Ticket{cartTickets.length !== 1 ? 's' : ''}
              </span>
            </div>
            <span
              style={{
                fontSize: '15px',
                color: '#94a3b8',
              }}
            >
              Total to pay
            </span>
          </div>

          {/* Total Amount */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <CreditCard size={32} color="#24BD68" />
            <span
              style={{
                fontSize: '42px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-1px',
              }}
            >
              {total.toFixed(2)} BRL
            </span>
          </div>

          {/* Payment hint */}
          <p
            style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '14px',
              color: '#94a3b8',
            }}
          >
            Please proceed to the cashier to complete your purchase
          </p>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default SecondDisplayCart
