// app/checkout/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/UserContext'
import { EsewaPayment } from './EsewaPayment'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: number
  bookId: number
  quantity: number
  priceAtAdd: number
  book: {
    id: number
    title: string
    price: number
  }
}

export default function CheckoutPage() {
  const { user, isLoading: userLoading } = useUser()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'ESEWA'>('CASH_ON_DELIVERY')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart')
        const data = await response.json()
        if (data.items) {
          setCartItems(data.items)
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCart()
    }
  }, [user])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0)
  const tax = 0 // Calculate tax if needed
  const shippingCost = subtotal > 1000 ? 0 : 100 // Free shipping over 1000
  const discount = 0
  const total = subtotal + tax + shippingCost - discount

  const handleCODOrder = async () => {
    if (!deliveryAddress || !phone) {
      alert('Please fill in delivery address and phone number')
      return
    }

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          deliveryAddress,
          phone,
          notes,
          tax,
          shippingCost,
          discount,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        router.push(`/payment/success?order=${data.order.orderNumber}`)
      } else {
        alert('Failed to create order')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      alert('Failed to create order')
    }
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Your cart is empty</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Delivery Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold mb-4">Delivery Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Address *</label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                    rows={3}
                    placeholder="Street address, city, postal code"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="98XXXXXXXX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                    rows={2}
                    placeholder="Special delivery instructions"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="CASH_ON_DELIVERY"
                    checked={paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  />
                  <span>Cash on Delivery</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="ESEWA"
                    checked={paymentMethod === 'ESEWA'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  />
                  <span>Pay with eSewa</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit sticky top-20">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.book.title}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span>रू {item.priceAtAdd * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>रू {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `रू ${shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>रू {tax}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-रू {discount}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>रू {total}</span>
                </div>
              </div>
            </div>

            {paymentMethod === 'ESEWA' && (
              <div className="mt-6">
                <EsewaPayment
                  amount={total}
                  productId="order-payment"
                  productName="Book Order"
                  onSuccess={() => console.log('Payment initiated')}
                  onFailure={(error:any) => alert(error)}
                />
              </div>
            )}

            {paymentMethod === 'CASH_ON_DELIVERY' && (
              <button
                onClick={handleCODOrder}
                className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Place Order (COD)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}