/**
 * ============================================================================
 * SECOND DISPLAY PAGE - PLAYER-FACING SCREEN
 * ============================================================================
 *
 * Purpose: Main container for the second display (player-facing screen) that
 * shows the games grid, game selection, and cart synced with the cashier's
 * main display. Players can also interact and add games to cart.
 *
 * Features:
 * - Real-time sync with main cashier display via BroadcastChannel
 * - Interactive games grid - players can select games
 * - Game selection interface - players can choose numbers/multipliers
 * - Live cart view - shows items being added by either display
 * - Beautiful Octili branding and animations
 *
 * Usage: Opens in a separate browser window on the player-facing monitor
 * Access URL: /second-display
 *
 * Dependencies: React, Zustand stores, useBroadcastSync hook
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Monitor, Wifi, WifiOff, ShoppingCart, Sparkles } from 'lucide-react'
import { useBroadcastSync } from '@/hooks/useBroadcastSync'
import { useDisplaySyncStore } from '@/stores/displaySyncStore'
import { useGameStore } from '@/stores/gameStore'
import { SecondDisplayGames } from './SecondDisplayGames'
import { SecondDisplayGamePlay } from './SecondDisplayGamePlay'
import { SecondDisplayCart } from './SecondDisplayCart'

/**
 * Display view modes
 */
type ViewMode = 'games' | 'gameplay' | 'cart' | 'idle' | 'payment' | 'complete'

/**
 * Main Second Display Page Component
 *
 * This is the entry point for the player-facing display. It manages the
 * current view based on sync messages from the main cashier display and
 * local navigation.
 */
