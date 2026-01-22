/**
 * ============================================================================
 * QR TICKET NEW PAGE - ISSUE QR LOTTERY TICKETS
 * ============================================================================
 *
 * Purpose: Interface for cashiers to issue new QR lottery tickets.
 * Customers purchase tickets with a deposit, receive a QR code, play on their
 * phone, and return to the cashier for payout.
 *
 * Features:
 * - Quick amount selection buttons (5, 10, 15, 20, 25, 50, 100)
 * - Custom amount entry with NumPad
 * - Game scope selection (One Game / All Games)
 * - Optional phone number linking
 * - QR code generation and display
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ticket,
  Check,
  X,
  Phone,
  Grid,
  Target,
  Sparkles,
  Printer,
} from 'lucide-react'
import { usePhysicalTicketStore } from '@/stores/physicalTicketStore'
import { useLotteryGames } from '@/stores/gameStore'
import { QRCodeDisplay } from '@/components/shared/QRCodeDisplay'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { AppHeader } from '@/components/layout/AppHeader'
import { SwipePageWrapper } from '@/components/shared/SwipePageWrapper'
import { QUICK_AMOUNTS, type GameScope } from '@/types/physical-ticket.types'
import type { PhysicalTicket } from '@/types/physical-ticket.types'

/**
 * NumPad component for custom amount entry.
 */
