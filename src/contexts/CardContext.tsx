'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
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

type CartContextType = {
  cart: CartData | null
  loading: boolean
  refreshCart: () => Promise<void>
  addToCart: (bookId: number, quantity: number) => Promise<boolean>
  updateQuantity: (itemId: number, quantity: number) => Promise<boolean>
  removeItem: (itemId: number) => Promise<boolean>
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const refreshCart = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isFetching.current) return
    
    isFetching.current = true
    try {
      const response = await fetch('/api/cart')
      if (response.ok && isMounted.current) {
        const data = await response.json()
        setCart(data)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
      isFetching.current = false
    }
  }, [])

  const addToCart = useCallback(async (bookId: number, quantity: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, quantity }),
      })
      
      if (response.ok) {
        await refreshCart()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to add to cart:', error)
      return false
    }
  }, [refreshCart])

  const updateQuantity = useCallback(async (itemId: number, quantity: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      
      if (response.ok) {
        await refreshCart()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to update quantity:', error)
      return false
    }
  }, [refreshCart])

  const removeItem = useCallback(async (itemId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await refreshCart()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to remove item:', error)
      return false
    }
  }, [refreshCart])

  useEffect(() => {
    isMounted.current = true
    refreshCart()
    
    return () => {
      isMounted.current = false
    }
  }, [refreshCart])

  const totalItems = cart?.totalItems || 0
  const totalPrice = cart?.totalPrice || 0

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}