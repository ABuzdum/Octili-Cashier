/**
 * ============================================================================
 * RESULTS PAGE - DRAW RESULTS
 * ============================================================================
 *
 * Purpose: Display draw results for all games
 * Based on SUMUS POS Terminal design
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, ChevronRight } from 'lucide-react'
import { useLotteryGames } from '@/stores/gameStore'
import { mockDrawResults } from '@/data/games-mock-data'
import { BottomNavigation } from '@/components/layout/BottomNavigation'

// Brand colors
const BRAND = {
  green: '#24BD68',
  teal: '#00A77E',
  deepTeal: '#006E7E',
  darkBlue: '#28455B',
  charcoal: '#282E3A',
}

export function ResultsPage() {
  const navigate = useNavigate()
  const games = useLotteryGames()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  // Get results for selected game
  const gameResults = selectedGame
    ? mockDrawResults.filter((r) => r.gameId === selectedGame)
    : []

  // Handle print (simulated)
  const handlePrint = (gameId: string) => {
    console.log('Printing results for game:', gameId)
    // In production, this would trigger the thermal printer
  }

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
        borderBottom: '1px solid #e2e8f0',
      }}>
        <button
          onClick={() => selectedGame ? setSelectedGame(null) : navigate('/pos')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: BRAND.darkBlue,
          }}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '16px',
        paddingBottom: '80px',
        overflow: 'auto',
      }}>
        {!selectedGame ? (
          <>
            <h2 style={{
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 700,
              color: BRAND.charcoal,
              marginBottom: '24px',
            }}>
              Draw Results
            </h2>

            {/* Games List */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              {games.map((game, index) => (
                <div
                  key={game.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: index < games.length - 1 ? '1px solid #e2e8f0' : 'none',
                  }}
                >
                  <span style={{
                    flex: 1,
                    fontWeight: 600,
                    color: BRAND.charcoal,
                  }}>
                    {game.name}
                  </span>
                  <button
                    onClick={() => handlePrint(game.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: 'none',
                      border: 'none',
                      color: BRAND.green,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Printer size={18} />
                    Printing
                  </button>
                  <button
                    onClick={() => setSelectedGame(game.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px',
                      background: 'none',
                      border: 'none',
                      color: BRAND.darkBlue,
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Game Results Detail */}
            <h2 style={{
              textAlign: 'left',
              fontSize: '18px',
              fontWeight: 700,
              color: BRAND.charcoal,
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              {games.find((g) => g.id === selectedGame)?.name}
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '16px',
            }}>
              Draw Results: {gameResults.length}
            </p>

            {/* Results Table */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                padding: '12px 16px',
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Number</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Date</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Time</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Result</span>
              </div>

              {/* Table Rows */}
              {gameResults.map((result, index) => (
                <div
                  key={result.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    padding: '12px 16px',
                    borderBottom: index < gameResults.length - 1 ? '1px solid #e2e8f0' : 'none',
                  }}
                >
                  <span style={{ fontSize: '13px', color: BRAND.charcoal }}>{result.drawNumber}</span>
                  <span style={{ fontSize: '13px', color: BRAND.charcoal }}>{result.date}</span>
                  <span style={{ fontSize: '13px', color: BRAND.charcoal }}>{result.time}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: BRAND.green }}>{result.result}</span>
                </div>
              ))}

              {gameResults.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  No results available
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
                gap: '8px',
                width: '100%',
                padding: '14px',
                marginTop: '16px',
                background: 'none',
                border: 'none',
                color: BRAND.green,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Printer size={20} />
              Printing
            </button>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="results" />
    </div>
  )
}
