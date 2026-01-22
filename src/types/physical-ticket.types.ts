/**
 * ============================================================================
 * PHYSICAL TICKET TYPES
 * ============================================================================
 *
 * Purpose: Type definitions for the physical ticket system where customers
 * purchase tickets with a deposit, play games via QR code on their phone,
 * and return to cashier for payout.
 *
 * Ticket Lifecycle:
 * 1. Customer buys ticket with deposit -> status: 'not_played'
 * 2. Customer scans QR, plays games -> status: 'active'
 * 3. Customer finishes playing:
 *    - Has winnings -> status: 'finished_won'
 *    - No winnings -> status: 'finished_lost'
 * 4. Cashier pays out ticket -> status: 'paid_out'
 * 5. If ticket expires -> status: 'expired'
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

/**
 * Possible states of a physical ticket throughout its lifecycle.
 *
 * @example
 * not_played  -> Customer just bought, hasn't scanned QR yet
 * active      -> Customer is playing, has remaining balance
 * finished_won -> Customer finished, has winnings to collect
 * finished_lost -> Customer finished, no winnings (balance = 0)
 * paid_out    -> Cashier already paid this ticket
 * expired     -> Ticket past expiration date
 */
export type PhysicalTicketStatus =
  | 'not_played'
  | 'active'
  | 'finished_won'
  | 'finished_lost'
  | 'paid_out'
  | 'expired'

/**
 * Defines whether ticket can be used for one specific game or all games.
 *
 * single - Ticket is restricted to one specific game
 * all    - Ticket can be used for any available game
 */
export type GameScope = 'single' | 'all'

/**
 * Payout mode when cashing out a ticket.
 *
 * winnings_only        - Pay only the winnings (remaining balance is lost)
 * winnings_plus_balance - Pay winnings + remaining unplayed balance
 */
export type PayoutMode = 'winnings_only' | 'winnings_plus_balance'

/**
 * Main physical ticket interface representing a lottery ticket
 * that a customer purchases from the cashier.
 */
export interface PhysicalTicket {
  /** Unique identifier for the ticket */
  id: string

  /** QR code string that customers scan to access their ticket */
  qrCode: string

  /** Current status of the ticket */
  status: PhysicalTicketStatus

  /** Initial deposit amount when ticket was purchased (BRL) */
  depositAmount: number

  /** Remaining balance available for betting (BRL) */
  remainingBalance: number

  /** Total winnings accumulated from games played (BRL) */
  totalWinnings: number

  /** Whether ticket is for one game or all games */
  gameScope: GameScope

  /** If gameScope is 'single', the ID of the allowed game */
  gameId: string | null

  /** If gameScope is 'single', the name of the allowed game */
  gameName: string | null

  /** Optional phone number linked to the ticket */
  phoneNumber: string | null

  /** ISO timestamp when ticket was issued */
  issuedAt: string

  /** ISO timestamp when ticket expires */
  expiresAt: string

  /** ISO timestamp when ticket was paid out (null if not paid) */
  paidOutAt: string | null

  /** Operator ID who processed the payout (null if not paid) */
  paidOutBy: string | null

  /** Final amount paid to customer (null if not paid) */
  paidOutAmount: number | null
}

/**
 * Parameters for creating a new physical ticket.
 */
export interface CreateTicketParams {
  /** Deposit amount in BRL */
  amount: number

  /** Whether ticket is for single game or all games */
  gameScope: GameScope

  /** Game ID if gameScope is 'single' */
  gameId?: string

  /** Game name if gameScope is 'single' */
  gameName?: string

  /** Optional phone number to link */
  phoneNumber?: string
}

/**
 * Result of a payout calculation showing what the customer will receive.
 */
export interface PayoutCalculation {
  /** The ticket being calculated */
  ticket: PhysicalTicket

  /** Selected payout mode */
  payoutMode: PayoutMode

  /** Winnings component of payout */
  winningsAmount: number

  /** Balance component of payout (0 if winnings_only mode) */
  balanceAmount: number

  /** Total amount to pay customer */
  totalPayout: number

  /** Whether payout can proceed (false if ticket is paid_out/expired) */
  canPayout: boolean

  /** Reason why payout cannot proceed (if canPayout is false) */
  reason?: string
}

/**
 * Result of processing a payout.
 */
export interface PayoutResult {
  /** Whether payout was successful */
  success: boolean

  /** Updated ticket after payout */
  ticket: PhysicalTicket

  /** Amount paid to customer */
  amountPaid: number

  /** Error message if payout failed */
  error?: string
}

/**
 * Status display configuration for UI.
 * Maps ticket status to user-friendly display properties.
 */
export interface StatusDisplayConfig {
  /** Status being configured */
  status: PhysicalTicketStatus

  /** Human-readable label */
  label: string

  /** Color for status badge */
  color: string

  /** Background color for status badge */
  backgroundColor: string

  /** Icon name or emoji */
  icon: string

  /** Whether payout is possible */
  canPayout: boolean
}

/**
 * Quick amount button configuration for the new ticket form.
 */
export interface QuickAmountButton {
  /** Amount value in BRL */
  value: number

  /** Display label */
  label: string
}

/**
 * Default quick amounts for new ticket creation.
 * These appear as large touch-friendly buttons.
 */
export const QUICK_AMOUNTS: QuickAmountButton[] = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
]

/**
 * Status display configurations for all ticket states.
 * Used to render consistent UI across the application.
 */
export const STATUS_DISPLAY_CONFIG: Record<PhysicalTicketStatus, StatusDisplayConfig> = {
  not_played: {
    status: 'not_played',
    label: 'Not Played',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    icon: '🎫',
    canPayout: true,
  },
  active: {
    status: 'active',
    label: 'Active',
    color: '#06b6d4',
    backgroundColor: '#ecfeff',
    icon: '🎮',
    canPayout: true,
  },
  finished_won: {
    status: 'finished_won',
    label: 'Winner!',
    color: '#10b981',
    backgroundColor: '#ecfdf5',
    icon: '🏆',
    canPayout: true,
  },
  finished_lost: {
    status: 'finished_lost',
    label: 'No Winnings',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    icon: '😔',
    canPayout: false,
  },
  paid_out: {
    status: 'paid_out',
    label: 'Already Paid',
    color: '#f59e0b',
    backgroundColor: '#fffbeb',
    icon: '✓',
    canPayout: false,
  },
  expired: {
    status: 'expired',
    label: 'Expired',
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    icon: '⏰',
    canPayout: false,
  },
}
