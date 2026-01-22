/**
 * ============================================================================
 * GAME PLAY PAGE - BET SELECTION SCREEN
 * ============================================================================
 *
 * Purpose: Beautiful betting interface for lottery games
 * Designed for VLT terminals and player-facing displays
 *
 * Features:
 * - Animated timer with urgency colors
 * - Interactive market selection grid
 * - Bet amount and draws dropdown
 * - Buy, Add to Cart, Clear actions
 *
 * @author Octili Development Team
 * @version 2.0.0
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Trash2, Clock, Ticket, Sparkles, Check, X } from 'lucide-react'
import { useGame, useGameStore } from '@/stores/gameStore'
import type { GameBet } from '@/types/game.types'

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
 * Format timer seconds to MM:SS
 */
function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function GamePlayPage() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const game = useGame(gameId || '')
  const { addToCart, purchaseSingle, cartTickets } = useGameStore()

  const [timer, setTimer] = useState(game?.timerSeconds || 60)
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [betAmount, setBetAmount] = useState(game?.betAmounts[0] || 0.5)
  const [numberOfDraws, setNumberOfDraws] = useState(1)
  const [showBetAmountDropdown, setShowBetAmountDropdown] = useState(false)
  const [showDrawsDropdown, setShowDrawsDropdown] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'buy' | 'cart'>('buy')
  const [showSuccess, setShowSuccess] = useState(false)

  // Get game index for gradient
  const gameIndex = parseInt(gameId?.replace('game-', '') || '0') - 1

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) return Math.floor(Math.random() * 240) + 60
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!game) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎰</div>
          <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '24px' }}>Game not found</p>
          <button
            onClick={() => navigate('/pos')}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Back to Games
          </button>
        </div>
      </div>
    )
  }

  // Timer urgency states
  const isUrgent = timer <= 30
  const isWarning = timer <= 60 && timer > 30

  // Calculate total cost
  const calculateTotalCost = () => {
    if (game.type === 'keno') {
      return betAmount * numberOfDraws
    } else {
      return selectedMarkets.length * betAmount * numberOfDraws
    }
  }

  const totalCost = calculateTotalCost()

  // Toggle market selection
  const toggleMarket = (market: string) => {
    if (selectedMarkets.includes(market)) {
      setSelectedMarkets(selectedMarkets.filter((m) => m !== market))
    } else {
      if (selectedMarkets.length >= game.maxSelections) {
        return
      }
      setSelectedMarkets([...selectedMarkets, market])
    }
  }

  // Create bet object
  const createBet = (): GameBet => ({
    gameId: game.id,
    gameName: game.name,
    gameType: game.type,
    selections: selectedMarkets,
    betAmount,
    numberOfDraws,
    drawNumber: game.currentDraw,
    totalCost,
  })

  // Handle buy button
  const handleBuy = () => {
    if (selectedMarkets.length === 0) return
    setConfirmAction('buy')
    setShowConfirmModal(true)
  }

  // Handle add to cart
  const handleAddToCart = () => {
    if (selectedMarkets.length === 0) return
    setConfirmAction('cart')
    setShowConfirmModal(true)
  }

  // Confirm purchase
  const confirmPurchase = () => {
    const bet = createBet()
    if (confirmAction === 'buy') {
      purchaseSingle(bet)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        navigate('/pos')
      }, 1500)
    } else {
      addToCart(bet)
      setSelectedMarkets([])
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 1500)
    }
    setShowConfirmModal(false)
  }

  // Clear selections
  const handleClear = () => {
    setSelectedMarkets([])
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header with gradient */}
      <div style={{
        background: GAME_GRADIENTS[gameIndex % GAME_GRADIENTS.length],
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          top: '-60px',
          right: '-40px',
        }} />
        <div style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          bottom: '-40px',
          left: '20%',
        }} />

        <button
          onClick={() => navigate('/pos')}
          style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            color: 'white',
            zIndex: 1,
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <h1 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            {game.name}
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '12px',
            fontWeight: 500,
          }}>
            Draw #{game.currentDraw}
          </p>
        </div>

        <button
          onClick={() => navigate('/cart')}
          style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <ShoppingCart size={20} color="white" />
          {cartTickets.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: '#ef4444',
              color: 'white',
              fontSize: '10px',
              fontWeight: 700,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
            }}>
              {cartTickets.length}
            </span>
          )}
        </button>
      </div>

      {/* Timer Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: isUrgent
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            : isWarning
            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          borderRadius: '16px',
          boxShadow: isUrgent
            ? '0 4px 16px rgba(239, 68, 68, 0.4)'
            : isWarning
            ? '0 4px 16px rgba(245, 158, 11, 0.4)'
            : '0 4px 16px rgba(34, 197, 94, 0.4)',
        }}>
          <Clock size={18} color="white" />
          <span style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: '20px',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '1px',
          }}>
            {formatTimer(timer)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflow: 'auto',
        paddingBottom: '120px',
      }}>
        {/* Selection Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Ticket size={16} color="#64748b" />
            <span style={{
              fontSize: '14px',
              color: '#64748b',
              fontWeight: 500,
            }}>
              Select up to {game.maxSelections} {game.type === 'keno' ? 'numbers' : 'markets'}
            </span>
          </div>
          <span style={{
            fontSize: '14px',
            color: '#10b981',
            fontWeight: 600,
          }}>
            {selectedMarkets.length}/{game.maxSelections}
          </span>
        </div>

        {/* Markets Grid */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          marginBottom: '20px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: game.type === 'keno' ? 'repeat(8, 1fr)' : 'repeat(6, 1fr)',
            gap: '8px',
          }}>
            {game.markets.slice(0, game.type === 'roulette' ? 37 : game.markets.length).map((market) => {
              const isSelected = selectedMarkets.includes(market)
              return (
                <button
                  key={market}
                  onClick={() => toggleMarket(market)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '12px',
                    border: 'none',
                    background: isSelected
                      ? GAME_GRADIENTS[gameIndex % GAME_GRADIENTS.length]
                      : '#f1f5f9',
                    color: isSelected ? 'white' : '#334155',
                    fontWeight: 700,
                    fontSize: game.type === 'keno' ? '14px' : '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected
                      ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                      : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {market}
                </button>
              )
            })}
          </div>
        </div>

        {/* Special options for roulette */}
        {game.type === 'roulette' && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            marginBottom: '20px',
          }}>
            <p style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Special Bets
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
            }}>
              {game.markets.slice(37).map((market) => {
                const isSelected = selectedMarkets.includes(market)
                return (
                  <button
                    key={market}
                    onClick={() => toggleMarket(market)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isSelected
                        ? GAME_GRADIENTS[gameIndex % GAME_GRADIENTS.length]
                        : '#f1f5f9',
                      color: isSelected ? 'white' : '#334155',
                      fontWeight: 600,
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    {market}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Bet Amount & Number of Draws */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '20px',
        }}>
          {/* Bet Amount */}
          <div style={{ position: 'relative' }}>
            <p style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '8px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Bet Amount
            </p>
            <button
              onClick={() => {
                setShowBetAmountDropdown(!showBetAmountDropdown)
                setShowDrawsDropdown(false)
              }}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s',
              }}
            >
              {betAmount} BRL
            </button>
            {showBetAmountDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                zIndex: 10,
                maxHeight: '200px',
                overflow: 'auto',
                marginTop: '8px',
              }}>
                {game.betAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setBetAmount(amount)
                      setShowBetAmountDropdown(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: 'none',
                      background: betAmount === amount ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
                      color: betAmount === amount ? 'white' : '#334155',
                      fontWeight: 600,
                      fontSize: '16px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    {amount} BRL
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Number of Draws */}
          <div style={{ position: 'relative' }}>
            <p style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '8px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Draws
            </p>
            <button
              onClick={() => {
                setShowDrawsDropdown(!showDrawsDropdown)
                setShowBetAmountDropdown(false)
              }}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s',
              }}
            >
              {numberOfDraws}x
            </button>
            {showDrawsDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                zIndex: 10,
                marginTop: '8px',
              }}>
                {game.drawOptions.map((draws) => (
                  <button
                    key={draws}
                    onClick={() => {
                      setNumberOfDraws(draws)
                      setShowDrawsDropdown(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: 'none',
                      background: numberOfDraws === draws ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'white',
                      color: numberOfDraws === draws ? 'white' : '#334155',
                      fontWeight: 600,
                      fontSize: '16px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    {draws}x Draw{draws > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Total Cost Display */}
        {selectedMarkets.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}>
              <Sparkles size={16} color="#f59e0b" />
              <span style={{
                fontSize: '12px',
                color: '#94a3b8',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Your Selection
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {selectedMarkets.map((market) => (
                <span
                  key={market}
                  style={{
                    padding: '6px 12px',
                    background: GAME_GRADIENTS[gameIndex % GAME_GRADIENTS.length],
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {market}
                </span>
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
            }}>
              <span style={{
                color: '#64748b',
                fontWeight: 500,
                fontSize: '14px',
              }}>
                Total Cost
              </span>
              <span style={{
                fontSize: '24px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {totalCost.toFixed(2)} BRL
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        padding: '16px 20px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        display: 'flex',
        gap: '12px',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.1)',
      }}>
        <button
          onClick={handleBuy}
          disabled={selectedMarkets.length === 0}
          style={{
            flex: 2,
            padding: '18px',
            borderRadius: '16px',
            border: 'none',
            background: selectedMarkets.length === 0
              ? '#e2e8f0'
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: selectedMarkets.length === 0 ? '#94a3b8' : 'white',
            fontWeight: 700,
            fontSize: '16px',
            cursor: selectedMarkets.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: selectedMarkets.length === 0
              ? 'none'
              : '0 4px 16px rgba(245, 158, 11, 0.4)',
            transition: 'all 0.2s',
          }}
        >
          Buy Now
        </button>
        <button
          onClick={handleAddToCart}
          disabled={selectedMarkets.length === 0}
          style={{
            flex: 1,
            padding: '18px',
            borderRadius: '16px',
            border: 'none',
            background: selectedMarkets.length === 0
              ? '#e2e8f0'
              : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: selectedMarkets.length === 0 ? '#94a3b8' : 'white',
            cursor: selectedMarkets.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: selectedMarkets.length === 0
              ? 'none'
              : '0 4px 16px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s',
          }}
        >
          <ShoppingCart size={22} />
        </button>
        <button
          onClick={handleClear}
          disabled={selectedMarkets.length === 0}
          style={{
            flex: 1,
            padding: '18px',
            borderRadius: '16px',
            border: 'none',
            background: selectedMarkets.length === 0
              ? '#e2e8f0'
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: selectedMarkets.length === 0 ? '#94a3b8' : 'white',
            cursor: selectedMarkets.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: selectedMarkets.length === 0
              ? 'none'
              : '0 4px 16px rgba(239, 68, 68, 0.4)',
            transition: 'all 0.2s',
          }}
        >
          <Trash2 size={22} />
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
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
            padding: '32px 24px',
            width: '100%',
            maxWidth: '340px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '24px',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: confirmAction === 'buy'
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: confirmAction === 'buy'
                  ? '0 8px 24px rgba(245, 158, 11, 0.4)'
                  : '0 8px 24px rgba(99, 102, 241, 0.4)',
              }}>
                {confirmAction === 'buy' ? (
                  <Ticket size={28} color="white" />
                ) : (
                  <ShoppingCart size={28} color="white" />
                )}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '8px',
              }}>
                {confirmAction === 'buy' ? 'Confirm Purchase' : 'Add to Cart'}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
              }}>
                {game.name} - Draw #{game.currentDraw}
              </p>
            </div>

            <div style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '24px',
            }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '12px',
              }}>
                {selectedMarkets.map((market) => (
                  <span
                    key={market}
                    style={{
                      padding: '4px 10px',
                      background: GAME_GRADIENTS[gameIndex % GAME_GRADIENTS.length],
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {market}
                  </span>
                ))}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
              }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>
                  {numberOfDraws} draw{numberOfDraws > 1 ? 's' : ''} × {betAmount} BRL
                </span>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#10b981',
                }}>
                  {totalCost.toFixed(2)} BRL
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={confirmPurchase}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Check size={20} />
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 1001,
          textAlign: 'center',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
          }}>
            <Check size={36} color="white" strokeWidth={3} />
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#1e293b',
          }}>
            {confirmAction === 'buy' ? 'Purchase Complete!' : 'Added to Cart!'}
          </h3>
        </div>
      )}
    </div>
  )
}
