/**
 * ============================================================================
 * QR PAGE - PLAYER ACCOUNT INTERACTIONS
 * ============================================================================
 *
 * Purpose: Beautiful QR code interactions for player accounts
 * Designed for VLT terminals and player-facing displays
 *
 * Features:
 * - QR Replenishment (add money to player's account)
 * - QR Payout (pay out from player's account)
 * - Animated QR scan interface
 * - Beautiful transaction confirmations
 *
 * @author Octili Development Team
 * @version 2.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, QrCode, Plus, Minus, Scan, Wallet, CheckCircle2, User } from 'lucide-react'
import { BottomNavigation } from '@/components/layout/BottomNavigation'

type QRMode = 'menu' | 'replenishment' | 'payout'

/**
 * Animated NumButton component for number pad
 */
function NumButton({
  value,
  onClick,
  variant = 'default',
}: {
  value: string
  onClick: () => void
  variant?: 'default' | 'confirm' | 'delete' | 'zero'
}) {
  const [isPressed, setIsPressed] = useState(false)

  const getBackground = () => {
    switch (variant) {
      case 'confirm':
        return 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
      case 'delete':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      case 'zero':
        return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
      default:
        return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    }
  }

  const getShadow = () => {
    switch (variant) {
      case 'confirm':
        return 'rgba(16, 185, 129, 0.4)'
      case 'delete':
        return 'rgba(245, 158, 11, 0.4)'
      default:
        return 'rgba(59, 130, 246, 0.4)'
    }
  }

  return (
    <button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
      style={{
        padding: '20px',
        fontSize: '24px',
        fontWeight: 700,
        background: getBackground(),
        color: 'white',
        border: 'none',
        borderRadius: '16px',
        cursor: 'pointer',
        boxShadow: `0 4px 16px ${getShadow()}`,
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
      }}
    >
      {value}
    </button>
  )
}

