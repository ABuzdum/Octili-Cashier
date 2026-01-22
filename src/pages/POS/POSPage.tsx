/**
 * ============================================================================
 * POS PAGE - LOTTERY GAMES GRID
 * ============================================================================
 *
 * Purpose: Main lottery POS interface showing available games
 * Based on SUMUS POS Terminal design
 *
 * Features:
 * - Grid of lottery games with countdown timers
 * - Payment of Winnings card
 * - Bottom navigation bar
 *
 * @author Octili Development Team
 * @version 2.0.0
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Banknote } from 'lucide-react'
import { useLotteryGames, useGameStore } from '@/stores/gameStore'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import type { LotteryGame } from '@/types/game.types'

// Brand colors
const BRAND = {
  green: '#24BD68',
  teal: '#00A77E',
  deepTeal: '#006E7E',
  darkBlue: '#28455B',
  charcoal: '#282E3A',
}

/**
 * Format timer seconds to MM:SS
 */
function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Game card component with countdown timer
 */
function GameCard({ game, onClick }: { game: LotteryGame; onClick: () => void }) {
  const [timer, setTimer] = useState(game.timerSeconds)

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Reset to a new random time between 1-5 minutes
          return Math.floor(Math.random() * 240) + 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Timer color based on remaining time
  const timerColor = timer <= 30 ? '#ef4444' : timer <= 60 ? '#f59e0b' : BRAND.green

  return (
    <button
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      {/* Game Name Header */}
      <div style={{
        background: BRAND.darkBlue,
        color: 'white',
        padding: '8px 12px',
        fontSize: '12px',
        fontWeight: 700,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {game.name}
      </div>

      {/* Game Image */}
      <div style={{
        aspectRatio: '4/3',
        background: `linear-gradient(135deg, ${BRAND.deepTeal}20, ${BRAND.green}10)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Placeholder for game image */}
        <div style={{
          fontSize: '48px',
          opacity: 0.8,
        }}>
          {game.type === 'keno' ? '🎱' : game.type === 'roulette' ? '🎰' : '🎈'}
        </div>

        {/* Game image overlay - would use actual images in production */}
        <img
          src={game.image}
          alt={game.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>

      {/* Timer */}
      <div style={{
        background: timerColor,
        color: 'white',
        padding: '6px 12px',
        fontSize: '14px',
        fontWeight: 700,
        textAlign: 'center',
        fontFamily: 'monospace',
      }}>
        {formatTimer(timer)}
      </div>
    </button>
  )
}

/**
 * Payment of Winnings card component
 */
function PaymentOfWinningsCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: BRAND.green,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(36, 189, 104, 0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        gap: '12px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(36, 189, 104, 0.4)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(36, 189, 104, 0.3)'
      }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Banknote size={32} color="white" />
      </div>
      <div style={{
        color: 'white',
        fontSize: '16px',
        fontWeight: 700,
        textAlign: 'center',
        lineHeight: 1.3,
      }}>
        Payment of<br />winnings
      </div>
    </button>
  )
}

export function POSPage() {
  const navigate = useNavigate()
  const games = useLotteryGames()
  const { balance } = useGameStore()

  const handleGameClick = (game: LotteryGame) => {
    navigate(`/game/${game.id}`)
  }

  const handlePaymentOfWinnings = () => {
    navigate('/payment')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Status Bar (simulated) */}
      <div style={{
        background: BRAND.darkBlue,
        color: 'white',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
      }}>
        <span style={{ fontWeight: 600 }}>Octili Cashier</span>
        <span style={{ fontWeight: 500 }}>
          Balance: <span style={{ color: BRAND.green }}>{balance.toFixed(2)} BRL</span>
        </span>
      </div>

      {/* Games Grid */}
      <div style={{
        flex: 1,
        padding: '16px',
        paddingBottom: '80px', // Space for bottom nav
        overflow: 'auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {/* First game */}
          {games.length > 0 && (
            <GameCard
              key={games[0].id}
              game={games[0]}
              onClick={() => handleGameClick(games[0])}
            />
          )}

          {/* Payment of Winnings Card */}
          <PaymentOfWinningsCard onClick={handlePaymentOfWinnings} />

          {/* Rest of the games */}
          {games.slice(1).map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => handleGameClick(game)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="games" />
    </div>
  )
}
