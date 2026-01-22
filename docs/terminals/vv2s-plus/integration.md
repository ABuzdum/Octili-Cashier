# SUNMI V2s Plus - Integration Guide

## Setup Instructions

### Initial Setup

1. Power on the SUNMI V2s Plus terminal
2. Complete initial Android 11 setup wizard
3. Connect to WiFi network (2.4G/5G supported)
4. Enable Developer Mode (see below)
5. Install Octili Cashier app

### Developer Mode

1. Go to **Settings** > **About Device**
2. Find **Build Number** and tap it **7 times**
3. Enter device PIN/password if prompted
4. "You are now a developer!" message appears
5. Go back to **Settings** > **System** > **Developer Options**
6. Enable **USB Debugging** for ADB access

### App Installation

#### Via APK Sideload (Development)

1. Enable **Developer Options** (see above)
2. Enable **USB Debugging** in Developer Options
3. Enable **Install from Unknown Sources** in Settings > Security
4. Connect device via USB Type-C cable
5. Run: `adb install octili-cashier.apk`

Alternatively:
1. Transfer APK to device via USB or download link
2. Open file manager and locate APK
3. Tap APK and confirm installation

#### Via MDM (Production)

SUNMI supports MDM deployment through:
- SUNMI Device Management System (DMS)
- Third-party MDM solutions (Knox, Intune, etc.)

Contact SUNMI support for enterprise deployment options.

## Hardware Integration

### Printer Integration

#### Thermal Printer Specs

| Property | Value |
|----------|-------|
| Paper width | 80mm (60-80mm label range) |
| Print speed | 80mm/s max |
| Roll diameter | 50mm max |
| Resolution | 203 DPI |
| Supported | Receipt, label, black mark printing |
| Protocol | ESC/POS compatible |

#### Setup

1. **Add Gradle Dependency** (Android native):
   ```gradle
   implementation 'com.sunmi:printerlibrary:1.0.18'
   ```

2. **For React Native / Capacitor**:
   - Use SUNMI printer bridge plugin
   - Or implement native module with AIDL

3. **Connection Modes**:
   - **AIDL** (recommended): Direct service binding
   - **Bluetooth**: Device name "InnerPrinter"
   - **JS Bridge**: For web-based apps

#### Code Example

```typescript
// SUNMI V2s Plus Printer Integration
// Uses SUNMI PrinterLibrary via native bridge

import { SunmiPrinter } from '@/lib/terminals/sunmi/printer'

// Initialize printer service
const printer = new SunmiPrinter()

export async function printTicket(ticketData: TicketData): Promise<void> {
  try {
    // Check printer status first
    const status = await printer.getStatus()
    if (status !== 'READY') {
      throw new Error(`Printer not ready: ${status}`)
    }

    // Begin transaction
    await printer.beginTransaction()

    // Print header
    await printer.setAlignment('CENTER')
    await printer.setBold(true)
    await printer.printText('OCTILI LOTTERY')
    await printer.setBold(false)
    await printer.printLine('='.repeat(32))

    // Print ticket info
    await printer.setAlignment('LEFT')
    await printer.printText(`Ticket: ${ticketData.number}`)
    await printer.printText(`Game: ${ticketData.gameName}`)
    await printer.printText(`Draw: #${ticketData.drawNumber}`)
    await printer.printLine('-'.repeat(32))

    // Print selections
    await printer.printText(`Selections: ${ticketData.selections.join(', ')}`)
    await printer.printText(`Bet Amount: ${ticketData.amount} BRL`)
    await printer.printText(`Draws: ${ticketData.numberOfDraws}`)
    await printer.printLine('-'.repeat(32))
    await printer.printText(`Total: ${ticketData.totalCost} BRL`)
    await printer.printLine('-'.repeat(32))

    // Print date/time
    await printer.printText(`Date: ${ticketData.date} ${ticketData.time}`)
    await printer.printLine('='.repeat(32))

    // Print QR code for validation
    await printer.setAlignment('CENTER')
    await printer.printQRCode(ticketData.qrCode, 200) // 200px size

    // Footer
    await printer.printLine('='.repeat(32))
    await printer.printText('Good Luck!')
    await printer.printLine('='.repeat(32))

    // Feed and cut
    await printer.feedPaper(4)
    await printer.cutPaper(false) // partial cut

    // Commit transaction
    await printer.commitTransaction()

  } catch (error) {
    console.error('Print failed:', error)
    throw error
  }
}

