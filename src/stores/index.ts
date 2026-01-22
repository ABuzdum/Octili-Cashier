/**
 * ============================================================================
 * STORES MODULE EXPORTS
 * ============================================================================
 *
 * Purpose: Central export file for all Zustand stores
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

export { useAuthStore } from './authStore'
export { useCartStore } from './cartStore'
export { useGameStore, useLotteryGames, useGame } from './gameStore'
export {
  useDisplaySyncStore,
  calculateActiveGameCost,
  type DisplayMode,
  type ActiveGameSelection,
  type DisplaySyncState,
} from './displaySyncStore'
export {
  useThemeStore,
  COLOR_THEMES,
  VISUAL_STYLES,
  getThemedCardStyle,
  getThemedButtonStyle,
  getSurfaceColors,
  applyThemeToDocument,
  type ColorTheme,
  type VisualStyle,
  type ColorMode,
} from './themeStore'
