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
import { ArrowLeft, ShoppingCart, Trash2, Clock, Ticket, Sparkles, Check, X, Calendar, Repeat, ChevronDown } from 'lucide-react'
import { useGame, useGameStore } from '@/stores/gameStore'
import { AppHeader } from '@/components/layout/AppHeader'
import type { GameBet } from '@/types/game.types'

/**
 * Draw selection mode:
 * - 'multi': Play on next X draws (1x, 2x, 5x, 10x)
 * - 'specific': Select a specific future draw
 */
type DrawMode = 'multi' | 'specific'

/**
 * Generate upcoming draws with estimated times
 * Creates a list of future draws for selection
 */
function generateUpcomingDraws(currentDraw: number, count: number = 20): { draw: number; time: string; date: string }[] {
  const draws: { draw: number; time: string; date: string }[] = []
  const now = new Date()

  // Assume draws every 5 minutes for demo (configurable per game)
  for (let i = 0; i < count; i++) {
    const drawTime = new Date(now.getTime() + (i + 1) * 5 * 60 * 1000)
    const hours = drawTime.getHours().toString().padStart(2, '0')
    const minutes = drawTime.getMinutes().toString().padStart(2, '0')

    // Format date as "Today", "Tomorrow", or day name
    const isToday = drawTime.toDateString() === now.toDateString()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const isTomorrow = drawTime.toDateString() === tomorrow.toDateString()

    let dateLabel: string
    if (isToday) {
      dateLabel = 'Today'
    } else if (isTomorrow) {
      dateLabel = 'Tomorrow'
    } else {
      dateLabel = drawTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }

    draws.push({
      draw: currentDraw + i + 1,
      time: `${hours}:${minutes}`,
      date: dateLabel,
    })
  }

  return draws
}

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
  const { addToCart, cartTickets } = useGameStore()

  const [timer, setTimer] = useState(game?.timerSeconds || 60)
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [betAmount, setBetAmount] = useState(game?.betAmounts[0] || 0.5)
  const [numberOfDraws, setNumberOfDraws] = useState(1)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showAnotherTicketModal, setShowAnotherTicketModal] = useState(false)

  // Draw selection mode: 'multi' for next X draws, 'specific' for a specific draw
  const [drawMode, setDrawMode] = useState<DrawMode>('multi')
  const [selectedSpecificDraw, setSelectedSpecificDraw] = useState<number | null>(null)
  const [showSpecificDrawPicker, setShowSpecificDrawPicker] = useState(false)

  // Generate upcoming draws for specific selection
  const upcomingDraws = game ? generateUpcomingDraws(game.currentDraw, 20) : []

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
            onClick={() => navigate('/games')}
            style={{
              padding: '16px 32px',
              minHeight: '52px',
              background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
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

  // Calculate total cost based on draw mode
  const calculateTotalCost = () => {
    const drawCount = drawMode === 'multi' ? numberOfDraws : 1
    if (game.type === 'keno') {
      return betAmount * drawCount
    } else {
      return selectedMarkets.length * betAmount * drawCount
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
    numberOfDraws: drawMode === 'multi' ? numberOfDraws : 1,
    drawNumber: drawMode === 'specific' && selectedSpecificDraw ? selectedSpecificDraw : game.currentDraw,
    totalCost,
    // Include draw mode info for display
    isSpecificDraw: drawMode === 'specific',
    targetDraw: drawMode === 'specific' ? selectedSpecificDraw : null,
  })

  // Check if bet is valid (has selections and valid draw)
  const isBetValid = selectedMarkets.length > 0 && (drawMode === 'multi' || selectedSpecificDraw !== null)

  // Handle buy button - shows confirmation modal
  const handleBuy = () => {
    if (!isBetValid) return
    setShowConfirmModal(true)
  }

  // Confirm purchase - adds to cart and asks if want another ticket
  const confirmPurchase = () => {
    const bet = createBet()
    addToCart(bet)
    setShowConfirmModal(false)
    setSelectedMarkets([]) // Clear selections for potential next ticket
    setShowAnotherTicketModal(true)
  }

  // Handle "Another ticket?" response
  const handleAnotherTicket = (wantAnother: boolean) => {
    setShowAnotherTicketModal(false)
    if (wantAnother) {
      // Go back to games list to select another game
      navigate('/games')
    } else {
      // Go to cart to complete purchase
      navigate('/cart')
    }
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
      {/* AppHeader with back button and custom title */}
      <AppHeader
        showBack
        backPath="/games"
        title={game.name}
        subtitle={game.type === 'keno' ? 'Keno' : game.type === 'roulette' ? 'Roulette' : 'Multiplier'}
        leftContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Game Icon */}
            <div style={{
              width: '44px',
              height: '44px',
              background: GAME_GRADIENTS[gameIndex % GAME_GRADIENTS.length],
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>
              {game.icon}
            </div>

            {/* Game Name */}
            <div style={{ minWidth: 0 }}>
              <h1 style={{
                color: '#1e293b',
                fontSize: '16px',
                fontWeight: 700,
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {game.name}
              </h1>
              <p style={{
                color: '#64748b',
                fontSize: '11px',
                margin: 0,
              }}>
                {game.type === 'keno' ? 'Keno' : game.type === 'roulette' ? 'Roulette' : 'Multiplier'}
              </p>
            </div>
          </div>
        }
      />

      {/* Game Info Bar: Draw + Timer */}
      <div style={{
        background: '#ffffff',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: '1px solid #f1f5f9',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {/* Current Draw Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <span style={{
              fontSize: '10px',
              color: '#94a3b8',
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}>
              Current Draw
            </span>
            <span style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#1e293b',
            }}>
              #{game.currentDraw}
            </span>
          </div>
          <div style={{
            width: '1px',
            height: '32px',
            background: '#e2e8f0',
          }} />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <span style={{
              fontSize: '10px',
              color: '#94a3b8',
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}>
              Closes at
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#64748b',
            }}>
              {upcomingDraws[0]?.date || 'Today'} {upcomingDraws[0]?.time || '--:--'}
            </span>
          </div>

          {/* Next Draw Info */}
          <div style={{
            width: '1px',
            height: '32px',
            background: '#e2e8f0',
          }} />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <span style={{
              fontSize: '10px',
              color: '#94a3b8',
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}>
              Next
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#3b82f6',
            }}>
              #{game.currentDraw + 1} {upcomingDraws[1]?.time || '--:--'}
            </span>
          </div>
        </div>

        {/* Timer + Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px',
            background: isUrgent
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : isWarning
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '12px',
            boxShadow: isUrgent
              ? '0 4px 16px rgba(239, 68, 68, 0.4)'
              : isWarning
              ? '0 4px 16px rgba(245, 158, 11, 0.4)'
              : '0 4px 16px rgba(34, 197, 94, 0.4)',
          }}>
            <Clock size={16} color="white" />
            <span style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '18px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '1px',
            }}>
              {formatTimer(timer)}
            </span>
          </div>

          {/* Cart Button - 48px minimum touch target */}
          <button
            onClick={() => navigate('/cart')}
            style={{
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              minWidth: '48px',
              minHeight: '48px',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <ShoppingCart size={22} color="#64748b" />
            {cartTickets.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: 'white',
                fontSize: '9px',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
              }}>
                {cartTickets.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Next Draws Info Bar */}
      <div style={{
        background: '#f8fafc',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{
            fontSize: '10px',
            color: '#94a3b8',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>
            Next:
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#f59e0b',
          }}>
            #{game.currentDraw + 1}
          </span>
          <span style={{
            fontSize: '11px',
            color: '#64748b',
          }}>
            {upcomingDraws[0]?.date} {upcomingDraws[0]?.time}
          </span>
        </div>

        <div style={{
          width: '1px',
          height: '16px',
          background: '#e2e8f0',
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{
            fontSize: '10px',
            color: '#94a3b8',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>
            +1:
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#6366f1',
          }}>
            #{game.currentDraw + 2}
          </span>
          <span style={{
            fontSize: '11px',
            color: '#64748b',
          }}>
            {upcomingDraws[1]?.date} {upcomingDraws[1]?.time}
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
            color: '#24BD68',
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
            gridTemplateColumns: game.type === 'keno' ? 'repeat(5, 1fr)' : 'repeat(5, 1fr)',
            gap: '10px',
          }}>
            {game.markets.slice(0, game.type === 'roulette' ? 37 : game.markets.length).map((market) => {
              const isSelected = selectedMarkets.includes(market)
              return (
                <button
                  key={market}
                  onClick={() => toggleMarket(market)}
                  style={{
                    minWidth: '48px',
                    minHeight: '48px',
                    aspectRatio: '1',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #24BD68' : '2px solid transparent',
                    background: isSelected
                      ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
                      : '#f1f5f9',
                    color: isSelected ? 'white' : '#334155',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected
                      ? '0 4px 12px rgba(36, 189, 104, 0.4)'
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
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
            }}>
              {game.markets.slice(37).map((market) => {
                const isSelected = selectedMarkets.includes(market)
                return (
                  <button
                    key={market}
                    onClick={() => toggleMarket(market)}
                    style={{
                      padding: '14px 12px',
                      minHeight: '48px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #24BD68' : '2px solid transparent',
                      background: isSelected
                        ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
                        : '#f1f5f9',
                      color: isSelected ? 'white' : '#334155',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isSelected ? '0 4px 12px rgba(36, 189, 104, 0.4)' : 'none',
                    }}
                  >
                    {market}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Bet Amount - Button Grid */}
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
            Bet Amount
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
          }}>
            {game.betAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                style={{
                  padding: '16px 12px',
                  minHeight: '52px',
                  borderRadius: '12px',
                  border: 'none',
                  background: betAmount === amount
                    ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
                    : '#f8fafc',
                  color: betAmount === amount ? 'white' : '#334155',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: betAmount === amount ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: betAmount === amount
                    ? '0 4px 12px rgba(36, 189, 104, 0.3)'
                    : 'none',
                }}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Draw Selection - Mode Toggle + Options */}
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
            Draw Selection
          </p>

          {/* Mode Toggle - 48px minimum touch targets */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            background: '#f1f5f9',
            borderRadius: '16px',
            padding: '6px',
          }}>
            <button
              onClick={() => {
                setDrawMode('multi')
                setSelectedSpecificDraw(null)
              }}
              style={{
                flex: 1,
                padding: '14px 16px',
                minHeight: '48px',
                borderRadius: '12px',
                border: 'none',
                background: drawMode === 'multi'
                  ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                  : 'transparent',
                color: drawMode === 'multi' ? 'white' : '#64748b',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: drawMode === 'multi' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
              }}
            >
              <Repeat size={18} />
              Multi-Draw
            </button>
            <button
              onClick={() => setDrawMode('specific')}
              style={{
                flex: 1,
                padding: '14px 16px',
                minHeight: '48px',
                borderRadius: '12px',
                border: 'none',
                background: drawMode === 'specific'
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'transparent',
                color: drawMode === 'specific' ? 'white' : '#64748b',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: drawMode === 'specific' ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none',
              }}
            >
              <Calendar size={18} />
              Specific Draw
            </button>
          </div>

          {/* Multi-Draw Options - 5 columns for two rows of 5 */}
          {drawMode === 'multi' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px',
            }}>
              {game.drawOptions.map((draws) => (
                <button
                  key={draws}
                  onClick={() => setNumberOfDraws(draws)}
                  style={{
                    padding: '10px 6px',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: 'none',
                    background: numberOfDraws === draws
                      ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                      : '#f8fafc',
                    color: numberOfDraws === draws ? 'white' : '#334155',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: numberOfDraws === draws ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: numberOfDraws === draws
                      ? '0 4px 12px rgba(99, 102, 241, 0.3)'
                      : 'none',
                  }}
                >
                  {draws}x
                </button>
              ))}
            </div>
          )}

          {/* Specific Draw Selection - 48px minimum touch target */}
          {drawMode === 'specific' && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowSpecificDrawPicker(!showSpecificDrawPicker)
                }}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  minHeight: '56px',
                  borderRadius: '14px',
                  border: selectedSpecificDraw ? 'none' : '2px dashed #cbd5e1',
                  background: selectedSpecificDraw
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : '#f8fafc',
                  color: selectedSpecificDraw ? 'white' : '#64748b',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                  boxShadow: selectedSpecificDraw
                    ? '0 4px 16px rgba(245, 158, 11, 0.3)'
                    : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} />
                  {selectedSpecificDraw ? (
                    <span>
                      Draw #{selectedSpecificDraw}
                      {upcomingDraws.find(d => d.draw === selectedSpecificDraw) && (
                        <span style={{ opacity: 0.9, marginLeft: '8px', fontSize: '13px' }}>
                          ({upcomingDraws.find(d => d.draw === selectedSpecificDraw)?.date} {upcomingDraws.find(d => d.draw === selectedSpecificDraw)?.time})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span>Select a specific draw...</span>
                  )}
                </div>
                <ChevronDown size={18} />
              </button>

              {/* Specific Draw Picker Dropdown */}
              {showSpecificDrawPicker && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  zIndex: 20,
                  maxHeight: '280px',
                  overflow: 'auto',
                  marginTop: '8px',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    position: 'sticky',
                    top: 0,
                  }}>
                    <p style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      Upcoming Draws
                    </p>
                  </div>
                  {upcomingDraws.map((draw, index) => {
                    const isSelected = selectedSpecificDraw === draw.draw
                    const isNext = index === 0
                    return (
                      <button
                        key={draw.draw}
                        onClick={() => {
                          setSelectedSpecificDraw(draw.draw)
                          setShowSpecificDrawPicker(false)
                        }}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          minHeight: '56px',
                          border: 'none',
                          background: isSelected
                            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                            : isNext
                            ? '#fef3c7'
                            : 'white',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s',
                          borderBottom: '1px solid #f1f5f9',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: isSelected
                              ? 'rgba(255,255,255,0.2)'
                              : isNext
                              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                              : '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: isSelected || isNext ? 'white' : '#64748b',
                          }}>
                            #{draw.draw.toString().slice(-3)}
                          </div>
                          <div>
                            <p style={{
                              fontWeight: 600,
                              fontSize: '14px',
                              color: isSelected ? 'white' : '#1e293b',
                            }}>
                              Draw #{draw.draw}
                              {isNext && !isSelected && (
                                <span style={{
                                  marginLeft: '8px',
                                  fontSize: '10px',
                                  padding: '2px 6px',
                                  background: '#f59e0b',
                                  color: 'white',
                                  borderRadius: '4px',
                                  fontWeight: 700,
                                }}>
                                  NEXT
                                </span>
                              )}
                            </p>
                            <p style={{
                              fontSize: '12px',
                              color: isSelected ? 'rgba(255,255,255,0.8)' : '#64748b',
                            }}>
                              {draw.date} at {draw.time}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check size={20} color="white" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Selected Draw Info */}
          <div style={{
            marginTop: '12px',
            padding: '12px 16px',
            background: '#f8fafc',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Clock size={16} color="#64748b" />
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              {drawMode === 'multi' ? (
                <>Playing <strong style={{ color: '#6366f1' }}>{numberOfDraws}</strong> consecutive draw{numberOfDraws > 1 ? 's' : ''} starting from next draw</>
              ) : selectedSpecificDraw ? (
                <>Playing on <strong style={{ color: '#f59e0b' }}>Draw #{selectedSpecificDraw}</strong> only</>
              ) : (
                <>Select a specific draw above</>
              )}
            </span>
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
                background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {totalCost.toFixed(2)} BRL
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons - 56px minimum touch targets */}
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
        {/* Buy Button - Primary action */}
        <button
          onClick={handleBuy}
          disabled={!isBetValid}
          style={{
            flex: 3,
            padding: '18px',
            minHeight: '56px',
            borderRadius: '16px',
            border: 'none',
            background: !isBetValid
              ? '#e2e8f0'
              : 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
            color: !isBetValid ? '#94a3b8' : 'white',
            fontWeight: 700,
            fontSize: '18px',
            cursor: !isBetValid ? 'not-allowed' : 'pointer',
            boxShadow: !isBetValid
              ? 'none'
              : '0 4px 16px rgba(36, 189, 104, 0.4)',
            transition: 'all 0.2s',
          }}
        >
          Buy
        </button>
        {/* Clear Button - Reset selections */}
        <button
          onClick={handleClear}
          disabled={selectedMarkets.length === 0}
          style={{
            flex: 1,
            padding: '18px',
            minHeight: '56px',
            minWidth: '56px',
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
          <Trash2 size={24} />
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
                background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(36, 189, 104, 0.4)',
              }}>
                <Ticket size={28} color="white" />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '8px',
              }}>
                Confirm Purchase
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
              }}>
                {game.name} - {drawMode === 'specific' && selectedSpecificDraw
                  ? `Draw #${selectedSpecificDraw}`
                  : `Next ${numberOfDraws} Draw${numberOfDraws > 1 ? 's' : ''}`}
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
                  {drawMode === 'specific'
                    ? `Draw #${selectedSpecificDraw} × ${betAmount} BRL`
                    : `${numberOfDraws} draw${numberOfDraws > 1 ? 's' : ''} × ${betAmount} BRL`}
                </span>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#24BD68',
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
                  minHeight: '52px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(36, 189, 104, 0.4)',
                }}
              >
                <Check size={22} />
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  flex: 1,
                  padding: '16px',
                  minHeight: '52px',
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
                <X size={22} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Another Ticket? Modal */}
      {showAnotherTicketModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px 24px',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            textAlign: 'center',
          }}>
            {/* Success checkmark */}
            <div style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(36, 189, 104, 0.4)',
            }}>
              <Check size={36} color="white" strokeWidth={3} />
            </div>

            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '8px',
            }}>
              Added to Cart!
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '24px',
            }}>
              {cartTickets.length} ticket{cartTickets.length > 1 ? 's' : ''} in cart
            </p>

            <h4 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '20px',
            }}>
              Do you want another ticket?
            </h4>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Yes - Another ticket */}
              <button
                onClick={() => handleAnotherTicket(true)}
                style={{
                  flex: 1,
                  padding: '18px 16px',
                  minHeight: '60px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 16px rgba(36, 189, 104, 0.4)',
                }}
              >
                <Ticket size={24} />
                <span>Yes, Add More</span>
              </button>

              {/* No - Go to cart */}
              <button
                onClick={() => handleAnotherTicket(false)}
                style={{
                  flex: 1,
                  padding: '18px 16px',
                  minHeight: '60px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                }}
              >
                <ShoppingCart size={24} />
                <span>No, Checkout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
