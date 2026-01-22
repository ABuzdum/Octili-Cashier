/**
 * ============================================================================
 * SUNMI PRINTER SERVICE
 * ============================================================================
 *
 * Purpose: TypeScript wrapper for SUNMI thermal printer on V2s Plus terminal
 *
 * Features:
 * - Print text, QR codes, barcodes
 * - Receipt printing with formatting
 * - Paper control (feed, cut)
 * - Status monitoring
 *
 * Plugin: @kduma-autoid/capacitor-sunmi-printer
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { Capacitor } from '@capacitor/core'
import { SunmiPrinter as SunmiPrinterPlugin, AlignmentModeEnum, PrinterStatusEnum } from '@kduma-autoid/capacitor-sunmi-printer'

/**
 * Printer status interface
 */
export interface PrinterStatus {
  ready: boolean
  status: string
  paperOk: boolean
  overheated: boolean
  coverOpen: boolean
}

/**
 * Ticket data for printing
 */
export interface TicketData {
  number: string
  gameName: string
  drawNumber: number
  selections: string[]
  amount: number
  numberOfDraws: number
  totalCost: number
  date: string
  time: string
  qrCode: string
}

/**
 * Check if running on a native platform with Capacitor
 */
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform()
}

/**
 * SUNMI Printer Service Class
 * Provides high-level methods for printing on SUNMI V2s Plus terminal
 */
export class SunmiPrinterService {
  private isInitialized = false

  /**
   * Initialize the printer service
   */
  async init(): Promise<void> {
    if (!isNativePlatform()) {
      console.warn('SunmiPrinter: Not running on native platform')
      return
    }

    try {
      await SunmiPrinterPlugin.bindService()
      this.isInitialized = true
      console.log('SunmiPrinter: Service bound successfully')
    } catch (error) {
      console.error('SunmiPrinter: Failed to bind service', error)
      throw error
    }
  }

  /**
   * Disconnect from printer service
   */
  async disconnect(): Promise<void> {
    if (!this.isInitialized) return

    try {
      await SunmiPrinterPlugin.unBindService()
      this.isInitialized = false
    } catch (error) {
      console.error('SunmiPrinter: Failed to unbind service', error)
    }
  }

  /**
   * Get printer status
   */
  async getStatus(): Promise<PrinterStatus> {
    if (!isNativePlatform()) {
      return {
        ready: false,
        status: 'NOT_NATIVE',
        paperOk: false,
        overheated: false,
        coverOpen: false,
      }
    }

    try {
      const { status } = await SunmiPrinterPlugin.updatePrinterState()

      return {
        ready: status === PrinterStatusEnum.NORMAL_OPERATION,
        status,
        paperOk: status !== PrinterStatusEnum.OUT_OF_PAPER,
        overheated: status === PrinterStatusEnum.OVERHEATED,
        coverOpen: status === PrinterStatusEnum.COVER_IS_OPEN,
      }
    } catch (error) {
      console.error('SunmiPrinter: Failed to get status', error)
      return {
        ready: false,
        status: 'ERROR',
        paperOk: false,
        overheated: false,
        coverOpen: false,
      }
    }
  }

  /**
   * Initialize printer for new print job
   */
  async initPrinter(): Promise<void> {
    if (!isNativePlatform()) return
    await SunmiPrinterPlugin.printerInit()
  }

  /**
   * Set text alignment
   */
  async setAlignment(alignment: 'left' | 'center' | 'right'): Promise<void> {
    if (!isNativePlatform()) return

    const alignMap: Record<string, AlignmentModeEnum> = {
      left: AlignmentModeEnum.LEFT,
      center: AlignmentModeEnum.CENTER,
      right: AlignmentModeEnum.RIGHT,
    }

    await SunmiPrinterPlugin.setAlignment({ alignment: alignMap[alignment] })
  }

  /**
   * Set font size
   */
  async setFontSize(size: number): Promise<void> {
    if (!isNativePlatform()) return
    await SunmiPrinterPlugin.setFontSize({ size })
  }

  /**
   * Set bold text
   */
  async setBold(enable: boolean): Promise<void> {
    if (!isNativePlatform()) return
    await SunmiPrinterPlugin.setBold({ enable })
  }

  /**
   * Print text with newline
   */
  async printText(text: string): Promise<void> {
    if (!isNativePlatform()) {
      console.log('SunmiPrinter [MOCK]:', text)
      return
    }
    await SunmiPrinterPlugin.printText({ text: text + '\n' })
  }

