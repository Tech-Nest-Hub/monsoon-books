'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus, ChevronRight } from 'lucide-react'
import type { CartItem, Book } from '@prisma/client'

type CartItemWithBook = CartItem & {
  book: Book
}

type CartData = {
  id: number
  items: CartItemWithBook[]
  totalItems: number
  totalPrice: number
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCart(data)
        // Select all items by default
        if (data.items?.length) {
          setSelectedItems(new Set(data.items.map((item: CartItemWithBook) => item.id)))
        }
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setUpdatingId(itemId)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      })
      
      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const removeItem = async (itemId: number) => {
    setRemovingId(itemId)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
    } finally {
      setRemovingId(null)
    }
  }

  const toggleSelectItem = (itemId: number) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const toggleSelectAll = () => {
    if (!cart) return
    
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(cart.items.map(item => item.id)))
    }
  }

  const handleCheckout = () => {
    if (!cart || selectedItems.size === 0) return
    
    const selectedItemIds = Array.from(selectedItems)
    router.push(`/checkout?selectedItems=${selectedItemIds.join(',')}`)
  }

  const getSelectedTotal = () => {
    if (!cart) return 0
    return cart.items
      .filter(item => selectedItems.has(item.id))
      .reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0)
  }

  const getSelectedCount = () => {
    if (!cart) return 0
    return cart.items
      .filter(item => selectedItems.has(item.id))
      .reduce((sum, item) => sum + item.quantity, 0)
  }

  const isAllSelected = cart && selectedItems.size === cart.items.length && cart.items.length > 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 flex gap-4">
                  <div className="w-24 h-32 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition mb-4">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">{cart.totalItems} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected ?? false}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({cart.items.length} items)
                </span>
              </label>
              <span className="text-sm text-gray-500">
                Selected: {selectedItems.size} items
              </span>
            </div>

            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition relative">
                <div className="flex gap-4 sm:gap-6">
                  {/* Selection Checkbox */}
                  <div className="flex items-start pt-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary mt-1"
                    />
                  </div>

                  {/* Book Cover */}
                  <Link href={`/book/${item.book.id}`} className="shrink-0">
                    <div className="relative w-20 h-28 sm:w-24 sm:h-32 bg-gray-100 rounded-lg overflow-hidden">
                      {item.book.coverImage ? (
                        <Image
                          src={item.book.coverImage}
                          alt={item.book.title}
                          fill
                          className="object-cover hover:scale-105 transition"
                          sizes="(max-width: 640px) 80px, 96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Book Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <div>
                        <Link href={`/book/${item.book.id}`}>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-primary transition line-clamp-1">
                            {item.book.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mt-0.5">{item.book.author}</p>
                        <p className="text-xs text-gray-400 mt-1">In stock: {item.book.stock} items</p>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        NPR {(item.priceAtAdd * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updatingId === item.id || item.quantity <= 1}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900">
                          {updatingId === item.id ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updatingId === item.id || item.quantity >= item.book.stock}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={removingId === item.id}
                        className="text-primary hover:text-primary transition disabled:opacity-50 flex items-center gap-1 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Selected Items ({getSelectedCount()})</span>
                  <span>NPR {getSelectedTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 pb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">
                  NPR {getSelectedTotal().toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItems.size === 0}
                className={`w-full py-3 rounded-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                  selectedItems.size > 0
                    ? 'bg-primary hover:bg-primary text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Checkout ({selectedItems.size} items)
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Only selected items will be checked out
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}