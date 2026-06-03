"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
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
  const [productLimit, setProductLimit] = React.useState(10)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)

  const displayBooks = books.slice(0, productLimit)

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setProductLimit((current) => Math.min(current + 10, books.length))
      setIsLoadingMore(false)
    }, 300)
  }

  const getDiscount = (originalPrice: number | null, price: number) => {
    if (!originalPrice || originalPrice <= price) return null
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  if (loading) {
    return (
      <section className="space-y-5">
        <div className="space-y-1.5">
          <div className="h-3 w-20 bg-neutral-200 rounded animate-pulse" />
          <div className="h-7 w-52 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
          ))}
        </div>
      </section>
    )
  }

  if (displayBooks.length === 0) {
    return (
      <section className="space-y-5">
        <SectionHeader />
        <p className="text-sm text-neutral-400 py-12 text-center">
          No featured books available at the moment.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <SectionHeader />

      {/* Grid */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {displayBooks.map((book) => {
          const discount = getDiscount(book.originalPrice, book.price)
          const isOutOfStock = book.stock === 0
          const isLowStock = book.stock > 0 && book.stock <= 5

          return (
            <div
              key={book.id}
              onClick={() => router.push(`/books/${book.id}`)}
              className="group cursor-pointer space-y-2"
            >
              {/* Image */}
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-neutral-100">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl text-neutral-300">
                    📚
                  </div>
                )}

                {/* Hover dim */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {discount && (
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      -{discount}%
                    </span>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Only {book.stock} left
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Sold out
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-0.5 px-0.5">
                {book.category && (
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-500">
                    {book.category.name}
                  </p>
                )}
                <p className="text-sm font-semibold text-neutral-800 line-clamp-2 leading-snug group-hover:text-neutral-600 transition-colors">
                  {book.title}
                </p>
                <p className="text-xs text-neutral-400 line-clamp-1">
                  {book.author}
                </p>
                <div className="flex items-baseline gap-1.5 pt-0.5">
                  <span className="text-sm font-bold text-neutral-900">
                    NPR {book.price.toLocaleString()}
                  </span>
                  {book.originalPrice && book.originalPrice > book.price && (
                    <span className="text-xs text-neutral-400 line-through">
                      NPR {book.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load more */}
      {books.length > productLimit && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </>
            ) : (
              <>
                Load more books
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  )
}

function SectionHeader() {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <TrendingUp className="w-4 h-4 text-orange-500" />
        <span className="text-xs font-bold tracking-widest uppercase text-orange-500">
          Featured
        </span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
        Featured Books
      </h2>
    </div>
  )
}