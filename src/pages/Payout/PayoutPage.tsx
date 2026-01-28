/**
 * ============================================================================
 * UNIFIED PAYOUT PAGE - SCAN & PAYOUT
 * ============================================================================
 *
 * Purpose: Single unified page for processing payouts on both QR tickets
 * and Draw tickets. Auto-detects ticket type from code format.
 *
 * Features:
 * - QR code scanner (camera) or manual entry
 * - Auto-detect ticket type from code pattern
 * - QR tickets: Status display with payout mode selection
 * - Draw tickets: Win/lose validation with simple payout
 * - Unified success experience
 *
 * Ticket Types:
 * - QR Tickets: OCT-XXXXXXXX-XXXX pattern (physicalTicketStore)
 * - Draw Tickets: 0289-XXXXXXXXXX-XXXXXXXXXXX pattern (gameStore)
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  Search,
  Check,
  X,
  AlertTriangle,
  AlertCircle,
  Clock,
  Trophy,
  Ticket,
  CreditCard,
  Ban,
  Banknote,
} from 'lucide-react'
import { usePhysicalTicketStore } from '@/stores/physicalTicketStore'
import { useGameStore } from '@/stores/gameStore'
import { useAuthStore } from '@/stores/authStore'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { SwipePageWrapper } from '@/components/shared/SwipePageWrapper'
import { STATUS_DISPLAY_CONFIG, type PayoutMode } from '@/types/physical-ticket.types'
import type { PhysicalTicket } from '@/types/physical-ticket.types'
import { detectTicketType, getTicketTypeLabel, getTicketTypeColor, type TicketType } from './utils/ticketDetection'

/** Draw ticket validation result */
type DrawValidationStatus = 'valid' | 'invalid' | 'paid'

interface DrawTicketResult {
  status: DrawValidationStatus
  winAmount: number
  gameName: string
}

/**
 * QR Ticket Status Modal
 * Shows detailed status and payout options for QR tickets
 */
