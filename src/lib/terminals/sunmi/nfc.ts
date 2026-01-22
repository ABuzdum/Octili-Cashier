/**
 * ============================================================================
 * SUNMI NFC SERVICE
 * ============================================================================
 *
 * Purpose: TypeScript wrapper for SUNMI NFC on V2s Plus terminal
 *
 * Features:
 * - NFC card detection
 * - Card reading for loyalty/voucher cards
 * - Card ID retrieval
 *
 * Plugin: capacitor-plugin-sunmi-nfc
 * Note: Only available on V2s Plus NFC variant
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { Capacitor } from '@capacitor/core'

// Note: The NFC plugin types may need adjustment based on actual plugin exports
// This is a basic wrapper that can be enhanced once tested on device

/**
 * NFC Card data interface
 */
export interface NFCCard {
  id: string
  type: string
  data?: string
}

/**
 * NFC card detected callback type
 */
export type NFCCardCallback = (card: NFCCard) => void

/**
 * Check if running on a native platform with Capacitor
 */
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform()
}

/**
 * SUNMI NFC Service Class
 * Provides high-level methods for NFC card reading on SUNMI V2s Plus terminal
 */
export class SunmiNFCService {
  private _isInitialized = false
  private isReading = false
  private onCardCallback: NFCCardCallback | null = null

  /**
   * Check if NFC is available on this device
   */
  async isAvailable(): Promise<boolean> {
    if (!isNativePlatform()) {
      return false
    }

    // NFC availability check would be done through the plugin
    // For now, return true on native platform
    return true
  }

  /**
   * Initialize the NFC service
   */
  async init(): Promise<void> {
    if (!isNativePlatform()) {
      console.warn('SunmiNFC: Not running on native platform')
      return
    }

    try {
      // The plugin should auto-initialize
      // Additional setup can be added here
      this._isInitialized = true
      console.log('SunmiNFC: Service initialized')
    } catch (error) {
      console.error('SunmiNFC: Failed to initialize', error)
      throw error
    }
  }

  /**
   * Register callback for NFC card detection
   */
  onCardDetected(callback: NFCCardCallback): void {
    this.onCardCallback = callback
  }

  /**
   * Start NFC reading mode
   */
  async startReading(): Promise<void> {
    if (!isNativePlatform()) {
      console.log('SunmiNFC [MOCK]: Reading started')
      // Simulate a card detection after 3 seconds for testing
      setTimeout(() => {
        if (this.onCardCallback) {
          this.onCardCallback({
            id: 'MOCK-NFC-CARD-001',
            type: 'Mifare',
            data: 'Mock card data',
          })
        }
      }, 3000)
      return
    }

    try {
      // Plugin-specific start reading command
      // This depends on the actual plugin implementation
      this.isReading = true
      console.log('SunmiNFC: Reading started')
    } catch (error) {
      console.error('SunmiNFC: Failed to start reading', error)
      throw error
    }
  }

  /**
   * Stop NFC reading mode
   */
  async stopReading(): Promise<void> {
    if (!isNativePlatform()) {
      console.log('SunmiNFC [MOCK]: Reading stopped')
      return
    }

    try {
      // Plugin-specific stop reading command
      this.isReading = false
      console.log('SunmiNFC: Reading stopped')
    } catch (error) {
      console.error('SunmiNFC: Failed to stop reading', error)
    }
  }

  /**
   * Check if currently reading
   */
  isCurrentlyReading(): boolean {
    return this.isReading
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this._isInitialized
  }

  /**
   * Disconnect and cleanup
   */
  async dispose(): Promise<void> {
    if (this.isReading) {
      await this.stopReading()
    }

    this.onCardCallback = null
    this._isInitialized = false
  }
}

// Export singleton instance
export const sunmiNFC = new SunmiNFCService()
