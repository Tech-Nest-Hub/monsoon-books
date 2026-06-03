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
        const response = await fetch(`/api/wishlist?bookId=${bookId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setIsInWishlist(false)
        }
      } else {
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
      className={`p-3 rounded-full transition-all duration-300 ${
        isInWishlist
          ? 'bg-primary text-white hover:bg-primary'
          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-primary'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
    </button>
  )
}