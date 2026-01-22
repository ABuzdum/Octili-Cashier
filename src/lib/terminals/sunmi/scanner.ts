/**
 * ============================================================================
 * SUNMI SCANNER SERVICE
 * ============================================================================
 *
 * Purpose: TypeScript wrapper for SUNMI barcode scanner on V2s Plus terminal
 *
 * Features:
 * - 1D and 2D barcode scanning
 * - QR code scanning for ticket validation
 * - Scan event listeners
 * - Configurable scan modes
 *
 * Plugin: @kduma-autoid/capacitor-sunmi-scanhead
 * Note: Only available on V2s Plus Scanner (GMS) variant
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { Capacitor } from '@capacitor/core'
import type { PluginListenerHandle } from '@capacitor/core'
import { SunmiScanHead, OutputMode, ScanMode } from '@kduma-autoid/capacitor-sunmi-scanhead'

/**
 * Scan result callback type
 */
export type ScanResultCallback = (code: string, rawBytes?: string) => void

/**
 * Scanner configuration options
 */
export interface ScannerConfig {
  beepEnabled?: boolean
  vibrateEnabled?: boolean
  continuousMode?: boolean
}

/**
 * Check if running on a native platform with Capacitor
 */
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform()
}

/**
 * SUNMI Scanner Service Class
 * Provides high-level methods for barcode scanning on SUNMI V2s Plus terminal
 */
export class SunmiScannerService {
  private isInitialized = false
  private scanListener: PluginListenerHandle | null = null
  private onScanCallback: ScanResultCallback | null = null

  /**
   * Initialize the scanner service
   */
  async init(config?: ScannerConfig): Promise<void> {
    if (!isNativePlatform()) {
      console.warn('SunmiScanner: Not running on native platform')
      return
    }

    try {
      // Bind scanner service
      await SunmiScanHead.bindService()

      // Configure scanner
      await this.configure(config)

      // Set up scan result listener
      this.scanListener = await SunmiScanHead.addListener('onScanResult', (result) => {
        if (this.onScanCallback) {
          this.onScanCallback(result.data, result.source_bytes)
        }
      })

      this.isInitialized = true
      console.log('SunmiScanner: Service initialized successfully')
    } catch (error) {
      console.error('SunmiScanner: Failed to initialize', error)
      throw error
    }
  }

  /**
   * Configure scanner settings
   */
  async configure(config?: ScannerConfig): Promise<void> {
    if (!isNativePlatform()) return

    try {
      // Create write context for settings
      await SunmiScanHead.createWriteContext()

      // Configure beep
      if (config?.beepEnabled !== undefined) {
        await SunmiScanHead.setBeep({ enabled: config.beepEnabled })
      }

      // Configure vibration
      if (config?.vibrateEnabled !== undefined) {
        await SunmiScanHead.setVibrate({ enabled: config.vibrateEnabled })
      }

      // Configure scan mode
      if (config?.continuousMode) {
        await SunmiScanHead.setTriggerMethod({
          mode: ScanMode.Continuous,
          timeout: 5000,
          sleep: 500,
        })
      } else {
        await SunmiScanHead.setTriggerMethod({
          mode: ScanMode.Trigger,
          timeout: 5000,
        })
      }

      // Set output mode to disabled (we use the listener instead)
      await SunmiScanHead.setOutputType({ mode: OutputMode.Disabled })

      // Enable broadcast output
      await SunmiScanHead.setOutputBroadcastEnabled({ enabled: true })

      // Commit settings
      await SunmiScanHead.commitWriteContext()
    } catch (error) {
      console.error('SunmiScanner: Failed to configure', error)
      // Discard context on error
      await SunmiScanHead.discardWriteContext()
    }
  }

  /**
   * Register callback for scan results
   */
  onScanResult(callback: ScanResultCallback): void {
    this.onScanCallback = callback
  }

  /**
   * Start scanning
   */
  async startScan(): Promise<void> {
    if (!isNativePlatform()) {
      console.log('SunmiScanner [MOCK]: Scan started')
      // Simulate a scan result after 2 seconds for testing
      setTimeout(() => {
        if (this.onScanCallback) {
          this.onScanCallback('MOCK-TICKET-123456789')
        }
      }, 2000)
      return
    }

    try {
      await SunmiScanHead.scan()
    } catch (error) {
      console.error('SunmiScanner: Failed to start scan', error)
      throw error
    }
  }

  /**
   * Stop scanning
   */
  async stopScan(): Promise<void> {
    if (!isNativePlatform()) {
      console.log('SunmiScanner [MOCK]: Scan stopped')
      return
    }

    try {
      await SunmiScanHead.stop()
    } catch (error) {
      console.error('SunmiScanner: Failed to stop scan', error)
    }
  }

  /**
   * Play beep sound
   */
  async beep(): Promise<void> {
    if (!isNativePlatform()) return
    await SunmiScanHead.beep()
  }

  /**
   * Vibrate device
   */
  async vibrate(): Promise<void> {
    if (!isNativePlatform()) return
    await SunmiScanHead.vibrate()
  }

  /**
   * Enable or disable scanner illumination (flashlight)
   */
  async setFlashlight(enabled: boolean): Promise<void> {
    if (!isNativePlatform()) return

    try {
      await SunmiScanHead.createWriteContext()
      await SunmiScanHead.setFlash({ enabled })
      await SunmiScanHead.commitWriteContext()
    } catch (error) {
      console.error('SunmiScanner: Failed to set flashlight', error)
      await SunmiScanHead.discardWriteContext()
    }
  }

  /**
   * Get scanner model information
   */
  async getModel(): Promise<string> {
    if (!isNativePlatform()) {
      return 'MOCK_SCANNER'
    }

    try {
      const { name } = await SunmiScanHead.getScannerModel()
      return name
    } catch (error) {
      console.error('SunmiScanner: Failed to get model', error)
      return 'UNKNOWN'
    }
  }

  /**
   * Disconnect and cleanup
   */
  async dispose(): Promise<void> {
    if (this.scanListener) {
      await this.scanListener.remove()
      this.scanListener = null
    }

    this.onScanCallback = null

    if (this.isInitialized && isNativePlatform()) {
      try {
        await SunmiScanHead.unBindService()
      } catch (error) {
        console.error('SunmiScanner: Failed to unbind service', error)
      }
    }

    this.isInitialized = false
  }
}

// Export singleton instance
export const sunmiScanner = new SunmiScannerService()
