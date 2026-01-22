/**
 * ============================================================================
 * AUTH TYPES
 * ============================================================================
 *
 * Purpose: Type definitions for authentication and user management
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

export interface User {
  id: string
  username: string
  name: string
  role: 'cashier' | 'manager' | 'admin'
  avatar?: string
  pin?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
