/**
 * ============================================================================
 * TERMINAL STATUS STORE
 * ============================================================================
 *
 * Purpose: Manage terminal operational status (working/not working)
 *
 * Features:
 * - Track terminal online/offline status
 * - Store reason for being offline
 * - Track offline duration
 * - Persist status across page reloads
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Reasons why terminal might be temporarily offline
 * Each reason has a clear label for display
 */
export type OfflineReason =
  | 'break'
  | 'lunch'
  | 'technical'
  | 'maintenance'
  | 'training'
  | 'end_of_shift'
  | 'vacation'
  | 'other'

/**
 * Configuration for each offline reason
 * Includes icon color, label, and description
 */
export const OFFLINE_REASONS: Record<OfflineReason, {
  label: string
  description: string
  icon: string
  color: string
  gradient: string
}> = {
  break: {
    label: 'Short Break',
    description: 'Taking a quick break, back soon',
    icon: '☕',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  lunch: {
    label: 'Lunch Break',
    description: 'On lunch break',
    icon: '🍽️',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  technical: {
    label: 'Technical Issue',
    description: 'Experiencing technical difficulties',
    icon: '🔧',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  },
  maintenance: {
    label: 'Maintenance',
    description: 'Terminal under maintenance',
    icon: '🛠️',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  },
  training: {
    label: 'Training',
    description: 'Staff training in progress',
    icon: '📚',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },
  end_of_shift: {
    label: 'End of Shift',
    description: 'Shift ended, closing terminal',
    icon: '🌙',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  },
  vacation: {
    label: 'Vacation',
    description: 'Operator on vacation',
    icon: '🏖️',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  },
  other: {
    label: 'Other',
    description: 'Temporarily unavailable',
    icon: '⏸️',
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  },
}

/**
 * Terminal status state interface
 */
interface TerminalState {
  /** Is terminal currently working */
  isOnline: boolean
  /** Reason for being offline (if offline) */
  offlineReason: OfflineReason | null
  /** Custom note for 'other' reason */
  offlineNote: string
  /** Timestamp when terminal went offline */
  offlineSince: string | null
  /** Expected return time (optional) */
  expectedReturn: string | null

  /** Actions */
  goOffline: (reason: OfflineReason, note?: string, expectedReturn?: string) => void
  goOnline: () => void
  setExpectedReturn: (time: string | null) => void
}

/**
 * Terminal status store
 * Manages terminal online/offline state with persistence
 */
export const useTerminalStore = create<TerminalState>()(
  persist(
    (set) => ({
      isOnline: true,
      offlineReason: null,
      offlineNote: '',
      offlineSince: null,
      expectedReturn: null,

      goOffline: (reason, note = '', expectedReturn = null) => set({
        isOnline: false,
        offlineReason: reason,
        offlineNote: note,
        offlineSince: new Date().toISOString(),
        expectedReturn,
      }),

      goOnline: () => set({
        isOnline: true,
        offlineReason: null,
        offlineNote: '',
        offlineSince: null,
        expectedReturn: null,
      }),

      setExpectedReturn: (time) => set({ expectedReturn: time }),
    }),
    {
      name: 'octili-terminal-status',
    }
  )
)

/**
 * Helper function to format duration since offline
 */
export function formatOfflineDuration(offlineSince: string): string {
  const start = new Date(offlineSince)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()

  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else {
    return `${minutes}m`
  }
}
