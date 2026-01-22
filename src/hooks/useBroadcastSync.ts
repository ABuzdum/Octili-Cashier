/**
 * ============================================================================
 * BROADCAST SYNC HOOK
 * ============================================================================
 *
 * Purpose: Enables real-time bidirectional communication between the main
 * cashier display and the second display (player-facing screen) using the
 * BroadcastChannel API.
 *
 * Features:
 * - Bidirectional sync between windows
 * - Automatic reconnection on channel close
 * - Type-safe message passing
 * - Support for multiple message types (navigation, cart, selections)
 *
 * Usage:
 * ```tsx
 * const { sendMessage, lastMessage } = useBroadcastSync()
 * sendMessage({ type: 'NAVIGATE', payload: { path: '/game/balloons' } })
 * ```
 *
 * Dependencies: React hooks, BroadcastChannel API (modern browsers)
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { useEffect, useCallback, useState, useRef } from 'react'

/**
 * Channel name for communication between main and second display
 */
const CHANNEL_NAME = 'octili-display-sync'

/**
 * Types of messages that can be sent between displays
 */
export type DisplayMessageType =
  | 'NAVIGATE'           // Navigate to a specific page
  | 'CART_UPDATE'        // Cart items changed
  | 'GAME_SELECT'        // Game was selected
  | 'SELECTION_UPDATE'   // Market/number selections changed
  | 'BET_UPDATE'         // Bet amount or draws changed
  | 'PURCHASE_START'     // Purchase process started
  | 'PURCHASE_COMPLETE'  // Purchase completed
  | 'DISPLAY_MODE'       // Change display mode (idle, active, payment)
  | 'SYNC_REQUEST'       // Request full state sync
  | 'SYNC_RESPONSE'      // Full state sync response
  | 'PING'               // Keep-alive ping
  | 'PONG'               // Keep-alive response

/**
 * Navigation payload for NAVIGATE messages
 */
export interface NavigatePayload {
  path: string
  params?: Record<string, string>
}

/**
 * Game selection payload
 */
export interface GameSelectPayload {
  gameId: string
  gameName: string
}

/**
 * Selection update payload for market/number selections
 */
export interface SelectionPayload {
  gameId: string
  selections: string[]
  betAmount: number
  numberOfDraws: number
  totalCost: number
}

/**
 * Display mode payload
 */
export interface DisplayModePayload {
  mode: 'idle' | 'games' | 'gameplay' | 'cart' | 'payment' | 'complete'
  gameId?: string
}

/**
 * Full sync state payload
 */
export interface SyncStatePayload {
  currentPath: string
  currentGameId?: string
  selections: string[]
  betAmount: number
  numberOfDraws: number
  cartCount: number
}

/**
 * Union type for all possible payloads
 */
export type DisplayMessagePayload =
  | NavigatePayload
  | GameSelectPayload
  | SelectionPayload
  | DisplayModePayload
  | SyncStatePayload
  | Record<string, unknown>
  | null

/**
 * Message structure for broadcast communication
 */
export interface DisplayMessage {
  type: DisplayMessageType
  payload: DisplayMessagePayload
  timestamp: number
  source: 'main' | 'second'
}

/**
 * Hook return type
 */
export interface UseBroadcastSyncReturn {
  /** Send a message to the other display */
  sendMessage: (type: DisplayMessageType, payload?: DisplayMessagePayload) => void
  /** Last received message */
  lastMessage: DisplayMessage | null
  /** Whether the channel is connected */
  isConnected: boolean
  /** Whether the other display is active (responded to ping) */
  isPeerActive: boolean
  /** Request a full state sync from the other display */
  requestSync: () => void
}

/**
 * Custom hook for bidirectional communication between displays using BroadcastChannel API.
 *
 * @param source - Identifies this window as 'main' (cashier) or 'second' (player-facing)
 * @returns Object with sendMessage function, lastMessage, and connection status
 *
 * @example
 * // In main display
 * const { sendMessage, lastMessage, isPeerActive } = useBroadcastSync('main')
 *
 * // Send navigation update
 * sendMessage('NAVIGATE', { path: '/game/balloons' })
 *
 * // Listen for messages
 * useEffect(() => {
 *   if (lastMessage?.type === 'CART_UPDATE') {
 *     // Handle cart update from second display
 *   }
 * }, [lastMessage])
 */
