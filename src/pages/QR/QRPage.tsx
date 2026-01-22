/**
 * ============================================================================
 * QR PAGE - PLAYER ACCOUNT INTERACTIONS
 * ============================================================================
 *
 * Purpose: QR code interactions for player accounts
 * Based on SUMUS POS Terminal design
 *
 * Features:
 * - QR Replenishment (add money to player's account)
 * - QR Payout (pay out from player's account)
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, QrCode, Plus, Minus } from 'lucide-react'
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

type QRMode = 'menu' | 'replenishment' | 'payout'

export function QRPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<QRMode>('menu')
  const [amount, setAmount] = useState('')
  const [playerAccount, setPlayerAccount] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Handle amount input
  const handleNumberInput = (num: string) => {
    setAmount((prev) => prev + num)
  }

  const handleBackspace = () => {
    setAmount((prev) => prev.slice(0, -1))
  }

  // Simulate QR scan (in production would open camera)
  const handleScanQR = () => {
    // Simulated player account
    setPlayerAccount('******52795')
  }

  // Handle transaction
  const handleTransaction = () => {
    if (!playerAccount || !amount) return
    // In production, this would call an API
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setAmount('')
      setPlayerAccount('')
      setMode('menu')
    }, 2000)
  }

  if (mode === 'menu') {
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
          justifyContent: 'center',
          padding: '40px 20px',
          paddingBottom: '100px',
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: BRAND.charcoal,
            marginBottom: '48px',
          }}>
            QR
          </h1>

          {/* QR Options */}
          <div style={{
            width: '100%',
            maxWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <button
              onClick={() => setMode('replenishment')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '18px 32px',
                background: BRAND.orange,
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              <QrCode size={24} />
              QR Replenishment
            </button>

            <button
              onClick={() => setMode('payout')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '18px 32px',
                background: BRAND.orange,
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              <QrCode size={24} />
              QR Payout
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab="qr" />
      </div>
    )
  }

  // Replenishment or Payout Mode
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
          onClick={() => setMode('menu')}
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
        padding: '32px 20px',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: mode === 'replenishment' ? BRAND.green : '#ef4444',
          marginBottom: '32px',
        }}>
          {mode === 'replenishment' ? 'QR Replenishment' : 'QR Payout'}
        </h2>

        {/* Player Account Display */}
        {playerAccount && (
          <div style={{
            padding: '16px 24px',
            background: `${BRAND.green}10`,
            borderRadius: '12px',
            marginBottom: '24px',
          }}>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Player Account</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: BRAND.charcoal }}>
              {playerAccount}
            </p>
          </div>
        )}

        {/* Scan QR Button */}
        {!playerAccount && (
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
              marginBottom: '32px',
            }}
          >
            <QrCode size={24} />
            Scan Player QR Code
          </button>
        )}

        {/* Amount Input */}
        {playerAccount && (
          <>
            <input
              type="text"
              value={amount}
              readOnly
              placeholder="Enter amount"
              style={{
                width: '100%',
                maxWidth: '280px',
                padding: '14px 16px',
                fontSize: '20px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                marginBottom: '16px',
                textAlign: 'center',
                fontWeight: 600,
              }}
            />

            {/* Number Pad */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '24px',
              width: '100%',
              maxWidth: '280px',
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(String(num))}
                  style={{
                    padding: '18px',
                    fontSize: '22px',
                    fontWeight: 600,
                    background: '#0ea5e9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleTransaction}
                style={{
                  padding: '18px',
                  fontSize: '22px',
                  fontWeight: 600,
                  background: BRAND.green,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                ✓
              </button>
              <button
                onClick={() => handleNumberInput('0')}
                style={{
                  padding: '18px',
                  fontSize: '22px',
                  fontWeight: 600,
                  background: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                style={{
                  padding: '18px',
                  fontSize: '22px',
                  fontWeight: 600,
                  background: BRAND.orange,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                ⌫
              </button>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleTransaction}
              disabled={!amount}
              style={{
                width: '100%',
                maxWidth: '280px',
                padding: '16px',
                background: mode === 'replenishment' ? BRAND.green : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: amount ? 'pointer' : 'not-allowed',
                opacity: amount ? 1 : 0.5,
              }}
            >
              {mode === 'replenishment' ? 'Add to Account' : 'Pay Out'}
            </button>
          </>
        )}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: BRAND.green,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <span style={{ color: 'white', fontSize: '32px' }}>✓</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: BRAND.charcoal }}>
              Transaction Successful!
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
              {amount} BRL {mode === 'replenishment' ? 'added to' : 'paid from'} account
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="qr" />
    </div>
  )
}