function NumPad({
  value,
  onChange,
  onConfirm,
  onCancel,
}: {
  value: string
  onChange: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
}) {
  const handleDigit = (digit: string) => {
    if (value === '0') {
      onChange(digit)
    } else {
      onChange(value + digit)
    }
  }

  const handleBackspace = () => {
    if (value.length <= 1) {
      onChange('0')
    } else {
      onChange(value.slice(0, -1))
    }
  }

  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Display */}
      <div
        style={{
          background: '#f8fafc',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          border: '2px solid #e2e8f0',
        }}
      >
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
          Amount (BRL)
        </p>
        <p
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#1e293b',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          {value}
        </p>
      </div>

      {/* NumPad Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === 'C') {
                onChange('0')
              } else if (btn === '⌫') {
                handleBackspace()
              } else {
                handleDigit(btn)
              }
            }}
            style={{
              height: '56px',
              borderRadius: '14px',
              border: 'none',
              fontSize: '22px',
              fontWeight: 600,
              cursor: 'pointer',
              background: btn === 'C' ? '#fef2f2' : btn === '⌫' ? '#fffbeb' : '#f1f5f9',
              color: btn === 'C' ? '#ef4444' : btn === '⌫' ? '#f59e0b' : '#1e293b',
              transition: 'all 0.15s ease',
            }}
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            height: '52px',
            borderRadius: '14px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            background: '#fee2e2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <X size={20} />
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            height: '52px',
            borderRadius: '14px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(36, 189, 104, 0.3)',
          }}
        >
          <Check size={20} />
          Confirm
        </button>
      </div>
    </div>
  )
}

/**
 * Success modal showing the generated QR code.
 */
function SuccessModal({
  ticket,
  onClose,
  onPrint,
}: {
  ticket: PhysicalTicket
  onClose: () => void
  onPrint: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(36, 189, 104, 0.3)',
          }}
        >
          <Check size={40} color="white" strokeWidth={3} />
        </div>

        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1e293b',
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          Ticket Created!
        </h2>

        <p
          style={{
            fontSize: '15px',
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          {ticket.depositAmount.toFixed(2)} BRL •{' '}
          {ticket.gameScope === 'all' ? 'All Games' : ticket.gameName}
        </p>

        {/* QR Code */}
        <QRCodeDisplay
          value={ticket.qrCode}
          size={180}
          label="Scan to Play"
          showCode
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
          <button
            onClick={onPrint}
            style={{
              flex: 1,
              height: '52px',
              borderRadius: '14px',
              border: '2px solid #e2e8f0',
              background: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Printer size={20} />
            Print
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: '52px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(36, 189, 104, 0.3)',
            }}
          >
            <Check size={20} />
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * NewTicketPage Component
 *
 * Main interface for issuing new physical lottery tickets.
 * Cashiers select deposit amount, game scope, and optionally link a phone number.
 */
export function NewTicketPage() {
  const navigate = useNavigate()
  const games = useLotteryGames()
  const createTicket = usePhysicalTicketStore((state) => state.createTicket)

  // Form state
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [showCustomAmount, setShowCustomAmount] = useState(false)
  const [customAmountValue, setCustomAmountValue] = useState('0')
  const [gameScope, setGameScope] = useState<GameScope>('all')
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showPhoneInput, setShowPhoneInput] = useState(false)

  // Created ticket (for success modal)
  const [createdTicket, setCreatedTicket] = useState<PhysicalTicket | null>(null)

  // Get selected game name
  const selectedGame = games.find((g) => g.id === selectedGameId)

  // Handle amount selection
  const handleAmountSelect = useCallback((amount: number) => {
    setSelectedAmount(amount)
    setShowCustomAmount(false)
  }, [])

  // Handle custom amount confirm
  const handleCustomAmountConfirm = useCallback(() => {
    const amount = parseInt(customAmountValue, 10)
    if (amount > 0) {
      setSelectedAmount(amount)
      setShowCustomAmount(false)
    }
  }, [customAmountValue])

  // Handle create ticket
  const handleCreateTicket = useCallback(() => {
    if (!selectedAmount) return

    const ticket = createTicket({
      amount: selectedAmount,
      gameScope,
      gameId: gameScope === 'single' ? selectedGameId || undefined : undefined,
      gameName: gameScope === 'single' ? selectedGame?.name : undefined,
      phoneNumber: phoneNumber || undefined,
    })

    setCreatedTicket(ticket)
  }, [selectedAmount, gameScope, selectedGameId, selectedGame, phoneNumber, createTicket])

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setCreatedTicket(null)
    // Reset form
    setSelectedAmount(null)
    setGameScope('all')
    setSelectedGameId(null)
    setPhoneNumber('')
    setShowPhoneInput(false)
  }, [])

  // Handle print (placeholder)
  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  // Can create ticket?
  const canCreate =
    selectedAmount !== null &&
    (gameScope === 'all' || (gameScope === 'single' && selectedGameId))

  return (
    <SwipePageWrapper
      currentPage="qrticket-sell"
      background="linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)"
    >
      {/* AppHeader - Consistent header with balance and menu */}
      <AppHeader
        showBack
        backPath="/games"
        title="QR Ticket - Sell"
        subtitle="Issue QR lottery ticket"
      />

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          paddingBottom: '100px',
          overflow: 'auto',
        }}
      >
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {/* Custom Amount NumPad Modal */}
          {showCustomAmount && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '24px',
                  maxWidth: '340px',
                  width: '100%',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1e293b',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  Enter Amount
                </h3>
                <NumPad
                  value={customAmountValue}
                  onChange={setCustomAmountValue}
                  onConfirm={handleCustomAmountConfirm}
                  onCancel={() => setShowCustomAmount(false)}
                />
              </div>
            </div>
          )}

          {/* Section 1: Amount Selection */}
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                1
              </span>
              Select Amount (BRL)
            </h2>

            {/* Quick Amount Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                marginBottom: '12px',
              }}
            >
              {QUICK_AMOUNTS.map((qa) => (
                <button
                  key={qa.value}
                  onClick={() => handleAmountSelect(qa.value)}
                  style={{
                    height: '56px',
                    borderRadius: '14px',
                    border:
                      selectedAmount === qa.value
                        ? '2px solid #3b82f6'
                        : '2px solid #e2e8f0',
                    background:
                      selectedAmount === qa.value
                        ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                        : 'white',
                    fontSize: '20px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: selectedAmount === qa.value ? '#3b82f6' : '#1e293b',
                    transition: 'all 0.15s ease',
                    boxShadow:
                      selectedAmount === qa.value
                        ? '0 4px 12px rgba(59, 130, 246, 0.2)'
                        : 'none',
                  }}
                >
                  {qa.label}
                </button>
              ))}

              {/* Other Amount Button */}
              <button
                onClick={() => {
                  setCustomAmountValue('0')
                  setShowCustomAmount(true)
                }}
                style={{
                  height: '56px',
                  borderRadius: '14px',
                  border: '2px dashed #e2e8f0',
                  background: '#f8fafc',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#64748b',
                  transition: 'all 0.15s ease',
                }}
              >
                Other
              </button>
            </div>

            {/* Selected Amount Display */}
            {selectedAmount && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  borderRadius: '14px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '4px',
                  }}
                >
                  Deposit Amount
                </p>
                <p
                  style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    color: 'white',
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  {selectedAmount.toFixed(2)}{' '}
                  <span style={{ fontSize: '16px', opacity: 0.8 }}>BRL</span>
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Game Scope */}
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                2
              </span>
              Game Access
            </h2>

            {/* Toggle Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button
                onClick={() => {
                  setGameScope('all')
                  setSelectedGameId(null)
                }}
                style={{
                  flex: 1,
                  height: '56px',
                  borderRadius: '14px',
                  border: gameScope === 'all' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                  background:
                    gameScope === 'all'
                      ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                      : 'white',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: gameScope === 'all' ? '#3b82f6' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Grid size={20} />
                All Games
              </button>
              <button
                onClick={() => setGameScope('single')}
                style={{
                  flex: 1,
                  height: '56px',
                  borderRadius: '14px',
                  border:
                    gameScope === 'single' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                  background:
                    gameScope === 'single'
                      ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                      : 'white',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: gameScope === 'single' ? '#3b82f6' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Target size={20} />
                One Game
              </button>
            </div>

            {/* Game Selection (if single game) */}
            {gameScope === 'single' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                }}
              >
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGameId(game.id)}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      border:
                        selectedGameId === game.id
                          ? '2px solid #24BD68'
                          : '2px solid #e2e8f0',
                      background:
                        selectedGameId === game.id
                          ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                          : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '24px',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      {game.icon}
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color:
                          selectedGameId === game.id ? '#059669' : '#1e293b',
                      }}
                    >
                      {game.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Phone Number (Optional) */}
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                3
              </span>
              Phone Number
              <span
                style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  fontWeight: 500,
                  marginLeft: 'auto',
                }}
              >
                Optional
              </span>
            </h2>

            {!showPhoneInput ? (
              <button
                onClick={() => setShowPhoneInput(true)}
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '14px',
                  border: '2px dashed #e2e8f0',
                  background: '#f8fafc',
                  fontSize: '15px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Phone size={18} />
                Add Phone Number
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="tel"
                  placeholder="+55 11 99999-9999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    flex: 1,
                    height: '52px',
                    borderRadius: '14px',
                    border: '2px solid #e2e8f0',
                    padding: '0 16px',
                    fontSize: '16px',
                    fontFamily: 'ui-monospace, monospace',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => {
                    setShowPhoneInput(false)
                    setPhoneNumber('')
                  }}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    border: '2px solid #fee2e2',
                    background: '#fef2f2',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444',
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateTicket}
            disabled={!canCreate}
            style={{
              width: '100%',
              height: '60px',
              borderRadius: '18px',
              border: 'none',
              background: canCreate
                ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
                : '#e2e8f0',
              fontSize: '18px',
              fontWeight: 700,
              cursor: canCreate ? 'pointer' : 'not-allowed',
              color: canCreate ? 'white' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: canCreate
                ? '0 8px 24px rgba(36, 189, 104, 0.35)'
                : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Sparkles size={22} />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {createdTicket && (
        <SuccessModal
          ticket={createdTicket}
          onClose={handleModalClose}
          onPrint={handlePrint}
        />
      )}

      {/* Bottom Navigation - Always visible */}
      <BottomNavigation activeTab="qrticket-sell" />
    </SwipePageWrapper>
  )
}

export default NewTicketPage
