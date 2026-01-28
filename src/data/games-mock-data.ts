/**
 * ============================================================================
 * LOTTERY GAMES MOCK DATA
 * ============================================================================
 *
 * Purpose: Sample lottery games for development and testing
 * Based on SUMUS POS Terminal structure
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import type { LotteryGame, DrawResult, PurchasedTicket } from '@/types/game.types'

/**
 * Available lottery games
 * Games are based on the SUMUS POS Terminal layout
 */
export const lotteryGames: LotteryGame[] = [
  {
    id: 'loto-blitz',
    name: 'Loto Blitz',
    type: 'keno',
    image: '/games/loto-blitz.png',
    icon: '⚡',
    markets: Array.from({ length: 20 }, (_, i) => String(i + 1)),
    maxSelections: 10,
    betAmounts: [0.5, 1, 2, 5, 10, 20, 50, 100, 200],
    drawOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentDraw: 82717,
    timerSeconds: 8,
    isActive: true,
  },
  {
    id: 'loto-gol',
    name: 'Loto Gol',
    type: 'keno',
    image: '/games/loto-gol.png',
    icon: '⚽',
    markets: Array.from({ length: 12 }, (_, i) => String(i + 1)),
    maxSelections: 6,
    betAmounts: [0.5, 1, 2, 5, 10, 20, 50, 100],
    drawOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentDraw: 45231,
    timerSeconds: 84,
    isActive: true,
  },
  {
    id: 'loto-bubble',
    name: 'Loto Bubble',
    type: 'keno',
    image: '/games/loto-bubble.png',
    icon: '🫧',
    markets: Array.from({ length: 15 }, (_, i) => String(i + 1)),
    maxSelections: 8,
    betAmounts: [0.5, 1, 2, 5, 10, 20, 50, 100],
    drawOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentDraw: 67892,
    timerSeconds: 52,
    isActive: true,
  },
  {
    id: 'cash-lotto',
    name: 'Cash Lotto',
    type: 'keno',
    image: '/games/cash-lotto.png',
    icon: '💰',
    markets: Array.from({ length: 20 }, (_, i) => String(i + 1)),
    maxSelections: 10,
    betAmounts: [0.5, 1, 2, 5, 10, 20, 50, 100],
    drawOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentDraw: 23456,
    timerSeconds: 52,
    isActive: true,
  },
  {
    id: 'bubble-ball',
    name: 'Bubble Ball',
    type: 'multiplier',
    image: '/games/bubble-ball.png',
    icon: '🔮',
    markets: ['X2', 'X3', 'X5', 'X10', 'X15', 'X25', 'X50', 'X100'],
    maxSelections: 8,
    betAmounts: [0.5, 1, 2, 5, 10, 20, 50, 100, 200],
    drawOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentDraw: 201724,
    timerSeconds: 224,
    isActive: true,
  },
  {
    id: 'balloons',
    name: 'Balloons',
    type: 'multiplier',
    image: '/games/balloons.png',
    icon: '🎈',
    markets: ['X2', 'X3', 'X5', 'X10', 'X15', 'X25', 'X50', 'X100'],
    maxSelections: 8,
    betAmounts: [0.5, 1, 2, 5, 10, 20, 50, 100, 200],
    drawOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentDraw: 201753,
    timerSeconds: 95,
    isActive: true,
  },
  {
    id: 'gods-heritage',
    name: 'Gods Heritage',
    type: 'multiplier',
    image: '/games/gods-heritage.png',
    icon: '🏛️',
    markets: ['X2', 'X3', 'X5', 'X10', 'X15', 'X25', 'X50', 'X100'],
    maxSelections: 8,
    betAmounts: [0.5, 1, 2, 5, 10, 20, 50, 100, 200],
    drawOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentDraw: 156789,
    timerSeconds: 180,
    isActive: true,
  },
  {
    id: 'fifth-element',
    name: 'Fifth Element',
    type: 'multiplier',
    image: '/games/fifth-element.png',
    icon: '🌀',
    markets: ['X2', 'X3', 'X5', 'X10', 'X15', 'X25', 'X50', 'X100'],
    maxSelections: 8,
    betAmounts: [0.5, 1, 2, 5, 10, 20, 50, 100, 200],
    drawOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentDraw: 98765,
    timerSeconds: 22,
    isActive: true,
  },
  {
    id: 'roulette-37',
    name: 'Roulette 37',
    type: 'roulette',
    image: '/games/roulette-37.png',
    icon: '🎰',
    markets: [
      ...Array.from({ length: 37 }, (_, i) => String(i)),
      '1-12', '13-24', '25-36',
      'RED SECTOR', 'BLACK SECTOR',
      'EVEN NUMBER', 'ODD NUMBER',
      '1-18', '19-36',
      'ROW I', 'ROW II', 'ROW III',
    ],
    maxSelections: 10,
    betAmounts: [1, 2, 5, 10, 20, 50, 100],
    drawOptions: [1],
    currentDraw: 82714,
    timerSeconds: 252,
    isActive: true,
  },
  {
    id: 'mini-keno',
    name: 'Mini Keno',
    type: 'keno',
    image: '/games/mini-keno.png',
    icon: '🎱',
    markets: Array.from({ length: 40 }, (_, i) => String(i + 1)),
    maxSelections: 10,
    betAmounts: [0.5, 1, 2, 5, 10, 20, 50],
    drawOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentDraw: 54321,
    timerSeconds: 120,
    isActive: true,
  },
]

