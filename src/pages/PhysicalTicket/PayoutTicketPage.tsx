/**
 * ============================================================================
 * QR TICKET PAYOUT PAGE - REDEEM QR LOTTERY TICKETS
 * ============================================================================
 *
 * Purpose: Interface for cashiers to process payouts for QR lottery tickets.
 * Cashiers scan or enter the QR code, view ticket status, and process payment.
 *
 * Features:
 * - QR code scanner (camera) or manual entry
 * - Status-specific display (not_played, active, finished_won, etc.)
 * - Payout mode selection (winnings only vs winnings + balance)
 * - Payment confirmation and receipt
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Banknote,
  Camera,
  Search,
  Check,
  X,
  AlertTriangle,
  Clock,
  Trophy,
  Ticket,
  CreditCard,
} from 'lucide-react'
import { usePhysicalTicketStore } from '@/stores/physicalTicketStore'
import { useAuthStore } from '@/stores/authStore'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { AppHeader } from '@/components/layout/AppHeader'
import { SwipePageWrapper } from '@/components/shared/SwipePageWrapper'
import { STATUS_DISPLAY_CONFIG, type PayoutMode } from '@/types/physical-ticket.types'
import type { PhysicalTicket, PayoutCalculation } from '@/types/physical-ticket.types'

/**
 * Ticket status modal showing ticket details and payout options.
 */
