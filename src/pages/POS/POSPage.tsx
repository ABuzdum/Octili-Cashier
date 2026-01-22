/**
 * ============================================================================
 * POS PAGE (MAIN CASHIER INTERFACE)
 * ============================================================================
 *
 * Purpose: Main point-of-sale interface for cashier operations
 *
 * Features:
 * - Product grid with categories
 * - Cart panel with running totals
 * - Quick actions
 * - Search and barcode scanning
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, LogOut, Receipt, Settings, BarChart3 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { categories, products } from '@/data/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui'
import type { Product } from '@/types/product.types'

export function POSPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { items, total, itemCount, addItem, removeItem, updateQuantity, clearCart } = useCartStore()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter products by category and search
  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery)
    return matchesCategory && matchesSearch && product.isActive
  })

  const handleProductClick = (product: Product) => {
    addItem(product)
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    navigate('/checkout')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-brand-600">Octili</h1>
          <span className="text-gray-500">|</span>
          <span className="text-gray-700">{user?.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/transactions')}>
            <Receipt className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
            <BarChart3 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Products */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or scan barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-xl p-4 text-left hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-3xl">
                      {product.categoryId === '1' ? '🥤' :
                       product.categoryId === '2' ? '🍔' :
                       product.categoryId === '3' ? '🍪' :
                       product.categoryId === '4' ? '🎰' :
                       product.categoryId === '5' ? '🚬' : '📦'}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-brand-600 font-semibold">
                    {formatCurrency(product.price)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Cart */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-danger hover:text-danger-dark"
                >
                  Clear all
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500">{itemCount} items</p>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Cart is empty</p>
                <p className="text-sm mt-1">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-3 flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.product.price)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-20 text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-danger"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t border-gray-200 p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(total / 1.21)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (21%)</span>
                <span>{formatCurrency(total - total / 1.21)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="w-full"
              size="lg"
              variant="success"
            >
              Pay {formatCurrency(total)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
