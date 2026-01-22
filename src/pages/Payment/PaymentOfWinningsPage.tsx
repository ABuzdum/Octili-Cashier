/**
 * ============================================================================
 * PAY WINNINGS PAGE
 * ============================================================================
 *
 * Purpose: Validate lottery tickets and pay out prizes
 * Clear naming for any cashier: "Pay" = Pay winnings to customers
 *
 * Features:
 * - Modern barcode/ticket number input
 * - Animated QR code scanning button
 * - Beautiful validation result modals
 * - Smooth number pad interactions
 *
 * @author Octili Development Team
 * @version 2.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, QrCode, X, Check, AlertCircle, Ban, Banknote, Sparkles } from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'
import { BottomNavigation } from '@/components/layout/BottomNavigation'

type ValidationStatus = 'idle' | 'valid' | 'invalid' | 'paid'

export function PaymentOfWinningsPage() {
  const navigate = useNavigate()
  const { ticketHistory } = useGameStore()

  const [barcode, setBarcode] = useState('')
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle')
  const [winAmount, setWinAmount] = useState(0)
  const [gameName, setGameName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  // Handle barcode input
  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9-]/g, '')
    setBarcode(value)
  }

  // Simulate QR code scanning
  const handleScanQR = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      if (ticketHistory.length > 0) {
        const randomTicket = ticketHistory[Math.floor(Math.random() * ticketHistory.length)]
        setBarcode(randomTicket.ticketNumber)
        validateBarcode(randomTicket.ticketNumber)
      } else {
        setBarcode('0289-2397122442-00028362302')
      }
    }, 1500)
  }

  // Validate the barcode
  const validateBarcode = (code?: string) => {
    const ticketNumber = code || barcode.replace(/-/g, '')

    const ticket = ticketHistory.find(
      (t) => t.ticketNumber.replace(/-/g, '') === ticketNumber
    )

    if (!ticket) {
      setValidationStatus('invalid')
      setGameName('')
      setWinAmount(0)
      setShowModal(true)
      return
    }

    if (ticket.status === 'paid') {
      setValidationStatus('paid')
      setGameName(ticket.bet.gameName)
      setShowModal(true)
      return
    }

    const isWin = Math.random() > 0.3
    if (isWin) {
      const amount = ticket.bet.totalCost * (Math.floor(Math.random() * 5) + 2)
      setValidationStatus('valid')
      setWinAmount(amount)
      setGameName(ticket.bet.gameName)
    } else {
      setValidationStatus('invalid')
      setWinAmount(0)
      setGameName(ticket.bet.gameName)
    }
    setShowModal(true)
  }

  // Handle payout
  const handlePayout = () => {
    setShowModal(false)
    setBarcode('')
    setValidationStatus('idle')
    navigate('/pos')
  }

  // Close modal and reset
  const closeModal = () => {
    setShowModal(false)
    if (validationStatus !== 'valid') {
      setBarcode('')
      setValidationStatus('idle')
    }
  }

  // Number pad button component
  const NumButton = ({ value, onClick, variant = 'default' }: {
    value: string;
    onClick: () => void;
    variant?: 'default' | 'confirm' | 'delete'
  }) => {
    const [isPressed, setIsPressed] = useState(false)

    const backgrounds = {
      default: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      confirm: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
      delete: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    }

    const shadows = {
      default: '0 4px 12px rgba(0,0,0,0.1)',
      confirm: '0 4px 16px rgba(16, 185, 129, 0.4)',
      delete: '0 4px 16px rgba(245, 158, 11, 0.4)',
    }

    return (
      <button
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        style={{
          padding: '20px',
          fontSize: '24px',
          fontWeight: 700,
          background: backgrounds[variant],
          color: variant === 'default' ? '#334155' : 'white',
          border: 'none',
          borderRadius: '16px',
          cursor: 'pointer',
          boxShadow: shadows[variant],
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        }}
      >
        {value}
      </button>
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
        background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 50%, #047857 100%)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          top: '-80px',
          right: '-60px',
        }} />
        <div style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          bottom: '-40px',
          left: '20%',
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
          <Banknote size={28} color="white" />
          <h1 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            Pay Winnings
          </h1>
        </div>

        <div style={{ width: '40px' }} />
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 20px',
        paddingBottom: '100px',
      }}>
        {/* Barcode Input */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          marginBottom: '24px',
        }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            color: '#64748b',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
          }}>
            Ticket Number / Barcode
          </label>
          <input
            type="text"
            value={barcode}
            onChange={handleBarcodeChange}
            placeholder="Enter or scan ticket number"
            style={{
              width: '100%',
              padding: '18px 20px',
              fontSize: '18px',
              fontFamily: 'ui-monospace, monospace',
              border: 'none',
              borderRadius: '16px',
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              outline: 'none',
              transition: 'box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.2), 0 0 0 3px rgba(16, 185, 129, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && barcode) {
                validateBarcode()
              }
            }}
          />
        </div>

        {/* QR Scan Button */}
        <button
          onClick={handleScanQR}
          disabled={isScanning}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '18px 36px',
            background: isScanning
              ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
              : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: isScanning ? 'not-allowed' : 'pointer',
            boxShadow: isScanning
              ? 'none'
              : '0 8px 24px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginBottom: '32px',
          }}
        >
          <QrCode size={24} style={{
            animation: isScanning ? 'pulse 1s ease-in-out infinite' : 'none',
          }} />
          {isScanning ? 'Scanning...' : 'Scan QR Code'}
        </button>

        {/* Number Pad */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          width: '100%',
          maxWidth: '320px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}>
            <Sparkles size={16} color="#f59e0b" />
            <span style={{
              fontSize: '12px',
              color: '#94a3b8',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Manual Entry
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <NumButton
                key={num}
                value={String(num)}
                onClick={() => setBarcode(barcode + num)}
              />
            ))}
            <NumButton
              value="✓"
              onClick={() => validateBarcode()}
              variant="confirm"
            />
            <NumButton
              value="0"
              onClick={() => setBarcode(barcode + '0')}
            />
            <NumButton
              value="⌫"
              onClick={() => setBarcode(barcode.slice(0, -1))}
              variant="delete"
            />
          </div>
        </div>
      </div>

      {/* Validation Result Modal */}
      {showModal && (
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
            padding: '32px 24px',
            width: '100%',
            maxWidth: '340px',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#f1f5f9',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} />
            </button>

            {validationStatus === 'valid' && (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                }}>
                  <Check size={40} color="white" strokeWidth={3} />
                </div>
                <h3 style={{
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '8px',
                }}>
                  Winner!
                </h3>
                <p style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#64748b',
                  marginBottom: '16px',
                }}>
                  {gameName}
                </p>
                <div style={{
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px',
                }}>
                  <p style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#00A77E',
                    fontWeight: 500,
                    marginBottom: '4px',
                  }}>
                    Prize Amount
                  </p>
                  <p style={{
                    textAlign: 'center',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#047857',
                  }}>
                    {winAmount.toFixed(2)} BRL
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handlePayout}
                    style={{
                      flex: 1,
                      padding: '16px',
                      borderRadius: '14px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    <Banknote size={20} />
                    Pay Out
                  </button>
                  <button
                    onClick={closeModal}
                    style={{
                      flex: 1,
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
              </>
            )}

            {validationStatus === 'invalid' && (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
                }}>
                  <AlertCircle size={40} color="white" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '8px',
                }}>
                  No Win
                </h3>
                <p style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#64748b',
                  marginBottom: '24px',
                }}>
                  This ticket did not win. Please try another ticket.
                </p>
                <button
                  onClick={closeModal}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  Try Another Ticket
                </button>
              </>
            )}

            {validationStatus === 'paid' && (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
                }}>
                  <Ban size={40} color="white" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '8px',
                }}>
                  Already Paid
                </h3>
                <p style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#64748b',
                  marginBottom: '24px',
                }}>
                  This ticket has already been paid out. Please try another ticket.
                </p>
                <button
                  onClick={closeModal}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  Try Another Ticket
                </button>
              </>
            )}
          </div>
        </div>
      )}

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
