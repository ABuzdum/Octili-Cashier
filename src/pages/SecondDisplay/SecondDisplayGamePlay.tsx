/**
 * ============================================================================
 * SECOND DISPLAY GAME PLAY - BET SELECTION FOR PLAYER DISPLAY
 * ============================================================================
 *
 * Purpose: Game selection interface for the second display (player-facing).
 * Players can select numbers/multipliers, bet amounts, and add to cart.
 *
 * Features:
 * - Interactive market/number selection grid
 * - Bet amount and draws selectors
 * - Real-time total cost calculation
 * - Add to Cart functionality (synced with main display)
 * - Beautiful animations and Octili branding
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { useState, useEffect } from 'react'
import { ArrowLeft, ShoppingCart, Trash2, Clock, Ticket, Sparkles, Check } from 'lucide-react'
import { useGame, useGameStore } from '@/stores/gameStore'
import type { GameBet } from '@/types/game.types'
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
 * Format seconds to MM:SS
 */
function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Props for SecondDisplayGamePlay component
 */
interface SecondDisplayGamePlayProps {
  /** ID of the game to play */
  gameId: string
  /** Callback to go back to games list */
  onBack: () => void
  /** Function to send messages to main display */
  sendMessage: (type: DisplayMessageType, payload?: DisplayMessagePayload) => void
}

/**
 * Second Display Game Play Component
 *
 * Interactive betting interface for the player-facing display.
 * Allows players to select numbers/multipliers and add bets to cart.
 */
