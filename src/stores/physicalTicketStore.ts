/**
 * ============================================================================
 * PHYSICAL TICKET STORE - ZUSTAND STATE MANAGEMENT
 * ============================================================================
 *
 * Purpose: Manages all state and operations for physical lottery tickets.
 * Handles ticket creation, lookup, payout calculation, and payout processing.
 *
 * Features:
 * - Create new tickets with QR codes
 * - Lookup tickets by QR code
 * - Calculate payouts based on mode (winnings only vs winnings + balance)
 * - Process payouts and update ticket status
 * - Persist tickets to localStorage
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  PhysicalTicket,
  PhysicalTicketStatus,
  CreateTicketParams,
  PayoutCalculation,
  PayoutResult,
  PayoutMode,
} from '@/types/physical-ticket.types'
import { MOCK_PHYSICAL_TICKETS } from '@/data/physical-ticket-mock-data'

/**
 * Generate a unique QR code string for a ticket.
 * Format: OCT-XXXXXXXX-XXXX where X is alphanumeric
 */
function generateQRCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'OCT-'

  // First part: 8 characters
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }

  code += '-'

  // Second part: 4 characters
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }

  return code
}

/**
 * Generate a unique ticket ID.
 * Format: TKT-TIMESTAMP-RANDOM
 */
