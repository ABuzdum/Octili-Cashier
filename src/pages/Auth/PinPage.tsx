/**
 * ============================================================================
 * PIN PAGE
 * ============================================================================
 *
 * Purpose: Quick authentication with numeric PIN
 *
 * Features:
 * - Numeric keypad
 * - Large touch targets
 * - Visual PIN dots
 * - Clear/backspace functionality
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Delete } from 'lucide-react'

export function PinPage() {
  const navigate = useNavigate()
  const { loginWithPin, isLoading } = useAuthStore()

  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const PIN_LENGTH = 4

  const handleNumberClick = async (num: string) => {
    if (pin.length >= PIN_LENGTH) return

    const newPin = pin + num
    setPin(newPin)
    setError('')

    // Auto-submit when PIN is complete
    if (newPin.length === PIN_LENGTH) {
      const success = await loginWithPin(newPin)

      if (success) {
        navigate('/games')
      } else {
        setError('Invalid PIN')
        setPin('')
      }
    }
  }

  const handleBackspace = () => {
    setPin(pin.slice(0, -1))
    setError('')
  }

  const handleClear = () => {
    setPin('')
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-600">Octili</h1>
          <p className="text-gray-600 mt-2">Enter PIN</p>
        </div>

        {/* PIN Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center gap-4 mb-8">
            {Array.from({ length: PIN_LENGTH }).map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-colors ${
                  index < pin.length ? 'bg-brand-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-danger-light text-danger rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                disabled={isLoading}
                className="h-16 text-2xl font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="h-16 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              Clear
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              disabled={isLoading}
              className="h-16 text-2xl font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              disabled={isLoading}
              className="h-16 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <Delete className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Use password instead
            </Link>
          </div>

          {/* Demo PIN */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              Demo PIN: <strong>1234</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
