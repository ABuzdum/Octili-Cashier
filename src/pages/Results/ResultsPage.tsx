/**
 * ============================================================================
 * RESULTS PAGE - DRAW RESULTS
 * ============================================================================
 *
 * Purpose: Beautiful display of draw results for all games
 * Designed for VLT terminals and player-facing displays
 *
 * @author Octili Development Team
 * @version 2.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, ChevronRight, Target, Trophy, Calendar } from 'lucide-react'
import { useLotteryGames } from '@/stores/gameStore'
import { mockDrawResults } from '@/data/games-mock-data'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { useSwipeNavigation } from '@/hooks'

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

export function ResultsPage() {
  const navigate = useNavigate()
  const games = useLotteryGames()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [hoveredGame, setHoveredGame] = useState<string | null>(null)

  // Swipe navigation handlers
  const swipeHandlers = useSwipeNavigation({ currentPage: 'results' })

  // Get results for selected game
  const gameResults = selectedGame
    ? mockDrawResults.filter((r) => r.gameId === selectedGame)
    : []

  // Get game index for gradient
  const getGameIndex = (gameId: string) => {
    return games.findIndex(g => g.id === gameId)
  }

  // Handle print (simulated)
  const handlePrint = (gameId: string) => {
    console.log('Printing results for game:', gameId)
  }

  return (
    <div
      {...swipeHandlers}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'pan-y',
      }}>
      {/* AppHeader with balance and menu */}
      <AppHeader
        showBack
        backPath={selectedGame ? undefined : '/pos'}
        title={selectedGame ? games.find(g => g.id === selectedGame)?.name || 'Results' : 'Draw Results'}
        subtitle="Latest game results"
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '20px',
        paddingBottom: '100px',
        overflow: 'auto',
      }}>
        {!selectedGame ? (
          <>
            {/* Games List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              {games.map((game, index) => {
                const isHovered = hoveredGame === game.id
                return (
                  <div
                    key={game.id}
                    onMouseEnter={() => setHoveredGame(game.id)}
                    onMouseLeave={() => setHoveredGame(null)}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: isHovered
                        ? '0 12px 32px rgba(0,0,0,0.12)'
                        : '0 4px 16px rgba(0,0,0,0.06)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                    }}>
                      {/* Game Icon */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: GAME_GRADIENTS[index % GAME_GRADIENTS.length],
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        marginRight: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}>
                        {game.icon}
                      </div>

                      <span style={{
                        flex: 1,
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: '16px',
                      }}>
                        {game.name}
                      </span>

                      <button
                        onClick={() => handlePrint(game.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 16px',
                          background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                          marginRight: '12px',
                        }}
                      >
                        <Printer size={16} />
                        Print
                      </button>

                      <button
                        onClick={() => setSelectedGame(game.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          background: '#f1f5f9',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#64748b',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <>
            {/* Game Results Detail */}
            <div style={{
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              {/* Results Summary Card */}
              <div style={{
                background: GAME_GRADIENTS[getGameIndex(selectedGame) % GAME_GRADIENTS.length],
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '20px',
                position: 'relative',
                overflow: 'hidden',
              }}>
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}>
                  <Trophy size={24} color="white" />
                  <span style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Results Available
                  </span>
                </div>

                <p style={{
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 700,
                }}>
                  {gameResults.length}
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '14px',
                }}>
                  Draw results for this game
                </p>
              </div>

              {/* Results Table */}
              <div style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.2fr 0.8fr 1fr',
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Draw</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Result</span>
                </div>

                {/* Table Rows */}
                {gameResults.map((result, index) => (
                  <div
                    key={result.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1.2fr 0.8fr 1fr',
                      padding: '16px 20px',
                      borderBottom: index < gameResults.length - 1 ? '1px solid #f1f5f9' : 'none',
                      background: index % 2 === 0 ? 'white' : '#fafafa',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>#{result.drawNumber}</span>
                    <span style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#94a3b8" />
                      {result.date}
                    </span>
                    <span style={{ fontSize: '14px', color: '#334155' }}>{result.time}</span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      background: GAME_GRADIENTS[getGameIndex(selectedGame) % GAME_GRADIENTS.length],
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {result.result}
                    </span>
                  </div>
                ))}

                {gameResults.length === 0 && (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: '#f1f5f9',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}>
                      <Target size={28} color="#94a3b8" />
                    </div>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>No results available</p>
                  </div>
                )}
              </div>

              {/* Print Button */}
              <button
                onClick={() => handlePrint(selectedGame)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '18px',
                  marginTop: '20px',
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Printer size={22} />
                Print Results
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="results" />
    </div>
  )
}
