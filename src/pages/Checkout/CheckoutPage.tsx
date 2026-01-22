/**
 * ============================================================================
 * CHECKOUT PAGE
 * ============================================================================
 *
 * Purpose: Payment processing and completion
 *
 * Features:
 * - Payment method selection (cash, card)
 * - Cash amount entry with change calculation
 * - Receipt generation
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Banknote, Check } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui'
import { AppHeader } from '@/components/layout/AppHeader'

type PaymentMethod = 'cash' | 'card' | null
type CheckoutStep = 'method' | 'cash' | 'card' | 'complete'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()

  const [step, setStep] = useState<CheckoutStep>('method')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [cashReceived, setCashReceived] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const cashAmount = parseFloat(cashReceived) || 0
  const change = cashAmount - total

  // Quick cash amounts
  const quickAmounts = [5, 10, 20, 50, 100]

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method)
    if (method === 'cash') {
      setStep('cash')
    } else if (method === 'card') {
      setStep('card')
      // Simulate card processing
      handleCardPayment()
    }
  }

  const handleCardPayment = async () => {
    setIsProcessing(true)
    // Simulate card processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setStep('complete')
  }

  const handleCashPayment = () => {
    if (cashAmount < total) return
    setStep('complete')
  }

  const handleComplete = () => {
    clearCart()
    navigate('/pos')
  }

  const handleBack = () => {
    if (step === 'method') {
      navigate('/pos')
    } else if (step === 'cash' || step === 'card') {
      setStep('method')
      setPaymentMethod(null)
    }
  }

  // Redirect if no items
  if (items.length === 0 && step !== 'complete') {
    navigate('/pos')
    return null
  }

  // Get dynamic title based on step
  const getStepTitle = () => {
    switch (step) {
      case 'method': return 'Payment Method'
      case 'cash': return 'Cash Payment'
      case 'card': return 'Card Payment'
      case 'complete': return 'Complete'
      default: return 'Checkout'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* AppHeader with balance and menu */}
      <AppHeader
        showBack={step !== 'complete'}
        title={getStepTitle()}
        subtitle={`Total: ${formatCurrency(total)}`}
      />

      <div className="max-w-lg mx-auto p-4">
        {/* Total Display */}
        <div className="bg-white rounded-2xl p-6 mb-6 text-center">
          <p className="text-gray-500 text-sm mb-1">Amount Due</p>
          <p className="text-4xl font-bold text-gray-900">{formatCurrency(total)}</p>
        </div>

        {/* Payment Method Selection */}
        {step === 'method' && (
          <div className="space-y-4">
            <button
              onClick={() => handleSelectPaymentMethod('cash')}
              className="w-full bg-white rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <Banknote className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">Cash</h3>
                <p className="text-sm text-gray-500">Pay with cash</p>
              </div>
            </button>

            <button
              onClick={() => handleSelectPaymentMethod('card')}
              className="w-full bg-white rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">Card</h3>
                <p className="text-sm text-gray-500">Pay with debit or credit card</p>
              </div>
            </button>
          </div>
        )}

        {/* Cash Payment */}
        {step === 'cash' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <label className="block text-sm text-gray-500 mb-2">Amount Received</label>
              <input
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="0.00"
                className="w-full text-3xl font-bold text-center py-4 border-b-2 border-gray-200 focus:border-brand-500 focus:outline-none"
                autoFocus
              />

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setCashReceived(amount.toString())}
                    className="px-4 py-2 bg-gray-100 rounded-lg font-medium hover:bg-gray-200"
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
                <button
                  onClick={() => setCashReceived(total.toFixed(2))}
                  className="px-4 py-2 bg-brand-100 text-brand-700 rounded-lg font-medium hover:bg-brand-200"
                >
                  Exact
                </button>
              </div>
            </div>

            {/* Change Display */}
            {cashAmount > 0 && (
              <div className={`rounded-xl p-6 ${change >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm text-gray-600 mb-1">
                  {change >= 0 ? 'Change Due' : 'Amount Short'}
                </p>
                <p className={`text-3xl font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(change))}
                </p>
              </div>
            )}

            <Button
              onClick={handleCashPayment}
              disabled={cashAmount < total}
              className="w-full"
              size="lg"
              variant="success"
            >
              Complete Payment
            </Button>
          </div>
        )}

        {/* Card Payment */}
        {step === 'card' && (
          <div className="bg-white rounded-xl p-8 text-center">
            {isProcessing ? (
              <>
                <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Processing Payment...</h3>
                <p className="text-gray-500 mt-2">Please wait while we process your card</p>
              </>
            ) : (
              <>
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Insert or Tap Card</h3>
                <p className="text-gray-500 mt-2">Present card on the terminal</p>
              </>
            )}
          </div>
        )}

        {/* Payment Complete */}
        {step === 'complete' && (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800">Payment Successful!</h3>
              <p className="text-green-600 mt-2">Transaction completed</p>

              {paymentMethod === 'cash' && change > 0 && (
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-500">Change Due</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(change)}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1" size="lg">
                Print Receipt
              </Button>
              <Button onClick={handleComplete} className="flex-1" size="lg">
                New Sale
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
