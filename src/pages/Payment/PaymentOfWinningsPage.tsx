/**
 * ============================================================================
 * PAYMENT OF WINNINGS PAGE
 * ============================================================================
 *
 * Purpose: Screen for validating and paying out winning tickets
 * Based on SUMUS POS Terminal design
 *
 * Features:
 * - Manual barcode/ticket number entry
 * - QR code scanning button (simulated)
 * - Ticket validation with status display
 * - Payout confirmation
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, QrCode, X } from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'

// Brand colors
const BRAND = {
  green: '#24BD68',
  teal: '#00A77E',
  deepTeal: '#006E7E',
  darkBlue: '#28455B',
  charcoal: '#282E3A',
  orange: '#f59e0b',
}

type ValidationStatus = 'idle' | 'valid' | 'invalid' | 'paid'

export function PaymentOfWinningsPage() {
  const navigate = useNavigate()
  const { validateTicket, payoutTicket, ticketHistory } = useGameStore()

  const [barcode, setBarcode] = useState('')
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle')
  const [winAmount, setWinAmount] = useState(0)
  const [gameName, setGameName] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Handle barcode input
  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and hyphens
    const value = e.target.value.replace(/[^0-9-]/g, '')
    setBarcode(value)
  }

  // Simulate QR code scanning
  const handleScanQR = () => {
    // In production, this would open a camera to scan QR code
    // For demo, we'll use a random ticket from history
    if (ticketHistory.length > 0) {
      const randomTicket = ticketHistory[Math.floor(Math.random() * ticketHistory.length)]
      setBarcode(randomTicket.ticketNumber)
      validateBarcode(randomTicket.ticketNumber)
    } else {
      // Show a demo ticket number
      setBarcode('0289-2397122442-00028362302')
    }
  }

  // Validate the barcode
  const validateBarcode = (code?: string) => {
    const ticketNumber = code || barcode.replace(/-/g, '')

    // Find ticket in history (in production this would be an API call)
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

    // Simulate random win (in production, this comes from backend)
    const isWin = Math.random() > 0.3 // 70% chance of win for demo
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
    // In production, this would call an API and print a receipt
    setShowModal(false)
    setBarcode('')
    setValidationStatus('idle')
    // Navigate back or show success
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

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: BRAND.green,
          marginBottom: '40px',
        }}>
          Payment of winnings
        </h1>

        {/* Barcode Input */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          marginBottom: '32px',
        }}>
          <input
            type="text"
            value={barcode}
            onChange={handleBarcodeChange}
            placeholder="Barcode"
            style={{
              width: '100%',
              padding: '16px 20px',
              fontSize: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = BRAND.green
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && barcode) {
                validateBarcode()
              }
            }}
          />
        </div>

        {/* Camera Scan QR Button */}
        <button
          onClick={handleScanQR}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px 32px',
            background: BRAND.orange,
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <QrCode size={24} />
          Camera scan Qrcode
        </button>

        {/* Number Pad for manual entry */}
        <div style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          width: '100%',
          maxWidth: '280px',
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => setBarcode(barcode + num)}
              style={{
                padding: '20px',
                fontSize: '24px',
                fontWeight: 600,
                background: '#e0f2fe',
                color: BRAND.darkBlue,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => validateBarcode()}
            style={{
              padding: '20px',
              fontSize: '24px',
              fontWeight: 600,
              background: BRAND.green,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            ✓
          </button>
          <button
            onClick={() => setBarcode(barcode + '0')}
            style={{
              padding: '20px',
              fontSize: '24px',
              fontWeight: 600,
              background: '#e0f2fe',
              color: BRAND.darkBlue,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            0
          </button>
          <button
            onClick={() => setBarcode(barcode.slice(0, -1))}
            style={{
              padding: '20px',
              fontSize: '24px',
              fontWeight: 600,
              background: BRAND.orange,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            ⌫
          </button>
        </div>
      </div>

      {/* Validation Result Modal */}
      {showModal && (
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
            maxWidth: '320px',
            position: 'relative',
          }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
              }}
            >
              <X size={24} />
            </button>

            {validationStatus === 'valid' && (
              <>
                <h3 style={{
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: BRAND.charcoal,
                  marginBottom: '8px',
                }}>
                  Valid ticket
                </h3>
                <p style={{
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: BRAND.green,
                  marginBottom: '24px',
                }}>
                  Win: {winAmount.toFixed(2)}
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handlePayout}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: BRAND.green,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                    }}
                  >
                    Payment
                  </button>
                  <button
                    onClick={closeModal}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '8px',
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
              </>
            )}

            {validationStatus === 'invalid' && (
              <>
                <h3 style={{
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#ef4444',
                  marginBottom: '24px',
                }}>
                  Ticket not valid
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={closeModal}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: BRAND.green,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                    }}
                  >
                    OK
                  </button>
                  <button
                    onClick={closeModal}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '8px',
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
              </>
            )}

            {validationStatus === 'paid' && (
              <>
                <h3 style={{
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: BRAND.orange,
                  marginBottom: '24px',
                }}>
                  Paid ticket
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={closeModal}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: BRAND.green,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                    }}
                  >
                    OK
                  </button>
                  <button
                    onClick={closeModal}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '8px',
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
