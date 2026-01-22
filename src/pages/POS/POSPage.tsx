/**
 * ============================================================================
 * POS PAGE - LOTTERY GAMES GRID
 * ============================================================================
 *
 * Purpose: Main lottery POS/VLT interface showing available games
 * Designed for both cashier terminals and player-facing VLT displays
 *
 * Features:
 * - Beautiful game cards with countdown timers
 * - Gradient backgrounds and smooth animations
 * - Payment of Winnings card
 * - Bottom navigation bar
 *
 * @author Octili Development Team
 * @version 2.0.0
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Banknote, Clock, Sparkles } from 'lucide-react'
import { useLotteryGames, useGameStore } from '@/stores/gameStore'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import type { LotteryGame } from '@/types/game.types'

// Beautiful gradient colors for games
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

/**
 * Beautiful game card component with countdown timer
 */
function GameCard({ game, index, onClick }: { game: LotteryGame; index: number; onClick: () => void }) {
  const [timer, setTimer] = useState(game.timerSeconds)
  const [isHovered, setIsHovered] = useState(false)

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          return Math.floor(Math.random() * 240) + 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Timer urgency states
  const isUrgent = timer <= 30
  const isWarning = timer <= 60 && timer > 30

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: isHovered
          ? '0 20px 40px rgba(0,0,0,0.15), 0 0 0 2px rgba(102, 126, 234, 0.3)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        position: 'relative',
      }}
    >
      {/* Animated glow effect on hover */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: GAME_GRADIENTS[index % GAME_GRADIENTS.length],
          opacity: 0.1,
          borderRadius: '20px',
        }} />
      )}

      {/* Game Image/Visual Area */}
      <div style={{
        aspectRatio: '4/3',
        background: GAME_GRADIENTS[index % GAME_GRADIENTS.length],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          top: '-30px',
          right: '-30px',
        }} />
        <div style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          bottom: '-20px',
          left: '-20px',
        }} />

        {/* Game icon */}
        <div style={{
          fontSize: '56px',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
          transition: 'transform 0.3s ease',
        }}>
          {game.type === 'keno' ? '🎱' : game.type === 'roulette' ? '🎰' : '🎈'}
        </div>

        {/* Sparkle effect */}
        {isHovered && (
          <Sparkles
            size={24}
            color="rgba(255,255,255,0.8)"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              animation: 'pulse 1s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Game Info */}
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '8px',
          letterSpacing: '-0.3px',
        }}>
          {game.name}
        </h3>

        {/* Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: isUrgent
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            : isWarning
            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          borderRadius: '12px',
          boxShadow: isUrgent
            ? '0 4px 12px rgba(239, 68, 68, 0.3)'
            : isWarning
            ? '0 4px 12px rgba(245, 158, 11, 0.3)'
            : '0 4px 12px rgba(34, 197, 94, 0.3)',
        }}>
          <Clock size={14} color="white" />
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'white',
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: '0.5px',
          }}>
            {formatTimer(timer)}
          </span>
        </div>
      </div>
    </button>
  )
}

/**
 * Beautiful Payment of Winnings card
 */
function PaymentOfWinningsCard({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: isHovered
          ? '0 20px 40px rgba(16, 185, 129, 0.4), 0 0 0 2px rgba(16, 185, 129, 0.3)'
          : '0 8px 24px rgba(16, 185, 129, 0.25)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        gap: '16px',
        position: 'relative',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        top: '-40px',
        right: '-40px',
      }} />
      <div style={{
        position: 'absolute',
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        bottom: '-30px',
        left: '-30px',
      }} />

      {/* Icon */}
      <div style={{
        width: '72px',
        height: '72px',
        background: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      }}>
        <Banknote size={36} color="white" strokeWidth={2} />
      </div>

      {/* Text */}
      <div style={{
        color: 'white',
        fontSize: '18px',
        fontWeight: 700,
        textAlign: 'center',
        lineHeight: 1.3,
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        Payment of<br />Winnings
      </div>

      {/* Sparkle on hover */}
      {isHovered && (
        <Sparkles
          size={20}
          color="rgba(255,255,255,0.9)"
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
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}>
            <span style={{ fontSize: '20px' }}>🎰</span>
          </div>
          <div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}>
              Octili Cashier
            </h1>
            <p style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
            }}>
              Lottery Terminal
            </p>
          </div>
        </div>

        {/* Balance */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '10px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>
            Balance
          </p>
          <p style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#10b981',
            fontFamily: 'ui-monospace, monospace',
          }}>
            {balance.toFixed(2)} <span style={{ fontSize: '12px', opacity: 0.8 }}>BRL</span>
          </p>
        </div>
      </div>

      {/* Games Grid */}
      <div style={{
        flex: 1,
        padding: '20px',
        paddingBottom: '100px',
        overflow: 'auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '20px',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* First game */}
          {games.length > 0 && (
            <GameCard
              key={games[0].id}
              game={games[0]}
              index={0}
              onClick={() => handleGameClick(games[0])}
            />
          )}

          {/* Payment of Winnings Card */}
          <PaymentOfWinningsCard onClick={handlePaymentOfWinnings} />

          {/* Rest of the games */}
          {games.slice(1).map((game, idx) => (
            <GameCard
              key={game.id}
              game={game}
              index={idx + 1}
              onClick={() => handleGameClick(game)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="play" />

      {/* Global styles for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
