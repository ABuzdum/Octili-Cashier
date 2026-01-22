/**
 * ============================================================================
 * GAME STORE - LOTTERY POS TERMINAL STATE MANAGEMENT
 * ============================================================================
 *
 * Purpose: Zustand store for managing lottery games, cart, and transactions
 *
 * Features:
 * - Multi-pocket balance system (Cash, Card, PIX, Other)
 * - Payment method tracking for all transactions
 * - Cart management for lottery tickets
 * - Cash collection and replenishment by pocket
 *
 * @author Octili Development Team
 * @version 2.0.0
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  CartTicket,
  GameBet,
  PurchasedTicket,
  CashTransaction,
  PaymentMethod,
  PocketBalance,
} from '@/types/game.types'
import { lotteryGames, operatorInfo } from '@/data/games-mock-data'

/**
 * Initial pocket balances - for new installations
 */
const INITIAL_POCKET_BALANCES: PocketBalance = {
  cash: 2000.00,
  card: 1500.00,
  pix: 500.00,
  other: 272.15,
}

interface GameState {
  /** Cart tickets pending purchase */
  cartTickets: CartTicket[]
  /** Purchased ticket history */
  ticketHistory: PurchasedTicket[]
  /** Cash transactions (collections, replenishments, sales, payouts) */
  cashTransactions: CashTransaction[]
  /** Multi-pocket balance system */
  pocketBalances: PocketBalance
  /** Operator ID */
  operatorId: string
  /** Legacy balance field for backward compatibility (computed) */
  balance: number

  // Balance getters
  getTotalBalance: () => number
  getPocketBalance: (pocket: PaymentMethod) => number

  // Cart actions
  addToCart: (bet: GameBet) => void
  removeFromCart: (ticketId: string) => void
  clearCart: () => void
  getCartTotal: () => number

  // Purchase actions with payment method
  purchaseCart: (paymentMethod?: PaymentMethod) => PurchasedTicket[]
  purchaseSingle: (bet: GameBet, paymentMethod?: PaymentMethod) => PurchasedTicket

  // Cash management by pocket
  cashCollection: (amount: number, pocket?: PaymentMethod | 'all') => void
  cashReplenishment: (amount: number, pocket?: PaymentMethod) => void
  collectFromPocket: (pocket: PaymentMethod | 'all', amount: number) => void
  replenishPocket: (pocket: PaymentMethod, amount: number) => void

  // Ticket validation
  validateTicket: (ticketNumber: string) => { status: 'valid' | 'invalid' | 'paid'; winAmount?: number; gameName?: string }
  payoutTicket: (ticketNumber: string, payoutPocket?: PaymentMethod) => boolean
}

/**
 * Generate a unique ticket number
 */