function TicketStatusModal({
  ticket,
  onClose,
  onPayout,
}: {
  ticket: PhysicalTicket
  onClose: () => void
  onPayout: (mode: PayoutMode) => void
}) {
  const [payoutMode, setPayoutMode] = useState<PayoutMode>('winnings_plus_balance')
  const calculatePayout = usePhysicalTicketStore((state) => state.calculatePayout)

  const calculation = calculatePayout(ticket, payoutMode)
  const statusConfig = STATUS_DISPLAY_CONFIG[ticket.status]

  // Determine what to show based on status
  const renderStatusContent = () => {
    switch (ticket.status) {
      case 'not_played':
        return (
          <div
            style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <Ticket size={48} color="#3b82f6" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>
              Ticket Not Played
            </h3>
            <p style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '16px' }}>
              Customer has not used this ticket yet. Full deposit refund available.
            </p>
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                display: 'inline-block',
              }}
            >
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Full Refund
              </p>
              <p
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#3b82f6',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {ticket.depositAmount.toFixed(2)} BRL
              </p>
            </div>
          </div>
        )

      case 'active':
        return (
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Clock size={24} color="#06b6d4" />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0e7490' }}>
                    Active Ticket
                  </h3>
                  <p style={{ fontSize: '13px', color: '#06b6d4' }}>
                    Customer is currently playing
                  </p>
                </div>
              </div>

              {/* Balance & Winnings */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  style={{
                    flex: 1,
                    background: 'white',
                    borderRadius: '12px',
                    padding: '14px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                    Remaining Balance
                  </p>
                  <p
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#06b6d4',
                      fontFamily: 'ui-monospace, monospace',
                    }}
                  >
                    {ticket.remainingBalance.toFixed(2)}
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: 'white',
                    borderRadius: '12px',
                    padding: '14px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                    Winnings
                  </p>
                  <p
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#24BD68',
                      fontFamily: 'ui-monospace, monospace',
                    }}
                  >
                    {ticket.totalWinnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payout Mode Selection */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>
                Payout Mode
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => setPayoutMode('winnings_plus_balance')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: payoutMode === 'winnings_plus_balance' ? '2px solid #24BD68' : '2px solid #e2e8f0',
                    background: payoutMode === 'winnings_plus_balance' ? '#ecfdf5' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                      Winnings + Balance
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                      Pay everything
                    </p>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#24BD68' }}>
                    {(ticket.totalWinnings + ticket.remainingBalance).toFixed(2)} BRL
                  </span>
                </button>
                <button
                  onClick={() => setPayoutMode('winnings_only')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: payoutMode === 'winnings_only' ? '2px solid #24BD68' : '2px solid #e2e8f0',
                    background: payoutMode === 'winnings_only' ? '#ecfdf5' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                      Winnings Only
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                      Balance stays on ticket
                    </p>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#24BD68' }}>
                    {ticket.totalWinnings.toFixed(2)} BRL
                  </span>
                </button>
              </div>
            </div>
          </div>
        )

      case 'finished_won':
        return (
          <div
            style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <Trophy size={56} color="#24BD68" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#047857', marginBottom: '8px' }}>
              Winner! 🎉
            </h3>
            <p style={{ fontSize: '14px', color: '#24BD68', marginBottom: '16px' }}>
              Customer finished playing with winnings
            </p>
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                display: 'inline-block',
              }}
            >
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Total Winnings
              </p>
              <p
                style={{
                  fontSize: '40px',
                  fontWeight: 800,
                  color: '#24BD68',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {ticket.totalWinnings.toFixed(2)} BRL
              </p>
            </div>
          </div>
        )

      case 'finished_lost':
        return (
          <div
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: '#f1f5f9',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '32px',
              }}
            >
              😔
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
              No Winnings
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              Customer played all balance without winning
            </p>
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                display: 'inline-block',
              }}
            >
              <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>
                Nothing to pay out
              </p>
            </div>
          </div>
        )

      case 'paid_out':
        return (
          <div
            style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#b45309', marginBottom: '8px' }}>
              Already Paid Out
            </h3>
            <p style={{ fontSize: '14px', color: '#f59e0b', marginBottom: '16px' }}>
              This ticket was already redeemed
            </p>
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Paid Amount</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                  {ticket.paidOutAmount?.toFixed(2)} BRL
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Paid On</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                  {ticket.paidOutAt ? new Date(ticket.paidOutAt).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>
          </div>
        )

      case 'expired':
        return (
          <div
            style={{
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <X
              size={48}
              color="#ef4444"
              style={{
                marginBottom: '12px',
                background: '#fecaca',
                borderRadius: '50%',
                padding: '8px',
              }}
            />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#b91c1c', marginBottom: '8px' }}>
              Ticket Expired
            </h3>
            <p style={{ fontSize: '14px', color: '#ef4444', marginBottom: '16px' }}>
              This ticket has passed its expiration date
            </p>
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <p style={{ fontSize: '13px', color: '#64748b' }}>Expired On</p>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                {new Date(ticket.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

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
          padding: '24px',
          maxWidth: '420px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: statusConfig.backgroundColor,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              {statusConfig.icon}
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                Ticket Details
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: statusConfig.color,
                }}
              >
                {statusConfig.label}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: 'none',
              background: '#f1f5f9',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Ticket Info */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Ticket Code</span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#1e293b',
                fontFamily: 'ui-monospace, monospace',
              }}
            >
              {ticket.qrCode}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Deposit</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
              {ticket.depositAmount.toFixed(2)} BRL
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Game Access</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
              {ticket.gameScope === 'all' ? 'All Games' : ticket.gameName}
            </span>
          </div>
        </div>

        {/* Status-specific content */}
        {renderStatusContent()}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: '52px',
              borderRadius: '14px',
              border: '2px solid #e2e8f0',
              background: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            Close
          </button>
          {calculation.canPayout && (
            <button
              onClick={() => onPayout(payoutMode)}
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
              <CreditCard size={20} />
              Pay {calculation.totalPayout.toFixed(2)} BRL
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Success modal after successful payout.
 */
function PayoutSuccessModal({
  amount,
  onClose,
}: {
  amount: number
  onClose: () => void
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
          maxWidth: '360px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
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

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
          Payout Complete!
        </h2>

        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
          Payment has been processed successfully
        </p>

        <div
          style={{
            background: '#ecfdf5',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <p style={{ fontSize: '12px', color: '#24BD68', marginBottom: '4px' }}>
            Amount Paid
          </p>
          <p
            style={{
              fontSize: '36px',
              fontWeight: 800,
              color: '#059669',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {amount.toFixed(2)} BRL
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            color: 'white',
            boxShadow: '0 4px 12px rgba(36, 189, 104, 0.3)',
          }}
        >
          Done
        </button>
      </div>
    </div>
  )
}

/**
 * PayoutTicketPage Component
 *
 * Main interface for processing payouts on physical lottery tickets.
 * Cashiers scan QR codes or enter them manually, then process payments.
 */
export function PayoutTicketPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const getTicketByQRCode = usePhysicalTicketStore((state) => state.getTicketByQRCode)
  const processPayoutTicket = usePhysicalTicketStore((state) => state.processPayoutTicket)
  const loadMockData = usePhysicalTicketStore((state) => state.loadMockData)

  // Load mock data for testing on component mount
  useEffect(() => {
    loadMockData()
  }, [loadMockData])

  // State
  const [qrCodeInput, setQrCodeInput] = useState('')
  const [foundTicket, setFoundTicket] = useState<PhysicalTicket | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [payoutSuccess, setPayoutSuccess] = useState<number | null>(null)

  // Handle search
  const handleSearch = useCallback(() => {
    if (!qrCodeInput.trim()) {
      setError('Please enter a ticket code')
      return
    }

    const ticket = getTicketByQRCode(qrCodeInput.trim())
    if (!ticket) {
      setError('Ticket not found. Please check the code and try again.')
      setFoundTicket(null)
    } else {
      setFoundTicket(ticket)
      setError(null)
    }
  }, [qrCodeInput, getTicketByQRCode])

  // Handle payout
  const handlePayout = useCallback(
    (mode: PayoutMode) => {
      if (!foundTicket || !user) return

      const result = processPayoutTicket(foundTicket.id, mode, user.id || 'operator')

      if (result.success) {
        setPayoutSuccess(result.amountPaid)
        setFoundTicket(null)
        setQrCodeInput('')
      } else {
        setError(result.error || 'Failed to process payout')
      }
    },
    [foundTicket, user, processPayoutTicket]
  )

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setFoundTicket(null)
  }, [])

  // Handle success close
  const handleSuccessClose = useCallback(() => {
    setPayoutSuccess(null)
  }, [])

  // Handle camera scan (placeholder)
  const handleCameraScan = useCallback(() => {
    alert('Camera scanner will be implemented with device camera API')
  }, [])

  return (
    <SwipePageWrapper
      currentPage="qrticket-payout"
      background="linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)"
    >
      {/* AppHeader - Consistent header with balance and menu */}
      <AppHeader
        showBack
        backPath="/games"
        title="QR Ticket - Payout"
        subtitle="Scan or enter ticket code"
      />

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          paddingBottom: '100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '400px', width: '100%' }}>
          {/* Camera Scan Button */}
          <button
            onClick={handleCameraScan}
            style={{
              width: '100%',
              height: '180px',
              borderRadius: '20px',
              border: '3px dashed #06b6d4',
              background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '20px',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(6, 182, 212, 0.3)',
              }}
            >
              <Camera size={36} color="white" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '17px', fontWeight: 700, color: '#0e7490' }}>
                Scan QR Code
              </p>
              <p style={{ fontSize: '13px', color: '#06b6d4' }}>
                Use camera to scan ticket
              </p>
            </div>
          </button>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
              OR ENTER MANUALLY
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Manual Entry */}
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}
          >
            <label
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#64748b',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              Ticket Code
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="OCT-XXXXXXXX-XXXX"
                value={qrCodeInput}
                onChange={(e) => {
                  setQrCodeInput(e.target.value.toUpperCase())
                  setError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch()
                }}
                style={{
                  flex: 1,
                  height: '52px',
                  borderRadius: '14px',
                  border: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                  padding: '0 16px',
                  fontSize: '16px',
                  fontFamily: 'ui-monospace, monospace',
                  letterSpacing: '0.5px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
                }}
              >
                <Search size={22} />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p
                style={{
                  fontSize: '13px',
                  color: '#ef4444',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <AlertTriangle size={14} />
                {error}
              </p>
            )}
          </div>

          {/* Test Codes Hint (for development) */}
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '14px',
              border: '1px dashed #e2e8f0',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                marginBottom: '8px',
              }}
            >
              Test Codes (Dev Mode)
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              {[
                { code: 'OCT-TESTAB12-N0PL', label: 'Not Played' },
                { code: 'OCT-TESTCD34-ACTV', label: 'Active' },
                { code: 'OCT-TESTEF56-FWIN', label: 'Won' },
                { code: 'OCT-TESTGH78-FLST', label: 'Lost' },
              ].map((test) => (
                <button
                  key={test.code}
                  onClick={() => setQrCodeInput(test.code)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    fontSize: '11px',
                    cursor: 'pointer',
                    color: '#64748b',
                  }}
                >
                  {test.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Status Modal */}
      {foundTicket && (
        <TicketStatusModal
          ticket={foundTicket}
          onClose={handleModalClose}
          onPayout={handlePayout}
        />
      )}

      {/* Payout Success Modal */}
      {payoutSuccess !== null && (
        <PayoutSuccessModal amount={payoutSuccess} onClose={handleSuccessClose} />
      )}

      {/* Bottom Navigation - Always visible */}
      <BottomNavigation activeTab="qrticket-payout" />
    </SwipePageWrapper>
  )
}

export default PayoutTicketPage
