import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor Configuration for Octili Cashier
 * Target: SUNMI V2s Plus POS Terminal (Android 11)
 */
const config: CapacitorConfig = {
  appId: 'com.octili.cashier',
  appName: 'Octili Cashier',
  webDir: 'dist',
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    // Allow mixed content for development
    allowMixedContent: true,
  },
  server: {
    // For development - allows live reload
    // Remove in production
    cleartext: true,
  },
  plugins: {
    // SUNMI Printer Plugin Configuration
    SunmiPrinter: {
      bindOnLoad: true,
    },
    // SUNMI Scanner Plugin Configuration
    SunmiScanHead: {
      bindOnLoad: true,
    },
  },
};

export default config;
