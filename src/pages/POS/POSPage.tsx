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
import { Clock, Sparkles } from 'lucide-react'
import { useLotteryGames } from '@/stores/gameStore'
import { useThemeStore } from '@/stores/themeStore'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { AppHeader } from '@/components/layout/AppHeader'
import { SwipePageWrapper } from '@/components/shared/SwipePageWrapper'
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

        {/* Game icon - unique per game from Octili RGS */}
        <div style={{
          fontSize: '56px',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
          transition: 'transform 0.3s ease',
        }}>
          {game.icon}
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

export function POSPage() {
  const navigate = useNavigate()
  const games = useLotteryGames()
  const { visualStyle, isDarkMode } = useThemeStore()

  const handleGameClick = (game: LotteryGame) => {
    navigate(`/game/${game.id}`)
  }

  return (
    <SwipePageWrapper
      currentPage="draw"
      background={isDarkMode
        ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
        : visualStyle === 'neumorphic'
        ? 'linear-gradient(180deg, #e8eef5 0%, #dfe6ef 100%)'
        : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)'}
    >
      {/* AppHeader - Consistent header with balance and menu */}
      <AppHeader
        title="Games"
        subtitle="Select a lottery game"
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '20px',
        paddingBottom: '100px',
        overflow: 'auto',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* Games Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '20px',
          }}>
            {games.map((game, idx) => (
              <GameCard
                key={game.id}
                game={game}
                index={idx}
                onClick={() => handleGameClick(game)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="games" />

      {/* Global styles for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </SwipePageWrapper>
  )
}
