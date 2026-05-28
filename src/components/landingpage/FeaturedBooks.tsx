"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { TrendingUp, ShoppingCart, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { useCart } from "@/contexts/CartContext"
import { useUser } from "@/contexts/UserContext"
import type { Book, Category, BookImage } from "@prisma/client"

type BookWithRelations = Book & {
  category?: Category | null
  images?: BookImage[]
}

type FeaturedBooksProps = {
  books: BookWithRelations[]
  loading?: boolean
}

export function FeaturedBooks({ books, loading = false }: FeaturedBooksProps) {
  const router = useRouter()
  const { user } = useUser()
  const { addToCart } = useCart()
  
  const [productLimit, setProductLimit] = React.useState(10)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const [addingToCart, setAddingToCart] = React.useState<number | null>(null)

  const displayBooks = books.slice(0, productLimit)

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setProductLimit((current) => Math.min(current + 10, books.length))
      setIsLoadingMore(false)
    }, 300)
  }

  const handleBookClick = (bookId: number) => {
    router.push(`/books/${bookId}`)
  }

  const handleAddToCart = async (e: React.MouseEvent, bookId: number) => {
    e.stopPropagation()
    
    if (!user) {
      router.push('/login')
      return
    }

    setAddingToCart(bookId)
    const success = await addToCart(bookId, 1)
    
    if (success) {
      setTimeout(() => setAddingToCart(null), 1000)
    } else {
      setAddingToCart(null)
    }
  }

  const getDiscountPercentage = (originalPrice: number | null, price: number) => {
    if (!originalPrice || originalPrice <= price) return null
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  // Book Card Component
  const BookCard = ({ book }: { book: BookWithRelations }) => {
    const discount = getDiscountPercentage(book.originalPrice, book.price)
    const isLowStock = book.stock > 0 && book.stock <= 5
    const isOutOfStock = book.stock === 0
    const isAdding = addingToCart === book.id
    
    return (
      <Card
        onClick={() => handleBookClick(book.id)}
        className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-neutral-200 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-xs text-neutral-400">No cover</p>
              </div>
            </div>
          )}

          {/* Hover Overlay with View Details */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-2 rounded-xl text-neutral-900 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1">
              View details <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {discount && (
              <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                -{discount}%
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                Only {book.stock} left
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-neutral-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        <CardContent className="p-3 space-y-2">
          {/* Category */}
          {book.category && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full truncate">
                {book.category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-sm text-neutral-800 line-clamp-2 group-hover:text-red-600 transition-colors">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-neutral-500 line-clamp-1">
            by {book.author}
          </p>

          {/* Price Section */}
          <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-red-600">
                ₹{book.price.toLocaleString()}
              </span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-[10px] text-neutral-400 line-through">
                  ₹{book.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {/* Stock indicator */}
            {!isOutOfStock && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] text-neutral-500">In stock</span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => handleAddToCart(e, book.id)}
            disabled={isOutOfStock || isAdding}
            className={cn(
              "w-full mt-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5",
              isOutOfStock
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : isAdding
                ? "bg-green-600 text-white"
                : "bg-neutral-900 text-white hover:bg-neutral-700 active:scale-95"
            )}
          >
            {isAdding ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </>
            )}
          </button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-neutral-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-neutral-200 rounded mt-1 animate-pulse" />
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-96 rounded-xl" />
          ))}
        </div>
      </section>
    )
  }

  if (displayBooks.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-700">
            Our sales
          </p>
        </div>
        <h2 className="text-3xl font-bold text-neutral-900">
          Featured Books & Products
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Handpicked books just for you
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {displayBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Load More Button */}
      {books.length > productLimit && (
        <div className="flex justify-center pb-4 pt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="group relative overflow-hidden rounded-lg px-8 py-3 font-semibold text-white transition-all duration-300 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-300 group-hover:from-red-700 group-hover:to-orange-700"></div>
            <div className="relative flex items-center gap-2">
              {isLoadingMore ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  Load More Books
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </>
              )}
            </div>
          </button>
        </div>
      )}
    </section>
  )
}