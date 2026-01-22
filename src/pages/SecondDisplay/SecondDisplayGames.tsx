/**
 * ============================================================================
 * SECOND DISPLAY GAMES - GAMES GRID FOR PLAYER DISPLAY
 * ============================================================================
 *
 * Purpose: Shows the lottery games grid on the second display (player-facing).
 * Players can select games to play, with countdown timers for each draw.
 *
 * Features:
 * - Beautiful game cards with countdown timers
 * - Gradient backgrounds and hover animations
 * - Interactive - players can tap to select games
 * - Real-time timer updates with urgency colors
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { useState, useEffect } from 'react'
import { Clock, Sparkles, Trophy } from 'lucide-react'
import { useLotteryGames } from '@/stores/gameStore'
import type { LotteryGame } from '@/types/game.types'
import type { DisplayMessageType, DisplayMessagePayload } from '@/hooks/useBroadcastSync'

/**
 * Game gradients - matching the main display for consistency
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
 * Format seconds to MM:SS display
 */
function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Props for SecondDisplayGames component
 */
interface SecondDisplayGamesProps {
  /** Callback when a game is selected */
  onGameSelect: (gameId: string) => void
  /** Function to send messages to main display */
  sendMessage: (type: DisplayMessageType, payload?: DisplayMessagePayload) => void
}

/**
 * Game card component with countdown timer for second display
 */
function GameCard({
  game,
  index,
  onClick,
}: {
  game: LotteryGame
  index: number
  onClick: () => void
}) {
  const [timer, setTimer] = useState(game.timerSeconds)
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Reset timer to random value between 1-4 minutes
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
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={{
        background: 'white',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: isHovered
          ? '0 20px 50px rgba(0,0,0,0.18), 0 0 0 3px rgba(36, 189, 104, 0.3)'
          : '0 4px 24px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transform: isPressed
          ? 'translateY(-4px) scale(0.98)'
          : isHovered
          ? 'translateY(-12px) scale(1.03)'
          : 'translateY(0) scale(1)',
        position: 'relative',
      }}
    >
      {/* Animated glow effect on hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: GAME_GRADIENTS[index % GAME_GRADIENTS.length],
            opacity: 0.15,
            borderRadius: '24px',
          }}
        />
      )}

      {/* Game Image/Visual Area */}
      <div
        style={{
          aspectRatio: '4/3',
          background: GAME_GRADIENTS[index % GAME_GRADIENTS.length],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '50%',
            top: '-40px',
            right: '-40px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%',
            bottom: '-30px',
            left: '-30px',
          }}
        />

        {/* Game icon */}
        <div
          style={{
            fontSize: '72px',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.25))',
            transform: isHovered ? 'scale(1.15) rotate(5deg)' : 'scale(1) rotate(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {game.icon}
        </div>

        {/* Sparkle effect */}
        {isHovered && (
          <Sparkles
            size={28}
            color="rgba(255,255,255,0.9)"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              animation: 'pulse 1s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Game Info */}
      <div style={{ padding: '20px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '12px',
            letterSpacing: '-0.3px',
          }}
        >
          {game.name}
        </h3>

        {/* Timer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: isUrgent
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : isWarning
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '14px',
            boxShadow: isUrgent
              ? '0 4px 16px rgba(239, 68, 68, 0.35)'
              : isWarning
              ? '0 4px 16px rgba(245, 158, 11, 0.35)'
              : '0 4px 16px rgba(34, 197, 94, 0.35)',
          }}
        >
          <Clock size={16} color="white" />
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'white',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.5px',
            }}
          >
            {formatTimer(timer)}
          </span>
        </div>

        {/* Play hint on hover */}
        {isHovered && (
          <div
            style={{
              marginTop: '12px',
              textAlign: 'center',
              color: '#24BD68',
              fontSize: '13px',
              fontWeight: 600,
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            Tap to play
          </div>
        )}
      </div>
    </button>
  )
}

/**
 * Promotional banner component
 */
function PromoBanner() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 50%, #006E7E 100%)',
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        boxShadow: '0 8px 32px rgba(36, 189, 104, 0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          top: '-80px',
          right: '-60px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          bottom: '-60px',
          left: '-40px',
        }}
      />

      <Trophy size={36} color="white" style={{ zIndex: 1 }} />
      <div style={{ zIndex: 1 }}>
        <h3
          style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '4px',
          }}
        >
          Win Big Today!
        </h3>
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
          }}
        >
          Select a game to start playing
        </p>
      </div>
    </div>
  )
}

/**
 * Second Display Games Grid Component
 *
 * Shows all available lottery games with countdown timers.
 * Players can tap on a game card to start playing.
 */
export function SecondDisplayGames({ onGameSelect, sendMessage }: SecondDisplayGamesProps) {
  const games = useLotteryGames()

  const handleGameClick = (game: LotteryGame) => {
    onGameSelect(game.id)
    // Notify main display about selection
    sendMessage('NAVIGATE', { path: `/game/${game.id}` })
  }

  return (
    <div
      style={{
        flex: 1,
        padding: '24px',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Promo Banner */}
        <div style={{ marginBottom: '24px' }}>
          <PromoBanner />
        </div>

        {/* Section Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '4px',
              height: '24px',
              background: 'linear-gradient(180deg, #24BD68 0%, #00A77E 100%)',
              borderRadius: '2px',
            }}
          />
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#1e293b',
              letterSpacing: '-0.5px',
            }}
          >
            Choose Your Game
          </h2>
        </div>

        {/* Games Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '24px',
          }}
        >
          {games.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              index={index}
              onClick={() => handleGameClick(game)}
            />
          ))}
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default SecondDisplayGames
