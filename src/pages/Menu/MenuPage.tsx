/**
 * ============================================================================
 * MENU PAGE - CASHIER SETTINGS & MANAGEMENT
 * ============================================================================
 *
 * Purpose: Menu for cashier operations and settings
 * Based on SUMUS POS Terminal design
 *
 * Features:
 * - Reports menu
 * - Cash collection
 * - Cash replenishment
 * - History
 * - Exit (logout)
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Wallet, PiggyBank, History, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useGameStore } from '@/stores/gameStore'
import { operatorInfo } from '@/data/games-mock-data'
import { BottomNavigation } from '@/components/layout/BottomNavigation'

// Brand colors
const BRAND = {
  green: '#24BD68',
  teal: '#00A77E',
  deepTeal: '#006E7E',
  darkBlue: '#28455B',
  charcoal: '#282E3A',
  orange: '#f59e0b',
}

type ModalType = 'none' | 'collection' | 'replenishment' | 'history'

export function MenuPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { balance, cashCollection, cashReplenishment, cashTransactions, ticketHistory } = useGameStore()

  const [activeModal, setActiveModal] = useState<ModalType>('none')
  const [amount, setAmount] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

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

  // Number pad input
  const handleNumberInput = (num: string) => {
    setAmount((prev) => prev + num)
  }

  const handleBackspace = () => {
    setAmount((prev) => prev.slice(0, -1))
  }

  const menuItems = [
    { icon: FileText, label: 'Reports menu', action: () => navigate('/reports') },
    { icon: Wallet, label: 'Cash collection', action: () => setActiveModal('collection') },
    { icon: PiggyBank, label: 'Cash replenishment', action: () => setActiveModal('replenishment') },
    { icon: History, label: 'History', action: () => setActiveModal('history') },
    { icon: LogOut, label: 'Exit', action: handleLogout },
  ]

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
          onClick={() => navigate('/pos')}
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

      {/* Operator Info */}
      <div style={{
        background: BRAND.darkBlue,
        padding: '24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#ffffff20',
          borderRadius: '50%',
          margin: '0 auto 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <User size={32} color="white" />
        </div>
        <p style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>
          Operator: {operatorInfo.id}
        </p>
        <p style={{
          color: BRAND.green,
          fontSize: '20px',
          fontWeight: 700,
        }}>
          Balance: {balance.toFixed(2)} {operatorInfo.currency} 🔄
        </p>
      </div>

      {/* Menu Items */}
      <div style={{
        flex: 1,
        padding: '16px',
        paddingBottom: '80px',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={item.action}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: index < menuItems.length - 1 ? '1px solid #e2e8f0' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Icon size={22} color={BRAND.darkBlue} />
                <span style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: BRAND.charcoal,
                }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Support Phone */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
        }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Support phone</p>
          <p style={{ fontSize: '16px', fontWeight: 600, color: BRAND.darkBlue }}>
            {operatorInfo.supportPhone}
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="menu" />

      {/* Cash Collection/Replenishment Modal */}
      {(activeModal === 'collection' || activeModal === 'replenishment') && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '340px',
          }}>
            <h3 style={{
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 700,
              color: BRAND.green,
              marginBottom: '24px',
            }}>
              {activeModal === 'collection' ? 'Cash collection' : 'Cash replenishment'}
            </h3>

            {/* Amount Input */}
            <input
              type="text"
              value={amount}
              readOnly
              placeholder="Sum"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '18px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                marginBottom: '16px',
                textAlign: 'center',
                fontWeight: 600,
              }}
            />

            {/* Number Pad */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(String(num))}
                  style={{
                    padding: '16px',
                    fontSize: '20px',
                    fontWeight: 600,
                    background: '#0ea5e9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => activeModal === 'collection' ? handleCashCollection() : handleCashReplenishment()}
                style={{
                  padding: '16px',
                  fontSize: '20px',
                  fontWeight: 600,
                  background: BRAND.green,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                ✓
              </button>
              <button
                onClick={() => handleNumberInput('0')}
                style={{
                  padding: '16px',
                  fontSize: '20px',
                  fontWeight: 600,
                  background: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                style={{
                  padding: '16px',
                  fontSize: '20px',
                  fontWeight: 600,
                  background: BRAND.orange,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                ⌫
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => activeModal === 'collection' ? handleCashCollection() : handleCashReplenishment()}
                style={{
                  padding: '14px',
                  borderRadius: '24px',
                  border: `2px solid ${BRAND.orange}`,
                  background: 'white',
                  color: BRAND.orange,
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                {activeModal === 'collection' ? 'Cash collection' : 'Cash replenishment'}
              </button>
              {activeModal === 'collection' && (
                <button
                  onClick={handleAllMoney}
                  style={{
                    padding: '14px',
                    borderRadius: '24px',
                    border: `2px solid ${BRAND.orange}`,
                    background: 'white',
                    color: BRAND.orange,
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                >
                  All the money
                </button>
              )}
              <button
                onClick={() => {
                  setActiveModal('none')
                  setAmount('')
                }}
                style={{
                  padding: '14px',
                  borderRadius: '24px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
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
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: BRAND.charcoal,
              }}>
                History
              </h3>
              <button
                onClick={() => setActiveModal('none')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
              >
                ×
              </button>
            </div>

            {ticketHistory.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                No history yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ticketHistory.slice(0, 20).map((ticket) => (
                  <div
                    key={ticket.id}
                    style={{
                      padding: '12px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {new Date(ticket.purchasedAt).toLocaleString()}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: ticket.status === 'won' ? BRAND.green : ticket.status === 'lost' ? '#ef4444' : BRAND.orange,
                      }}>
                        {ticket.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontWeight: 600, color: BRAND.charcoal, marginTop: '4px' }}>
                      {ticket.bet.gameName}
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                      {ticket.ticketNumber}
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: BRAND.green }}>
                      +{ticket.bet.totalCost.toFixed(2)} BRL
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
