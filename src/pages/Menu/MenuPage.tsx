/**
 * ============================================================================
 * MENU PAGE - CASHIER SETTINGS & MANAGEMENT
 * ============================================================================
 *
 * Purpose: Beautiful menu for cashier operations and settings
 * Designed for VLT terminals and player-facing displays
 *
 * Features:
 * - Operator info display
 * - Cash management (collection/replenishment)
 * - History view
 * - Logout
 *
 * @author Octili Development Team
 * @version 2.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Wallet, PiggyBank, History, LogOut, User, Phone, ChevronRight, X, Check, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useGameStore } from '@/stores/gameStore'
import { operatorInfo } from '@/data/games-mock-data'
import { BottomNavigation } from '@/components/layout/BottomNavigation'

type ModalType = 'none' | 'collection' | 'replenishment' | 'history'

export function MenuPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { balance, cashCollection, cashReplenishment, ticketHistory } = useGameStore()

  const [activeModal, setActiveModal] = useState<ModalType>('none')
  const [amount, setAmount] = useState('')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Handle logout
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Handle cash collection
  const handleCashCollection = () => {
    const numAmount = parseFloat(amount)
    if (numAmount > 0 && numAmount <= balance) {
      cashCollection(numAmount)
      setAmount('')
      setActiveModal('none')
    }
  }

  // Handle cash replenishment
  const handleCashReplenishment = () => {
    const numAmount = parseFloat(amount)
    if (numAmount > 0) {
      cashReplenishment(numAmount)
      setAmount('')
      setActiveModal('none')
    }
  }

  // Fill all money for collection
  const handleAllMoney = () => {
    setAmount(balance.toFixed(2))
  }

  // Number pad component
  const NumButton = ({ value, onClick, variant = 'default' }: {
    value: string;
    onClick: () => void;
    variant?: 'default' | 'confirm' | 'delete'
  }) => {
    const [isPressed, setIsPressed] = useState(false)
    const backgrounds = {
      default: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      confirm: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delete: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    }
    return (
      <button
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        style={{
          padding: '18px',
          fontSize: '22px',
          fontWeight: 700,
          background: backgrounds[variant],
          color: variant === 'default' ? '#334155' : 'white',
          border: 'none',
          borderRadius: '14px',
          cursor: 'pointer',
          boxShadow: variant === 'default' ? '0 4px 12px rgba(0,0,0,0.08)' : '0 4px 12px rgba(0,0,0,0.2)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        }}
      >
        {value}
      </button>
    )
  }

  const menuItems = [
    { id: 'reports', icon: FileText, label: 'Reports Menu', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', action: () => navigate('/reports') },
    { id: 'collection', icon: Wallet, label: 'Cash Collection', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', action: () => setActiveModal('collection') },
    { id: 'replenishment', icon: PiggyBank, label: 'Cash Replenishment', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', action: () => setActiveModal('replenishment') },
    { id: 'history', icon: History, label: 'History', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', action: () => setActiveModal('history') },
    { id: 'logout', icon: LogOut, label: 'Exit', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', action: handleLogout },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          top: '-80px',
          right: '-60px',
        }} />

        <button
          onClick={() => navigate('/pos')}
          style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
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
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          zIndex: 1,
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            Menu
          </h1>
        </div>

        <div style={{ width: '40px' }} />
      </div>

      {/* Operator Info Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        margin: '20px',
        borderRadius: '24px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          top: '-40px',
          right: '-40px',
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}>
            <User size={28} color="white" />
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Operator ID
            </p>
            <p style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>
              {operatorInfo.id}
            </p>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '16px 20px',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>
            Current Balance
          </p>
          <p style={{
            fontSize: '28px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {balance.toFixed(2)} <span style={{ fontSize: '16px' }}>{operatorInfo.currency}</span>
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div style={{
        flex: 1,
        padding: '0 20px',
        paddingBottom: '100px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isHovered = hoveredItem === item.id
            return (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 20px',
                  background: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: isHovered
                    ? '0 12px 32px rgba(0,0,0,0.12)'
                    : '0 4px 16px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: item.gradient,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}>
                  <Icon size={24} color="white" />
                </div>
                <span style={{
                  flex: 1,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                }}>
                  {item.label}
                </span>
                <ChevronRight size={20} color="#94a3b8" />
              </button>
            )
          })}
        </div>

        {/* Support Phone */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '32px',
          padding: '16px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}>
          <Phone size={18} color="#64748b" />
          <span style={{ fontSize: '14px', color: '#64748b' }}>Support:</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
            {operatorInfo.supportPhone}
          </span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="menu" />

      {/* Cash Collection/Replenishment Modal */}
      {(activeModal === 'collection' || activeModal === 'replenishment') && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '28px 24px',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '24px',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: activeModal === 'collection'
                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}>
                {activeModal === 'collection' ? (
                  <Wallet size={28} color="white" />
                ) : (
                  <PiggyBank size={28} color="white" />
                )}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1e293b',
              }}>
                {activeModal === 'collection' ? 'Cash Collection' : 'Cash Replenishment'}
              </h3>
            </div>

            {/* Amount Input */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
            }}>
              <input
                type="text"
                value={amount}
                readOnly
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '28px',
                  fontWeight: 700,
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'center',
                  color: '#1e293b',
                  outline: 'none',
                }}
              />
              <p style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#64748b',
              }}>
                {activeModal === 'collection' ? `Max: ${balance.toFixed(2)} BRL` : 'Enter amount'}
              </p>
            </div>

            {/* Number Pad */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px',
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <NumButton
                  key={num}
                  value={String(num)}
                  onClick={() => setAmount(amount + num)}
                />
              ))}
              <NumButton
                value="✓"
                onClick={() => activeModal === 'collection' ? handleCashCollection() : handleCashReplenishment()}
                variant="confirm"
              />
              <NumButton
                value="0"
                onClick={() => setAmount(amount + '0')}
              />
              <NumButton
                value="⌫"
                onClick={() => setAmount(amount.slice(0, -1))}
                variant="delete"
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeModal === 'collection' && (
                <button
                  onClick={handleAllMoney}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  <Sparkles size={20} />
                  Collect All ({balance.toFixed(2)} BRL)
                </button>
              )}
              <button
                onClick={() => {
                  setActiveModal('none')
                  setAmount('')
                }}
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
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

      {/* History Modal */}
      {activeModal === 'history' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <History size={20} color="white" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                  Transaction History
                </h3>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflow: 'auto' }}>
              {ticketHistory.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: '#f1f5f9',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}>
                    <History size={28} color="#94a3b8" />
                  </div>
                  <p style={{ color: '#64748b', fontSize: '14px' }}>No history yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {ticketHistory.slice(0, 20).map((ticket) => (
                    <div
                      key={ticket.id}
                      style={{
                        padding: '16px',
                        background: '#f8fafc',
                        borderRadius: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          {new Date(ticket.purchasedAt).toLocaleString()}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: ticket.status === 'won'
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : ticket.status === 'lost'
                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: 'white',
                        }}>
                          {ticket.status.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                        {ticket.bet.gameName}
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
                        {ticket.ticketNumber}
                      </p>
                      <p style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#10b981',
                      }}>
                        +{ticket.bet.totalCost.toFixed(2)} BRL
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
