/**
 * ============================================================================
 * SUNMI TERMINAL SERVICES - INDEX
 * ============================================================================
 *
 * Purpose: Export all SUNMI hardware services for V2s Plus POS terminal
 *
 * Services:
 * - Printer: 80mm thermal printing
 * - Scanner: 1D/2D barcode scanning
 * - NFC: NFC card reading
 *
 * Usage:
 * ```typescript
 * import { sunmiPrinter, sunmiScanner, sunmiNFC, isNativePlatform } from '@/lib/terminals/sunmi'
 *
 * // Check if running on device
 * if (isNativePlatform()) {
 *   await sunmiPrinter.init()
 *   await sunmiScanner.init()
 * }
 * ```
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

// Export printer service
export {
  SunmiPrinterService,
  sunmiPrinter,
  isNativePlatform,
  type PrinterStatus,
  type TicketData,
} from './printer'

// Export scanner service
export {
  SunmiScannerService,
  sunmiScanner,
  type ScanResultCallback,
  type ScannerConfig,
} from './scanner'

// Export NFC service
export {
  SunmiNFCService,
  sunmiNFC,
  type NFCCard,
  type NFCCardCallback,
} from './nfc'
