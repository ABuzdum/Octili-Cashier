/**
 * ============================================================================
 * GAME PLAY PAGE - BET SELECTION SCREEN
 * ============================================================================
 *
 * Purpose: Screen for selecting bets on a lottery game
 * Based on SUMUS POS Terminal design
 *
 * Features:
 * - Timer and draw number display
 * - Market/multiplier selection
 * - Bet amount selection
 * - Number of draws selection
 * - Buy, Add to Cart, Delete buttons
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react'
import { useGame, useGameStore } from '@/stores/gameStore'
import type { GameBet } from '@/types/game.types'

// Brand colors
const BRAND = {
  green: '#24BD68',
  teal: '#00A77E',
  deepTeal: '#006E7E',
  darkBlue: '#28455B',
  charcoal: '#282E3A',
  orange: '#f59e0b',
}

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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Game not found</p>
        <button onClick={() => navigate('/pos')}>Back to Games</button>
      </div>
    )
  }

  // Calculate total cost
  const calculateTotalCost = () => {
    if (game.type === 'keno') {
      // Keno: selecting more numbers doesn't increase cost
      return betAmount * numberOfDraws
    } else {
      // Multiplier/Roulette: each selection equals one bet
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
        // Show max selection warning (could add a toast here)
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
      // Show success message and go back
      navigate('/pos')
    } else {
      addToCart(bet)
      setSelectedMarkets([])
    }
    setShowConfirmModal(false)
  }

  // Clear selections
  const handleClear = () => {
    setSelectedMarkets([])
  }

  const timerColor = timer <= 30 ? '#ef4444' : timer <= 60 ? BRAND.orange : BRAND.green

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
        <button
          onClick={() => navigate('/pos')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: BRAND.darkBlue,
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{
          color: BRAND.green,
          fontSize: '18px',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          {game.name}
        </h1>
        <button
          onClick={() => navigate('/cart')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <ShoppingCart size={24} color={BRAND.darkBlue} />
          {cartTickets.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#ef4444',
              color: 'white',
              fontSize: '10px',
              fontWeight: 700,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {cartTickets.length}
            </span>
          )}
        </button>
      </div>

      {/* Timer Bar */}
      <div style={{
        background: BRAND.darkBlue,
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          background: timerColor,
          color: 'white',
          padding: '6px 16px',
          borderRadius: '8px',
          fontWeight: 700,
          fontFamily: 'monospace',
          fontSize: '16px',
        }}>
          Timer: {formatTimer(timer)}
        </div>
        <div style={{
          color: 'white',
          fontWeight: 600,
          fontSize: '14px',
        }}>
          Draw: {game.currentDraw}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflow: 'auto',
        paddingBottom: '100px',
      }}>
        {/* Market Selection Label */}
        <p style={{
          fontSize: '13px',
          color: '#64748b',
          marginBottom: '12px',
          fontWeight: 500,
        }}>
          Select: {game.maxSelections} markets
        </p>

        {/* Markets Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
          marginBottom: '24px',
        }}>
          {game.markets.slice(0, game.type === 'roulette' ? 37 : game.markets.length).map((market) => {
            const isSelected = selectedMarkets.includes(market)
            return (
              <button
                key={market}
                onClick={() => toggleMarket(market)}
                style={{
                  padding: '12px 8px',
                  borderRadius: '8px',
                  border: `2px solid ${isSelected ? BRAND.orange : '#e2e8f0'}`,
                  background: isSelected ? BRAND.orange : 'white',
                  color: isSelected ? 'white' : BRAND.charcoal,
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {market}
              </button>
            )
          })}
        </div>

        {/* Special options for roulette */}
        {game.type === 'roulette' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '24px',
          }}>
            {game.markets.slice(37).map((market) => {
              const isSelected = selectedMarkets.includes(market)
              return (
                <button
                  key={market}
                  onClick={() => toggleMarket(market)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? BRAND.orange : '#e2e8f0'}`,
                    background: isSelected ? BRAND.orange : 'white',
                    color: isSelected ? 'white' : BRAND.charcoal,
                    fontWeight: 600,
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {market}
                </button>
              )
            })}
          </div>
        )}

        {/* Bet Amount & Number of Draws */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {/* Bet Amount */}
          <div style={{ position: 'relative' }}>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
              Bet Amount
            </p>
            <button
              onClick={() => {
                setShowBetAmountDropdown(!showBetAmountDropdown)
                setShowDrawsDropdown(false)
              }}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '24px',
                border: 'none',
                background: BRAND.green,
                color: 'white',
                fontWeight: 700,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              {betAmount}
            </button>
            {showBetAmountDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                zIndex: 10,
                maxHeight: '200px',
                overflow: 'auto',
                marginTop: '4px',
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
                      padding: '12px 16px',
                      border: 'none',
                      background: betAmount === amount ? BRAND.green : 'white',
                      color: betAmount === amount ? 'white' : BRAND.charcoal,
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Number of Draws */}
          <div style={{ position: 'relative' }}>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
              Number of Draws
            </p>
            <button
              onClick={() => {
                setShowDrawsDropdown(!showDrawsDropdown)
                setShowBetAmountDropdown(false)
              }}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '24px',
                border: 'none',
                background: BRAND.green,
                color: 'white',
                fontWeight: 700,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              {numberOfDraws}
            </button>
            {showDrawsDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                zIndex: 10,
                marginTop: '4px',
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
                      padding: '12px 16px',
                      border: 'none',
                      background: numberOfDraws === draws ? BRAND.green : 'white',
                      color: numberOfDraws === draws ? 'white' : BRAND.charcoal,
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {draws}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Total Cost Display */}
        {selectedMarkets.length > 0 && (
          <div style={{
            background: `${BRAND.green}10`,
            border: `1px solid ${BRAND.green}30`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: BRAND.darkBlue, fontWeight: 500 }}>Selected:</span>
              <span style={{ color: BRAND.charcoal, fontWeight: 600 }}>
                {selectedMarkets.join(', ')}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: `1px solid ${BRAND.green}20`,
            }}>
              <span style={{ color: BRAND.darkBlue, fontWeight: 600, fontSize: '16px' }}>Total Cost:</span>
              <span style={{ color: BRAND.green, fontWeight: 700, fontSize: '20px' }}>
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
        padding: '12px 16px',
        display: 'flex',
        gap: '12px',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
      }}>
        <button
          onClick={handleBuy}
          disabled={selectedMarkets.length === 0}
          style={{
            flex: 2,
            padding: '16px',
            borderRadius: '12px',
            border: `2px solid ${BRAND.orange}`,
            background: 'white',
            color: BRAND.orange,
            fontWeight: 700,
            fontSize: '16px',
            cursor: selectedMarkets.length === 0 ? 'not-allowed' : 'pointer',
            opacity: selectedMarkets.length === 0 ? 0.5 : 1,
          }}
        >
          Buy
        </button>
        <button
          onClick={handleAddToCart}
          disabled={selectedMarkets.length === 0}
          style={{
            flex: 1,
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: BRAND.orange,
            color: 'white',
            cursor: selectedMarkets.length === 0 ? 'not-allowed' : 'pointer',
            opacity: selectedMarkets.length === 0 ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShoppingCart size={24} />
        </button>
        <button
          onClick={handleClear}
          style={{
            flex: 1,
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: '#ef4444',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
          }}>
            <button
              onClick={() => setShowConfirmModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#94a3b8',
              }}
            >
              ×
            </button>
            <h3 style={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 700,
              color: BRAND.charcoal,
              marginBottom: '16px',
            }}>
              {confirmAction === 'buy' ? 'Buy?' : 'Add to Cart?'}
            </h3>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <span style={{ color: BRAND.darkBlue, fontWeight: 600 }}>
                {selectedMarkets.join(', ')}
              </span>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, color: BRAND.charcoal }}>
                Price: {totalCost.toFixed(2)} BRL
              </span>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ color: '#64748b' }}>
                Number of Draws: {numberOfDraws}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={confirmPurchase}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: BRAND.green,
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                OK
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
