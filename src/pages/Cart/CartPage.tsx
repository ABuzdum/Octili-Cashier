/**
 * ============================================================================
 * CART PAGE - PENDING LOTTERY TICKETS
 * ============================================================================
 *
 * Purpose: Display and manage pending lottery tickets in cart
 * Based on SUMUS POS Terminal design
 *
 * Features:
 * - List of pending tickets with game info
 * - Remove individual tickets
 * - Clear entire cart
 * - Purchase all tickets at once
 * - Total calculation
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, ShoppingCart, X, Check } from 'lucide-react'
import { useGameStore, useLotteryGames } from '@/stores/gameStore'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import type { CartTicket, LotteryGame } from '@/types/game.types'

// Brand colors
const BRAND = {
  green: '#24BD68',
  teal: '#00A77E',
  deepTeal: '#006E7E',
  darkBlue: '#28455B',
  charcoal: '#282E3A',
}

/**
 * Individual cart ticket item component
 */
function CartTicketItem({
  ticket,
  game,
  onRemove,
}: {
  ticket: CartTicket
  game: LotteryGame | undefined
  onRemove: () => void
}) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      {/* Game Icon */}
      <div style={{
        width: '48px',
        height: '48px',
        background: `linear-gradient(135deg, ${BRAND.deepTeal}20, ${BRAND.green}20)`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        flexShrink: 0,
      }}>
        {game?.type === 'keno' ? '🎱' : game?.type === 'roulette' ? '🎰' : '🎈'}
      </div>

      {/* Ticket Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 700,
          color: BRAND.charcoal,
          marginBottom: '4px',
        }}>
          {game?.name || 'Unknown Game'}
        </h3>
        <p style={{
          fontSize: '12px',
          color: '#64748b',
          marginBottom: '2px',
        }}>
          Selection: {ticket.bet.selectedMarkets.join(', ')}
        </p>
        <p style={{
          fontSize: '12px',
          color: '#64748b',
        }}>
          {ticket.bet.numberOfDraws} draw{ticket.bet.numberOfDraws > 1 ? 's' : ''} × {ticket.bet.betAmount} BRL
        </p>
      </div>

      {/* Price and Remove */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
      }}>
        <span style={{
          fontSize: '16px',
          fontWeight: 700,
          color: BRAND.green,
        }}>
          {ticket.totalCost.toFixed(2)} BRL
        </span>
        <button
          onClick={onRemove}
          style={{
            background: '#fee2e2',
            border: 'none',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Trash2 size={16} color="#ef4444" />
        </button>
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

  const cartTotal = getCartTotal()

  // Get game by ID
  const getGame = (gameId: string): LotteryGame | undefined => {
    return games.find(g => g.id === gameId)
  }

  // Handle purchase all
  const handlePurchaseAll = () => {
    if (cartTickets.length === 0) return
    setPurchasedAmount(cartTotal)
    purchaseCart()
    setShowPurchaseSuccess(true)
    setTimeout(() => {
      setShowPurchaseSuccess(false)
      navigate('/pos')
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
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/pos')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: BRAND.darkBlue,
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: BRAND.charcoal,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <ShoppingCart size={20} />
            Cart
            {cartTickets.length > 0 && (
              <span style={{
                background: BRAND.green,
                color: 'white',
                fontSize: '12px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
              }}>
                {cartTickets.length}
              </span>
            )}
          </h1>
        </div>

        {cartTickets.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            style={{
              background: '#fee2e2',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ef4444',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <Trash2 size={16} />
            Clear
          </button>
        )}
      </div>

      {/* Cart Content */}
      <div style={{
        flex: 1,
        padding: '16px',
        paddingBottom: '180px', // Space for footer and bottom nav
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
              width: '80px',
              height: '80px',
              background: '#f1f5f9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <ShoppingCart size={40} color="#94a3b8" />
            </div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: BRAND.charcoal,
              marginBottom: '8px',
            }}>
              Your cart is empty
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '24px',
            }}>
              Add lottery tickets to your cart to purchase them
            </p>
            <button
              onClick={() => navigate('/pos')}
              style={{
                padding: '12px 24px',
                background: BRAND.green,
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Browse Games
            </button>
          </div>
        ) : (
          // Cart Items
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            {cartTickets.map((ticket) => (
              <CartTicketItem
                key={ticket.id}
                ticket={ticket}
                game={getGame(ticket.gameId)}
                onRemove={() => removeFromCart(ticket.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Purchase Footer */}
      {cartTickets.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '70px', // Above bottom nav
          left: 0,
          right: 0,
          background: 'white',
          padding: '16px',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
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
              marginBottom: '12px',
            }}>
              <span style={{
                fontSize: '14px',
                color: '#64748b',
              }}>
                {cartTickets.length} ticket{cartTickets.length > 1 ? 's' : ''}
              </span>
              <span style={{
                fontSize: '20px',
                fontWeight: 700,
                color: BRAND.charcoal,
              }}>
                Total: <span style={{ color: BRAND.green }}>{cartTotal.toFixed(2)} BRL</span>
              </span>
            </div>
            <button
              onClick={handlePurchaseAll}
              style={{
                width: '100%',
                padding: '14px',
                background: BRAND.green,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Check size={20} />
              Purchase All
            </button>
          </div>
        </div>
      )}

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '320px',
            width: '100%',
            textAlign: 'center',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Trash2 size={28} color="#ef4444" />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: BRAND.charcoal,
              marginBottom: '8px',
            }}>
              Clear Cart?
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '24px',
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
                  padding: '12px',
                  background: '#f1f5f9',
                  color: BRAND.charcoal,
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
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
                  padding: '12px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Success Modal */}
      {showPurchaseSuccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: BRAND.green,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <span style={{ color: 'white', fontSize: '32px' }}>✓</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: BRAND.charcoal }}>
              Purchase Complete!
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
              {purchasedAmount.toFixed(2)} BRL deducted from balance
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="cart" />
    </div>
  )
}
