/**
 * ============================================================================
 * CART PAGE - PENDING LOTTERY TICKETS
 * ============================================================================
 *
 * Purpose: Beautiful cart management for pending lottery tickets
 * Designed for VLT terminals and player-facing displays
 *
 * Features:
 * - Stunning list of pending tickets with game gradients
 * - Animated remove and clear actions
 * - Beautiful purchase confirmation
 * - Total calculation with elegant display
 *
 * @author Octili Development Team
 * @version 2.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Trash2,
  ShoppingCart,
  Check,
  AlertTriangle,
  CheckCircle2,
  Ticket,
  Sparkles,
  X,
  Wallet,
} from 'lucide-react'
import { useGameStore, useLotteryGames } from '@/stores/gameStore'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { PaymentMethodSelector, PAYMENT_METHOD_CONFIG } from '@/components/shared/PaymentMethodSelector'
import type { CartTicket, LotteryGame, PaymentMethod } from '@/types/game.types'

// Game gradients matching POSPage
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
 * Individual cart ticket item component with beautiful design
 */
function CartTicketItem({
  ticket,
  game,
  gameIndex,
  onRemove,
  isHovered,
  onHover,
}: {
  ticket: CartTicket
  game: LotteryGame | undefined
  gameIndex: number
  onRemove: () => void
  isHovered: boolean
  onHover: (hovered: boolean) => void
}) {
  const gradient = GAME_GRADIENTS[gameIndex % GAME_GRADIENTS.length]

  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: isHovered
          ? '0 12px 32px rgba(0,0,0,0.12)'
          : '0 4px 16px rgba(0,0,0,0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
      }}>
        {/* Game Color Bar */}
        <div style={{
          width: '6px',
          background: gradient,
        }} />

        <div style={{
          flex: 1,
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          {/* Game Icon */}
          <div style={{
            width: '52px',
            height: '52px',
            background: gradient,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            {game?.icon || '🎰'}
          </div>

          {/* Ticket Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              {game?.name || 'Unknown Game'}
              {isHovered && <Sparkles size={14} color="#f59e0b" />}
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '6px',
            }}>
              {ticket.bet.selections.slice(0, 5).map((market, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '4px 8px',
                    background: `${gradient.includes('#667eea') ? '#667eea' : gradient.split(',')[1].split(' ')[1]}15`,
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#475569',
                  }}
                >
                  {market}
                </span>
              ))}
              {ticket.bet.selections.length > 5 && (
                <span style={{
                  padding: '4px 8px',
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748b',
                }}>
                  +{ticket.bet.selections.length - 5}
                </span>
              )}
            </div>
            <p style={{
              fontSize: '12px',
              color: '#64748b',
            }}>
              {ticket.bet.numberOfDraws} draw{ticket.bet.numberOfDraws > 1 ? 's' : ''} × {ticket.bet.betAmount} USD
            </p>
          </div>

          {/* Price and Remove */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: 700,
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {ticket.bet.totalCost.toFixed(2)} USD
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              style={{
                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                minHeight: '44px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#ef4444',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CartPage() {
  const navigate = useNavigate()
  const games = useLotteryGames()
  const { cartTickets, removeFromCart, clearCart, purchaseCart, getCartTotal } = useGameStore()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false)
  const [purchasedAmount, setPurchasedAmount] = useState(0)
  const [hoveredTicket, setHoveredTicket] = useState<string | null>(null)
  /** Payment method selection state */
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash')

  const cartTotal = getCartTotal()

  // Get game by ID
  const getGame = (gameId: string): LotteryGame | undefined => {
    return games.find(g => g.id === gameId)
  }

  // Get game index for gradient
  const getGameIndex = (gameId: string): number => {
    return games.findIndex(g => g.id === gameId)
  }

  /**
   * Handle purchase button click - shows payment method selection modal
   */
  const handlePurchaseAll = () => {
    if (cartTickets.length === 0) return
    setShowPaymentModal(true)
  }

  /**
   * Confirm purchase with selected payment method
   * This is called after the operator selects how the customer is paying
   */
  const handleConfirmPurchase = () => {
    setPurchasedAmount(cartTotal)
    purchaseCart(selectedPaymentMethod)
    setShowPaymentModal(false)
    setShowPurchaseSuccess(true)
    setTimeout(() => {
      setShowPurchaseSuccess(false)
      navigate('/games')
    }, 2000)
  }

  // Handle clear cart
  const handleClearCart = () => {
    clearCart()
    setShowClearConfirm(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* AppHeader with balance and menu */}
      <AppHeader
        showBack
        backPath="/games"
        title="My Cart"
        subtitle={`${cartTickets.length} ticket${cartTickets.length !== 1 ? 's' : ''}`}
      />

      {/* Cart Actions Bar */}
      {cartTickets.length > 0 && (
        <div style={{
          background: '#ffffff',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <ShoppingCart size={20} color="#64748b" />
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1e293b',
            }}>
              {cartTickets.length} ticket{cartTickets.length !== 1 ? 's' : ''} in cart
            </span>
          </div>
          <button
            onClick={() => setShowClearConfirm(true)}
            style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 18px',
              minHeight: '44px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <Trash2 size={18} />
            Clear All
          </button>
        </div>
      )}

      {/* Cart Content */}
      <div style={{
        flex: 1,
        padding: '20px',
        paddingBottom: cartTickets.length > 0 ? '200px' : '100px',
        overflow: 'auto',
      }}>
        {cartTickets.length === 0 ? (
          // Empty Cart State
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              borderRadius: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 16px 48px rgba(250, 112, 154, 0.3)',
            }}>
              <Ticket size={48} color="white" />
            </div>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '8px',
            }}>
              Your cart is empty
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '32px',
              maxWidth: '280px',
            }}>
              Add lottery tickets to your cart by selecting numbers in any game
            </p>
            <button
              onClick={() => navigate('/games')}
              style={{
                padding: '16px 32px',
                minHeight: '56px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Sparkles size={22} />
              Browse Games
            </button>
          </div>
        ) : (
          // Cart Items
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            {cartTickets.map((ticket) => (
              <CartTicketItem
                key={ticket.id}
                ticket={ticket}
                game={getGame(ticket.bet.gameId)}
                gameIndex={getGameIndex(ticket.bet.gameId)}
                onRemove={() => removeFromCart(ticket.id)}
                isHovered={hoveredTicket === ticket.id}
                onHover={(hovered) => setHoveredTicket(hovered ? ticket.id : null)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Purchase Footer */}
      {cartTickets.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '70px',
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '20px',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
          zIndex: 50,
        }}>
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <span style={{
                fontSize: '14px',
                color: '#94a3b8',
              }}>
                {cartTickets.length} ticket{cartTickets.length > 1 ? 's' : ''}
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
              }}>
                <span style={{
                  fontSize: '14px',
                  color: '#94a3b8',
                }}>
                  Total:
                </span>
                <span style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {cartTotal.toFixed(2)} USD
                </span>
              </div>
            </div>
            <button
              onClick={handlePurchaseAll}
              style={{
                width: '100%',
                padding: '18px',
                minHeight: '60px',
                background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Check size={24} />
              Purchase All Tickets
            </button>
          </div>
        </div>
      )}

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '340px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(251, 191, 36, 0.3)',
            }}>
              <AlertTriangle size={36} color="#f59e0b" />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '8px',
            }}>
              Clear Cart?
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '28px',
            }}>
              This will remove all {cartTickets.length} ticket{cartTickets.length > 1 ? 's' : ''} from your cart.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
            }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{
                  flex: 1,
                  padding: '16px',
                  minHeight: '52px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                style={{
                  flex: 1,
                  padding: '16px',
                  minHeight: '52px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Selection Modal */}
      {showPaymentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPaymentModal(false)
            }
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(36, 189, 104, 0.3)',
                  }}
                >
                  <Wallet size={24} color="white" />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1e293b',
                      margin: 0,
                    }}
                  >
                    Payment Method
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      margin: 0,
                    }}
                  >
                    How is the customer paying?
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#f1f5f9',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Total Amount Display */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative circle */}
              <div
                style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '50%',
                  top: '-20px',
                  right: '-20px',
                }}
              />
              <p
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: '4px',
                }}
              >
                Total to Pay
              </p>
              <p
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: 'white',
                  fontFamily: 'ui-monospace, monospace',
                  letterSpacing: '-1px',
                }}
              >
                {cartTotal.toFixed(2)}{' '}
                <span style={{ fontSize: '16px', fontWeight: 500, opacity: 0.7 }}>USD</span>
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '4px',
                }}
              >
                {cartTickets.length} ticket{cartTickets.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Payment Method Selector */}
            <PaymentMethodSelector
              selected={selectedPaymentMethod}
              onSelect={setSelectedPaymentMethod}
            />

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPurchase}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '18px',
                minHeight: '60px',
                background: selectedPaymentMethod
                  ? PAYMENT_METHOD_CONFIG[selectedPaymentMethod].gradient
                  : 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '17px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: selectedPaymentMethod
                  ? `0 8px 24px ${PAYMENT_METHOD_CONFIG[selectedPaymentMethod].color}40`
                  : '0 8px 24px rgba(36, 189, 104, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              <Check size={24} />
              Confirm {PAYMENT_METHOD_CONFIG[selectedPaymentMethod].label} Payment
            </button>
          </div>
        </div>
      )}

      {/* Purchase Success Modal */}
      {showPurchaseSuccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '340px',
            width: '100%',
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              width: '88px',
              height: '88px',
              background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
            }}>
              <CheckCircle2 size={48} color="white" />
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '12px',
            }}>
              Purchase Complete!
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
            }}>
              <span style={{
                fontWeight: 700,
                background: PAYMENT_METHOD_CONFIG[selectedPaymentMethod].gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {purchasedAmount.toFixed(2)} USD
              </span>
              {' '}added to {PAYMENT_METHOD_CONFIG[selectedPaymentMethod].label}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#94a3b8',
              marginTop: '8px',
            }}>
              Good luck!
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="cart" />
    </div>
  )
}
