/**
 * ============================================================================
 * REPORTS PAGE
 * ============================================================================
 *
 * Purpose: View sales reports and analytics
 *
 * Features:
 * - Daily summary
 * - Sales by category
 * - Payment method breakdown
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, CreditCard, Banknote, ShoppingBag } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export function ReportsPage() {
  const navigate = useNavigate()

  // Mock data for reports
  const todaySummary = {
    totalSales: 1250.50,
    transactions: 45,
    averageTicket: 27.79,
    cashSales: 750.25,
    cardSales: 500.25,
  }

  const categoryBreakdown = [
    { name: 'Drinks', sales: 450.00, percentage: 36 },
    { name: 'Food', sales: 320.50, percentage: 26 },
    { name: 'Snacks', sales: 180.00, percentage: 14 },
    { name: 'Lottery', sales: 150.00, percentage: 12 },
    { name: 'Tobacco', sales: 100.00, percentage: 8 },
    { name: 'Other', sales: 50.00, percentage: 4 },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate('/pos')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Reports</h1>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Date Selector */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="font-semibold text-gray-900 mb-2">Today's Report</h2>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(todaySummary.totalSales)}
            </p>
            <p className="text-sm text-gray-500">Total Sales</p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{todaySummary.transactions}</p>
            <p className="text-sm text-gray-500">Transactions</p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Banknote className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(todaySummary.cashSales)}
            </p>
            <p className="text-sm text-gray-500">Cash Sales</p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(todaySummary.cardSales)}
            </p>
            <p className="text-sm text-gray-500">Card Sales</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Sales by Category</h3>
          <div className="space-y-4">
            {categoryBreakdown.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-500">
                    {formatCurrency(category.sales)} ({category.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Banknote className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Cash</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(todaySummary.cashSales)}
              </p>
              <p className="text-sm text-green-600">
                {Math.round((todaySummary.cashSales / todaySummary.totalSales) * 100)}% of total
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Card</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(todaySummary.cardSales)}
              </p>
              <p className="text-sm text-blue-600">
                {Math.round((todaySummary.cardSales / todaySummary.totalSales) * 100)}% of total
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