/**
 * Mock draw results for games
 */
export const mockDrawResults: DrawResult[] = [
  { id: '1', gameId: 'balloons', gameName: 'Balloons', drawNumber: 201795, result: '2', date: '2024-11-12', time: '18:59' },
  { id: '2', gameId: 'balloons', gameName: 'Balloons', drawNumber: 201794, result: '2', date: '2024-11-12', time: '18:54' },
  { id: '3', gameId: 'balloons', gameName: 'Balloons', drawNumber: 201793, result: '5', date: '2024-11-12', time: '18:49' },
  { id: '4', gameId: 'balloons', gameName: 'Balloons', drawNumber: 201792, result: '2', date: '2024-11-12', time: '18:44' },
  { id: '5', gameId: 'balloons', gameName: 'Balloons', drawNumber: 201791, result: '5', date: '2024-11-12', time: '18:39' },
  { id: '6', gameId: 'balloons', gameName: 'Balloons', drawNumber: 201790, result: '2', date: '2024-11-12', time: '18:34' },
  { id: '7', gameId: 'balloons', gameName: 'Balloons', drawNumber: 201789, result: '25', date: '2024-11-12', time: '18:29' },
  { id: '8', gameId: 'balloons', gameName: 'Balloons', drawNumber: 201788, result: '5', date: '2024-11-12', time: '18:24' },
  { id: '9', gameId: 'loto-blitz', gameName: 'Loto Blitz', drawNumber: 82716, result: '3, 7, 12, 15, 18', date: '2024-11-12', time: '18:50' },
  { id: '10', gameId: 'loto-blitz', gameName: 'Loto Blitz', drawNumber: 82715, result: '1, 5, 9, 14, 20', date: '2024-11-12', time: '18:45' },
  { id: '11', gameId: 'roulette-37', gameName: 'Roulette 37', drawNumber: 82713, result: '17', date: '2024-11-12', time: '18:40' },
  { id: '12', gameId: 'roulette-37', gameName: 'Roulette 37', drawNumber: 82712, result: '32', date: '2024-11-12', time: '18:35' },
]

/**
 * Mock purchased tickets history
 */
export const mockTicketHistory: PurchasedTicket[] = [
  {
    id: '1',
    ticketNumber: '0289-2397122442-00028362302',
    bet: {
      gameId: 'balloons',
      gameName: 'Balloons',
      gameType: 'multiplier',
      selections: ['X2', 'X5', 'X15'],
      betAmount: 10,
      numberOfDraws: 1,
      drawNumber: 201754,
      totalCost: 30,
    },
    purchasedAt: '2024-11-12T13:29:44',
    status: 'won',
    winAmount: 20,
  },
  {
    id: '2',
    ticketNumber: '0289-2397122443-00028362303',
    bet: {
      gameId: 'loto-blitz',
      gameName: 'Loto Blitz',
      gameType: 'keno',
      selections: ['1', '2', '3', '4', '5', '7', '8', '9', '10', '11'],
      betAmount: 1,
      numberOfDraws: 1,
      drawNumber: 82717,
      totalCost: 1,
    },
    purchasedAt: '2024-11-12T14:15:00',
    status: 'lost',
  },
  {
    id: '3',
    ticketNumber: '0289-2397122444-00028362304',
    bet: {
      gameId: 'roulette-37',
      gameName: 'Roulette 37',
      gameType: 'roulette',
      selections: ['17', 'RED SECTOR', '1-18'],
      betAmount: 5,
      numberOfDraws: 1,
      drawNumber: 82714,
      totalCost: 15,
    },
    purchasedAt: '2024-11-12T15:00:00',
    status: 'pending',
  },
]

/**
 * Operator info for the cashier
 */
export const operatorInfo = {
  id: '10100601',
  name: 'Cashier Demo',
  balance: 4272.15,
  currency: 'USD',
  supportPhone: '+38 068 777 22 89',
  securityPhone: '+38 068 777 22 90',
}
