# VV2S Plus - Integration Guide

## Setup Instructions

### Initial Setup

1. Power on the VV2S Plus terminal
2. Connect to WiFi network
3. Enable Developer Mode (if required)
4. Install Octili Cashier app

### Developer Mode

[Instructions to enable developer mode - to be documented]

### App Installation

#### Via APK Sideload

1. Enable "Install from Unknown Sources" in Settings
2. Transfer APK to device via USB or download
3. Open APK and confirm installation

#### Via MDM

[MDM deployment instructions - to be documented]

## Hardware Integration

### Printer Integration

#### Thermal Printer Specs

- Paper width: [e.g., 58mm]
- Print speed: [e.g., 50mm/s]
- Resolution: [e.g., 203 DPI]

#### Setup

[Printer setup instructions - to be documented]

#### Code Example

```typescript
// VV2S Plus Printer Integration
// TODO: Implement based on manufacturer SDK

import { VV2SPrinter } from '@/lib/terminals/vv2s-plus/printer'

export async function printTicket(ticketData: TicketData): Promise<void> {
  const printer = new VV2SPrinter()

  await printer.initialize()
  await printer.printText(`Ticket #${ticketData.number}`)
  await printer.printBarcode(ticketData.barcode)
  await printer.printQRCode(ticketData.qrCode)
  await printer.feedPaper(3)
  await printer.cut()
}
```

#### Print Templates

```
================================
        OCTILI LOTTERY
================================
Ticket: {ticketNumber}
Game: {gameName}
Draw: #{drawNumber}
--------------------------------
Selections: {selections}
Bet Amount: {amount} BRL
Draws: {numberOfDraws}
--------------------------------
Total: {totalCost} BRL
--------------------------------
Date: {date} {time}
================================
[QR CODE]
================================
Good Luck!
================================
```

### Scanner Integration

#### Barcode/QR Scanner Specs

- Scanner type: [1D/2D]
- Supported formats: [QR, Code128, EAN13, etc.]

#### Setup

[Scanner setup instructions - to be documented]

#### Code Example

```typescript
// VV2S Plus Scanner Integration
// TODO: Implement based on manufacturer SDK

import { VV2SScanner } from '@/lib/terminals/vv2s-plus/scanner'

export function initializeScanner(onScan: (code: string) => void): void {
  const scanner = new VV2SScanner()

  scanner.on('scan', (result) => {
    onScan(result.code)
  })

  scanner.start()
}

export function stopScanner(): void {
  VV2SScanner.stop()
}
```

### Payment Terminal Integration

#### Supported Payment Methods

- [ ] EMV Chip
- [ ] Magnetic Stripe
- [ ] Contactless/NFC
- [ ] QR Code Payment

#### Code Example

```typescript
// VV2S Plus Payment Integration
// TODO: Implement based on manufacturer SDK

import { VV2SPayment } from '@/lib/terminals/vv2s-plus/payment'

export async function processCardPayment(
  amount: number,
  currency: string = 'BRL'
): Promise<PaymentResult> {
  const payment = new VV2SPayment()

  const result = await payment.process({
    amount,
    currency,
    methods: ['chip', 'contactless', 'swipe']
  })

  return result
}
```

## Network Configuration

### WiFi Setup

1. Go to Settings > WiFi
2. Select network
3. Enter credentials
4. Verify connection

### Ethernet Setup

[If applicable - to be documented]

### Cellular Setup

[If applicable - to be documented]

## Security Considerations

### Data Encryption

- All sensitive data must be encrypted at rest
- Use Android Keystore for cryptographic keys
- Implement certificate pinning for API calls

### Certificate Management

[Document certificate installation process]

### Secure Storage

```typescript
// Use Android EncryptedSharedPreferences or equivalent
import { SecureStorage } from '@/lib/terminals/vv2s-plus/secure-storage'

// Store sensitive data
await SecureStorage.set('auth_token', token)

// Retrieve sensitive data
const token = await SecureStorage.get('auth_token')
```

## Troubleshooting

### Common Issues

#### Issue 1: Printer Not Responding

**Symptoms:** Print commands fail or timeout

**Solution:**
1. Check paper roll is properly installed
2. Verify printer is enabled in settings
3. Restart the device
4. Check for paper jams

#### Issue 2: Scanner Not Detecting Codes

**Symptoms:** QR codes or barcodes not being read

**Solution:**
1. Clean the scanner lens
2. Ensure adequate lighting
3. Check scan distance (optimal: 10-20cm)
4. Verify code format is supported

#### Issue 3: Network Connection Drops

**Symptoms:** Intermittent connectivity

**Solution:**
1. Check WiFi signal strength
2. Verify router settings
3. Restart network services
4. Consider using cellular backup

## Deployment Checklist

### Pre-Deployment

- [ ] Device firmware is up to date
- [ ] Octili Cashier app is latest version
- [ ] Network connectivity verified
- [ ] Printer tested with sample ticket
- [ ] Scanner tested with sample QR code
- [ ] Payment terminal configured (if applicable)

### Go-Live

- [ ] Operator credentials created
- [ ] Cash drawer configured
- [ ] Shift start/end procedures documented
- [ ] Support contact information provided
- [ ] Backup procedures established

### Post-Deployment

- [ ] Daily reconciliation process verified
- [ ] Offline mode tested
- [ ] Data sync verified
- [ ] Performance monitored
