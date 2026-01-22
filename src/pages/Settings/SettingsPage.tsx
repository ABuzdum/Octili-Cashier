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
 * - Printer configuration
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Printer, Bell, Moon, Globe, Info } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { AppHeader } from '@/components/layout/AppHeader'

export function SettingsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const settingGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', description: 'Manage your account details' },
      ],
    },
    {
      title: 'Hardware',
      items: [
        { icon: Printer, label: 'Receipt Printer', description: 'Configure printer settings' },
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
      {/* AppHeader with balance and menu */}
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
