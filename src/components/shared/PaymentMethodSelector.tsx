/**
 * ============================================================================
 * PAYMENT METHOD SELECTOR - MULTI-POCKET PAYMENT SELECTION
 * ============================================================================
 *
 * Purpose: Display payment method options for checkout and collection
 *
 * Features:
 * - 4 payment methods: Cash, Card, PIX, Other
 * - Touch-friendly buttons (48px+)
 * - Visual feedback on selection
 * - Optional balance display per method
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { Banknote, CreditCard, Zap, FileText } from 'lucide-react'
import type { PaymentMethod, PocketBalance } from '@/types/game.types'

/**
 * Configuration for each payment method
 */
const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, {
  label: string
  icon: typeof Banknote
  color: string
  gradient: string
  bgLight: string
}> = {
  cash: {
    label: 'Cash',
    icon: Banknote,
    color: '#24BD68',
    gradient: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
    bgLight: '#ecfdf5',
  },
  card: {
    label: 'Card',
    icon: CreditCard,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    bgLight: '#eff6ff',
  },
  pix: {
    label: 'PIX',
    icon: Zap,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    bgLight: '#ecfeff',
  },
  other: {
    label: 'Other',
    icon: FileText,
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    bgLight: '#f8fafc',
  },
}

interface PaymentMethodSelectorProps {
  /** Currently selected payment method */
  selected: PaymentMethod | null
  /** Callback when a method is selected */
  onSelect: (method: PaymentMethod) => void
  /** Optional: Show balance for each pocket */
  showBalances?: boolean
  /** Optional: Pocket balances to display */
  pocketBalances?: PocketBalance
  /** Optional: Allow selecting "All" option for collection */
  showAllOption?: boolean
  /** Optional: Callback when "All" is selected */
  onSelectAll?: () => void
  /** Optional: Is "All" currently selected */
  isAllSelected?: boolean
}

/**
 * PaymentMethodSelector Component
 *
 * Displays a 2x2 grid of payment method buttons with optional balance display.
 */
export function PaymentMethodSelector({
  selected,
  onSelect,
  showBalances = false,
  pocketBalances,
  showAllOption = false,
  onSelectAll,
  isAllSelected = false,
}: PaymentMethodSelectorProps) {
  const [hoveredMethod, setHoveredMethod] = useState<PaymentMethod | 'all' | null>(null)

  const methods: PaymentMethod[] = ['cash', 'card', 'pix', 'other']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* 2x2 Grid of Payment Methods */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}
      >
        {methods.map((method) => {
          const config = PAYMENT_METHOD_CONFIG[method]
          const Icon = config.icon
          const isSelected = selected === method && !isAllSelected
          const isHovered = hoveredMethod === method

          return (
            <button
              key={method}
              onClick={() => onSelect(method)}
              onMouseEnter={() => setHoveredMethod(method)}
              onMouseLeave={() => setHoveredMethod(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '20px 16px',
                minHeight: '100px',
                background: isSelected
                  ? config.gradient
                  : isHovered
                  ? config.bgLight
                  : 'white',
                border: isSelected
                  ? 'none'
                  : `2px solid ${isHovered ? config.color : '#e2e8f0'}`,
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.02)' : isHovered ? 'scale(1.01)' : 'scale(1)',
                boxShadow: isSelected
                  ? `0 8px 24px ${config.color}40`
                  : isHovered
                  ? '0 4px 12px rgba(0,0,0,0.08)'
                  : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: isSelected ? 'rgba(255,255,255,0.2)' : config.bgLight,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  size={26}
                  color={isSelected ? 'white' : config.color}
                  strokeWidth={2}
                />
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: isSelected ? 'white' : '#1e293b',
                }}
              >
                {config.label}
              </span>

              {/* Balance (optional) */}
              {showBalances && pocketBalances && (
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isSelected ? 'rgba(255,255,255,0.9)' : config.color,
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  {pocketBalances[method].toFixed(2)} BRL
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* "All" Option for Collection */}
      {showAllOption && onSelectAll && (
        <button
          onClick={onSelectAll}
          onMouseEnter={() => setHoveredMethod('all')}
          onMouseLeave={() => setHoveredMethod(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px 20px',
            background: isAllSelected
              ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
              : hoveredMethod === 'all'
              ? '#f5f3ff'
              : 'white',
            border: isAllSelected
              ? 'none'
              : `2px solid ${hoveredMethod === 'all' ? '#8b5cf6' : '#e2e8f0'}`,
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isAllSelected
              ? '0 8px 24px rgba(139, 92, 246, 0.4)'
              : '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <span
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: isAllSelected ? 'white' : '#1e293b',
            }}
          >
            Collect from All Pockets
          </span>
          {showBalances && pocketBalances && (
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: isAllSelected ? 'rgba(255,255,255,0.9)' : '#8b5cf6',
                fontFamily: 'ui-monospace, monospace',
              }}
            >
              {(pocketBalances.cash + pocketBalances.card + pocketBalances.pix + pocketBalances.other).toFixed(2)} BRL
            </span>
          )}
        </button>
      )}
    </div>
  )
}

/**
 * Compact version for inline use (e.g., in modals)
 */
export function PaymentMethodSelectorCompact({
  selected,
  onSelect,
}: {
  selected: PaymentMethod | null
  onSelect: (method: PaymentMethod) => void
}) {
  const methods: PaymentMethod[] = ['cash', 'card', 'pix', 'other']

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
      }}
    >
      {methods.map((method) => {
        const config = PAYMENT_METHOD_CONFIG[method]
        const Icon = config.icon
        const isSelected = selected === method

        return (
          <button
            key={method}
            onClick={() => onSelect(method)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 8px',
              background: isSelected ? config.gradient : 'white',
              border: isSelected ? 'none' : `2px solid #e2e8f0`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Icon
              size={20}
              color={isSelected ? 'white' : config.color}
              strokeWidth={2}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: isSelected ? 'white' : '#64748b',
              }}
            >
              {config.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export { PAYMENT_METHOD_CONFIG }
