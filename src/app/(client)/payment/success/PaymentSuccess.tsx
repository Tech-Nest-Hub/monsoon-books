// app/payment/success/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const transactionRef = searchParams.get('ref')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully.
        </p>
        
        {transactionRef && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Transaction Reference</p>
            <p className="text-sm font-mono font-semibold text-gray-800">
              {transactionRef}
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <Link
            href="/profile/orders"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Package className="w-5 h-5" />
            View My Orders
          </Link>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
        
        <p className="text-sm text-gray-400 mt-6">
          Redirecting to home in {countdown} seconds...
        </p>
      </div>
    </div>
  )
}