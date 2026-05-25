"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/app/aayushma/Navbar"

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

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookId) return

    const loadBook = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/books/${bookId}`)
        if (!response.ok) {
          throw new Error("Book not found")
        }
        const data = await response.json()
        setBook(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load book")
        setBook(null)
      } finally {
        setLoading(false)
      }
    }

    loadBook()
  }, [bookId])

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="aspect-[3/4] rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 rounded" />
              <Skeleton className="h-6 w-1/2 rounded" />
              <Skeleton className="h-32 rounded" />
              <Skeleton className="h-10 w-32 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Book not found</h1>
            <p className="mt-2 text-slate-600">{error || "This book could not be found."}</p>
            <Button onClick={() => router.push("/")} className="mt-6">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const mainImage = book.coverImage || (book.images && book.images[0]?.url)
  const otherImages = book.images ? book.images.slice(1) : []

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-red-50 min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-red-700 hover:underline transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{book.title}</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 aspect-[3/4] shadow-xl">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={book.title}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-lg">
                  No image available
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {otherImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden bg-slate-100 aspect-square cursor-pointer hover:ring-2 hover:ring-red-500 transition-all duration-200"
                  >
                    <img
                      src={img.url}
                      alt={`${book.title} ${idx + 2}`}
                      className="h-full w-full object-cover hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title and Author */}
            <div className="space-y-3">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">{book.title}</h1>
                <p className="mt-2 text-xl text-slate-600">by <span className="font-semibold text-slate-900">{book.author}</span></p>
              </div>
              
              {book.category && (
                <div className="inline-block">
                  <span className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-full">
                    {book.category.name}
                  </span>
                </div>
              )}
            </div>

            {/* Rating and Reviews Placeholder */}
            <div className="flex items-center gap-4 pb-4 border-b border-red-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-slate-600">(5 customer reviews)</span>
            </div>

            {/* Price Section */}
            <div className="space-y-4 bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100">
              <div>
                <p className="text-sm text-slate-600 mb-2">Special Price</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-bold text-red-700">₹{book.price || "--"}</span>
                  {book.originalPrice && book.originalPrice > (book.price || 0) && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-slate-500 line-through">₹{book.originalPrice}</span>
                      <span className="px-3 py-1 text-sm font-bold text-white bg-red-600 rounded-full">
                        Save {Math.round(((book.originalPrice - (book.price || 0)) / book.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {book.stock !== undefined && (
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${book.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                  <p className={`font-semibold ${book.stock > 0 ? "text-green-700" : "text-red-700"}`}>
                    {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">About this book</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {book.description}
                </p>
              </div>
            )}

            {/* Book Details Grid */}
            <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl border border-red-100">
              {book.language && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Language</p>
                  <p className="text-slate-900 font-medium mt-1">{book.language}</p>
                </div>
              )}
              {book.publisher && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Publisher</p>
                  <p className="text-slate-900 font-medium mt-1">{book.publisher}</p>
                </div>
              )}
              {book.edition && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Edition</p>
                  <p className="text-slate-900 font-medium mt-1">{book.edition}</p>
                </div>
              )}
              {book.status && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Status</p>
                  <p className="text-slate-900 font-medium mt-1">{book.status}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  book.stock === 0
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white hover:shadow-lg hover:-translate-y-1"
                }`}
                disabled={book.stock === 0}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-6" />
                </svg>
                {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-4 rounded-xl font-bold text-lg border-2 border-red-600 text-red-600 hover:bg-red-50 transition-all duration-300"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
