/**
 * ============================================================================
 * AUTH STORE - UNIT TESTS
 * ============================================================================
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'

describe('authStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  })

  describe('initial state', () => {
    it('starts with no user and not authenticated', () => {
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
    })
  })

  describe('login', () => {
    it('authenticates with valid credentials', async () => {
      const result = await useAuthStore.getState().login('cashier', 'password')

      expect(result).toBe(true)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).not.toBeNull()
      expect(state.user?.username).toBe('cashier1')
    })

    it('rejects invalid credentials', async () => {
      const result = await useAuthStore.getState().login('wrong', 'credentials')

      expect(result).toBe(false)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
    })

    it('sets loading state during login', async () => {
      const loginPromise = useAuthStore.getState().login('cashier', 'password')

      // Should be loading immediately after calling
      expect(useAuthStore.getState().isLoading).toBe(true)

      await loginPromise

      // Should not be loading after completion
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('loginWithPin', () => {
    it('authenticates with valid PIN', async () => {
      const result = await useAuthStore.getState().loginWithPin('1234')

      expect(result).toBe(true)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })

    it('rejects invalid PIN', async () => {
      const result = await useAuthStore.getState().loginWithPin('0000')

      expect(result).toBe(false)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('clears user and authentication state', async () => {
      // First login
      await useAuthStore.getState().login('cashier', 'password')
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Then logout
      useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('setUser', () => {
    it('sets user and updates authentication state', () => {
      const mockUser = {
        id: '123',
        username: 'testuser',
        name: 'Test User',
        role: 'cashier' as const,
        pin: '5678',
      }

      useAuthStore.getState().setUser(mockUser)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.isAuthenticated).toBe(true)
    })

    it('clears authentication when setting null user', () => {
      // First set a user
      useAuthStore.getState().setUser({
        id: '123',
        username: 'testuser',
        name: 'Test User',
        role: 'cashier',
        pin: '5678',
      })

      // Then clear it
      useAuthStore.getState().setUser(null)

      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})