export function SecondDisplayPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Broadcast sync for communication with main display
  const { sendMessage, lastMessage, isConnected, isPeerActive } = useBroadcastSync('second')

  // Display sync store for shared state
  const { displayMode, setDisplayMode, activeGame, currentPath } = useDisplaySyncStore()

  // Game store for cart data
  const { cartTickets } = useGameStore()

  // Local view mode - can be overridden by main display
  const [viewMode, setViewMode] = useState<ViewMode>('games')

  // Selected game ID for gameplay view
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)

  // Welcome animation state
  const [showWelcome, setShowWelcome] = useState(true)

  /**
   * Handle incoming messages from main display
   */
  useEffect(() => {
    if (!lastMessage) return

    switch (lastMessage.type) {
      case 'NAVIGATE':
        const payload = lastMessage.payload as { path: string; params?: Record<string, string> }
        if (payload.path.startsWith('/game/')) {
          const gameId = payload.path.split('/game/')[1]
          setSelectedGameId(gameId)
          setViewMode('gameplay')
        } else if (payload.path === '/cart') {
          setViewMode('cart')
        } else if (payload.path === '/pos' || payload.path === '/') {
          setViewMode('games')
          setSelectedGameId(null)
        }
        break

      case 'GAME_SELECT':
        const gamePayload = lastMessage.payload as { gameId: string }
        setSelectedGameId(gamePayload.gameId)
        setViewMode('gameplay')
        break

      case 'DISPLAY_MODE':
        const modePayload = lastMessage.payload as { mode: ViewMode; gameId?: string }
        setViewMode(modePayload.mode)
        if (modePayload.gameId) {
          setSelectedGameId(modePayload.gameId)
        }
        break

      case 'CART_UPDATE':
        // Cart is automatically synced via Zustand localStorage
        break

      case 'SYNC_REQUEST':
        // Respond with current state
        sendMessage('SYNC_RESPONSE', {
          currentPath: viewMode,
          currentGameId: selectedGameId,
          selections: [],
          betAmount: 0.5,
          numberOfDraws: 1,
          cartCount: cartTickets.length,
        })
        break
    }
  }, [lastMessage, sendMessage, cartTickets.length])

  /**
   * Hide welcome screen after initial animation
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  /**
   * Handle game selection from this display
   */
  const handleGameSelect = (gameId: string) => {
    setSelectedGameId(gameId)
    setViewMode('gameplay')
    // Notify main display
    sendMessage('GAME_SELECT', { gameId, gameName: '' })
    sendMessage('DISPLAY_MODE', { mode: 'gameplay', gameId })
  }

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    setViewMode('games')
    setSelectedGameId(null)
    sendMessage('DISPLAY_MODE', { mode: 'games' })
  }

  /**
   * Handle cart view toggle
   */
  const handleCartToggle = () => {
    if (viewMode === 'cart') {
      setViewMode('games')
      sendMessage('DISPLAY_MODE', { mode: 'games' })
    } else {
      setViewMode('cart')
      sendMessage('DISPLAY_MODE', { mode: 'cart' })
    }
  }

  /**
   * Render welcome/idle screen
   */
  if (showWelcome) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background circles */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(36, 189, 104, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '-100px',
          right: '-100px',
          animation: 'pulse 3s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 167, 126, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '-50px',
          left: '-50px',
          animation: 'pulse 3s ease-in-out infinite 1s',
        }} />

        {/* Logo and welcome text */}
        <div style={{
          textAlign: 'center',
          zIndex: 1,
          animation: 'fadeIn 1s ease-out',
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            boxShadow: '0 20px 60px rgba(36, 189, 104, 0.4)',
            animation: 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          }}>
            <span style={{ fontSize: '56px' }}>🎰</span>
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: 800,
            color: 'white',
            marginBottom: '16px',
            letterSpacing: '-1px',
          }}>
            Octili
          </h1>

          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 500,
          }}>
            Welcome • Bem-vindo
          </p>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounceIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    )
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
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        {/* Left: Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(36, 189, 104, 0.3)',
          }}>
            <span style={{ fontSize: '20px' }}>🎰</span>
          </div>
          <div>
            <h1 style={{
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}>
              Octili
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Monitor size={12} color="rgba(255,255,255,0.6)" />
              <span style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 500,
              }}>
                Player Display
              </span>
            </div>
          </div>
        </div>

        {/* Center: Connection Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: isPeerActive
            ? 'rgba(36, 189, 104, 0.2)'
            : 'rgba(239, 68, 68, 0.2)',
          borderRadius: '20px',
          border: `1px solid ${isPeerActive ? 'rgba(36, 189, 104, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        }}>
          {isPeerActive ? (
            <Wifi size={14} color="#24BD68" />
          ) : (
            <WifiOff size={14} color="#ef4444" />
          )}
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: isPeerActive ? '#24BD68' : '#ef4444',
          }}>
            {isPeerActive ? 'Synced' : 'Offline'}
          </span>
        </div>

        {/* Right: Cart Button */}
        <button
          onClick={handleCartToggle}
          style={{
            background: viewMode === 'cart'
              ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
              : 'rgba(255,255,255,0.1)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '12px',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s',
          }}
        >
          <ShoppingCart size={18} />
          <span>Cart</span>
          {cartTickets.length > 0 && (
            <span style={{
              background: viewMode === 'cart' ? 'white' : '#ef4444',
              color: viewMode === 'cart' ? '#24BD68' : 'white',
              fontSize: '11px',
              fontWeight: 700,
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              {cartTickets.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {viewMode === 'games' && (
          <SecondDisplayGames
            onGameSelect={handleGameSelect}
            sendMessage={sendMessage}
          />
        )}

        {viewMode === 'gameplay' && selectedGameId && (
          <SecondDisplayGamePlay
            gameId={selectedGameId}
            onBack={handleBack}
            sendMessage={sendMessage}
          />
        )}

        {viewMode === 'cart' && (
          <SecondDisplayCart
            onBack={handleBack}
            sendMessage={sendMessage}
          />
        )}
      </div>

      {/* Footer Branding */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
      }}>
        <Sparkles size={14} color="#24BD68" />
        <span style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
          fontWeight: 500,
        }}>
          Play responsibly • Jogue com responsabilidade
        </span>
        <Sparkles size={14} color="#24BD68" />
      </div>
    </div>
  )
}

export default SecondDisplayPage