function QRTicketModal({
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
            <div style={{ background: 'white', borderRadius: '12px', padding: '16px', display: 'inline-block' }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Full Refund</p>
              <p style={{ fontSize: '32px', fontWeight: 800, color: '#3b82f6', fontFamily: 'ui-monospace, monospace' }}>
                {ticket.depositAmount.toFixed(2)} USD
              </p>
            </div>
          </div>
        )

      case 'active':
        return (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Clock size={24} color="#06b6d4" />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0e7490' }}>Active Ticket</h3>
                  <p style={{ fontSize: '13px', color: '#06b6d4' }}>Customer is currently playing</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Remaining Balance</p>
                  <p style={{ fontSize: '22px', fontWeight: 700, color: '#06b6d4', fontFamily: 'ui-monospace, monospace' }}>
                    {ticket.remainingBalance.toFixed(2)}
                  </p>
                </div>
                <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Winnings</p>
                  <p style={{ fontSize: '22px', fontWeight: 700, color: '#24BD68', fontFamily: 'ui-monospace, monospace' }}>
                    {ticket.totalWinnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>Payout Mode</p>
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
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Winnings + Balance</p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>Pay everything</p>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#24BD68' }}>
                    {(ticket.totalWinnings + ticket.remainingBalance).toFixed(2)} USD
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
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Winnings Only</p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>Balance stays on ticket</p>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#24BD68' }}>
                    {ticket.totalWinnings.toFixed(2)} USD
                  </span>
                </button>
              </div>
            </div>
          </div>
        )

      case 'finished_won':
        return (
          <div style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
            <Trophy size={56} color="#24BD68" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#047857', marginBottom: '8px' }}>Winner!</h3>
            <p style={{ fontSize: '14px', color: '#24BD68', marginBottom: '16px' }}>Customer finished playing with winnings</p>
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', display: 'inline-block' }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Total Winnings</p>
              <p style={{ fontSize: '40px', fontWeight: 800, color: '#24BD68', fontFamily: 'ui-monospace, monospace' }}>
                {ticket.totalWinnings.toFixed(2)} USD
              </p>
            </div>
          </div>
        )

      case 'finished_lost':
        return (
          <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '32px' }}>
              😔
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>No Winnings</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Customer played all balance without winning</p>
            <div style={{ background: 'white', borderRadius: '12px', padding: '16px', display: 'inline-block' }}>
              <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>Nothing to pay out</p>
            </div>
          </div>
        )

      case 'paid_out':
        return (
          <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
            <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#b45309', marginBottom: '8px' }}>Already Paid Out</h3>
            <p style={{ fontSize: '14px', color: '#f59e0b', marginBottom: '16px' }}>This ticket was already redeemed</p>
            <div style={{ background: 'white', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Paid Amount</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{ticket.paidOutAmount?.toFixed(2)} USD</span>
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
          <div style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
            <X size={48} color="#ef4444" style={{ marginBottom: '12px', background: '#fecaca', borderRadius: '50%', padding: '8px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#b91c1c', marginBottom: '8px' }}>Ticket Expired</h3>
            <p style={{ fontSize: '14px', color: '#ef4444', marginBottom: '16px' }}>This ticket has passed its expiration date</p>
            <div style={{ background: 'white', borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Expired On</p>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>{new Date(ticket.expiresAt).toLocaleDateString()}</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '24px', maxWidth: '420px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: statusConfig.backgroundColor, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              {statusConfig.icon}
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>QR Ticket Details</h2>
              <p style={{ fontSize: '12px', fontWeight: 600, color: statusConfig.color }}>{statusConfig.label}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        {/* Ticket Info */}
        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Ticket Code</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', fontFamily: 'ui-monospace, monospace' }}>{ticket.qrCode}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Deposit</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{ticket.depositAmount.toFixed(2)} USD</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Game Access</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{ticket.gameScope === 'all' ? 'All Games' : ticket.gameName}</span>
          </div>
        </div>

        {renderStatusContent()}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, height: '52px', borderRadius: '14px', border: '2px solid #e2e8f0', background: 'white', fontSize: '15px', fontWeight: 600, cursor: 'pointer', color: '#64748b' }}>
            Close
          </button>
          {calculation.canPayout && (
            <button
              onClick={() => onPayout(payoutMode)}
              style={{ flex: 1, height: '52px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)', fontSize: '15px', fontWeight: 600, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(36, 189, 104, 0.3)' }}
            >
              <CreditCard size={20} />
              Pay {calculation.totalPayout.toFixed(2)} USD
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Draw Ticket Modal
 * Shows validation result and payout option for draw tickets
 */
function DrawTicketModal({
  result,
  ticketNumber,
  onClose,
  onPayout,
}: {
  result: DrawTicketResult
  ticketNumber: string
  onClose: () => void
  onPayout: () => void
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '32px 24px', width: '100%', maxWidth: '340px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={20} />
        </button>

        {/* Type Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <span style={{ padding: '6px 12px', borderRadius: '20px', background: '#f3e8ff', color: '#8b5cf6', fontSize: '12px', fontWeight: 600 }}>
            Draw Ticket
          </span>
        </div>

        {result.status === 'valid' && (
          <>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)' }}>
              <Check size={40} color="white" strokeWidth={3} />
            </div>
            <h3 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Winner!</h3>
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>{result.gameName}</p>
            <div style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#00A77E', fontWeight: 500, marginBottom: '4px' }}>Prize Amount</p>
              <p style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, color: '#047857' }}>{result.winAmount.toFixed(2)} USD</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={onPayout} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)' }}>
                <Banknote size={20} />
                Pay Out
              </button>
              <button onClick={onClose} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', background: '#f1f5f9', color: '#64748b', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </>
        )}

        {result.status === 'invalid' && (
          <>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)' }}>
              <AlertCircle size={40} color="white" strokeWidth={2.5} />
            </div>
            <h3 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>No Win</h3>
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              {result.gameName ? `${result.gameName} - ` : ''}This ticket did not win. Please try another ticket.
            </p>
            <button onClick={onClose} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)' }}>
              Try Another Ticket
            </button>
          </>
        )}

        {result.status === 'paid' && (
          <>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)' }}>
              <Ban size={40} color="white" strokeWidth={2.5} />
            </div>
            <h3 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Already Paid</h3>
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              {result.gameName ? `${result.gameName} - ` : ''}This ticket has already been paid out. Please try another ticket.
            </p>
            <button onClick={onClose} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)' }}>
              Try Another Ticket
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Payout Success Modal
 * Unified success experience for both ticket types
 */
function PayoutSuccessModal({
  amount,
  ticketType,
  onClose,
}: {
  amount: number
  ticketType: TicketType
  onClose: () => void
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '32px', maxWidth: '360px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(36, 189, 104, 0.3)' }}>
          <Check size={40} color="white" strokeWidth={3} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Payout Complete!</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Payment has been processed successfully</p>

        <div style={{ background: '#ecfdf5', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', color: '#24BD68', marginBottom: '4px' }}>Amount Paid</p>
          <p style={{ fontSize: '36px', fontWeight: 800, color: '#059669', fontFamily: 'ui-monospace, monospace' }}>{amount.toFixed(2)} USD</p>
        </div>

        <button onClick={onClose} style={{ width: '100%', height: '52px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)', fontSize: '16px', fontWeight: 600, cursor: 'pointer', color: 'white', boxShadow: '0 4px 12px rgba(36, 189, 104, 0.3)' }}>
          Done
        </button>
      </div>
    </div>
  )
}

/**
 * Main PayoutPage Component
 */
export function PayoutPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { ticketHistory } = useGameStore()

  // QR Ticket store methods
  const getTicketByQRCode = usePhysicalTicketStore((state) => state.getTicketByQRCode)
  const processPayoutTicket = usePhysicalTicketStore((state) => state.processPayoutTicket)
  const loadMockData = usePhysicalTicketStore((state) => state.loadMockData)

  // Load mock data on mount
  useEffect(() => {
    loadMockData()
  }, [loadMockData])

  // State
  const [ticketCode, setTicketCode] = useState('')
  const [detectedType, setDetectedType] = useState<TicketType | null>(null)
  const [error, setError] = useState<string | null>(null)

  // QR Ticket state
  const [foundQRTicket, setFoundQRTicket] = useState<PhysicalTicket | null>(null)

  // Draw Ticket state
  const [drawResult, setDrawResult] = useState<DrawTicketResult | null>(null)

  // Success state
  const [payoutSuccess, setPayoutSuccess] = useState<{ amount: number; type: TicketType } | null>(null)

  // Handle input change with auto-detection
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setTicketCode(value)
    setError(null)

    // Auto-detect type as user types
    if (value.length >= 3) {
      const type = detectTicketType(value)
      setDetectedType(type !== 'unknown' ? type : null)
    } else {
      setDetectedType(null)
    }
  }, [])

  // Handle search
  const handleSearch = useCallback(() => {
    if (!ticketCode.trim()) {
      setError('Please enter a ticket code')
      return
    }

    const type = detectTicketType(ticketCode.trim())
    setDetectedType(type)

    if (type === 'unknown') {
      setError('Invalid ticket format. Please check the code and try again.')
      return
    }

    if (type === 'qr') {
      // Look up QR ticket
      const ticket = getTicketByQRCode(ticketCode.trim())
      if (!ticket) {
        setError('QR Ticket not found. Please check the code and try again.')
        setFoundQRTicket(null)
      } else {
        setFoundQRTicket(ticket)
        setError(null)
      }
    } else if (type === 'draw') {
      // Look up Draw ticket
      const ticketNumber = ticketCode.replace(/-/g, '')
      const ticket = ticketHistory.find((t) => t.ticketNumber.replace(/-/g, '') === ticketNumber)

      if (!ticket) {
        setDrawResult({ status: 'invalid', winAmount: 0, gameName: '' })
      } else if (ticket.status === 'paid') {
        setDrawResult({ status: 'paid', winAmount: 0, gameName: ticket.bet.gameName })
      } else {
        // Random win calculation (70% chance)
        const isWin = Math.random() > 0.3
        if (isWin) {
          const amount = ticket.bet.totalCost * (Math.floor(Math.random() * 5) + 2)
          setDrawResult({ status: 'valid', winAmount: amount, gameName: ticket.bet.gameName })
        } else {
          setDrawResult({ status: 'invalid', winAmount: 0, gameName: ticket.bet.gameName })
        }
      }
      setError(null)
    }
  }, [ticketCode, getTicketByQRCode, ticketHistory])

  // Handle QR ticket payout
  const handleQRPayout = useCallback((mode: PayoutMode) => {
    if (!foundQRTicket || !user) return

    const result = processPayoutTicket(foundQRTicket.id, mode, user.id || 'operator')

    if (result.success) {
      setPayoutSuccess({ amount: result.amountPaid, type: 'qr' })
      setFoundQRTicket(null)
      setTicketCode('')
      setDetectedType(null)
    } else {
      setError(result.error || 'Failed to process payout')
    }
  }, [foundQRTicket, user, processPayoutTicket])

  // Handle Draw ticket payout
  const handleDrawPayout = useCallback(() => {
    if (!drawResult || drawResult.status !== 'valid') return

    setPayoutSuccess({ amount: drawResult.winAmount, type: 'draw' })
    setDrawResult(null)
    setTicketCode('')
    setDetectedType(null)
  }, [drawResult])

  // Handle camera scan (placeholder)
  const handleCameraScan = useCallback(() => {
    alert('Camera scanner will be implemented with device camera API')
  }, [])

  // Close modals
  const handleQRModalClose = useCallback(() => setFoundQRTicket(null), [])
  const handleDrawModalClose = useCallback(() => setDrawResult(null), [])
  const handleSuccessClose = useCallback(() => setPayoutSuccess(null), [])

  return (
    <SwipePageWrapper
      currentPage="payout"
      background="linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)"
    >
      {/* AppHeader */}
      <AppHeader
        title="Payout"
        subtitle="Scan or enter ticket code"
      />

      {/* Content */}
      <div style={{ flex: 1, padding: '20px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>

          {/* Camera Scan Button */}
          <button
            onClick={handleCameraScan}
            style={{
              width: '100%',
              height: '160px',
              borderRadius: '20px',
              border: '3px dashed #24BD68',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
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
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(36, 189, 104, 0.3)' }}>
              <Camera size={32} color="white" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#047857' }}>Scan QR / Barcode</p>
              <p style={{ fontSize: '13px', color: '#24BD68' }}>Use camera to scan any ticket</p>
            </div>
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>OR ENTER MANUALLY</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Manual Entry */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Ticket Code</label>
              {detectedType && (
                <span style={{ padding: '4px 10px', borderRadius: '12px', background: `${getTicketTypeColor(detectedType)}15`, color: getTicketTypeColor(detectedType), fontSize: '11px', fontWeight: 600 }}>
                  {getTicketTypeLabel(detectedType)}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="OCT-XXXXXXXX-XXXX or 0289-..."
                value={ticketCode}
                onChange={handleInputChange}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                style={{
                  flex: 1,
                  height: '52px',
                  borderRadius: '14px',
                  border: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                  padding: '0 16px',
                  fontSize: '15px',
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
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(36, 189, 104, 0.3)',
                }}
              >
                <Search size={22} />
              </button>
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: '#ef4444', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} />
                {error}
              </p>
            )}
          </div>

          {/* Test Codes (Dev Mode) */}
          <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #e2e8f0' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>Test Codes (Dev Mode)</p>

            <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>QR Tickets:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {[
                { code: 'OCT-TESTAB12-N0PL', label: 'Not Played' },
                { code: 'OCT-TESTCD34-ACTV', label: 'Active' },
                { code: 'OCT-TESTEF56-FWIN', label: 'Won' },
                { code: 'OCT-TESTGH78-FLST', label: 'Lost' },
              ].map((test) => (
                <button
                  key={test.code}
                  onClick={() => setTicketCode(test.code)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '11px', cursor: 'pointer', color: '#06b6d4' }}
                >
                  {test.label}
                </button>
              ))}
            </div>

            <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Draw Tickets:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                onClick={() => setTicketCode('0289-2397122442-00028362302')}
                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '11px', cursor: 'pointer', color: '#8b5cf6' }}
              >
                Sample Draw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Ticket Modal */}
      {foundQRTicket && (
        <QRTicketModal
          ticket={foundQRTicket}
          onClose={handleQRModalClose}
          onPayout={handleQRPayout}
        />
      )}

      {/* Draw Ticket Modal */}
      {drawResult && (
        <DrawTicketModal
          result={drawResult}
          ticketNumber={ticketCode}
          onClose={handleDrawModalClose}
          onPayout={handleDrawPayout}
        />
      )}

      {/* Payout Success Modal */}
      {payoutSuccess && (
        <PayoutSuccessModal
          amount={payoutSuccess.amount}
          ticketType={payoutSuccess.type}
          onClose={handleSuccessClose}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="payout" />
    </SwipePageWrapper>
  )
}

export default PayoutPage
