/**
 * ============================================================================
 * TERMINAL OFFLINE OVERLAY
 * ============================================================================
 *
 * Purpose: Full-screen overlay shown when terminal is temporarily not working
 *
 * Features:
 * - Shows reason for being offline
 * - Displays offline duration
 * - Animated background
 * - Resume work button with optional PIN verification
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import { Play, Clock, AlertTriangle, Lock } from 'lucide-react'
import {
  useTerminalStore,
  OFFLINE_REASONS,
  formatOfflineDuration,
} from '@/stores/terminalStore'
import { useAuthStore } from '@/stores/authStore'

/**
 * Full-screen overlay component for offline terminal state
 * Blocks all interactions until terminal is brought back online
 */
export function TerminalOfflineOverlay() {
  const { isOnline, offlineReason, offlineNote, offlineSince, expectedReturn, goOnline } = useTerminalStore()
  const { user } = useAuthStore()
  const [duration, setDuration] = useState('')
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)

  // Update duration every minute
  useEffect(() => {
    if (!isOnline && offlineSince) {
      const updateDuration = () => {
        setDuration(formatOfflineDuration(offlineSince))
      }
      updateDuration()
      const interval = setInterval(updateDuration, 60000)
      return () => clearInterval(interval)
    }
  }, [isOnline, offlineSince])

  // Don't render if terminal is online
  if (isOnline) return null

  const reasonConfig = offlineReason ? OFFLINE_REASONS[offlineReason] : null

  // Handle resume with PIN verification
  const handleResume = () => {
    // For demo, accept any 4-digit PIN or skip verification
    if (pin.length === 4 || pin === '') {
      goOnline()
      setShowPinModal(false)
      setPin('')
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  // Handle PIN input
  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit)
      setPinError(false)
    }
  }

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1))
    setPinError(false)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      overflow: 'hidden',
    }}>
      {/* Animated background circles */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: reasonConfig?.gradient || 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        borderRadius: '50%',
        top: '-100px',
        right: '-100px',
        opacity: 0.1,
        animation: 'pulse 4s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: reasonConfig?.gradient || 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        borderRadius: '50%',
        bottom: '-80px',
        left: '-80px',
        opacity: 0.1,
        animation: 'pulse 4s ease-in-out infinite 1s',
      }} />

      {/* Main content */}
      <div style={{
        textAlign: 'center',
        padding: '40px',
        maxWidth: '400px',
        zIndex: 1,
      }}>
        {/* Status icon */}
        <div style={{
          width: '120px',
          height: '120px',
          background: reasonConfig?.gradient || 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
          borderRadius: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: `0 20px 60px ${reasonConfig?.color || '#64748b'}40`,
          fontSize: '56px',
        }}>
          {reasonConfig?.icon || '⏸️'}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: 'white',
          marginBottom: '12px',
          letterSpacing: '-0.5px',
        }}>
          Terminal Offline
        </h1>

        {/* Reason */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: reasonConfig?.gradient || 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
          borderRadius: '30px',
          marginBottom: '24px',
        }}>
          <span style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'white',
          }}>
            {reasonConfig?.label || 'Unavailable'}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '16px',
          color: '#94a3b8',
          marginBottom: '32px',
          lineHeight: 1.6,
        }}>
          {offlineNote || reasonConfig?.description || 'Terminal is temporarily unavailable'}
        </p>

        {/* Duration & Info Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {/* Duration */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '16px',
          }}>
            <Clock size={20} color="#94a3b8" />
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Offline for</span>
            <span style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'white',
              fontFamily: 'ui-monospace, monospace',
            }}>
              {duration || '0m'}
            </span>
          </div>

          {/* Expected return */}
          {expectedReturn && (
            <div style={{
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                Expected return: <strong style={{ color: 'white' }}>{expectedReturn}</strong>
              </span>
            </div>
          )}

          {/* Operator info */}
          {user && (
            <div style={{
              paddingTop: '16px',
              marginTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ color: '#64748b', fontSize: '12px' }}>
                Operator: {user.name}
              </span>
            </div>
          )}
        </div>

        {/* Resume button */}
        <button
          onClick={() => setShowPinModal(true)}
          style={{
            width: '100%',
            padding: '20px 32px',
            background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
            border: 'none',
            borderRadius: '16px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.3s',
          }}
        >
          <Play size={24} />
          Resume Work
        </button>

        {/* Warning note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '24px',
        }}>
          <AlertTriangle size={14} color="#f59e0b" />
          <span style={{ color: '#64748b', fontSize: '12px' }}>
            All transactions are paused while offline
          </span>
        </div>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderRadius: '28px',
            padding: '32px',
            width: '100%',
            maxWidth: '340px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Lock size={28} color="white" />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'white',
                marginBottom: '8px',
              }}>
                Enter PIN to Resume
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Enter your 4-digit PIN or press confirm
              </p>
            </div>

            {/* PIN Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '48px',
                    height: '56px',
                    background: pin[i] ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)' : 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: 'white',
                    border: pinError ? '2px solid #ef4444' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {pin[i] ? '•' : ''}
                </div>
              ))}
            </div>

            {pinError && (
              <p style={{
                color: '#ef4444',
                fontSize: '13px',
                textAlign: 'center',
                marginBottom: '16px',
              }}>
                Invalid PIN. Please try again.
              </p>
            )}

            {/* Number Pad */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px',
            }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => {
                    if (digit === 'C') {
                      setPin('')
                      setPinError(false)
                    } else if (digit === '⌫') {
                      handlePinDelete()
                    } else {
                      handlePinInput(digit)
                    }
                  }}
                  style={{
                    padding: '18px',
                    borderRadius: '14px',
                    border: 'none',
                    background: digit === 'C'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : digit === '⌫'
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(255,255,255,0.1)',
                    color: digit === 'C'
                      ? '#ef4444'
                      : digit === '⌫'
                      ? '#f59e0b'
                      : 'white',
                    fontSize: '22px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {digit}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowPinModal(false)
                  setPin('')
                  setPinError(false)
                }}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleResume}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.15; }
        }
      `}</style>
    </div>
  )
}
