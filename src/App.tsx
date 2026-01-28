/**
 * ============================================================================
 * APP - MAIN APPLICATION COMPONENT
 * ============================================================================
 *
 * Purpose: Root component with routing configuration
 *
 * Features:
 * - React Router setup
 * - Lazy loading for all pages
 * - Protected routes with auth redirect
 * - Error boundary for graceful error handling
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { Suspense, lazy, useEffect, Component, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore, applyThemeToDocument } from '@/stores/themeStore'
import { TerminalOfflineOverlay } from '@/components/shared/TerminalOfflineOverlay'

// Lazy load all pages for code splitting
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage').then(m => ({ default: m.LoginPage })))
const PinPage = lazy(() => import('@/pages/Auth/PinPage').then(m => ({ default: m.PinPage })))
const POSPage = lazy(() => import('@/pages/POS/POSPage').then(m => ({ default: m.POSPage })))
const CheckoutPage = lazy(() => import('@/pages/Checkout/CheckoutPage').then(m => ({ default: m.CheckoutPage })))
const TransactionsPage = lazy(() => import('@/pages/Transactions/TransactionsPage').then(m => ({ default: m.TransactionsPage })))
const ReportsPage = lazy(() => import('@/pages/Reports/ReportsPage').then(m => ({ default: m.ReportsPage })))
const SettingsPage = lazy(() => import('@/pages/Settings/SettingsPage').then(m => ({ default: m.SettingsPage })))

// Lottery POS pages - Clear naming for cashiers
const GamePlayPage = lazy(() => import('@/pages/Game/GamePlayPage').then(m => ({ default: m.GamePlayPage })))
const PaymentOfWinningsPage = lazy(() => import('@/pages/Payment/PaymentOfWinningsPage').then(m => ({ default: m.PaymentOfWinningsPage })))
const ResultsPage = lazy(() => import('@/pages/Results/ResultsPage').then(m => ({ default: m.ResultsPage })))
const MenuPage = lazy(() => import('@/pages/Menu/MenuPage').then(m => ({ default: m.MenuPage })))
const AccountPage = lazy(() => import('@/pages/Account/AccountPage').then(m => ({ default: m.AccountPage })))
const CartPage = lazy(() => import('@/pages/Cart/CartPage').then(m => ({ default: m.CartPage })))

// Physical Ticket pages - Issue and payout physical lottery tickets
const NewTicketPage = lazy(() => import('@/pages/PhysicalTicket/NewTicketPage').then(m => ({ default: m.NewTicketPage })))
const PayoutTicketPage = lazy(() => import('@/pages/PhysicalTicket/PayoutTicketPage').then(m => ({ default: m.PayoutTicketPage })))

// Unified Payout page - Handles both QR tickets and Draw tickets
const PayoutPage = lazy(() => import('@/pages/Payout').then(m => ({ default: m.PayoutPage })))

// QR Ticket hub page - Access physical tickets, QR tickets, and account
const QRTicketPage = lazy(() => import('@/pages/QRTicket/QRTicketPage').then(m => ({ default: m.QRTicketPage })))

// TV Box Control - Manage TV displays in venue
const TVBoxControlPage = lazy(() => import('@/pages/TVBox/TVBoxControlPage').then(m => ({ default: m.TVBoxControlPage })))

// Second Display - Player-facing screen (opens in separate window)
const SecondDisplayPage = lazy(() => import('@/pages/SecondDisplay/SecondDisplayPage').then(m => ({ default: m.SecondDisplayPage })))

/**
 * Loading spinner component shown during lazy loading
 */
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

/**
 * Error Boundary for catching render errors and showing fallback UI
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Protected route wrapper - redirects to login if not authenticated
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

/**
 * Public route wrapper - redirects to QR Tickets (main page) if already authenticated
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/physical-ticket/new" replace />
  }

  return <>{children}</>
}

function App() {
  const { colorTheme, visualStyle, isDarkMode } = useThemeStore()

  // Initialize theme on app load
  useEffect(() => {
    applyThemeToDocument(colorTheme, visualStyle, isDarkMode)
  }, [colorTheme, visualStyle, isDarkMode])

  return (
    <BrowserRouter>
      {/* Terminal Offline Overlay - blocks all interactions when terminal is paused */}
      <TerminalOfflineOverlay />

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/pin"
            element={
              <PublicRoute>
                <PinPage />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <POSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Lottery POS routes */}
          <Route
            path="/game/:gameId"
            element={
              <ProtectedRoute>
                <GamePlayPage />
              </ProtectedRoute>
            }
          />

          {/* Unified Payout page - handles both QR and Draw tickets */}
          <Route
            path="/payout"
            element={
              <ProtectedRoute>
                <PayoutPage />
              </ProtectedRoute>
            }
          />

          {/* Legacy route - redirect to unified payout */}
          <Route path="/payment" element={<Navigate to="/payout" replace />} />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* QR Ticket hub */}
          <Route
            path="/qr-ticket"
            element={
              <ProtectedRoute>
                <QRTicketPage />
              </ProtectedRoute>
            }
          />

          {/* TV Box Control */}
          <Route
            path="/tvbox-control"
            element={
              <ProtectedRoute>
                <TVBoxControlPage />
              </ProtectedRoute>
            }
          />

          {/* Physical Ticket routes */}
          <Route
            path="/physical-ticket/new"
            element={
              <ProtectedRoute>
                <NewTicketPage />
              </ProtectedRoute>
            }
          />

          {/* Legacy route - redirect to unified payout */}
          <Route path="/physical-ticket/payout" element={<Navigate to="/payout" replace />} />

          {/* Second Display - Player-facing screen (no auth required) */}
          <Route path="/second-display" element={<SecondDisplayPage />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
