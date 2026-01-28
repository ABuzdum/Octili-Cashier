/**
 * ============================================================================
 * REPORTS PAGE - LOTTERY TERMINAL REPORTS
 * ============================================================================
 *
 * Purpose: View lottery sales reports, payouts, and shift analytics
 *
 * Features:
 * - Daily/Shift summary with sales and payouts
 * - Game-by-game breakdown
 * - Net balance calculation
 * - Commission earned
 * - Transaction history summary
 *
 * @author Octili Development Team
 * @version 2.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Ticket,
  Banknote,
  Trophy,
  Calendar,
  Clock,
  ChevronRight,
  Wallet,
  BarChart3,
  PieChart,
  FileText,
  Download,
  Printer,
} from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'

// Report period type
type ReportPeriod = 'today' | 'shift' | 'week' | 'month'

// Mock data for lottery reports
const MOCK_REPORTS = {
  today: {
    period: 'Today',
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    ticketsSold: 147,
    totalSales: 4250.00,
    ticketsPaid: 23,
    totalPayouts: 1850.00,
    netBalance: 2400.00,
    commission: 127.50,
    games: [
      { name: 'Loto Gold', sales: 1200.00, payouts: 450.00, tickets: 42 },
      { name: 'Keno Express', sales: 980.00, payouts: 320.00, tickets: 38 },
      { name: 'Lucky Wheel', sales: 750.00, payouts: 580.00, tickets: 28 },
      { name: 'Super 7', sales: 620.00, payouts: 200.00, tickets: 22 },
      { name: 'Instant Win', sales: 450.00, payouts: 180.00, tickets: 12 },
      { name: 'Mega Jackpot', sales: 250.00, payouts: 120.00, tickets: 5 },
    ],
    hourlyData: [
      { hour: '08:00', sales: 180 },
      { hour: '09:00', sales: 320 },
      { hour: '10:00', sales: 450 },
      { hour: '11:00', sales: 380 },
      { hour: '12:00', sales: 520 },
      { hour: '13:00', sales: 420 },
      { hour: '14:00', sales: 380 },
      { hour: '15:00', sales: 450 },
      { hour: '16:00', sales: 550 },
      { hour: '17:00', sales: 600 },
    ],
  },
  shift: {
    period: 'Current Shift',
    date: 'Started at 08:00',
    ticketsSold: 89,
    totalSales: 2580.00,
    ticketsPaid: 14,
    totalPayouts: 980.00,
    netBalance: 1600.00,
    commission: 77.40,
    games: [
      { name: 'Loto Gold', sales: 720.00, payouts: 280.00, tickets: 26 },
      { name: 'Keno Express', sales: 580.00, payouts: 180.00, tickets: 24 },
      { name: 'Lucky Wheel', sales: 450.00, payouts: 320.00, tickets: 18 },
      { name: 'Super 7', sales: 380.00, payouts: 100.00, tickets: 14 },
      { name: 'Instant Win', sales: 280.00, payouts: 60.00, tickets: 5 },
      { name: 'Mega Jackpot', sales: 170.00, payouts: 40.00, tickets: 2 },
    ],
    hourlyData: [
      { hour: '08:00', sales: 180 },
      { hour: '09:00', sales: 320 },
      { hour: '10:00', sales: 450 },
      { hour: '11:00', sales: 380 },
      { hour: '12:00', sales: 520 },
      { hour: '13:00', sales: 420 },
      { hour: '14:00', sales: 310 },
    ],
  },
}

export function ReportsPage() {
  const navigate = useNavigate()
  const { balance } = useGameStore()
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('today')
  const [hoveredGame, setHoveredGame] = useState<string | null>(null)

  const report = selectedPeriod === 'shift' ? MOCK_REPORTS.shift : MOCK_REPORTS.today

  // Calculate percentage for progress bars
  const maxSales = Math.max(...report.games.map(g => g.sales))

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
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '50%',
          top: '-80px',
          right: '-60px',
        }} />

        <button
          onClick={() => navigate('/menu')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            color: 'white',
            zIndex: 1,
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 1,
        }}>
          <BarChart3 size={24} color="white" />
          <h1 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 700,
          }}>
            Reports
          </h1>
        </div>

        <button
          onClick={() => {/* Print report */}}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            color: 'white',
            zIndex: 1,
          }}
        >
          <Printer size={20} />
        </button>
      </div>

      {/* Period Selector */}
      <div style={{
        padding: '16px 20px',
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          background: '#f1f5f9',
          borderRadius: '12px',
          padding: '4px',
        }}>
          {[
            { id: 'today', label: 'Today', icon: Calendar },
            { id: 'shift', label: 'Shift', icon: Clock },
          ].map((period) => {
            const Icon = period.icon
            const isActive = selectedPeriod === period.id
            return (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id as ReportPeriod)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                }}
              >
                <Icon size={16} />
                {period.label}
              </button>
            )
          })}
        </div>
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#64748b',
          marginTop: '12px',
        }}>
          {report.date}
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '16px 20px',
        paddingBottom: '100px',
        overflow: 'auto',
      }}>
        {/* Summary Cards - Top Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '16px',
        }}>
          {/* Total Sales */}
          <div style={{
            background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
            borderRadius: '20px',
            padding: '20px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              top: '-30px',
              right: '-30px',
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}>
              <TrendingUp size={20} />
              <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.9 }}>
                Total Sales
              </span>
            </div>
            <p style={{
              fontSize: '28px',
              fontWeight: 800,
              marginBottom: '4px',
            }}>
              {report.totalSales.toFixed(2)}
            </p>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>
              {report.ticketsSold} tickets sold
            </p>
          </div>

          {/* Total Payouts */}
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '20px',
            padding: '20px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              top: '-30px',
              right: '-30px',
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}>
              <TrendingDown size={20} />
              <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.9 }}>
                Total Payouts
              </span>
            </div>
            <p style={{
              fontSize: '28px',
              fontWeight: 800,
              marginBottom: '4px',
            }}>
              {report.totalPayouts.toFixed(2)}
            </p>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>
              {report.ticketsPaid} winners paid
            </p>
          </div>
        </div>

        {/* Summary Cards - Bottom Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px',
        }}>
          {/* Net Balance */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Wallet size={20} color="white" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                Net Balance
              </span>
            </div>
            <p style={{
              fontSize: '24px',
              fontWeight: 800,
              color: report.netBalance >= 0 ? '#24BD68' : '#ef4444',
            }}>
              {report.netBalance >= 0 ? '+' : ''}{report.netBalance.toFixed(2)}
            </p>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              Sales minus payouts
            </p>
          </div>

          {/* Commission */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Trophy size={20} color="white" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                Commission
              </span>
            </div>
            <p style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#8b5cf6',
            }}>
              {report.commission.toFixed(2)}
            </p>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              3% of sales
            </p>
          </div>
        </div>

        {/* Game Breakdown */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          marginBottom: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <PieChart size={22} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                  Sales by Game
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  {report.games.length} games played
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {report.games.map((game, index) => {
              const percentage = (game.sales / maxSales) * 100
              const netProfit = game.sales - game.payouts
              const isHovered = hoveredGame === game.name

              return (
                <div
                  key={game.name}
                  onMouseEnter={() => setHoveredGame(game.name)}
                  onMouseLeave={() => setHoveredGame(null)}
                  style={{
                    padding: '14px',
                    background: isHovered ? '#f8fafc' : 'transparent',
                    borderRadius: '14px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: `hsl(${index * 50}, 70%, 60%)`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Ticket size={16} color="white" />
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                          {game.name}
                        </p>
                        <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {game.tickets} tickets
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                        {game.sales.toFixed(2)} USD
                      </p>
                      <p style={{
                        fontSize: '11px',
                        color: netProfit >= 0 ? '#24BD68' : '#ef4444',
                        fontWeight: 600,
                      }}>
                        {netProfit >= 0 ? '+' : ''}{netProfit.toFixed(2)} net
                      </p>
                    </div>
                  </div>
                  <div style={{
                    height: '6px',
                    background: '#f1f5f9',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, hsl(${index * 50}, 70%, 55%) 0%, hsl(${index * 50}, 70%, 45%) 100%)`,
                      borderRadius: '3px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}>
          <button
            onClick={() => {/* Download PDF */}}
            style={{
              padding: '16px',
              background: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <Download size={20} color="#667eea" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
              Download PDF
            </span>
          </button>

          <button
            onClick={() => {/* View full report */}}
            style={{
              padding: '16px',
              background: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <FileText size={20} color="#667eea" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
              Full Report
            </span>
          </button>
        </div>
      </div>

      {/* Current Balance Footer */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '16px 20px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
      }}>
        <div>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>Current Terminal Balance</p>
          <p style={{ fontSize: '24px', fontWeight: 800, color: '#24BD68' }}>
            {balance.toFixed(2)} USD
          </p>
        </div>
        <button
          onClick={() => navigate('/menu')}
          style={{
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '14px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
          }}
        >
          Back to Menu
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