export function QRPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<QRMode>('menu')
  const [amount, setAmount] = useState('')
  const [playerAccount, setPlayerAccount] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)

  // Handle amount input
  const handleNumberInput = (num: string) => {
    setAmount((prev) => prev + num)
  }

  const handleBackspace = () => {
    setAmount((prev) => prev.slice(0, -1))
  }

  // Simulate QR scan (in production would open camera)
  const handleScanQR = () => {
    setIsScanning(true)
    setTimeout(() => {
      setPlayerAccount('******52795')
      setIsScanning(false)
    }, 1500)
  }

  // Handle transaction
  const handleTransaction = () => {
    if (!playerAccount || !amount) return
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
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            top: '-60px',
            right: '-40px',
          }} />
          <div style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            bottom: '-30px',
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
            <QrCode size={28} color="white" />
            <h1 style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              QR Transactions
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
          justifyContent: 'center',
          padding: '40px 20px',
          paddingBottom: '100px',
        }}>
          {/* QR Illustration */}
          <div style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            boxShadow: '0 16px 48px rgba(67, 233, 123, 0.3)',
          }}>
            <Scan size={56} color="white" />
          </div>

          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '8px',
          }}>
            Player Account
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '40px',
            textAlign: 'center',
          }}>
            Scan QR code to replenish or pay out
          </p>

          {/* QR Options */}
          <div style={{
            width: '100%',
            maxWidth: '360px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {/* Replenishment Option */}
            <button
              onClick={() => setMode('replenishment')}
              onMouseEnter={() => setHoveredOption('replenishment')}
              onMouseLeave={() => setHoveredOption(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 24px',
                background: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                boxShadow: hoveredOption === 'replenishment'
                  ? '0 12px 32px rgba(16, 185, 129, 0.25)'
                  : '0 4px 16px rgba(0,0,0,0.06)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredOption === 'replenishment' ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}>
                <Plus size={28} color="white" />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '4px',
                }}>
                  QR Replenishment
                </span>
                <span style={{
                  fontSize: '13px',
                  color: '#64748b',
                }}>
                  Add funds to player account
                </span>
              </div>
            </button>

            {/* Payout Option */}
            <button
              onClick={() => setMode('payout')}
              onMouseEnter={() => setHoveredOption('payout')}
              onMouseLeave={() => setHoveredOption(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 24px',
                background: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                boxShadow: hoveredOption === 'payout'
                  ? '0 12px 32px rgba(239, 68, 68, 0.25)'
                  : '0 4px 16px rgba(0,0,0,0.06)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredOption === 'payout' ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              }}>
                <Minus size={28} color="white" />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '4px',
                }}>
                  QR Payout
                </span>
                <span style={{
                  fontSize: '13px',
                  color: '#64748b',
                }}>
                  Pay out from player account
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab="sellticket" />
      </div>
    )
  }

  // Replenishment or Payout Mode
  const isReplenishment = mode === 'replenishment'
  const modeGradient = isReplenishment
    ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  const modeShadow = isReplenishment
    ? 'rgba(16, 185, 129, 0.4)'
    : 'rgba(239, 68, 68, 0.4)'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: modeGradient,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          top: '-60px',
          right: '-40px',
        }} />

        <button
          onClick={() => setMode('menu')}
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
          {isReplenishment ? <Plus size={24} color="white" /> : <Minus size={24} color="white" />}
          <h1 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            {isReplenishment ? 'QR Replenishment' : 'QR Payout'}
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
        padding: '24px 20px',
        paddingBottom: '100px',
        overflow: 'auto',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '360px',
        }}>
          {/* Player Account Card */}
          {playerAccount ? (
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: modeGradient,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${modeShadow}`,
                }}>
                  <User size={28} color="white" />
                </div>
                <div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px',
                  }}>
                    Player Account
                  </p>
                  <p style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#1e293b',
                    fontFamily: 'monospace',
                  }}>
                    {playerAccount}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Scan QR Button */
            <button
              onClick={handleScanQR}
              disabled={isScanning}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                padding: '40px',
                background: 'white',
                border: '3px dashed #e2e8f0',
                borderRadius: '24px',
                cursor: isScanning ? 'wait' : 'pointer',
                marginBottom: '24px',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                background: modeGradient,
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${modeShadow}`,
                animation: isScanning ? 'pulse 1s infinite' : 'none',
              }}>
                <Scan size={40} color="white" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '4px',
                }}>
                  {isScanning ? 'Scanning...' : 'Scan Player QR Code'}
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#64748b',
                }}>
                  {isScanning ? 'Please wait' : 'Tap to open camera'}
                </p>
              </div>
            </button>
          )}

          {/* Amount Input & Keypad */}
          {playerAccount && (
            <>
              {/* Amount Display */}
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '20px 24px',
                marginBottom: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                }}>
                  Amount (BRL)
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Wallet size={24} color="#64748b" />
                  <span style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: amount ? '#1e293b' : '#cbd5e1',
                    fontFamily: 'monospace',
                  }}>
                    {amount || '0.00'}
                  </span>
                </div>
              </div>

              {/* Number Pad */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '24px',
              }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <NumButton
                    key={num}
                    value={String(num)}
                    onClick={() => handleNumberInput(String(num))}
                  />
                ))}
                <NumButton
                  value="✓"
                  variant="confirm"
                  onClick={handleTransaction}
                />
                <NumButton
                  value="0"
                  variant="zero"
                  onClick={() => handleNumberInput('0')}
                />
                <NumButton
                  value="⌫"
                  variant="delete"
                  onClick={handleBackspace}
                />
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleTransaction}
                disabled={!amount}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: amount ? modeGradient : '#e2e8f0',
                  color: amount ? 'white' : '#94a3b8',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: amount ? 'pointer' : 'not-allowed',
                  boxShadow: amount ? `0 4px 16px ${modeShadow}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                {isReplenishment ? <Plus size={22} /> : <Minus size={22} />}
                {isReplenishment ? 'Add to Account' : 'Pay Out'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
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
            padding: '40px',
            textAlign: 'center',
            maxWidth: '320px',
            width: '100%',
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: modeGradient,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: `0 8px 24px ${modeShadow}`,
            }}>
              <CheckCircle2 size={40} color="white" />
            </div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '8px',
            }}>
              Transaction Successful!
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
            }}>
              <span style={{
                fontWeight: 700,
                background: modeGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {amount} BRL
              </span>
              {' '}{isReplenishment ? 'added to' : 'paid from'} account
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="sellticket" />
    </div>
  )
}
