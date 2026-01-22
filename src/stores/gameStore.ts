/**
 * ============================================================================
 * GAME STORE - LOTTERY POS TERMINAL STATE MANAGEMENT
 * ============================================================================
 *
 * Purpose: Zustand store for managing lottery games, cart, and transactions
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartTicket, GameBet, PurchasedTicket, CashTransaction } from '@/types/game.types'
import { lotteryGames, operatorInfo } from '@/data/games-mock-data'

interface GameState {
  /** Cart tickets pending purchase */
  cartTickets: CartTicket[]
  /** Purchased ticket history */
  ticketHistory: PurchasedTicket[]
  /** Cash transactions (collections and replenishments) */
  cashTransactions: CashTransaction[]
  /** Current operator balance */
  balance: number
  /** Operator ID */
  operatorId: string

  // Cart actions
  addToCart: (bet: GameBet) => void
  removeFromCart: (ticketId: string) => void
  clearCart: () => void
  getCartTotal: () => number

  // Purchase actions
  purchaseCart: () => PurchasedTicket[]
  purchaseSingle: (bet: GameBet) => PurchasedTicket

  // Cash management
  cashCollection: (amount: number) => void
  cashReplenishment: (amount: number) => void

  // Ticket validation
  validateTicket: (ticketNumber: string) => { status: 'valid' | 'invalid' | 'paid'; winAmount?: number; gameName?: string }
  payoutTicket: (ticketNumber: string) => boolean
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

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      cartTickets: [],
      ticketHistory: [],
      cashTransactions: [],
      balance: operatorInfo.balance,
      operatorId: operatorInfo.id,

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

      purchaseCart: () => {
        const { cartTickets, balance } = get()
        const total = cartTickets.reduce((sum, t) => sum + t.bet.totalCost, 0)

        const purchasedTickets: PurchasedTicket[] = cartTickets.map((t) => ({
          id: generateId(),
          ticketNumber: generateTicketNumber(),
          bet: t.bet,
          purchasedAt: new Date().toISOString(),
          status: 'pending' as const,
        }))

        set((state) => ({
          cartTickets: [],
          ticketHistory: [...purchasedTickets, ...state.ticketHistory],
          balance: state.balance + total,
        }))

        return purchasedTickets
      },

      purchaseSingle: (bet: GameBet) => {
        const ticket: PurchasedTicket = {
          id: generateId(),
          ticketNumber: generateTicketNumber(),
          bet,
          purchasedAt: new Date().toISOString(),
          status: 'pending',
        }

        set((state) => ({
          ticketHistory: [ticket, ...state.ticketHistory],
          balance: state.balance + bet.totalCost,
        }))

        return ticket
      },

      cashCollection: (amount: number) => {
        const transaction: CashTransaction = {
          id: generateId(),
          type: 'collection',
          amount,
          timestamp: new Date().toISOString(),
          operatorId: get().operatorId,
        }

        set((state) => ({
          balance: state.balance - amount,
          cashTransactions: [transaction, ...state.cashTransactions],
        }))
      },

      cashReplenishment: (amount: number) => {
        const transaction: CashTransaction = {
          id: generateId(),
          type: 'replenishment',
          amount,
          timestamp: new Date().toISOString(),
          operatorId: get().operatorId,
        }

        set((state) => ({
          balance: state.balance + amount,
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

      payoutTicket: (ticketNumber: string) => {
        const validation = get().validateTicket(ticketNumber)

        if (validation.status !== 'valid' || !validation.winAmount) {
          return false
        }

        set((state) => ({
          ticketHistory: state.ticketHistory.map((t) =>
            t.ticketNumber === ticketNumber
              ? { ...t, status: 'paid' as const, winAmount: validation.winAmount }
              : t
          ),
          balance: state.balance - validation.winAmount!,
        }))

        return true
      },
    }),
    {
      name: 'octili-game-store',
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
