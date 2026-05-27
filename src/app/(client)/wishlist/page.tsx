'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'

type WishlistItem = {
  id: number
  userId: number
  bookId: number
  createdAt: string
  book: {
    id: number
    title: string
    author: string
    price: number
    coverImage: string
    stock: number
    category: {
      name: string
    }
  }
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlistItems(data)
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (bookId: number) => {
    setRemovingId(bookId)
    try {
      const response = await fetch(`/api/wishlist?bookId=${bookId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.bookId !== bookId))
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    } finally {
      setRemovingId(null)
    }
  }

  const addToCart = async (bookId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, quantity: 1 }),
      })
      if (response.ok) {
        router.push('/cart')
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-6">Save your favorite books here</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'book' : 'books'} saved
          </p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
              {/* Book Cover */}
              <Link href={`/book/${item.book.id}`} className="block relative aspect-3/4 overflow-hidden bg-gray-100">
                {item.book.coverImage ? (
                  <Image
                    src={item.book.coverImage}
                    alt={item.book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                
                {/* Remove button overlay */}
                <button
                  onClick={() => removeFromWishlist(item.bookId)}
                  disabled={removingId === item.bookId}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </Link>

              {/* Book Info */}
              <div className="p-4">
                <Link href={`/book/${item.book.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-red-600 transition">
                    {item.book.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">{item.book.author}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-red-600">
                    NPR {item.book.price.toString()}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.book.category.name}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(item.bookId)}
                  disabled={item.book.stock === 0}
                  className={`w-full py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                    item.book.stock > 0
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {item.book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}