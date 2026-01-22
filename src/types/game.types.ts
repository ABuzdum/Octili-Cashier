/**
 * ============================================================================
 * GAME TYPE DEFINITIONS - LOTTERY POS TERMINAL
 * ============================================================================
 *
 * Purpose: TypeScript interfaces for lottery games and tickets
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

/**
 * Game types available in the POS terminal
 * - multiplier: Games where player selects multipliers (X2, X5, X10, etc.)
 * - keno: Games where player selects numbers (1-20, etc.)
 * - roulette: Games where player selects numbers/sectors on a wheel
 */
export type GameType = 'multiplier' | 'keno' | 'roulette'

/**
 * Lottery game definition
 */
export interface LotteryGame {
  id: string
  name: string
  type: GameType
  image: string
  /** Emoji icon for quick visual identification */
  icon: string
  /** Available markets/options to select (multipliers or max numbers) */
  markets: string[]
  /** Maximum number of selections allowed */
  maxSelections: number
  /** Available bet amounts */
  betAmounts: number[]
  /** Available number of draws */
  drawOptions: number[]
  /** Current draw number */
  currentDraw: number
  /** Seconds until next draw */
  timerSeconds: number
  /** Is game currently active */
  isActive: boolean
}

/**
 * Selected bet for a game
 */
export interface GameBet {
  gameId: string
  gameName: string
  gameType: GameType
  selections: string[]
  betAmount: number
  /** Number of consecutive draws to play (multi-draw mode) */
  numberOfDraws: number
  /** Starting draw number */
  drawNumber: number
  totalCost: number
  /** Whether this bet is for a specific future draw */
  isSpecificDraw?: boolean
  /** Target draw number if playing a specific draw */
  targetDraw?: number | null
}

/**
 * Ticket in the cart
 */
export interface CartTicket {
  id: string
  bet: GameBet
  createdAt: string
}

/**
 * Purchased ticket
 */
export interface PurchasedTicket {
  id: string
  ticketNumber: string
  bet: GameBet
  purchasedAt: string
  status: 'pending' | 'won' | 'lost' | 'paid'
  winAmount?: number
  qrCode?: string
}

/**
 * Draw result for a game
 */
export interface DrawResult {
  id: string
  gameId: string
  gameName: string
  drawNumber: number
  result: string
  date: string
  time: string
}

/**
 * Ticket validation result
 */
export interface TicketValidation {
  status: 'valid' | 'invalid' | 'paid'
  ticketNumber: string
  gameName?: string
  winAmount?: number
  message: string
}

/**
 * Cash management transaction
 */
export interface CashTransaction {
  id: string
  type: 'collection' | 'replenishment'
  amount: number
  timestamp: string
  operatorId: string
}

/**
 * Daily report data
 */
export interface DailyReport {
  date: string
  operatorId: string
  balance: number
  currency: string
  games: {
    name: string
    sales: { amount: number; sum: number }
    payouts: { amount: number; sum: number }
    balance: number
  }[]
  cashier: {
    sales: { amount: number; sum: number }
    payouts: { amount: number; sum: number }
    abolition: { amount: number; sum: number }
    balance: number
  }
}

/**
 * QR transaction for player account
 */
export interface QRTransaction {
  id: string
  type: 'replenishment' | 'payout'
  playerAccount: string
  amount: number
  timestamp: string
  operatorId: string
}