export function useBroadcastSync(source: 'main' | 'second'): UseBroadcastSyncReturn {
  // Store the last received message
  const [lastMessage, setLastMessage] = useState<DisplayMessage | null>(null)

  // Track connection status
  const [isConnected, setIsConnected] = useState(false)

  // Track if peer display is active
  const [isPeerActive, setIsPeerActive] = useState(false)

  // Reference to the broadcast channel
  const channelRef = useRef<BroadcastChannel | null>(null)

  // Ping interval reference
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Peer timeout reference
  const peerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Initialize the broadcast channel and set up message handlers
   */
  useEffect(() => {
    // Check if BroadcastChannel is supported
    if (typeof BroadcastChannel === 'undefined') {
      console.warn('[BroadcastSync] BroadcastChannel not supported in this browser')
      return
    }

    // Create a new channel
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = channel
    setIsConnected(true)

    // Handle incoming messages
    channel.onmessage = (event: MessageEvent<DisplayMessage>) => {
      const message = event.data

      // Ignore messages from self
      if (message.source === source) {
        return
      }

      // Handle ping/pong for peer detection
      if (message.type === 'PING') {
        // Respond to ping with pong
        channel.postMessage({
          type: 'PONG',
          payload: null,
          timestamp: Date.now(),
          source,
        } as DisplayMessage)
        setIsPeerActive(true)
        return
      }

      if (message.type === 'PONG') {
        setIsPeerActive(true)
        // Reset peer timeout
        if (peerTimeoutRef.current) {
          clearTimeout(peerTimeoutRef.current)
        }
        peerTimeoutRef.current = setTimeout(() => {
          setIsPeerActive(false)
        }, 5000)
        return
      }

      // Store the message for consumers
      setLastMessage(message)
      setIsPeerActive(true)
    }

    // Handle channel errors
    channel.onmessageerror = (event) => {
      console.error('[BroadcastSync] Message error:', event)
    }

    // Start ping interval to detect peer
    pingIntervalRef.current = setInterval(() => {
      channel.postMessage({
        type: 'PING',
        payload: null,
        timestamp: Date.now(),
        source,
      } as DisplayMessage)
    }, 2000)

    // Send initial ping
    channel.postMessage({
      type: 'PING',
      payload: null,
      timestamp: Date.now(),
      source,
    } as DisplayMessage)

    // Cleanup on unmount
    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
      }
      if (peerTimeoutRef.current) {
        clearTimeout(peerTimeoutRef.current)
      }
      channel.close()
      channelRef.current = null
      setIsConnected(false)
    }
  }, [source])

  /**
   * Send a message to the other display
   */
  const sendMessage = useCallback(
    (type: DisplayMessageType, payload: DisplayMessagePayload = null) => {
      if (!channelRef.current) {
        console.warn('[BroadcastSync] Channel not connected')
        return
      }

      const message: DisplayMessage = {
        type,
        payload,
        timestamp: Date.now(),
        source,
      }

      channelRef.current.postMessage(message)
    },
    [source]
  )

  /**
   * Request a full state sync from the other display
   */
  const requestSync = useCallback(() => {
    sendMessage('SYNC_REQUEST', null)
  }, [sendMessage])

  return {
    sendMessage,
    lastMessage,
    isConnected,
    isPeerActive,
    requestSync,
  }
}

/**
 * Opens the second display in a new window.
 * Should be called from the main cashier display.
 *
 * @param options - Window options (width, height, etc.)
 * @returns The opened window reference, or null if blocked
 *
 * @example
 * const secondWindow = openSecondDisplay({ width: 1024, height: 768 })
 */
export function openSecondDisplay(options?: {
  width?: number
  height?: number
  left?: number
  top?: number
}): Window | null {
  const {
    width = 1024,
    height = 768,
    left = window.screen.width - 1024,
    top = 0,
  } = options || {}

  const features = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'menubar=no',
    'toolbar=no',
    'location=no',
    'status=no',
    'resizable=yes',
    'scrollbars=yes',
  ].join(',')

  const secondWindow = window.open('/second-display', 'OctiliSecondDisplay', features)

  if (!secondWindow) {
    console.error('[BroadcastSync] Failed to open second display - popup may be blocked')
    return null
  }

  return secondWindow
}

export default useBroadcastSync