// Check paper status
export async function checkPrinterStatus(): Promise<PrinterStatus> {
  const status = await printer.getStatus()
  return {
    ready: status === 'READY',
    paperLow: status === 'PAPER_LOW',
    noPaper: status === 'NO_PAPER',
    overheated: status === 'OVERHEAT',
    error: status === 'ERROR'
  }
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

| Property | Value |
|----------|-------|
| Scanner type | 1D and 2D (Scanner Version only) |
| Supported formats | QR Code, Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, PDF417, Data Matrix |
| Special feature | Reads scratched, folded, or stained codes |
| Light | Built-in LED for low-light scanning |

#### Setup

1. Scanner is available only on **V2s Plus Scanner (GMS)** variant
2. No additional hardware setup required
3. Integrate via SUNMI Scan Service

#### Code Example

```typescript
// SUNMI V2s Plus Scanner Integration
// Scanner Version (GMS) only

import { SunmiScanner } from '@/lib/terminals/sunmi/scanner'

const scanner = new SunmiScanner()
let scanCallback: ((code: string) => void) | null = null

// Initialize scanner with event listener
export function initializeScanner(onScan: (code: string) => void): void {
  scanCallback = onScan

  // Configure scanner settings
  scanner.configure({
    formats: ['QR_CODE', 'CODE_128', 'EAN_13', 'EAN_8'],
    beepEnabled: true,
    vibrateEnabled: true,
    flashlightEnabled: false, // Enable in low light
    continuousMode: false
  })

  // Register scan result listener
  scanner.onScanResult((result) => {
    if (scanCallback) {
      scanCallback(result.code)
    }
  })

  scanner.onScanError((error) => {
    console.error('Scan error:', error)
  })
}

// Start scanning session
export function startScan(): void {
  scanner.start()
}

// Stop scanning session
export function stopScanner(): void {
  scanner.stop()
}

// Cleanup when component unmounts
export function disposeScanner(): void {
  scanner.dispose()
  scanCallback = null
}

// Enable flashlight for low-light conditions
export function toggleFlashlight(enabled: boolean): void {
  scanner.setFlashlight(enabled)
}

// Example usage in React component
/*
useEffect(() => {
  initializeScanner((code) => {
    console.log('Scanned:', code)
    // Process ticket QR code
    validateTicket(code)
  })

  return () => disposeScanner()
}, [])
*/
```

### Payment Terminal Integration

#### Supported Payment Methods

| Method | Support | Notes |
|--------|---------|-------|
| NFC/Contactless | ✅ (NFC variant) | Type A&B, Mifare, Felica |
| QR Code Payment | ✅ | Via camera or scanner |
| EMV Chip | ❌ | No card slot - use external reader |
| Magnetic Stripe | ❌ | No card slot - use external reader |

> **Note**: V2s Plus does not have built-in card reader. For card payments, integrate with external Bluetooth card reader or use PIX/QR Code payments popular in Brazil.

#### Code Example

```typescript
// SUNMI V2s Plus Payment Integration
// NFC payments and QR Code payments

import { SunmiNFC } from '@/lib/terminals/sunmi/nfc'
import { SunmiScanner } from '@/lib/terminals/sunmi/scanner'

// PIX QR Code Payment (Brazil)
export async function processPixPayment(
  amount: number,
  pixKey: string
): Promise<PaymentResult> {
  // Generate PIX QR code
  const pixCode = await generatePixCode({
    amount,
    pixKey,
    merchantName: 'OCTILI LOTTERY',
    city: 'SAO PAULO'
  })

  // Display QR code for customer to scan with their app
  return {
    type: 'PIX',
    qrCode: pixCode,
    amount,
    status: 'PENDING',
    expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
  }
}

// NFC Card Reading (for loyalty/voucher cards)
export async function readNFCCard(): Promise<NFCCardData> {
  const nfc = new SunmiNFC()

  return new Promise((resolve, reject) => {
    nfc.onCardDetected(async (card) => {
      try {
        const data = await nfc.readCard(card)
        nfc.stop()
        resolve({
          id: card.id,
          type: card.type,
          data
        })
      } catch (error) {
        reject(error)
      }
    })

    nfc.start()

    // Timeout after 30 seconds
    setTimeout(() => {
      nfc.stop()
      reject(new Error('NFC read timeout'))
    }, 30000)
  })
}

// External Bluetooth Card Reader Integration
export async function processCardPayment(
  amount: number,
  currency: string = 'BRL'
): Promise<PaymentResult> {
  // Connect to external Bluetooth card reader
  // Implementation depends on specific reader model
  // Common options: PAX, Ingenico, Stone, PagSeguro readers

  throw new Error('External card reader required - not built-in')
}
```

## Network Configuration

### WiFi Setup

| Property | Value |
|----------|-------|
| Bands | 2.4GHz and 5GHz |
| Standards | IEEE 802.11 a/b/g/n/ac |

**Setup Steps:**
1. Go to **Settings** > **Network & Internet** > **WiFi**
2. Enable WiFi toggle
3. Select your network from the list
4. Enter password (WPA2/WPA3 recommended)
5. Verify connection with connectivity check

**For Enterprise Networks (WPA2-Enterprise):**
1. Select network > **Advanced options**
2. Choose EAP method (PEAP, TLS, TTLS)
3. Enter credentials or install certificate
4. Configure Phase 2 authentication if required

### Ethernet Setup

V2s Plus does **not** have built-in Ethernet port. Use USB-C to Ethernet adapter if wired connection is required.

### Cellular Setup (4G/LTE)

| Property | Value |
|----------|-------|
| SIM Type | Dual Nano SIM |
| Bands | 4G/3G/2G |

**Setup Steps:**
1. Power off the device
2. Insert Nano SIM card(s) into slot(s)
3. Power on the device
4. Go to **Settings** > **Network & Internet** > **Mobile Network**
5. Enable mobile data
6. Select preferred SIM for data if dual SIM
7. APN settings should auto-configure (manual config available)

**Recommended for Lottery Terminals:**
- Use cellular as **backup** when WiFi fails
- Configure auto-failover in app settings
- Monitor data usage (limited plans)

## Security Considerations

### Data Encryption

| Requirement | Implementation |
|-------------|----------------|
| Data at rest | Android Keystore + EncryptedSharedPreferences |
| Data in transit | TLS 1.2+ with certificate pinning |
| Sensitive data | Never store in plain SharedPreferences |

### Certificate Management

**Installing Custom CA Certificate:**
1. Transfer certificate file (.crt/.cer) to device
2. Go to **Settings** > **Security** > **Encryption & Credentials**
3. Select **Install a certificate** > **CA certificate**
4. Browse and select your certificate file
5. Confirm installation

**For Certificate Pinning (in-app):**
```typescript
// Configure in network layer
const pinnedCertificates = [
  'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', // Primary
  'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB='  // Backup
]
```

### Secure Storage

```typescript
// SUNMI V2s Plus Secure Storage
// Uses Android Keystore + EncryptedSharedPreferences

import { SecureStorage } from '@/lib/terminals/sunmi/secure-storage'

// Initialize with encryption
const storage = new SecureStorage({
  keyAlias: 'octili_cashier_key',
  authenticationRequired: false // Set true for biometric
})

// Store sensitive data (encrypted automatically)
export async function storeAuthToken(token: string): Promise<void> {
  await storage.set('auth_token', token)
}

// Retrieve sensitive data (decrypted automatically)
export async function getAuthToken(): Promise<string | null> {
  return await storage.get('auth_token')
}

// Delete sensitive data
export async function clearAuthToken(): Promise<void> {
  await storage.delete('auth_token')
}

// Store complex objects
export async function storeUserSession(session: UserSession): Promise<void> {
  await storage.setObject('user_session', session)
}

// Clear all secure storage (on logout)
export async function clearAllSecureData(): Promise<void> {
  await storage.clear()
}
```

### Additional Security Best Practices

1. **Disable USB Debugging** in production
2. **Enable Screen Lock** with PIN/Password
3. **Use SUNMI Device Management** for remote wipe capability
4. **Implement session timeout** for inactive cashiers
5. **Log all transactions** for audit trail
6. **Validate all input** from scanner/NFC

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
