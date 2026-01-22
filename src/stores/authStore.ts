/**
 * ============================================================================
 * AUTH STORE
 * ============================================================================
 *
 * Purpose: Zustand store for authentication state management
 *
 * Features:
 * - User login/logout
 * - PIN verification
 * - Session management
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { create } from 'zustand'
import type { User } from '@/types/auth.types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  loginWithPin: (pin: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User | null) => void
}

// Mock user for development
const mockUser: User = {
  id: '1',
  username: 'cashier1',
  name: 'John Doe',
  role: 'cashier',
  pin: '1234',
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (username: string, password: string) => {
    set({ isLoading: true })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock authentication - in production, this would call an API
    if (username === 'cashier' && password === 'password') {
      set({ user: mockUser, isAuthenticated: true, isLoading: false })
      return true
    }

    set({ isLoading: false })
    return false
  },

  loginWithPin: async (pin: string) => {
    set({ isLoading: true })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock PIN verification
    if (pin === '1234') {
      set({ user: mockUser, isAuthenticated: true, isLoading: false })
      return true
    }

    set({ isLoading: false })
    return false
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user })
  },
}))
