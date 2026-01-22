/**
 * ============================================================================
 * QR CODE DISPLAY COMPONENT
 * ============================================================================
 *
 * Purpose: Renders a QR code with customizable styling for ticket display.
 * Used in the NewTicketPage to show the generated QR code after ticket creation.
 *
 * Features:
 * - Generates QR code from any string value
 * - Customizable size and colors
 * - Optional ticket code display below QR
 * - Print-friendly styling
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { QRCodeSVG } from 'qrcode.react'

/**
 * Props for QRCodeDisplay component.
 */
interface QRCodeDisplayProps {
  /** The value to encode in the QR code */
  value: string

  /** Size of the QR code in pixels (default: 200) */
  size?: number

  /** Whether to show the code text below the QR (default: true) */
  showCode?: boolean

  /** Background color (default: white) */
  bgColor?: string

  /** Foreground color (default: black) */
  fgColor?: string

  /** Optional label above the QR code */
  label?: string
}

/**
 * QRCodeDisplay Component
 *
 * Renders a QR code with optional label and code text display.
 * Designed for ticket printing and display in the cashier interface.
 *
 * @example
 * <QRCodeDisplay
 *   value="OCT-ABCD1234-EFGH"
 *   size={250}
 *   label="Scan to Play"
 *   showCode
 * />
 */
export function QRCodeDisplay({
  value,
  size = 200,
  showCode = true,
  bgColor = '#ffffff',
  fgColor = '#000000',
  label,
}: QRCodeDisplayProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Optional label */}
      {label && (
        <p
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {label}
        </p>
      )}

      {/* QR Code container with white background and border */}
      <div
        style={{
          background: bgColor,
          padding: '16px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '2px solid #e2e8f0',
        }}
      >
        <QRCodeSVG
          value={value}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level="H"
          includeMargin={false}
        />
      </div>

      {/* Code text display */}
      {showCode && (
        <div
          style={{
            background: '#f8fafc',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        >
          <p
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#1e293b',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '1px',
            }}
          >
            {value}
          </p>
        </div>
      )}
    </div>
  )
}

export default QRCodeDisplay
