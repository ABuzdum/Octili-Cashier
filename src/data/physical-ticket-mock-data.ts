/**
 * ============================================================================
 * PHYSICAL TICKET MOCK DATA
 * ============================================================================
 *
 * Purpose: Sample physical tickets for testing all status states.
 * Each ticket demonstrates a different status in the ticket lifecycle.
 *
 * Usage: Import this data for development and testing purposes.
 * In production, tickets would come from the backend API.
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import type { PhysicalTicket } from '@/types/physical-ticket.types'

/**
 * Helper to create ISO date strings relative to now.
 */
function getRelativeDate(hoursOffset: number): string {
  const date = new Date()
  date.setHours(date.getHours() + hoursOffset)
  return date.toISOString()
}

/**
 * Sample tickets demonstrating all possible states.
 * Use these for testing payout flows and UI states.
 */
export const MOCK_PHYSICAL_TICKETS: PhysicalTicket[] = [
  // 1. NOT PLAYED - Customer bought but hasn't scanned QR yet
  {
    id: 'TKT-MOCK001',
    qrCode: 'OCT-TESTAB12-N0PL',
    status: 'not_played',
    depositAmount: 50,
    remainingBalance: 50,
    totalWinnings: 0,
    gameScope: 'all',
    gameId: null,
    gameName: null,
    phoneNumber: null,
    issuedAt: getRelativeDate(-2),
    expiresAt: getRelativeDate(22),
    paidOutAt: null,
    paidOutBy: null,
    paidOutAmount: null,
  },

  // 2. ACTIVE - Customer is playing, has remaining balance
  {
    id: 'TKT-MOCK002',
    qrCode: 'OCT-TESTCD34-ACTV',
    status: 'active',
    depositAmount: 100,
    remainingBalance: 35,
    totalWinnings: 25,
    gameScope: 'all',
    gameId: null,
    gameName: null,
    phoneNumber: '+55 11 98765-4321',
    issuedAt: getRelativeDate(-5),
    expiresAt: getRelativeDate(19),
    paidOutAt: null,
    paidOutBy: null,
    paidOutAmount: null,
  },

  // 3. FINISHED WON - Customer finished playing, has winnings
  {
    id: 'TKT-MOCK003',
    qrCode: 'OCT-TESTEF56-FWIN',
    status: 'finished_won',
    depositAmount: 25,
    remainingBalance: 0,
    totalWinnings: 150,
    gameScope: 'single',
    gameId: 'game-1',
    gameName: 'Lucky Keno',
    phoneNumber: '+55 21 99999-8888',
    issuedAt: getRelativeDate(-10),
    expiresAt: getRelativeDate(14),
    paidOutAt: null,
    paidOutBy: null,
    paidOutAmount: null,
  },

  // 4. FINISHED LOST - Customer finished, no winnings
  {
    id: 'TKT-MOCK004',
    qrCode: 'OCT-TESTGH78-FLST',
    status: 'finished_lost',
    depositAmount: 20,
    remainingBalance: 0,
    totalWinnings: 0,
    gameScope: 'single',
    gameId: 'game-2',
    gameName: 'Balloons',
    phoneNumber: null,
    issuedAt: getRelativeDate(-15),
    expiresAt: getRelativeDate(9),
    paidOutAt: null,
    paidOutBy: null,
    paidOutAmount: null,
  },

  // 5. PAID OUT - Ticket already redeemed
  {
    id: 'TKT-MOCK005',
    qrCode: 'OCT-TESTIJ90-PAID',
    status: 'paid_out',
    depositAmount: 100,
    remainingBalance: 0,
    totalWinnings: 0,
    gameScope: 'all',
    gameId: null,
    gameName: null,
    phoneNumber: '+55 11 91234-5678',
    issuedAt: getRelativeDate(-48),
    expiresAt: getRelativeDate(-24),
    paidOutAt: getRelativeDate(-30),
    paidOutBy: 'operator-123',
    paidOutAmount: 275,
  },

  // 6. EXPIRED - Past expiration date
  {
    id: 'TKT-MOCK006',
    qrCode: 'OCT-TESTKL12-EXPR',
    status: 'expired',
    depositAmount: 15,
    remainingBalance: 10,
    totalWinnings: 5,
    gameScope: 'all',
    gameId: null,
    gameName: null,
    phoneNumber: null,
    issuedAt: getRelativeDate(-72),
    expiresAt: getRelativeDate(-48),
    paidOutAt: null,
    paidOutBy: null,
    paidOutAmount: null,
  },

  // 7. ACTIVE with single game restriction
  {
    id: 'TKT-MOCK007',
    qrCode: 'OCT-TESTMN34-SNG1',
    status: 'active',
    depositAmount: 50,
    remainingBalance: 20,
    totalWinnings: 10,
    gameScope: 'single',
    gameId: 'game-3',
    gameName: 'Loto Blitz',
    phoneNumber: '+55 31 97777-6666',
    issuedAt: getRelativeDate(-3),
    expiresAt: getRelativeDate(21),
    paidOutAt: null,
    paidOutBy: null,
    paidOutAmount: null,
  },

  // 8. NOT PLAYED with phone number linked
  {
    id: 'TKT-MOCK008',
    qrCode: 'OCT-TESTOP56-N0P2',
    status: 'not_played',
    depositAmount: 200,
    remainingBalance: 200,
    totalWinnings: 0,
    gameScope: 'all',
    gameId: null,
    gameName: null,
    phoneNumber: '+55 41 95555-4444',
    issuedAt: getRelativeDate(-1),
    expiresAt: getRelativeDate(23),
    paidOutAt: null,
    paidOutBy: null,
    paidOutAmount: null,
  },
]

/**
 * QR codes for quick testing.
 * Copy-paste these into the payout scanner.
 */
export const TEST_QR_CODES = {
  notPlayed: 'OCT-TESTAB12-N0PL',
  active: 'OCT-TESTCD34-ACTV',
  finishedWon: 'OCT-TESTEF56-FWIN',
  finishedLost: 'OCT-TESTGH78-FLST',
  paidOut: 'OCT-TESTIJ90-PAID',
  expired: 'OCT-TESTKL12-EXPR',
}
