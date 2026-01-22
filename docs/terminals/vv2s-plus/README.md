# SUNMI V2s Plus POS Terminal

## Overview

| Property | Value |
|----------|-------|
| Model | V2s Plus |
| Manufacturer | SUNMI |
| Platform | Android |
| OS Version | Android 11 (SUNMI OS) |
| Status | Development |
| Awards | Red Dot Design Award Winner |

## Hardware Specifications

### Display

| Property | Value |
|----------|-------|
| Screen Size | 6.22 inches |
| Resolution | 1520 x 720 (HD+) |
| Aspect Ratio | 19:9 |
| Touch Type | Capacitive IPS |
| Multi-touch | Yes |

### Processor & Memory

| Property | Value |
|----------|-------|
| CPU | Cortex-A53 Octa-Core (4×2.0GHz + 4×1.5GHz) |
| RAM | 2GB (Standard) / 3GB (Scanner/GMS versions) |
| Storage | 16GB (Standard) / 32GB (Scanner/GMS versions) |
| Expandable Storage | MicroSD card supported |

### Connectivity

| Property | Value |
|----------|-------|
| WiFi | 2.4G/5G IEEE 802.11 a/b/g/n/ac |
| Bluetooth | 2.1/3.0/4.2 with BLE support |
| Cellular | 4G/3G/2G with dual Nano SIM |
| Ethernet | No |
| USB | USB Type-C OTG |

### Peripherals

| Component | Specifications |
|-----------|----------------|
| Printer | 80mm thermal, 80mm/s max speed, 50mm max roll diameter |
| Scanner | 1D/2D barcode (Scanner Version), reads scratched/folded/stained codes |
| NFC | Type A&B, Mifare, Felica; ISO/IEC 14443, ISO15693 compliant |
| Card Reader | 4×PSAM slots |
| Camera | 5MP rear autofocus with LED flash |

### Physical

| Property | Value |
|----------|-------|
| Dimensions | 237.2 × 100.91 × 63mm (16.5mm at thinnest) |
| Weight | 535g |
| Battery | 7.7V/3500mAh (equals 3.85V/7000mAh), removable, ~16h runtime |
| Operating Temp | -10°C to +50°C |
| Storage Temp | -20°C to +60°C |
| Drop Test | 1.0m rated |
| Water Resistance | Screen and printer water-resistant |

## Software Environment

### System

| Property | Value |
|----------|-------|
| OS | Android 11 with SUNMI OS |
| API Level | 30 |
| WebView | Chrome WebView |
| Browser Support | Chrome WebView |

### Development

