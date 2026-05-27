"use client";

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Book, BookImage, Category } from "@prisma/client"
import { AddWishlistButton } from "@/app/(client)/(profilesettings)/wishlist/AddWishlistButton"
import { Share2, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/CardContext";

// Extended types for the client component
type BookWithRelations = Book & {
  category: Category
  images: BookImage[]
}

type SimilarBook = Book & {
  images?: BookImage[]
}

type BookDetailClientProps = {
  book: BookWithRelations
  similarBooks?: SimilarBook[]
  user?: {
    id?: number
    firstName: string | null
    lastName: string | null
    email: string
  } | null
}

export default function BookDetailClient({ book, similarBooks = [], user }: BookDetailClientProps) {
  const router = useRouter()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const [showShareTooltip, setShowShareTooltip] = useState(false)
  const { addToCart } = useCart()

  // Validate and sort images
  const allImages = book.images && book.images.length > 0 
    ? [...book.images].sort((a, b) => a.order - b.order) 
    : (book.coverImage ? [{ url: book.coverImage, order: 0, id: 0, bookId: book.id }] : [])
  
  const mainImage = allImages[selectedImageIndex]?.url || book.coverImage || null

  const handleImageError = (idx: number) => {
    setImageErrors(prev => ({ ...prev, [idx]: true }))
  }

  const adjustQuantity = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount))
  }

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setIsAddedToCart(true)
    const success = await addToCart(book.id, quantity)
    
    if (success) {
      setTimeout(() => setIsAddedToCart(false), 2000)
    } else {
      setIsAddedToCart(false)
      console.error('Failed to add to cart')
    }
  }

  const handleBuyNow = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setIsBuyingNow(true)
    const success = await addToCart(book.id, quantity)
    
    if (success) {
      router.push('/checkout')
    } else {
      setIsBuyingNow(false)
      console.error('Failed to add to cart')
    }
  }

  const handleShare = async () => {
    const shareUrl = window.location.href
    const shareTitle = book.title
    const shareText = `Check out this book: ${book.title} by ${book.author}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setShowShareTooltip(true)
      setTimeout(() => setShowShareTooltip(false), 2000)
    }
  }

  // Calculate discount percentage
  const discountPercentage = book.originalPrice && book.originalPrice > book.price
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0

  return (
    <div className="bg-[#F4F5F8] min-h-screen text-gray-900 selection:bg-red-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        
        {/* Top Minimalist Action Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs tracking-wider uppercase text-gray-400">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-red-700 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium truncate max-w-45 sm:max-w-none">
              {book.title}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {user?.id && <AddWishlistButton bookId={book.id} userId={user.id} />}
            <div className="relative">
              <button onClick={handleShare} className="hover:text-red-700 transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
              </button>
              {showShareTooltip && (
                <div className="absolute right-0 top-full mt-2 z-20 px-2 py-1 bg-black text-white text-[10px] rounded shadow-md whitespace-nowrap normal-case">
                  Link copied!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Core Detail Segment Grid */}
        <div className="grid gap-12 lg:grid-cols-12 items-start bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-xs">
          
          {/* Left Column: Image Media Box */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-6">
            <div className="bg-white aspect-3/4 relative overflow-hidden flex items-center justify-center">
              {mainImage && !imageErrors[selectedImageIndex] ? (
                <img
                  src={mainImage}
                  alt={book.title}
                  onError={() => handleImageError(selectedImageIndex)}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="text-center p-6 text-gray-300">
                  <p className="text-xs uppercase tracking-widest">No Image Preview</p>
                </div>
              )}
            </div>

            {/* Thumbnail Strip Selector */}
            {allImages.length > 1 && (
              <div className="flex gap-2 justify-center overflow-x-auto pt-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-18 bg-gray-50 p-1 transition-all ${
                      selectedImageIndex === idx ? "border border-red-700" : "border border-transparent opacity-60"
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={`${book.title} thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover mix-blend-multiply" 
                      onError={() => handleImageError(idx)} 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Checkout Info Stream */}
          <div className="lg:col-span-6 space-y-6 lg:pl-4">
            
            <div className="space-y-1">
              {book.category && (
                <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase block">
                  {book.category.name}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black leading-tight">
                {book.title}
              </h1>
              <p className="text-sm text-gray-600">by {book.author}</p>
            </div>

            {/* Price Row Block */}
            <div className="flex items-center gap-3 pt-1 flex-wrap">
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-gray-500 line-through text-sm">
                  Rs. {book.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-2xl font-bold text-black">
                Rs. {book.price.toLocaleString()}
              </span>
              {discountPercentage > 0 && (
                <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 tracking-wider rounded-full">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="text-sm">
              {book.stock > 0 ? (
                <span className="text-green-600">✓ In Stock ({book.stock} available)</span>
              ) : (
                <span className="text-red-600">✗ Out of Stock</span>
              )}
            </div>

            {/* Interactive Quantity Selection Widget */}
            {book.stock > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs text-gray-500 tracking-wide block">Quantity</label>
                <div className="inline-flex items-center border border-gray-300 rounded-full bg-white px-2">
                  <button 
                    onClick={() => adjustQuantity(-1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-light text-lg transition-colors disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-xs font-medium text-black select-none">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => adjustQuantity(1)}
                    disabled={quantity >= book.stock}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-light text-lg transition-colors disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Refined CTA Rack Panel */}
            {book.stock > 0 && (
              <div className="space-y-3 pt-2 max-w-md">
                <button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="w-full py-3 px-6 rounded-full text-xs font-medium tracking-wider border border-black bg-white text-black hover:bg-gray-50 transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddedToCart ? "✓ Added to cart" : "Add to cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={book.stock === 0 || isBuyingNow}
                  className="w-full py-3 px-6 rounded-full text-xs font-medium tracking-wider bg-red-700 text-white hover:bg-red-800 transition-all text-center shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBuyingNow ? "Processing..." : "Buy it now"}
                </button>
              </div>
            )}

            {/* Seamless Body Text Container */}
            {book.description && (
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-black mb-2">Description</h3>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  <p>{book.description}</p>
                </div>
              </div>
            )}

            {/* Bottom Meta Technical Specs */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-x-8 gap-y-2 text-xs">
              {book.language && (
                <p>Language: <span className="text-gray-700 font-medium">{book.language}</span></p>
              )}
              {book.publisher && (
                <p>Publisher: <span className="text-gray-700 font-medium">{book.publisher}</span></p>
              )}
              {book.edition && (
                <p>Edition: <span className="text-gray-700 font-medium">{book.edition}</span></p>
              )}
            </div>

            {/* RECOMMENDATIONS SECTION ("You may also like") */}
            {similarBooks.length > 0 && (
              <div className="space-y-6 pt-8 border-t border-gray-100">
                <h2 className="text-base font-bold text-black tracking-tight">You may also like</h2>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {similarBooks.map((simBook) => {
                    const simImage = simBook.images?.[0]?.url || simBook.coverImage || null;
                    const simDiscount = simBook.originalPrice && simBook.price 
                      ? Math.round(((simBook.originalPrice - simBook.price) / simBook.originalPrice) * 100)
                      : 0;

                    return (
                      <Link 
                        href={`/books/${simBook.id}`} 
                        key={simBook.id}
                        scroll={true}
                        className="group flex flex-col p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 shadow-xs transition-all duration-200 text-left"
                      >
                        <div className="aspect-3/4 mb-3 overflow-hidden relative flex items-center justify-center bg-white rounded-xl">
                          {simImage ? (
                            <img 
                              src={simImage} 
                              alt={simBook.title}
                              className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-200 group-hover:scale-105" 
                              onError={() => {}}
                            />
                          ) : (
                            <span className="text-[10px] text-gray-300 uppercase tracking-widest">No Cover</span>
                          )}

                          {simDiscount > 0 && (
                            <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 tracking-wider rounded-full">
                              {simDiscount}% OFF
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-black text-sm line-clamp-2 leading-snug group-hover:text-red-700 transition-colors">
                              {simBook.title}
                            </h3>
                            <p className="text-[11px] text-gray-400 mt-1">by {simBook.author}</p>
                          </div>

                          <div className="pt-2 flex items-baseline gap-2 text-xs">
                            {simBook.originalPrice && simBook.originalPrice > simBook.price && (
                              <span className="text-gray-400 line-through">Rs.{simBook.originalPrice}</span>
                            )}
                            <span className="font-bold text-black">Rs.{simBook.price}</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}