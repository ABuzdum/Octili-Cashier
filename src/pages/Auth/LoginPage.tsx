/**
 * ============================================================================
 * LOGIN PAGE
 * ============================================================================
 *
 * Purpose: User authentication with username/password
 *
 * Features:
 * - Username and password input
 * - Form validation
 * - Error handling
 * - Link to PIN login
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button, Input } from '@/components/ui'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Please enter username and password')
      return
    }

    const success = await login(username, password)

    if (success) {
      navigate('/pos')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-600">Octili</h1>
          <p className="text-gray-600 mt-2">Cashier System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            {error && (
              <div className="p-3 bg-danger-light text-danger rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/pin"
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Use PIN instead
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              Demo: username <strong>cashier</strong>, password <strong>password</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
