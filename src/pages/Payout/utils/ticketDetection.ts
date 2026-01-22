/**
 * ============================================================================
 * TICKET DETECTION UTILITY
 * ============================================================================
 *
 * Purpose: Detect ticket type from code format for unified payout page
 *
 * Patterns:
 * - QR Tickets: OCT-XXXXXXXX-XXXX (alphanumeric)
 * - Draw Tickets: 0289-XXXXXXXXXX-XXXXXXXXXXX (numeric with dashes)
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

/** Ticket type detected from code format */
export type TicketType = 'qr' | 'draw' | 'unknown'

/** QR Ticket pattern: OCT-XXXXXXXX-XXXX */
const QR_TICKET_PATTERN = /^OCT-[A-Z0-9]{8}-[A-Z0-9]{4}$/i

/** Draw Ticket pattern: 0289-XXXXXXXXXX-XXXXXXXXXXX */
const DRAW_TICKET_PATTERN = /^0289-\d{10}-\d{11}$/

/**
 * Detect ticket type from code format
 *
 * @param code - The ticket code to analyze
 * @returns The detected ticket type: 'qr', 'draw', or 'unknown'
 *
 * @example
 * detectTicketType('OCT-TESTAB12-N0PL') // 'qr'
 * detectTicketType('0289-2397122442-00028362302') // 'draw'
 * detectTicketType('invalid') // 'unknown'
 */
export function detectTicketType(code: string): TicketType {
  const trimmedCode = code.trim()

  if (QR_TICKET_PATTERN.test(trimmedCode)) {
    return 'qr'
  }

  if (DRAW_TICKET_PATTERN.test(trimmedCode)) {
    return 'draw'
  }

  return 'unknown'
}

/**
 * Get display name for ticket type
 */
export function getTicketTypeLabel(type: TicketType): string {
  switch (type) {
    case 'qr':
      return 'QR Ticket'
    case 'draw':
      return 'Draw Ticket'
    default:
      return 'Unknown'
  }
}

/**
 * Get color for ticket type badge
 */
export function getTicketTypeColor(type: TicketType): string {
  switch (type) {
    case 'qr':
      return '#06b6d4' // cyan
    case 'draw':
      return '#8b5cf6' // purple
    default:
      return '#64748b' // gray
  }
}
