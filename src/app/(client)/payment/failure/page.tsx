// app/payment/failure/page.tsx
'use client'

import Link from 'next/link'
import { XCircle, Home, ShoppingBag, RefreshCw } from 'lucide-react'

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment could not be processed. Please try again or use a different payment method.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Possible reasons for failure:
          </p>
          <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
            <li>Insufficient balance</li>
            <li>Transaction timeout</li>
            <li>Network connectivity issues</li>
            <li>Invalid payment credentials</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}