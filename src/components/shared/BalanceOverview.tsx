/**
 * ============================================================================
 * BALANCE OVERVIEW - MULTI-POCKET BALANCE DISPLAY
 * ============================================================================
 *
 * Purpose: Display terminal balance with breakdown by payment method
 *
 * Features:
 * - Total balance at top
 * - Individual pocket balances (Cash, Card, PIX, Other)
 * - Visual indicators for each pocket
 * - Can be used as modal or inline component
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { X, Banknote, CreditCard, Zap, FileText, Wallet, ArrowUpCircle, ArrowDownCircle, Building2, Phone, ChevronLeft } from 'lucide-react'
import type { PaymentMethod, PocketBalance } from '@/types/game.types'
import { PAYMENT_METHOD_CONFIG } from './PaymentMethodSelector'

interface BalanceOverviewProps {
  /** Pocket balances to display */
  pocketBalances: PocketBalance
  /** Whether to show as a modal */
  isModal?: boolean
  /** Callback to close modal */
  onClose?: () => void
  /** Callback when Top Up is requested */
  onTopUp?: () => void
  /** Callback when Bank Deposit is requested */
  onBankDeposit?: () => void
  /** Callback when Request Collection is requested */
  onRequestCollection?: () => void
}

/**
 * Get icon component for a payment method
 */
function getIconForMethod(method: PaymentMethod) {
  switch (method) {
    case 'cash':
      return Banknote
    case 'card':
      return CreditCard
    case 'pix':
      return Zap
    case 'other':
      return FileText
  }
}

/**
 * BalanceOverview Component
 *
 * Displays total balance and breakdown by payment method pocket.
 */
export function BalanceOverview({
  pocketBalances,
  isModal = false,
  onClose,
  onTopUp,
  onBankDeposit,
  onRequestCollection,
}: BalanceOverviewProps) {
  const [showDropOptions, setShowDropOptions] = useState(false)

  const totalBalance =
    pocketBalances.cash +
    pocketBalances.card +
    pocketBalances.pix +
    pocketBalances.other

  const methods: PaymentMethod[] = ['cash', 'card', 'pix', 'other']

  /** Handle Top Up button click */
  const handleTopUp = () => {
    if (onTopUp) {
      onTopUp()
    } else {
      // Default: show toast or navigate
      console.log('Top Up requested')
    }
  }

  /** Handle Bank Deposit selection */
  const handleBankDeposit = () => {
    setShowDropOptions(false)
    if (onBankDeposit) {
      onBankDeposit()
    } else {
      console.log('Bank Deposit requested')
    }
  }

  /** Handle Request Collection selection */
  const handleRequestCollection = () => {
    setShowDropOptions(false)
    if (onRequestCollection) {
      onRequestCollection()
    } else {
      console.log('Request Collection requested')
    }
  }

  const content = (
    <div
      style={{
        background: 'white',
        borderRadius: isModal ? '24px' : '20px',
        padding: isModal ? '24px' : '20px',
        boxShadow: isModal ? '0 20px 60px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: isModal ? '380px' : 'none',
        width: '100%',
      }}
    >
      {/* Header (Modal only) */}
      {isModal && onClose && (
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
                background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet size={22} color="white" />
            </div>
            <div>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#1e293b',
                  margin: 0,
                }}
              >
                Terminal Balance
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  margin: 0,
                }}
              >
                Breakdown by payment method
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
      )}

      {/* Total Balance */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            top: '-40px',
            right: '-40px',
          }}
        />

        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '8px',
          }}
        >
          Total Balance
        </p>
        <p
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: 'white',
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: '-1px',
          }}
        >
          {totalBalance.toFixed(2)}{' '}
          <span style={{ fontSize: '18px', fontWeight: 500, opacity: 0.7 }}>
            BRL
          </span>
        </p>
      </div>

      {/* Pocket Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {methods.map((method) => {
          const config = PAYMENT_METHOD_CONFIG[method]
          const Icon = getIconForMethod(method)
          const balance = pocketBalances[method]
          const percentage = totalBalance > 0 ? (balance / totalBalance) * 100 : 0

          return (
            <div
              key={method}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                background: config.bgLight,
                borderRadius: '14px',
                border: `1px solid ${config.color}20`,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: config.gradient,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${config.color}30`,
                }}
              >
                <Icon size={22} color="white" />
              </div>

              {/* Label and Progress */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1e293b',
                    }}
                  >
                    {config.label}
                  </span>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: config.color,
                      fontFamily: 'ui-monospace, monospace',
                    }}
                  >
                    {balance.toFixed(2)} BRL
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: '6px',
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: config.gradient,
                      borderRadius: '3px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons - Top Up & Drop */}
      {isModal && (
        <div style={{ marginTop: '20px' }}>
          {!showDropOptions ? (
            /* Main buttons: Top Up and Drop */
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Top Up Button */}
              <button
                onClick={handleTopUp}
                style={{
                  flex: 1,
                  padding: '16px',
                  minHeight: '64px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 16px rgba(36, 189, 104, 0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowUpCircle size={24} />
                <span>Top Up</span>
              </button>

              {/* Drop Button */}
              <button
                onClick={() => setShowDropOptions(true)}
                style={{
                  flex: 1,
                  padding: '16px',
                  minHeight: '64px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowDownCircle size={24} />
                <span>Drop</span>
              </button>
            </div>
          ) : (
            /* Drop sub-options: Bank Deposit or Request Collection */
            <div>
              {/* Back button */}
              <button
                onClick={() => setShowDropOptions(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  marginBottom: '12px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#64748b',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={18} />
                Back
              </button>

              <p style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '12px',
                textAlign: 'center',
              }}>
                Where do you want to drop?
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Bank Deposit */}
                <button
                  onClick={handleBankDeposit}
                  style={{
                    flex: 1,
                    padding: '16px',
                    minHeight: '72px',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Building2 size={26} />
                  <span>Bank Deposit</span>
                </button>

                {/* Request Collection */}
                <button
                  onClick={handleRequestCollection}
                  style={{
                    flex: 1,
                    padding: '16px',
                    minHeight: '72px',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Phone size={26} />
                  <span>Request Collection</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  // Modal wrapper
  if (isModal) {
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
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) {
            onClose()
          }
        }}
      >
        {content}
      </div>
    )
  }

  return content
}

/**
 * Compact inline version for headers
 */
export function BalanceOverviewCompact({
  pocketBalances,
  onClick,
}: {
  pocketBalances: PocketBalance
  onClick?: () => void
}) {
  const totalBalance =
    pocketBalances.cash +
    pocketBalances.card +
    pocketBalances.pix +
    pocketBalances.other

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 14px',
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '12px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
    >
      <Wallet size={18} color="white" />
      <div style={{ textAlign: 'left' }}>
        <p
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.7)',
            margin: 0,
          }}
        >
          Balance
        </p>
        <p
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'white',
            margin: 0,
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          {totalBalance.toFixed(2)} BRL
        </p>
      </div>
    </button>
  )
}
