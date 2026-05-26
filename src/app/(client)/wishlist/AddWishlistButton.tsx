'use client'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  bookId: number
  userId?: number | null
}

export function AddWishlistButton({ bookId, userId }: Props) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check if book is in wishlist on mount
  useEffect(() => {
    if (userId) {
      checkWishlistStatus()
    }
  }, [bookId, userId])

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`/api/wishlist/check?bookId=${bookId}`)
      if (response.ok) {
        const data = await response.json()
        setIsInWishlist(data.isInWishlist)
      }
    } catch (error) {
      console.error('Failed to check wishlist:', error)
    }
  }

  const toggleWishlist = async () => {
    if (!userId) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?bookId=${bookId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setIsInWishlist(false)
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId }),
        })
        if (response.ok) {
          setIsInWishlist(true)
        }
      }
      router.refresh()
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`flex items-center justify-center gap-2 py-4 sm:py-5 px-6 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl ${
        isInWishlist
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
      {isInWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
    </button>
  )
}