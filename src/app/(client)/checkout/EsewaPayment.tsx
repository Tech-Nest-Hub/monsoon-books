// components/payment/EsewaPayment.tsx
'use client'

import React, { useState } from 'react'
import { Loader2, CreditCard } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'

interface EsewaPaymentProps {
  amount: number
  productId: string
  productName: string
  onSuccess?: () => void
  onFailure?: (error: string) => void
}

export function EsewaPayment({ 
  amount, 
  productId, 
  productName, 
  onSuccess, 
  onFailure 
}: EsewaPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()

  const handlePayment = async () => {
    if (!user) {
      onFailure?.('Please login to continue')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/esewa/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount.toString(),
          productId,
          productName,
        }),
      })
      
      const data = await response.json()
      
      if (data.success && data.formData) {
        // Create and submit form to eSewa
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.gatewayUrl || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
        
        Object.entries(data.formData).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value as string
          form.appendChild(input)
        })
        
        document.body.appendChild(form)
        form.submit()
        onSuccess?.()
      } else {
        throw new Error(data.error || 'Failed to initiate payment')
      }
    } catch (error) {
      console.error('Payment error:', error)
      onFailure?.(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || !user}
      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          <span>Pay with eSewa</span>
        </>
      )}
    </button>
  )
}