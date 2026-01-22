/**
 * ============================================================================
 * TV BOX TYPES
 * ============================================================================
 *
 * Purpose: Type definitions for TV Box control system.
 * TV Boxes display games in the venue and can show promotional overlays.
 *
 * Features:
 * - TV Box device management
 * - Game assignment
 * - Volume control
 * - Promotional overlay (video/image)
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

/**
 * Connection status of a TV Box
 */
export type TVBoxStatus = 'online' | 'offline' | 'standby'

/**
 * Type of overlay content
 */
export type OverlayType = 'none' | 'image' | 'video'

/**
 * Position of the overlay on screen
 */
export type OverlayPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'fullscreen'

/**
 * Overlay configuration for promotional content
 */
export interface OverlayConfig {
  /** Type of overlay content */
  type: OverlayType

  /** URL to the image or video */
  url: string | null

  /** Position on screen */
  position: OverlayPosition

  /** Opacity (0-100) */
  opacity: number

  /** Width as percentage of screen (10-100) */
  width: number

  /** Whether overlay is currently active */
  isActive: boolean
}

/**
 * TV Box device configuration
 */
export interface TVBox {
  /** Unique identifier */
  id: string

  /** Display name for the TV Box */
  name: string

  /** Physical location description */
  location: string

  /** Connection status */
  status: TVBoxStatus

  /** Currently assigned game ID (null if showing default) */
  currentGameId: string | null

  /** Currently assigned game name */
  currentGameName: string | null

  /** Volume level (0-100) */
  volume: number

  /** Whether sound is muted */
  isMuted: boolean

  /** Overlay configuration */
  overlay: OverlayConfig

  /** Last seen timestamp */
  lastSeen: string

  /** IP address for diagnostics */
  ipAddress: string

  /** Screen resolution */
  resolution: string
}

/**
 * Parameters for updating TV Box settings
 */
export interface UpdateTVBoxParams {
  /** TV Box ID */
  id: string

  /** New game ID to assign */
  gameId?: string | null

  /** New volume level */
  volume?: number

  /** Mute state */
  isMuted?: boolean

  /** Overlay configuration */
  overlay?: Partial<OverlayConfig>
}
