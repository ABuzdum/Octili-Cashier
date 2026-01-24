/**
 * ============================================================================
 * MAIN ENTRY POINT
 * ============================================================================
 *
 * Purpose: Application bootstrap and root rendering
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { sunmiPrinter, isNativePlatform } from '@/lib/terminals/sunmi/printer'

// Initialize SUNMI hardware services on native platform
if (isNativePlatform()) {
  sunmiPrinter.init().catch((err) => {
    console.error('Failed to initialize SUNMI printer:', err)
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