function generateTicketNumber(): string {
  const prefix = '0289'
  const middle = Math.floor(Math.random() * 9999999999).toString().padStart(10, '0')
  const suffix = Math.floor(Math.random() * 99999999999).toString().padStart(11, '0')
  return `${prefix}-${middle}-${suffix}`
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Calculate total balance from all pockets
 */
function calculateTotalBalance(pockets: PocketBalance): number {
  return pockets.cash + pockets.card + pockets.pix + pockets.other
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      cartTickets: [],
      ticketHistory: [],
      cashTransactions: [],
      pocketBalances: INITIAL_POCKET_BALANCES,
      operatorId: operatorInfo.id,

      // Computed balance for backward compatibility
      get balance() {
        return calculateTotalBalance(get().pocketBalances)
      },

      getTotalBalance: () => {
        return calculateTotalBalance(get().pocketBalances)
      },

      getPocketBalance: (pocket: PaymentMethod) => {
        return get().pocketBalances[pocket]
      },

      addToCart: (bet: GameBet) => {
        const ticket: CartTicket = {
          id: generateId(),
          bet,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          cartTickets: [...state.cartTickets, ticket],
        }))
      },

      removeFromCart: (ticketId: string) => {
        set((state) => ({
          cartTickets: state.cartTickets.filter((t) => t.id !== ticketId),
        }))
      },

      clearCart: () => {
        set({ cartTickets: [] })
      },

      getCartTotal: () => {
        return get().cartTickets.reduce((sum, t) => sum + t.bet.totalCost, 0)
      },

      purchaseCart: (paymentMethod: PaymentMethod = 'cash') => {
        const { cartTickets, pocketBalances, operatorId } = get()
        const total = cartTickets.reduce((sum, t) => sum + t.bet.totalCost, 0)

        const purchasedTickets: PurchasedTicket[] = cartTickets.map((t) => ({
          id: generateId(),
          ticketNumber: generateTicketNumber(),
          bet: t.bet,
          purchasedAt: new Date().toISOString(),
          status: 'pending' as const,
        }))

        // Create transaction record
        const transaction: CashTransaction = {
          id: generateId(),
          type: 'sale',
          pocket: paymentMethod,
          amount: total,
          timestamp: new Date().toISOString(),
          operatorId,
        }

        // Update the specific pocket balance
        const newPocketBalances = { ...pocketBalances }
        newPocketBalances[paymentMethod] += total

        set((state) => ({
          cartTickets: [],
          ticketHistory: [...purchasedTickets, ...state.ticketHistory],
          pocketBalances: newPocketBalances,
          cashTransactions: [transaction, ...state.cashTransactions],
        }))

        return purchasedTickets
      },

      purchaseSingle: (bet: GameBet, paymentMethod: PaymentMethod = 'cash') => {
        const { pocketBalances, operatorId } = get()

        const ticket: PurchasedTicket = {
          id: generateId(),
          ticketNumber: generateTicketNumber(),
          bet,
          purchasedAt: new Date().toISOString(),
          status: 'pending',
        }

        // Create transaction record
        const transaction: CashTransaction = {
          id: generateId(),
          type: 'sale',
          pocket: paymentMethod,
          amount: bet.totalCost,
          timestamp: new Date().toISOString(),
          operatorId,
          ticketId: ticket.id,
        }

        // Update the specific pocket balance
        const newPocketBalances = { ...pocketBalances }
        newPocketBalances[paymentMethod] += bet.totalCost

        set((state) => ({
          ticketHistory: [ticket, ...state.ticketHistory],
          pocketBalances: newPocketBalances,
          cashTransactions: [transaction, ...state.cashTransactions],
        }))

        return ticket
      },

      cashCollection: (amount: number, pocket: PaymentMethod | 'all' = 'cash') => {
        get().collectFromPocket(pocket, amount)
      },

      collectFromPocket: (pocket: PaymentMethod | 'all', amount: number) => {
        const { pocketBalances, operatorId } = get()

        if (pocket === 'all') {
          // Collect proportionally from all pockets
          const total = calculateTotalBalance(pocketBalances)
          if (amount > total) return

          const ratio = amount / total
          const newPocketBalances: PocketBalance = {
            cash: pocketBalances.cash - (pocketBalances.cash * ratio),
            card: pocketBalances.card - (pocketBalances.card * ratio),
            pix: pocketBalances.pix - (pocketBalances.pix * ratio),
            other: pocketBalances.other - (pocketBalances.other * ratio),
          }

          // Create one transaction per pocket that had funds
          const transactions: CashTransaction[] = []
          const pockets: PaymentMethod[] = ['cash', 'card', 'pix', 'other']
          pockets.forEach((p) => {
            const pocketAmount = pocketBalances[p] * ratio
            if (pocketAmount > 0) {
              transactions.push({
                id: generateId(),
                type: 'collection',
                pocket: p,
                amount: pocketAmount,
                timestamp: new Date().toISOString(),
                operatorId,
              })
            }
          })

          set((state) => ({
            pocketBalances: newPocketBalances,
            cashTransactions: [...transactions, ...state.cashTransactions],
          }))
        } else {
          // Collect from specific pocket
          if (amount > pocketBalances[pocket]) return

          const transaction: CashTransaction = {
            id: generateId(),
            type: 'collection',
            pocket,
            amount,
            timestamp: new Date().toISOString(),
            operatorId,
          }

          const newPocketBalances = { ...pocketBalances }
          newPocketBalances[pocket] -= amount

          set((state) => ({
            pocketBalances: newPocketBalances,
            cashTransactions: [transaction, ...state.cashTransactions],
          }))
        }
      },

      cashReplenishment: (amount: number, pocket: PaymentMethod = 'cash') => {
        get().replenishPocket(pocket, amount)
      },

      replenishPocket: (pocket: PaymentMethod, amount: number) => {
        const { pocketBalances, operatorId } = get()

        const transaction: CashTransaction = {
          id: generateId(),
          type: 'replenishment',
          pocket,
          amount,
          timestamp: new Date().toISOString(),
          operatorId,
        }

        const newPocketBalances = { ...pocketBalances }
        newPocketBalances[pocket] += amount

        set((state) => ({
          pocketBalances: newPocketBalances,
          cashTransactions: [transaction, ...state.cashTransactions],
        }))
      },

      validateTicket: (ticketNumber: string) => {
        const ticket = get().ticketHistory.find((t) => t.ticketNumber === ticketNumber)

        if (!ticket) {
          return { status: 'invalid' as const }
        }

        if (ticket.status === 'paid') {
          return { status: 'paid' as const, gameName: ticket.bet.gameName }
        }

        // Simulate random win (30% chance for demo)
        const isWin = Math.random() < 0.3
        if (isWin) {
          const winAmount = ticket.bet.totalCost * (Math.floor(Math.random() * 5) + 2)
          return { status: 'valid' as const, winAmount, gameName: ticket.bet.gameName }
        }

        return { status: 'invalid' as const, gameName: ticket.bet.gameName }
      },

      payoutTicket: (ticketNumber: string, payoutPocket: PaymentMethod = 'cash') => {
        const validation = get().validateTicket(ticketNumber)
        const { pocketBalances, operatorId } = get()

        if (validation.status !== 'valid' || !validation.winAmount) {
          return false
        }

        // Check if pocket has enough funds
        if (pocketBalances[payoutPocket] < validation.winAmount) {
          return false
        }

        const transaction: CashTransaction = {
          id: generateId(),
          type: 'payout',
          pocket: payoutPocket,
          amount: validation.winAmount,
          timestamp: new Date().toISOString(),
          operatorId,
        }

        const newPocketBalances = { ...pocketBalances }
        newPocketBalances[payoutPocket] -= validation.winAmount

        set((state) => ({
          ticketHistory: state.ticketHistory.map((t) =>
            t.ticketNumber === ticketNumber
              ? { ...t, status: 'paid' as const, winAmount: validation.winAmount }
              : t
          ),
          pocketBalances: newPocketBalances,
          cashTransactions: [transaction, ...state.cashTransactions],
        }))

        return true
      },
    }),
    {
      name: 'octili-game-store',
      // Migration for old data format
      migrate: (persistedState: any, version: number) => {
        // If old format with single balance, migrate to pocketBalances
        if (persistedState && typeof persistedState.balance === 'number' && !persistedState.pocketBalances) {
          persistedState.pocketBalances = {
            cash: persistedState.balance,
            card: 0,
            pix: 0,
            other: 0,
          }
        }
        // Add pocket field to old transactions
        if (persistedState?.cashTransactions) {
          persistedState.cashTransactions = persistedState.cashTransactions.map((t: any) => ({
            ...t,
            pocket: t.pocket || 'cash',
          }))
        }
        return persistedState
      },
      version: 2,
    }
  )
)

/**
 * Hook to get all lottery games with updated timers
 */
export function useLotteryGames() {
  return lotteryGames
}

/**
 * Hook to get a specific game by ID
 */
export function useGame(gameId: string) {
  return lotteryGames.find((g) => g.id === gameId)
}
