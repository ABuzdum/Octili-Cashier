/**
 * ============================================================================
 * SETTINGS PAGE
 * ============================================================================
 *
 * Purpose: Cashier settings and configuration
 *
 * Features:
 * - User profile
 * - App settings
 * - Printer configuration with test print
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { ArrowLeft, User, Printer, Bell, Moon, Globe, Info, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { AppHeader } from '@/components/layout/AppHeader'
import { sunmiPrinter, isNativePlatform } from '@/lib/terminals/sunmi/printer'

export function SettingsPage() {
  const { user } = useAuthStore()
  const [printing, setPrinting] = useState(false)
  const [printResult, setPrintResult] = useState<'success' | 'error' | null>(null)

  const handleTestPrint = async () => {
    setPrinting(true)
    setPrintResult(null)

    try {
      await sunmiPrinter.printTestReceipt()
      setPrintResult('success')
    } catch (error) {
      console.error('Print failed:', error)
      setPrintResult('error')
    } finally {
      setPrinting(false)
      setTimeout(() => setPrintResult(null), 3000)
    }
  }

  const settingGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', description: 'Manage your account details' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', description: 'Sound and alert settings' },
        { icon: Moon, label: 'Appearance', description: 'Theme and display options' },
        { icon: Globe, label: 'Language', description: 'Change app language' },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: Info, label: 'About Octili', description: 'Version 1.0.0' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader
        showBack
        backPath="/games"
        title="Settings"
        subtitle="App configuration"
      />

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* User Card */}
        <div className="bg-white rounded-xl p-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-brand-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.name || 'Cashier'}</h2>
            <p className="text-sm text-gray-500 capitalize">{user?.role || 'User'}</p>
          </div>
        </div>

        {/* Hardware Section with Test Print */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
            Hardware
          </h3>
          <div className="bg-white rounded-xl divide-y divide-gray-100">
            {/* Printer Status and Test */}
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Printer className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Receipt Printer</p>
                  <p className="text-sm text-gray-500">
                    {isNativePlatform() ? 'SUNMI Built-in Printer' : 'Not available (web mode)'}
                  </p>
                </div>
              </div>

              {/* Test Print Button */}
              <button
                onClick={handleTestPrint}
                disabled={printing}
                className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {printing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Printing...
                  </>
                ) : printResult === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Print Successful!
                  </>
                ) : printResult === 'error' ? (
                  <>
                    <XCircle className="w-5 h-5" />
                    Print Failed
                  </>
                ) : (
                  <>
                    <Printer className="w-5 h-5" />
                    Test Print
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Settings Groups */}
        {settingGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
              {group.title}
            </h3>
            <div className="bg-white rounded-xl divide-y divide-gray-100">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