export function SecondDisplayGamePlay({
  gameId,
  onBack,
  sendMessage,
}: SecondDisplayGamePlayProps) {
  const game = useGame(gameId)
  const { addToCart, cartTickets } = useGameStore()

  // Game state
  const [timer, setTimer] = useState(game?.timerSeconds || 60)
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [betAmount, setBetAmount] = useState(game?.betAmounts[0] || 0.5)
  const [numberOfDraws, setNumberOfDraws] = useState(1)

  // UI state
  const [showBetAmountDropdown, setShowBetAmountDropdown] = useState(false)
  const [showDrawsDropdown, setShowDrawsDropdown] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Get game index for gradient
  const gameIndex = parseInt(gameId.replace('game-', '') || '0') - 1

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

  // Timer urgency states
  const isUrgent = timer <= 30
  const isWarning = timer <= 60 && timer > 30

  // If game not found
  if (!game) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎰</div>
        <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '24px' }}>
          Game not found
        </p>
        <button
          onClick={onBack}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(36, 189, 104, 0.3)',
          }}
        >
          Back to Games
        </button>
      </div>
    )
  }

  /**
   * Calculate total cost based on game type
   */
  const calculateTotalCost = () => {
    if (game.type === 'keno') {
      // Keno: cost = betAmount × numberOfDraws
      return betAmount * numberOfDraws
    } else {
      // Multiplier/Roulette: cost = selections × betAmount × numberOfDraws
      return selectedMarkets.length * betAmount * numberOfDraws
    }
  }

  const totalCost = calculateTotalCost()

  /**
   * Toggle market selection
   */
  const toggleMarket = (market: string) => {
    if (selectedMarkets.includes(market)) {
      setSelectedMarkets(selectedMarkets.filter((m) => m !== market))
    } else {
      if (selectedMarkets.length >= game.maxSelections) {
        return // Max selections reached
      }
      setSelectedMarkets([...selectedMarkets, market])
    }

    // Notify main display of selection change
    sendMessage('SELECTION_UPDATE', {
      gameId: game.id,
      selections: selectedMarkets.includes(market)
        ? selectedMarkets.filter((m) => m !== market)
        : [...selectedMarkets, market],
      betAmount,
      numberOfDraws,
      totalCost: calculateTotalCost(),
    })
  }

  /**
   * Create bet object
   */
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

  /**
   * Handle add to cart
   */
  const handleAddToCart = () => {
    if (selectedMarkets.length === 0) return

    const bet = createBet()
    addToCart(bet)

    // Clear selections after adding
    setSelectedMarkets([])

    // Show success feedback
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 1500)

    // Notify main display
    sendMessage('CART_UPDATE', { action: 'add', bet })
  }

  /**
   * Clear all selections
   */
  const handleClear = () => {
    setSelectedMarkets([])
    sendMessage('SELECTION_UPDATE', {
      gameId: game.id,
      selections: [],
      betAmount,
      numberOfDraws,
      totalCost: 0,
    })
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
      {/* Header with gradient */}
      <div
        style={{
          background: GAME_GRADIENTS[gameIndex % GAME_GRADIENTS.length],
          padding: '16px 24px',
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
            background: 'rgba(255,255,255,0.1)',
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
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            bottom: '-50px',
            left: '20%',
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
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeft size={22} />
        </button>

        {/* Game title */}
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <h1
            style={{
              color: 'white',
              fontSize: '22px',
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {game.name}
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Draw #{game.currentDraw}
          </p>
        </div>

        {/* Cart indicator */}
        <div
          style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '14px',
            zIndex: 1,
          }}
        >
          <ShoppingCart size={18} color="white" />
          <span
            style={{
              color: 'white',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {cartTickets.length}
          </span>
        </div>
      </div>

      {/* Timer Bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 24px',
            background: isUrgent
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : isWarning
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '18px',
            boxShadow: isUrgent
              ? '0 4px 20px rgba(239, 68, 68, 0.45)'
              : isWarning
              ? '0 4px 20px rgba(245, 158, 11, 0.45)'
              : '0 4px 20px rgba(34, 197, 94, 0.45)',
          }}
        >
          <Clock size={20} color="white" />
          <span
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '24px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '1px',
            }}
          >
            {formatTimer(timer)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: '24px',
          overflow: 'auto',
          paddingBottom: '140px',
        }}
      >
        {/* Selection Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Ticket size={18} color="#64748b" />
            <span
              style={{
                fontSize: '15px',
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              Select up to {game.maxSelections} {game.type === 'keno' ? 'numbers' : 'markets'}
            </span>
          </div>
          <span
            style={{
              fontSize: '16px',
              color: '#24BD68',
              fontWeight: 700,
            }}
          >
            {selectedMarkets.length}/{game.maxSelections}
          </span>
        </div>

        {/* Markets Grid */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                game.type === 'keno' ? 'repeat(8, 1fr)' : 'repeat(6, 1fr)',
              gap: '10px',
            }}
          >
            {game.markets
              .slice(0, game.type === 'roulette' ? 37 : game.markets.length)
              .map((market) => {
                const isSelected = selectedMarkets.includes(market)
                return (
                  <button
                    key={market}
                    onClick={() => toggleMarket(market)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '14px',
                      border: 'none',
                      background: isSelected
                        ? GAME_GRADIENTS[gameIndex % GAME_GRADIENTS.length]
                        : '#f1f5f9',
                      color: isSelected ? 'white' : '#334155',
                      fontWeight: 700,
                      fontSize: game.type === 'keno' ? '15px' : '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isSelected
                        ? '0 6px 16px rgba(102, 126, 234, 0.35)'
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

        {/* Bet Amount & Number of Draws */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Bet Amount */}
          <div style={{ position: 'relative' }}>
            <p
              style={{
                fontSize: '13px',
                color: '#94a3b8',
                marginBottom: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Bet Amount
            </p>
            <button
              onClick={() => {
                setShowBetAmountDropdown(!showBetAmountDropdown)
                setShowDrawsDropdown(false)
              }}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '18px',
                border: 'none',
                background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '20px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(36, 189, 104, 0.35)',
                transition: 'all 0.2s',
              }}
            >
              {betAmount} USD
            </button>
            {showBetAmountDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  borderRadius: '18px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                  zIndex: 10,
                  maxHeight: '220px',
                  overflow: 'auto',
                  marginTop: '10px',
                }}
              >
                {game.betAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setBetAmount(amount)
                      setShowBetAmountDropdown(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: 'none',
                      background:
                        betAmount === amount
                          ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
                          : 'white',
                      color: betAmount === amount ? 'white' : '#334155',
                      fontWeight: 600,
                      fontSize: '17px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    {amount} USD
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Number of Draws */}
          <div style={{ position: 'relative' }}>
            <p
              style={{
                fontSize: '13px',
                color: '#94a3b8',
                marginBottom: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Draws
            </p>
            <button
              onClick={() => {
                setShowDrawsDropdown(!showDrawsDropdown)
                setShowBetAmountDropdown(false)
              }}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '18px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '20px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
                transition: 'all 0.2s',
              }}
            >
              {numberOfDraws}x
            </button>
            {showDrawsDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  borderRadius: '18px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                  zIndex: 10,
                  marginTop: '10px',
                }}
              >
                {game.drawOptions.map((draws) => (
                  <button
                    key={draws}
                    onClick={() => {
                      setNumberOfDraws(draws)
                      setShowDrawsDropdown(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: 'none',
                      background:
                        numberOfDraws === draws
                          ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                          : 'white',
                      color: numberOfDraws === draws ? 'white' : '#334155',
                      fontWeight: 600,
                      fontSize: '17px',
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
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
              }}
            >
              <Sparkles size={18} color="#f59e0b" />
              <span
                style={{
                  fontSize: '13px',
                  color: '#94a3b8',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Your Selection
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              {selectedMarkets.map((market) => (
                <span
                  key={market}
                  style={{
                    padding: '8px 14px',
                    background: GAME_GRADIENTS[gameIndex % GAME_GRADIENTS.length],
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 600,
                  }}
                >
                  {market}
                </span>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '20px',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <span
                style={{
                  color: '#64748b',
                  fontWeight: 500,
                  fontSize: '15px',
                }}
              >
                Total Cost
              </span>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {totalCost.toFixed(2)} USD
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '20px 24px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          display: 'flex',
          gap: '14px',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
        }}
      >
        <button
          onClick={handleAddToCart}
          disabled={selectedMarkets.length === 0}
          style={{
            flex: 2,
            padding: '20px',
            borderRadius: '18px',
            border: 'none',
            background:
              selectedMarkets.length === 0
                ? '#e2e8f0'
                : 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
            color: selectedMarkets.length === 0 ? '#94a3b8' : 'white',
            fontWeight: 700,
            fontSize: '18px',
            cursor: selectedMarkets.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow:
              selectedMarkets.length === 0
                ? 'none'
                : '0 6px 20px rgba(36, 189, 104, 0.4)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <ShoppingCart size={22} />
          Add to Cart
        </button>
        <button
          onClick={handleClear}
          disabled={selectedMarkets.length === 0}
          style={{
            flex: 1,
            padding: '20px',
            borderRadius: '18px',
            border: 'none',
            background:
              selectedMarkets.length === 0
                ? '#e2e8f0'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: selectedMarkets.length === 0 ? '#94a3b8' : 'white',
            cursor: selectedMarkets.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
              selectedMarkets.length === 0
                ? 'none'
                : '0 6px 20px rgba(239, 68, 68, 0.4)',
            transition: 'all 0.2s',
          }}
        >
          <Trash2 size={24} />
        </button>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            borderRadius: '28px',
            padding: '40px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
            zIndex: 1001,
            textAlign: 'center',
            animation: 'bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 12px 32px rgba(36, 189, 104, 0.4)',
            }}
          >
            <Check size={40} color="white" strokeWidth={3} />
          </div>
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#1e293b',
            }}
          >
            Added to Cart!
          </h3>
        </div>
      )}

      <style>{`
        @keyframes bounceIn {
          0% { transform: translate(-50%, -50%) scale(0); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default SecondDisplayGamePlay
