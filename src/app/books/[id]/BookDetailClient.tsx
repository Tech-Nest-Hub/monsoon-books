"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type Book = {
  id: number
  title: string
  author: string
  price?: number
  originalPrice?: number
  description?: string
  coverImage?: string
  images?: Array<{ url: string; order: number }>
  category?: { name: string } | null
  publisher?: string | null
  edition?: number | null
  language?: string | null
  stock?: number
  status?: string
}

type BookDetailClientProps = {
  book: Book
}

export default function BookDetailClient({ book }: BookDetailClientProps) {
  const router = useRouter()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const allImages = book.images && book.images.length > 0 ? book.images : (book.coverImage ? [{ url: book.coverImage, order: 0 }] : [])
  const mainImage = allImages[selectedImageIndex]?.url || book.coverImage || null

  const handleImageError = (idx: number) => {
    setImageErrors(prev => ({...prev, [idx]: true}))
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-red-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8 flex items-center gap-2 text-xs sm:text-sm text-slate-600 overflow-x-auto">
          <Link href="/" className="hover:text-red-700 hover:underline transition-colors whitespace-nowrap">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-medium truncate">{book.title}</span>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-2 items-start">
          {/* Images Section - Enhanced */}
          <div className="space-y-3 sm:space-y-4 sticky top-8">
            {/* Main Image */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 aspect-[3/4] shadow-2xl relative group">
              {mainImage && !imageErrors[selectedImageIndex] ? (
                <div className="relative h-full w-full">
                  <img
                    src={mainImage}
                    alt={book.title}
                    onError={() => handleImageError(selectedImageIndex)}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm sm:text-lg">
                  <div className="text-center space-y-2">
                    <svg className="w-16 h-16 mx-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No image</p>
                  </div>
                </div>
              )}
              
              {/* Badge */}
              {book.stock && book.stock > 0 && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                  In Stock
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`rounded-lg overflow-hidden bg-slate-100 aspect-square cursor-pointer transition-all duration-200 border-2 ${
                      selectedImageIndex === idx 
                        ? "ring-2 ring-red-500 shadow-md border-red-500 scale-105" 
                        : "hover:ring-2 hover:ring-red-300 border-transparent"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${book.title} ${idx + 1}`}
                      onError={() => handleImageError(idx)}
                      className="h-full w-full object-cover hover:scale-110 transition-transform duration-200"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section - Enhanced */}
          <div className="space-y-4 sm:space-y-6">
            {/* Title and Author with Animation */}
            <div className="space-y-2 sm:space-y-3 animate-in fade-in slide-in-from-right duration-500">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">{book.title}</h1>
                <p className="mt-3 text-lg sm:text-xl text-slate-600">by <span className="font-bold text-slate-900">{book.author}</span></p>
              </div>
              
              {book.category && (
                <div className="inline-block">
                  <span className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-full shadow-md hover:shadow-lg transition-shadow">
                    {book.category.name}
                  </span>
                </div>
              )}
            </div>

            {/* Rating Section */}
            <div className="flex items-center gap-4 pb-4 border-b-2 border-red-200">
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-slate-600 font-medium">(4.8 ratings • 142 reviews)</span>
            </div>

            {/* Price Section - Modern Card */}
            <div className="space-y-4 bg-gradient-to-br from-red-600 via-red-500 to-orange-600 p-6 sm:p-8 rounded-2xl border-2 border-red-400 shadow-2xl text-white">
              <div>
                <p className="text-red-100 text-sm font-semibold uppercase tracking-wider mb-2">Special Offer</p>
                <div className="flex items-baseline gap-3 sm:gap-4 flex-wrap">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black">₹{book.price || "--"}</span>
                  {book.originalPrice && book.originalPrice > (book.price || 0) && (
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg sm:text-2xl line-through opacity-75">₹{book.originalPrice}</span>
                      <span className="px-3 py-1.5 text-xs sm:text-sm font-black text-red-600 bg-yellow-300 rounded-full shadow-lg">
                        -{Math.round(((book.originalPrice - (book.price || 0)) / book.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {book.stock !== undefined && (
                <div className="flex items-center gap-3 pt-3 border-t border-red-400">
                  <div className={`w-4 h-4 rounded-full ${book.stock > 0 ? "bg-green-300 animate-pulse" : "bg-red-300"}`}></div>
                  <p className={`font-bold text-sm ${book.stock > 0 ? "text-green-100" : "text-red-100"}`}>
                    {book.stock > 0 ? `${book.stock} items in stock • Free shipping` : "Out of stock"}
                  </p>
                </div>
              )}
            </div>

            {/* Description with Expand */}
            {book.description && (
              <div className="space-y-3 bg-white p-4 sm:p-6 rounded-xl border border-red-100 hover:shadow-lg transition-shadow">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">About this book</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                  {book.description}
                </p>
              </div>
            )}

            {/* Book Details Grid - 2x2 */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
              {book.language && (
                <div className="col-span-1 py-2 border-b-2 border-red-100">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Language</p>
                  <p className="text-slate-900 font-semibold mt-1.5 text-sm">{book.language}</p>
                </div>
              )}
              {book.publisher && (
                <div className="col-span-1 py-2 border-b-2 border-red-100">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Publisher</p>
                  <p className="text-slate-900 font-semibold mt-1.5 text-sm truncate">{book.publisher}</p>
                </div>
              )}
              {book.edition && (
                <div className="col-span-1 py-2">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Edition</p>
                  <p className="text-slate-900 font-semibold mt-1.5 text-sm">{book.edition}</p>
                </div>
              )}
              {book.status && (
                <div className="col-span-1 py-2">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Status</p>
                  <p className="text-slate-900 font-semibold mt-1.5 text-sm">{book.status}</p>
                </div>
              )}
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
              <button
                onClick={() => {setIsAddedToCart(true); setTimeout(() => setIsAddedToCart(false), 2000)}}
                className={`flex-1 py-4 sm:py-5 px-6 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl ${
                  book.stock === 0
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
                    : isAddedToCart
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700"
                }`}
                disabled={book.stock === 0}
              >
                {isAddedToCart ? (
                  <>
                    <svg className="w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0h2m-2 0a2 2 0 11-4 0m4 0l2 9" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              <button className="flex-1 py-4 sm:py-5 px-6 rounded-xl font-bold text-base sm:text-lg border-2 border-red-600 text-red-600 hover:bg-red-50 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Wishlist
              </button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-4 pt-4 text-xs text-slate-600 bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.354 7.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L2 9.293l2.646-2.647a.5.5 0 01.708 0zm0-4a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 01.708-.708L2 5.293l2.646-2.647a.5.5 0 01.708 0z" />
                </svg>
                Authentic
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.354 7.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L2 9.293l2.646-2.647a.5.5 0 01.708 0zm0-4a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 01.708-.708L2 5.293l2.646-2.647a.5.5 0 01.708 0z" />
                </svg>
                Free Shipping
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.354 7.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L2 9.293l2.646-2.647a.5.5 0 01.708 0zm0-4a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 01.708-.708L2 5.293l2.646-2.647a.5.5 0 01.708 0z" />
                </svg>
                Easy Returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
