/**
 * ============================================================================
 * DISPLAY SYNC STORE
 * ============================================================================
 *
 * Purpose: Manages the synchronized state between the main cashier display
 * and the second display (player-facing screen). This store tracks the current
 * view, active game selections, and display mode.
 *
 * Features:
 * - Tracks current display mode (idle, games, gameplay, cart, payment)
 * - Manages active game selections being configured
 * - Syncs bet amount and number of draws
 * - Tracks navigation state for second display
 *
 * Usage:
 * ```tsx
 * const { displayMode, setDisplayMode, activeGame } = useDisplaySyncStore()
 * ```
 *
 * Dependencies: Zustand, React
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Display modes for the second display
 */
export type DisplayMode =
  | 'idle'       // Welcome screen, no activity
  | 'games'      // Showing games grid
  | 'gameplay'   // Active game selection in progress
  | 'cart'       // Viewing cart
  | 'payment'    // Payment in progress
  | 'complete'   // Purchase complete / thank you
  | 'payout'     // Paying out winnings

/**
 * Active game selection state - what's currently being configured
 */
export interface ActiveGameSelection {
  gameId: string
  gameName: string
  gameType: 'multiplier' | 'keno' | 'roulette'
  selections: string[]
  betAmount: number
  numberOfDraws: number
  maxSelections: number
}

/**
 * Display sync store state interface
 */
export interface DisplaySyncState {
  // Current display mode
  displayMode: DisplayMode

  // Active game being configured (null if none)
  activeGame: ActiveGameSelection | null

  // Current navigation path for sync
  currentPath: string

  // Whether the second display window is open
  isSecondDisplayOpen: boolean

  // Last sync timestamp
  lastSyncTimestamp: number

  // Actions
  setDisplayMode: (mode: DisplayMode) => void
  setActiveGame: (game: ActiveGameSelection | null) => void
  updateSelections: (selections: string[]) => void
  updateBetAmount: (amount: number) => void
  updateNumberOfDraws: (draws: number) => void
  setCurrentPath: (path: string) => void
  setSecondDisplayOpen: (isOpen: boolean) => void
  clearActiveGame: () => void
  syncFromMessage: (state: Partial<DisplaySyncState>) => void
}

/**
 * Zustand store for display synchronization.
 * Uses localStorage persistence to maintain state across page refreshes.
 */
export const useDisplaySyncStore = create<DisplaySyncState>()(
  persist(
    (set, get) => ({
      // Initial state
      displayMode: 'idle',
      activeGame: null,
      currentPath: '/pos',
      isSecondDisplayOpen: false,
      lastSyncTimestamp: Date.now(),

      /**
       * Set the current display mode
       * @param mode - The new display mode
       */
      setDisplayMode: (mode) => {
        set({
          displayMode: mode,
          lastSyncTimestamp: Date.now(),
        })
      },

      /**
       * Set the active game being configured
       * @param game - The game selection state, or null to clear
       */
      setActiveGame: (game) => {
        set({
          activeGame: game,
          displayMode: game ? 'gameplay' : get().displayMode,
          lastSyncTimestamp: Date.now(),
        })
      },

      /**
       * Update the selections for the active game
       * @param selections - Array of selected market/number IDs
       */
      updateSelections: (selections) => {
        const { activeGame } = get()
        if (!activeGame) return

        set({
          activeGame: {
            ...activeGame,
            selections,
          },
          lastSyncTimestamp: Date.now(),
        })
      },

      /**
       * Update the bet amount for the active game
       * @param amount - The new bet amount
       */
      updateBetAmount: (amount) => {
        const { activeGame } = get()
        if (!activeGame) return

        set({
          activeGame: {
            ...activeGame,
            betAmount: amount,
          },
          lastSyncTimestamp: Date.now(),
        })
      },

      /**
       * Update the number of draws for the active game
       * @param draws - The new number of draws
       */
      updateNumberOfDraws: (draws) => {
        const { activeGame } = get()
        if (!activeGame) return

        set({
          activeGame: {
            ...activeGame,
            numberOfDraws: draws,
          },
          lastSyncTimestamp: Date.now(),
        })
      },

      /**
       * Set the current navigation path
       * @param path - The current route path
       */
      setCurrentPath: (path) => {
        set({
          currentPath: path,
          lastSyncTimestamp: Date.now(),
        })
      },

      /**
       * Set whether the second display window is open
       * @param isOpen - True if second display is open
       */
      setSecondDisplayOpen: (isOpen) => {
        set({
          isSecondDisplayOpen: isOpen,
          lastSyncTimestamp: Date.now(),
        })
      },

      /**
       * Clear the active game selection
       */
      clearActiveGame: () => {
        set({
          activeGame: null,
          displayMode: 'games',
          lastSyncTimestamp: Date.now(),
        })
      },

      /**
       * Sync state from a broadcast message
       * @param state - Partial state to merge
       */
      syncFromMessage: (state) => {
        set({
          ...state,
          lastSyncTimestamp: Date.now(),
        })
      },
    }),
    {
      name: 'octili-display-sync',
      partialize: (state) => ({
        // Only persist certain fields
        displayMode: state.displayMode,
        currentPath: state.currentPath,
        isSecondDisplayOpen: state.isSecondDisplayOpen,
      }),
    }
  )
)

/**
 * Helper function to calculate total cost for active game
 * @param game - The active game selection
 * @returns The total cost in currency units
 */
export function calculateActiveGameCost(game: ActiveGameSelection | null): number {
  if (!game) return 0

  // Keno games: cost = betAmount × numberOfDraws (selections don't multiply cost)
  if (game.gameType === 'keno') {
    return game.betAmount * game.numberOfDraws
  }

  // Multiplier and Roulette games: cost = selections × betAmount × numberOfDraws
  return game.selections.length * game.betAmount * game.numberOfDraws
}

export default useDisplaySyncStore
