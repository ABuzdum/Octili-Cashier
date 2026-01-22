/**
 * ============================================================================
 * TV BOX MOCK DATA
 * ============================================================================
 *
 * Purpose: Sample TV Box devices for development and testing.
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import type { TVBox } from '@/types/tvbox.types'

/**
 * Helper to get relative date string
 */
function getRelativeDate(minutesAgo: number): string {
  const date = new Date()
  date.setMinutes(date.getMinutes() - minutesAgo)
  return date.toISOString()
}

/**
 * Mock TV Boxes in the venue
 */
export const MOCK_TV_BOXES: TVBox[] = [
  {
    id: 'tvbox-001',
    name: 'Main Entrance TV',
    location: 'Entrance Area',
    status: 'online',
    currentGameId: 'game-1',
    currentGameName: 'Lucky Keno',
    volume: 75,
    isMuted: false,
    overlay: {
      type: 'image',
      url: '/promo/welcome-banner.jpg',
      position: 'bottom-right',
      opacity: 80,
      width: 25,
      isActive: true,
    },
    lastSeen: getRelativeDate(1),
    ipAddress: '192.168.1.101',
    resolution: '1920x1080',
  },
  {
    id: 'tvbox-002',
    name: 'Bar Area TV',
    location: 'Bar Counter',
    status: 'online',
    currentGameId: 'game-2',
    currentGameName: 'Balloons',
    volume: 50,
    isMuted: true,
    overlay: {
      type: 'none',
      url: null,
      position: 'bottom-right',
      opacity: 100,
      width: 20,
      isActive: false,
    },
    lastSeen: getRelativeDate(0),
    ipAddress: '192.168.1.102',
    resolution: '1920x1080',
  },
  {
    id: 'tvbox-003',
    name: 'VIP Lounge TV 1',
    location: 'VIP Section',
    status: 'online',
    currentGameId: 'game-3',
    currentGameName: 'Loto Blitz',
    volume: 60,
    isMuted: false,
    overlay: {
      type: 'video',
      url: '/promo/jackpot-winner.mp4',
      position: 'top-right',
      opacity: 90,
      width: 30,
      isActive: true,
    },
    lastSeen: getRelativeDate(2),
    ipAddress: '192.168.1.103',
    resolution: '3840x2160',
  },
  {
    id: 'tvbox-004',
    name: 'VIP Lounge TV 2',
    location: 'VIP Section',
    status: 'standby',
    currentGameId: null,
    currentGameName: null,
    volume: 40,
    isMuted: false,
    overlay: {
      type: 'none',
      url: null,
      position: 'bottom-right',
      opacity: 100,
      width: 20,
      isActive: false,
    },
    lastSeen: getRelativeDate(15),
    ipAddress: '192.168.1.104',
    resolution: '1920x1080',
  },
  {
    id: 'tvbox-005',
    name: 'Cashier Display',
    location: 'Cashier Counter',
    status: 'offline',
    currentGameId: 'game-1',
    currentGameName: 'Lucky Keno',
    volume: 0,
    isMuted: true,
    overlay: {
      type: 'none',
      url: null,
      position: 'bottom-right',
      opacity: 100,
      width: 20,
      isActive: false,
    },
    lastSeen: getRelativeDate(120),
    ipAddress: '192.168.1.105',
    resolution: '1920x1080',
  },
  {
    id: 'tvbox-006',
    name: 'Waiting Area TV',
    location: 'Customer Waiting Area',
    status: 'online',
    currentGameId: 'game-4',
    currentGameName: 'Speed Roulette',
    volume: 30,
    isMuted: false,
    overlay: {
      type: 'image',
      url: '/promo/new-games.jpg',
      position: 'top-left',
      opacity: 70,
      width: 35,
      isActive: true,
    },
    lastSeen: getRelativeDate(0),
    ipAddress: '192.168.1.106',
    resolution: '1920x1080',
  },
]

/**
 * Sample promotional media for overlays
 */
export const PROMO_MEDIA = [
  {
    id: 'promo-1',
    name: 'Welcome Banner',
    type: 'image' as const,
    url: '/promo/welcome-banner.jpg',
    thumbnail: '/promo/welcome-banner-thumb.jpg',
  },
  {
    id: 'promo-2',
    name: 'Jackpot Winner',
    type: 'video' as const,
    url: '/promo/jackpot-winner.mp4',
    thumbnail: '/promo/jackpot-winner-thumb.jpg',
  },
  {
    id: 'promo-3',
    name: 'New Games',
    type: 'image' as const,
    url: '/promo/new-games.jpg',
    thumbnail: '/promo/new-games-thumb.jpg',
  },
  {
    id: 'promo-4',
    name: 'Special Offer',
    type: 'image' as const,
    url: '/promo/special-offer.jpg',
    thumbnail: '/promo/special-offer-thumb.jpg',
  },
  {
    id: 'promo-5',
    name: 'Weekend Bonus',
    type: 'video' as const,
    url: '/promo/weekend-bonus.mp4',
    thumbnail: '/promo/weekend-bonus-thumb.jpg',
  },
]
