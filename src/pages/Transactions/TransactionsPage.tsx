/**
 * ============================================================================
 * TRANSACTIONS PAGE
 * ============================================================================
 *
 * Purpose: View transaction history
 *
 * Features:
 * - List of recent transactions
 * - Search and filter
 * - Transaction details
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Receipt, CreditCard, Banknote } from 'lucide-react'
import { recentTransactions } from '@/data/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export function TransactionsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTransactions = recentTransactions.filter(
    (tx) =>
      tx.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate('/pos')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Transactions</h1>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by receipt number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-xl p-4 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  tx.payments[0]?.method === 'cash' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {tx.payments[0]?.method === 'cash' ? (
                    <Banknote className="w-6 h-6 text-green-600" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{tx.receiptNumber}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                      tx.status === 'refunded' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(tx.createdAt)}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(tx.total)}</p>
                  <p className="text-sm text-gray-500 capitalize">{tx.payments[0]?.method}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