  /**
   * Print a line of dashes
   */
  async printLine(char = '-', length = 32): Promise<void> {
    await this.printText(char.repeat(length))
  }

  /**
   * Print QR code
   */
  async printQRCode(content: string, size = 8): Promise<void> {
    if (!isNativePlatform()) {
      console.log('SunmiPrinter [MOCK QR]:', content)
      return
    }
    await SunmiPrinterPlugin.printQRCode({ content, size })
  }

  /**
   * Feed paper
   */
  async feedPaper(lines = 4): Promise<void> {
    if (!isNativePlatform()) return
    await SunmiPrinterPlugin.lineWrap({ lines })
  }

  /**
   * Cut paper (desktop terminals only)
   */
  async cutPaper(): Promise<void> {
    if (!isNativePlatform()) return
    try {
      await SunmiPrinterPlugin.cutPaper()
    } catch {
      // V2s Plus doesn't have a cutter, this is expected to fail
      console.log('SunmiPrinter: cutPaper not supported on this device')
    }
  }

  /**
   * Begin transaction printing (buffer mode)
   */
  async beginTransaction(): Promise<void> {
    if (!isNativePlatform()) return
    await SunmiPrinterPlugin.enterPrinterBuffer({ clean: true })
  }

  /**
   * Commit transaction printing
   */
  async commitTransaction(): Promise<void> {
    if (!isNativePlatform()) return
    await SunmiPrinterPlugin.exitPrinterBuffer({ commit: true })
  }

  /**
   * Print a lottery ticket receipt
   */
  async printTicket(ticket: TicketData): Promise<void> {
    const status = await this.getStatus()
    if (!status.ready && isNativePlatform()) {
      throw new Error(`Printer not ready: ${status.status}`)
    }

    await this.beginTransaction()

    try {
      // Header
      await this.setAlignment('center')
      await this.setBold(true)
      await this.setFontSize(28)
      await this.printText('OCTILI LOTTERY')
      await this.setBold(false)
      await this.setFontSize(24)
      await this.printLine('=')

      // Ticket info
      await this.setAlignment('left')
      await this.printText(`Ticket: ${ticket.number}`)
      await this.printText(`Game: ${ticket.gameName}`)
      await this.printText(`Draw: #${ticket.drawNumber}`)
      await this.printLine('-')

      // Selections
      await this.printText(`Numbers: ${ticket.selections.join(', ')}`)
      await this.printText(`Bet: R$ ${ticket.amount.toFixed(2)}`)
      await this.printText(`Draws: ${ticket.numberOfDraws}`)
      await this.printLine('-')

      // Total
      await this.setBold(true)
      await this.printText(`TOTAL: R$ ${ticket.totalCost.toFixed(2)}`)
      await this.setBold(false)
      await this.printLine('-')

      // Date/Time
      await this.printText(`${ticket.date} ${ticket.time}`)
      await this.printLine('=')

      // QR Code for validation
      await this.setAlignment('center')
      await this.printQRCode(ticket.qrCode, 8)

      // Footer
      await this.printLine('=')
      await this.printText('Good Luck!')
      await this.printLine('=')

      // Feed and finish
      await this.feedPaper(4)
      await this.cutPaper()

      await this.commitTransaction()
    } catch (error) {
      console.error('SunmiPrinter: Print ticket failed', error)
      throw error
    }
  }

  /**
   * Print a test receipt
   */
  async printTestReceipt(): Promise<void> {
    await this.beginTransaction()

    await this.setAlignment('center')
    await this.setBold(true)
    await this.setFontSize(28)
    await this.printText('OCTILI CASHIER')
    await this.printText('TEST PRINT')
    await this.setBold(false)
    await this.setFontSize(24)
    await this.printLine('=')

    await this.setAlignment('left')
    await this.printText('Printer Status: OK')
    await this.printText(`Date: ${new Date().toLocaleDateString()}`)
    await this.printText(`Time: ${new Date().toLocaleTimeString()}`)
    await this.printLine('-')

    await this.setAlignment('center')
    await this.printQRCode('https://octili.com/test', 6)

    await this.printLine('=')
    await this.printText('End of Test')
    await this.feedPaper(4)

    await this.commitTransaction()
  }
}

// Export singleton instance
export const sunmiPrinter = new SunmiPrinterService()