| Property | Value |
|----------|-------|
| SDK Available | Yes - [SUNMI Developer Portal](https://developer.sunmi.com/docs/en-US/index) |
| ADB Access | Yes |
| Developer Mode | Settings > About > Tap Build Number 7 times |
| Sideloading | Yes |

## UI/UX Guidelines for Octili Cashier

### Touch Targets

- **Minimum touch target**: 48px x 48px (required for gloved operation)
- **Recommended spacing**: 8px between interactive elements
- **Button height**: 56px for primary actions, 48px for secondary

### Screen Layout

- **Resolution**: 1520 x 720 (HD+ at 19:9 aspect ratio)
- **Safe areas**: Standard Android navigation bar at bottom
- **Bottom navigation height**: ~80px including safe area
- **Header height**: ~80px
- **Usable content area**: ~1360 x 720 (accounting for headers/nav)

### Performance Recommendations

- Keep animations under 300ms
- Use lazy loading for images
- Optimize bundle size for faster loading (limited storage)
- Cache API responses for offline use
- Target 60fps for smooth scrolling
- Memory budget: Stay under 1.5GB active usage (2-3GB total RAM)

## API Documentation

### Printer API

The SUNMI V2s Plus uses the SUNMI Printer Service, accessible via AIDL, Bluetooth, or JS Bridge.

```typescript
// SUNMI Printer Integration
// Dependency: implementation 'com.sunmi:printerlibrary:1.0.18'

interface SunmiPrinterAPI {
  // Connection modes: Bluetooth (InnerPrinter), AIDL, JS Bridge
  connect(): Promise<void>
  disconnect(): Promise<void>

  // Printer status
  getStatus(): Promise<PrinterStatus>
  getPrinterVersion(): Promise<string>

  // Print operations
  printText(text: string, options?: TextOptions): Promise<void>
  printBarcode(data: string, symbology: BarcodeType, width: number, height: number): Promise<void>
  printQRCode(data: string, size: number): Promise<void>
  printImage(base64: string): Promise<void>
  printTable(rows: string[][], colWidths: number[]): Promise<void>

  // Paper control
  feedPaper(lines: number): Promise<void>
  cutPaper(fullCut: boolean): Promise<void>

  // ESC/POS compatible
  sendRawData(data: Uint8Array): Promise<void>
}

// Printer specs: 80mm width, 80mm/s speed, 50mm max roll
```

### Scanner API

```typescript
// SUNMI Scanner Integration (Scanner Version only)
// Supports 1D and 2D barcodes including scratched/folded codes

interface SunmiScannerAPI {
  // Initialize scanner
  init(): Promise<void>

  // Scanning
  startScan(): Promise<void>
  stopScan(): void

  // Event listeners
  onScanResult(callback: (result: ScanResult) => void): void
  onScanError(callback: (error: Error) => void): void

  // Configuration
  setFormats(formats: BarcodeFormat[]): void
  enableFlashlight(enabled: boolean): void
  enableBeep(enabled: boolean): void
  enableVibrate(enabled: boolean): void
}

interface ScanResult {
  code: string
  format: BarcodeFormat
  timestamp: number
}

type BarcodeFormat = 'QR_CODE' | 'CODE_128' | 'CODE_39' | 'EAN_13' | 'EAN_8' | 'UPC_A' | 'UPC_E' | 'PDF417' | 'DATA_MATRIX'
```

### NFC API

```typescript
// SUNMI NFC Integration
// Supports: Type A&B, Mifare, Felica, ISO/IEC 14443, ISO15693

interface SunmiNFCAPI {
  // Check NFC availability
  isAvailable(): Promise<boolean>
  isEnabled(): Promise<boolean>

  // Card reading
  startReading(): Promise<void>
  stopReading(): void

  // Event listeners
  onCardDetected(callback: (card: NFCCard) => void): void
  onCardRemoved(callback: () => void): void

  // Card operations
  readCard(card: NFCCard): Promise<CardData>
  writeCard(card: NFCCard, data: Uint8Array): Promise<void>
}

interface NFCCard {
  id: string
  type: 'TypeA' | 'TypeB' | 'Mifare' | 'Felica' | 'ISO15693'
  techList: string[]
}
```

## Model Variants

| Variant | RAM | Storage | NFC | Scanner |
|---------|-----|---------|-----|---------|
| V2s Plus Standard | 2GB | 16GB | No | No |
| V2s Plus NFC | 3GB | 32GB | Yes | No |
| V2s Plus Scanner (GMS) | 3GB | 32GB | Yes | 1D/2D |

## Known Issues & Workarounds

| Issue | Workaround | Status |
|-------|------------|--------|
| Printer overheating on continuous use | Allow 30s cooldown between large print jobs | Known |
| Battery drain in cold weather | Keep device warm, use charged backup battery | Known |
| Scanner slow in low light | Enable flashlight via SDK | Known |

## Testing Notes

- [ ] Touch responsiveness verified (48px targets)
- [ ] Printer integration tested (80mm receipts)
- [ ] Scanner integration tested (1D/2D barcodes)
- [ ] NFC card reading tested
- [ ] Offline mode tested
- [ ] Battery life tested (~16h runtime)
- [ ] Heat/performance under load tested
- [ ] Drop test (1.0m rated)
- [ ] Water resistance verified

## Resources

- [SUNMI Official Product Page](https://www.sunmi.com/en/v2s-plus/)
- [SUNMI Developer Portal](https://developer.sunmi.com/docs/en-US/index)
- [SUNMI Developer Docs](https://docs.sunmi.com/en/)
- [Printing Service Documentation](https://docs.sunmi.com/en/general-function-modules/printing-service/)
- [Scanning Documentation](https://docs.sunmi.com/en/general-function-modules/scan/)
- [GitHub Printer Demo](https://github.com/shangmisunmi/SunmiPrinterDemo)

---

> **Last Updated**: January 2026
> **Documentation Source**: SUNMI Official Specifications