function generateTicketId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TKT-${timestamp}-${random}`
}

/**
 * Calculate expiration date (24 hours from now).
 */
function calculateExpirationDate(): string {
  const expiration = new Date()
  expiration.setHours(expiration.getHours() + 24)
  return expiration.toISOString()
}

/**
 * Check if a ticket has expired.
 */
function isTicketExpired(ticket: PhysicalTicket): boolean {
  const now = new Date()
  const expiresAt = new Date(ticket.expiresAt)
  return now > expiresAt
}

/**
 * Get the effective status of a ticket (accounting for expiration).
 */
function getEffectiveStatus(ticket: PhysicalTicket): PhysicalTicketStatus {
  if (ticket.status === 'paid_out') {
    return 'paid_out'
  }

  if (isTicketExpired(ticket) && ticket.status !== 'expired') {
    return 'expired'
  }

  return ticket.status
}

/**
 * Physical Ticket Store State Interface
 */
interface PhysicalTicketState {
  /** All tickets in the system */
  tickets: PhysicalTicket[]

  /** Currently viewed/selected ticket */
  currentTicket: PhysicalTicket | null

  /** Loading state for async operations */
  isLoading: boolean

  /** Error message if any */
  error: string | null

  /**
   * Create a new physical ticket with deposit.
   * Returns the created ticket with QR code.
   */
  createTicket: (params: CreateTicketParams) => PhysicalTicket

  /**
   * Find a ticket by its QR code.
   * Returns null if not found.
   */
  getTicketByQRCode: (qrCode: string) => PhysicalTicket | null

  /**
   * Find a ticket by its ID.
   * Returns null if not found.
   */
  getTicketById: (id: string) => PhysicalTicket | null

  /**
   * Calculate the payout for a ticket based on payout mode.
   * Returns calculation with breakdown and validity.
   */
  calculatePayout: (ticket: PhysicalTicket, payoutMode: PayoutMode) => PayoutCalculation

  /**
   * Process payout for a ticket.
   * Updates ticket status and records payout details.
   */
  processPayoutTicket: (
    ticketId: string,
    payoutMode: PayoutMode,
    operatorId: string
  ) => PayoutResult

  /**
   * Update a ticket's status (for simulation/testing).
   */
  updateTicketStatus: (
    ticketId: string,
    status: PhysicalTicketStatus,
    updates?: Partial<PhysicalTicket>
  ) => void

  /**
   * Set the current ticket being viewed.
   */
  setCurrentTicket: (ticket: PhysicalTicket | null) => void

  /**
   * Clear any error state.
   */
  clearError: () => void

  /**
   * Get all tickets (for history/reports).
   */
  getAllTickets: () => PhysicalTicket[]

  /**
   * Get tickets by status.
   */
  getTicketsByStatus: (status: PhysicalTicketStatus) => PhysicalTicket[]

  /**
   * Load mock data for testing.
   */
  loadMockData: () => void
}

/**
 * Physical Ticket Store
 *
 * Zustand store with persistence to localStorage.
 * Manages the complete lifecycle of physical lottery tickets.
 */
export const usePhysicalTicketStore = create<PhysicalTicketState>()(
  persist(
    (set, get) => ({
      tickets: [],
      currentTicket: null,
      isLoading: false,
      error: null,

      createTicket: (params: CreateTicketParams): PhysicalTicket => {
        const now = new Date().toISOString()

        const newTicket: PhysicalTicket = {
          id: generateTicketId(),
          qrCode: generateQRCode(),
          status: 'not_played',
          depositAmount: params.amount,
          remainingBalance: params.amount,
          totalWinnings: 0,
          gameScope: params.gameScope,
          gameId: params.gameId || null,
          gameName: params.gameName || null,
          phoneNumber: params.phoneNumber || null,
          issuedAt: now,
          expiresAt: calculateExpirationDate(),
          paidOutAt: null,
          paidOutBy: null,
          paidOutAmount: null,
        }

        set((state) => ({
          tickets: [...state.tickets, newTicket],
          currentTicket: newTicket,
        }))

        return newTicket
      },

      getTicketByQRCode: (qrCode: string): PhysicalTicket | null => {
        const { tickets } = get()
        const ticket = tickets.find(
          (t) => t.qrCode.toUpperCase() === qrCode.toUpperCase()
        )

        if (!ticket) {
          return null
        }

        // Update status if expired
        const effectiveStatus = getEffectiveStatus(ticket)
        if (effectiveStatus !== ticket.status) {
          get().updateTicketStatus(ticket.id, effectiveStatus)
          return { ...ticket, status: effectiveStatus }
        }

        return ticket
      },

      getTicketById: (id: string): PhysicalTicket | null => {
        const { tickets } = get()
        return tickets.find((t) => t.id === id) || null
      },

      calculatePayout: (
        ticket: PhysicalTicket,
        payoutMode: PayoutMode
      ): PayoutCalculation => {
        const effectiveStatus = getEffectiveStatus(ticket)

        // Check if payout is possible
        if (effectiveStatus === 'paid_out') {
          return {
            ticket,
            payoutMode,
            winningsAmount: 0,
            balanceAmount: 0,
            totalPayout: 0,
            canPayout: false,
            reason: `Ticket was already paid out on ${new Date(ticket.paidOutAt!).toLocaleDateString()}`,
          }
        }

        if (effectiveStatus === 'expired') {
          return {
            ticket,
            payoutMode,
            winningsAmount: 0,
            balanceAmount: 0,
            totalPayout: 0,
            canPayout: false,
            reason: 'Ticket has expired and cannot be redeemed',
          }
        }

        if (effectiveStatus === 'finished_lost') {
          return {
            ticket,
            payoutMode,
            winningsAmount: 0,
            balanceAmount: 0,
            totalPayout: 0,
            canPayout: false,
            reason: 'No balance or winnings to pay out',
          }
        }

        // Calculate payout based on mode
        const winningsAmount = ticket.totalWinnings
        const balanceAmount =
          payoutMode === 'winnings_plus_balance' ? ticket.remainingBalance : 0
        const totalPayout = winningsAmount + balanceAmount

        return {
          ticket,
          payoutMode,
          winningsAmount,
          balanceAmount,
          totalPayout,
          canPayout: totalPayout > 0,
          reason: totalPayout === 0 ? 'No amount to pay out' : undefined,
        }
      },

      processPayoutTicket: (
        ticketId: string,
        payoutMode: PayoutMode,
        operatorId: string
      ): PayoutResult => {
        const ticket = get().getTicketById(ticketId)

        if (!ticket) {
          return {
            success: false,
            ticket: null as unknown as PhysicalTicket,
            amountPaid: 0,
            error: 'Ticket not found',
          }
        }

        const calculation = get().calculatePayout(ticket, payoutMode)

        if (!calculation.canPayout) {
          return {
            success: false,
            ticket,
            amountPaid: 0,
            error: calculation.reason,
          }
        }

        const now = new Date().toISOString()

        const updatedTicket: PhysicalTicket = {
          ...ticket,
          status: 'paid_out',
          remainingBalance: 0,
          totalWinnings: 0,
          paidOutAt: now,
          paidOutBy: operatorId,
          paidOutAmount: calculation.totalPayout,
        }

        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId ? updatedTicket : t
          ),
          currentTicket: updatedTicket,
        }))

        return {
          success: true,
          ticket: updatedTicket,
          amountPaid: calculation.totalPayout,
        }
      },

      updateTicketStatus: (
        ticketId: string,
        status: PhysicalTicketStatus,
        updates?: Partial<PhysicalTicket>
      ): void => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId ? { ...t, status, ...updates } : t
          ),
        }))
      },

      setCurrentTicket: (ticket: PhysicalTicket | null): void => {
        set({ currentTicket: ticket })
      },

      clearError: (): void => {
        set({ error: null })
      },

      getAllTickets: (): PhysicalTicket[] => {
        return get().tickets
      },

      getTicketsByStatus: (status: PhysicalTicketStatus): PhysicalTicket[] => {
        return get().tickets.filter((t) => getEffectiveStatus(t) === status)
      },

      loadMockData: (): void => {
        const existingTickets = get().tickets
        // Only load mock data if no tickets exist yet
        if (existingTickets.length === 0) {
          set({ tickets: MOCK_PHYSICAL_TICKETS })
        }
      },
    }),
    {
      name: 'octili-physical-tickets',
      version: 1,
    }
  )
)

/**
 * Hook to get ticket statistics for reports.
 */
export function useTicketStats() {
  const tickets = usePhysicalTicketStore((state) => state.tickets)

  const stats = {
    total: tickets.length,
    notPlayed: tickets.filter((t) => getEffectiveStatus(t) === 'not_played').length,
    active: tickets.filter((t) => getEffectiveStatus(t) === 'active').length,
    finishedWon: tickets.filter((t) => getEffectiveStatus(t) === 'finished_won').length,
    finishedLost: tickets.filter((t) => getEffectiveStatus(t) === 'finished_lost').length,
    paidOut: tickets.filter((t) => t.status === 'paid_out').length,
    expired: tickets.filter((t) => getEffectiveStatus(t) === 'expired').length,
    totalDeposits: tickets.reduce((sum, t) => sum + t.depositAmount, 0),
    totalPayouts: tickets.reduce((sum, t) => sum + (t.paidOutAmount || 0), 0),
  }

  return stats
}
