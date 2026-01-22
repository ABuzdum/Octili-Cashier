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
import { Clock, Sparkles, Menu, QrCode, Ticket } from 'lucide-react'
import { useLotteryGames, useGameStore } from '@/stores/gameStore'
import { useThemeStore, COLOR_THEMES, VISUAL_STYLES } from '@/stores/themeStore'
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

/**
 * Main action button component - QR Ticket or Draw Ticket
 */
function MainActionButton({
  icon: Icon,
  label,
  gradient,
  shadowColor,
  onClick
}: {
  icon: typeof QrCode
  label: string
  gradient: string
  shadowColor: string
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flex: 1,
        background: gradient,
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: isHovered
          ? `0 20px 40px ${shadowColor}60, 0 0 0 3px ${shadowColor}40`
          : `0 8px 24px ${shadowColor}40`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        gap: '16px',
        position: 'relative',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        minHeight: '160px',
      }}
    >
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        width: '180px',
        height: '180px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        top: '-60px',
        right: '-60px',
      }} />
      <div style={{
        position: 'absolute',
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        bottom: '-40px',
        left: '-20px',
      }} />

      {/* Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        background: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        zIndex: 1,
      }}>
        <Icon size={40} color="white" strokeWidth={2} />
      </div>

      {/* Text */}
      <span style={{
        color: 'white',
        fontSize: '22px',
        fontWeight: 800,
        textAlign: 'center',
        textShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 1,
        letterSpacing: '-0.5px',
      }}>
        {label}
      </span>

      {/* Sparkle on hover */}
      {isHovered && (
        <Sparkles
          size={24}
          color="rgba(255,255,255,0.9)"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1,
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
  const { colorTheme, visualStyle, isDarkMode } = useThemeStore()

  // Get current theme colors
  const theme = COLOR_THEMES[colorTheme]
  const style = VISUAL_STYLES[visualStyle]

  const handleGameClick = (game: LotteryGame) => {
    navigate(`/game/${game.id}`)
  }

  const handleQRTicket = () => {
    navigate('/qr-ticket')
  }

  // Generate header styles based on visual style
  const getHeaderStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: '16px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }

    switch (visualStyle) {
      case 'glass':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${theme.colors[600]}ee 0%, ${theme.colors[700]}dd 100%)`,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        }
      case 'neumorphic':
        return {
          ...baseStyle,
          background: isDarkMode ? '#1a2332' : '#e8eef5',
          boxShadow: isDarkMode
            ? 'inset 0 2px 4px rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.3)'
            : 'inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 24px rgba(0,0,0,0.08)',
        }
      case 'bold':
        return {
          ...baseStyle,
          background: theme.gradient,
          borderBottom: `3px solid ${theme.colors[800]}`,
          boxShadow: `0 6px 0 ${theme.colors[700]}`,
        }
      case 'minimal':
        return {
          ...baseStyle,
          background: isDarkMode ? '#0f172a' : '#ffffff',
          borderBottom: isDarkMode ? '1px solid #1e293b' : '1px solid #f1f5f9',
        }
      default: // bento
        return {
          ...baseStyle,
          background: theme.gradient,
          boxShadow: `0 4px 24px ${theme.primary}40`,
        }
    }
  }

  // Generate logo style based on visual style
  const getLogoStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }

    switch (visualStyle) {
      case 'glass':
        return {
          ...baseStyle,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }
      case 'neumorphic':
        return {
          ...baseStyle,
          background: theme.gradient,
          borderRadius: '16px',
          boxShadow: isDarkMode
            ? '4px 4px 12px #0d1117, -4px -4px 12px #273549'
            : '4px 4px 12px #c8d0dc, -4px -4px 12px #ffffff',
        }
      case 'bold':
        return {
          ...baseStyle,
          background: 'white',
          borderRadius: '12px',
          border: `3px solid ${theme.colors[800]}`,
          boxShadow: `3px 3px 0 ${theme.colors[800]}`,
        }
      case 'minimal':
        return {
          ...baseStyle,
          background: theme.gradient,
          borderRadius: '14px',
        }
      default: // bento
        return {
          ...baseStyle,
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '14px',
          border: '2px solid rgba(255,255,255,0.25)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }
    }
  }

  // Get text colors based on visual style
  const getHeaderTextColor = () => {
    if (visualStyle === 'neumorphic' && !isDarkMode) return theme.colors[800]
    if (visualStyle === 'minimal') return isDarkMode ? '#f8fafc' : theme.colors[700]
    return 'white'
  }

  const getSubtextColor = () => {
    if (visualStyle === 'neumorphic' && !isDarkMode) return theme.colors[600]
    if (visualStyle === 'minimal') return isDarkMode ? '#94a3b8' : theme.colors[500]
    return 'rgba(255,255,255,0.8)'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode
        ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
        : visualStyle === 'neumorphic'
        ? 'linear-gradient(180deg, #e8eef5 0%, #dfe6ef 100%)'
        : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header - Modern 2026 Design with Theme Support */}
      <div style={getHeaderStyle()}>
        {/* Decorative gradient orbs for glass/bento styles */}
        {(visualStyle === 'glass' || visualStyle === 'bento') && (
          <>
            <div style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              background: `radial-gradient(circle, ${theme.colors[400]}30 0%, transparent 70%)`,
              borderRadius: '50%',
              top: '-40px',
              right: '60px',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              width: '80px',
              height: '80px',
              background: `radial-gradient(circle, ${theme.colors[300]}20 0%, transparent 70%)`,
              borderRadius: '50%',
              bottom: '-30px',
              left: '100px',
              pointerEvents: 'none',
            }} />
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
          {/* Octili "O" Logo - Themed */}
          <div style={getLogoStyle()}>
            <span style={{
              fontSize: '26px',
              fontWeight: 900,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: visualStyle === 'bold' ? theme.colors[600] : (visualStyle === 'neumorphic' && !isDarkMode ? 'white' : 'white'),
              textShadow: visualStyle === 'glass' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
              letterSpacing: '-2px',
            }}>O</span>
          </div>
          <div>
            <h1 style={{
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: getHeaderTextColor(),
              textShadow: (visualStyle === 'glass' || visualStyle === 'bento') ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            }}>
              Octili
            </h1>
            <p style={{
              fontSize: '11px',
              color: getSubtextColor(),
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              Lottery Terminal
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
          {/* Balance Card - Themed */}
          <div style={{
            background: visualStyle === 'neumorphic'
              ? (isDarkMode ? '#1e293b' : '#f0f4f8')
              : visualStyle === 'minimal'
              ? (isDarkMode ? '#1e293b' : theme.colors[50])
              : visualStyle === 'bold'
              ? 'white'
              : 'rgba(255,255,255,0.12)',
            backdropFilter: visualStyle === 'glass' ? 'blur(12px)' : undefined,
            padding: '10px 16px',
            borderRadius: visualStyle === 'bold' ? '8px' : '14px',
            border: visualStyle === 'bold'
              ? `2px solid ${theme.colors[700]}`
              : visualStyle === 'neumorphic'
              ? 'none'
              : visualStyle === 'minimal'
              ? (isDarkMode ? '1px solid #334155' : `1px solid ${theme.colors[200]}`)
              : '1px solid rgba(255,255,255,0.15)',
            boxShadow: visualStyle === 'neumorphic'
              ? (isDarkMode ? '4px 4px 8px #0d1117, -4px -4px 8px #273549' : '4px 4px 8px #c8d0dc, -4px -4px 8px #ffffff')
              : visualStyle === 'bold'
              ? `2px 2px 0 ${theme.colors[700]}`
              : visualStyle === 'glass'
              ? '0 4px 16px rgba(0,0,0,0.1)'
              : 'none',
          }}>
            <p style={{
              fontSize: '10px',
              color: visualStyle === 'bold' || (visualStyle === 'neumorphic' && !isDarkMode) || visualStyle === 'minimal'
                ? theme.colors[500]
                : 'rgba(255,255,255,0.75)',
              marginBottom: '2px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Balance
            </p>
            <p style={{
              fontSize: '16px',
              fontWeight: 800,
              color: visualStyle === 'bold' || (visualStyle === 'neumorphic' && !isDarkMode)
                ? theme.colors[700]
                : visualStyle === 'minimal'
                ? (isDarkMode ? '#f8fafc' : theme.colors[700])
                : 'white',
              fontFamily: 'ui-monospace, monospace',
            }}>
              {balance.toFixed(2)} <span style={{ fontSize: '11px', opacity: 0.8 }}>BRL</span>
            </p>
          </div>

          {/* Menu Button - Themed - 48px minimum touch target */}
          <button
            onClick={() => navigate('/menu')}
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              minHeight: '48px',
              background: visualStyle === 'neumorphic'
                ? (isDarkMode ? '#1e293b' : '#f0f4f8')
                : visualStyle === 'minimal'
                ? (isDarkMode ? '#1e293b' : theme.colors[50])
                : visualStyle === 'bold'
                ? 'white'
                : 'rgba(255,255,255,0.12)',
              backdropFilter: visualStyle === 'glass' ? 'blur(12px)' : undefined,
              border: visualStyle === 'bold'
                ? `2px solid ${theme.colors[700]}`
                : visualStyle === 'minimal'
                ? (isDarkMode ? '1px solid #334155' : `1px solid ${theme.colors[200]}`)
                : visualStyle === 'neumorphic'
                ? 'none'
                : '1px solid rgba(255,255,255,0.15)',
              borderRadius: visualStyle === 'bold' ? '8px' : '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: visualStyle === 'neumorphic'
                ? (isDarkMode ? '4px 4px 8px #0d1117, -4px -4px 8px #273549' : '4px 4px 8px #c8d0dc, -4px -4px 8px #ffffff')
                : visualStyle === 'bold'
                ? `2px 2px 0 ${theme.colors[700]}`
                : visualStyle === 'glass'
                ? '0 4px 16px rgba(0,0,0,0.1)'
                : 'none',
            }}
            title="Operator Menu"
          >
            <Menu
              size={24}
              color={
                visualStyle === 'bold' || (visualStyle === 'neumorphic' && !isDarkMode)
                  ? theme.colors[600]
                  : visualStyle === 'minimal'
                  ? (isDarkMode ? '#f8fafc' : theme.colors[600])
                  : 'white'
              }
            />
          </button>
        </div>
      </div>

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
          {/* Two Main Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '32px',
          }}>
            <MainActionButton
              icon={QrCode}
              label="QR Ticket"
              gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)"
              shadowColor="#3b82f6"
              onClick={handleQRTicket}
            />
            <MainActionButton
              icon={Ticket}
              label="Draw Ticket"
              gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)"
              shadowColor="#8b5cf6"
              onClick={() => {
                // Scroll to games section
                const gamesSection = document.getElementById('games-section')
                if (gamesSection) {
                  gamesSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            />
          </div>

          {/* Draw Ticket Section Header */}
          <div
            id="games-section"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            }}>
              <Ticket size={22} color="white" />
            </div>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: isDarkMode ? '#f8fafc' : '#1e293b',
              }}>
                Draw Ticket
              </h2>
              <p style={{
                fontSize: '12px',
                color: isDarkMode ? '#94a3b8' : '#64748b',
              }}>
                Select a lottery game to play
              </p>
            </div>
          </div>

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
      <BottomNavigation activeTab="draw" />

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
