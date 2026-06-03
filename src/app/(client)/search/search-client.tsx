"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  Search,
  Home,
} from "lucide-react"

type Book = {
  id: number
  title: string
  author: string
  description?: string
  price?: number
  originalPrice?: number | null
  stock?: number
  coverImage?: string
  category?: { name: string } | null
}

// ─── Reusable book card ───────────────────────────────────────────────────────

function BookCard({ book, onClick }: { book: Book; onClick: () => void }) {
  const isOutOfStock = book.stock === 0
  const discount =
    book.originalPrice && book.originalPrice > (book.price ?? 0)
      ? Math.round(((book.originalPrice - (book.price ?? 0)) / book.originalPrice) * 100)
      : null

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer space-y-2"
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-neutral-100">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-neutral-300">
            <BookOpen className="h-8 w-8 stroke-[1.5]" />
            <span className="text-xs">No cover</span>
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
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            {book.category.name}
          </p>
        )}
        <p className="text-sm font-semibold text-neutral-800 line-clamp-2 leading-snug group-hover:text-neutral-600 transition-colors">
          {book.title}
        </p>
        <p className="text-xs text-neutral-400 line-clamp-1">
          {book.author || "Unknown Author"}
        </p>
        {book.description && (
          <p className="text-xs text-neutral-400 line-clamp-2 pt-0.5 leading-relaxed">
            {book.description}
          </p>
        )}
        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className="text-sm font-bold text-neutral-900">
            {book.price ? `NPR ${book.price.toLocaleString()}` : "—"}
          </span>
          {book.originalPrice && book.originalPrice > (book.price ?? 0) && (
            <span className="text-xs text-neutral-400 line-through">
              NPR {book.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SearchClientComp() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams?.get("q") || ""

  const [books, setBooks] = React.useState<Book[]>([])
  const [similarBooks, setSimilarBooks] = React.useState<Book[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [sortBy, setSortBy] = React.useState<"none" | "price-asc" | "price-desc">("none")
  const [selectedCategory, setSelectedCategory] = React.useState("All")

  React.useEffect(() => {
    if (!query) {
      setBooks([])
      setSimilarBooks([])
      return
    }

    let active = true
    setLoading(true)

    const run = async () => {
      try {
        const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`)
        if (!res.ok) throw new Error("Failed to load results")
        const data = await res.json()
        if (!active) return
        setBooks(data || [])
        setError(null)

        if (!data || data.length === 0) {
          const sim = await fetch(`/api/books?limit=6`)
          if (sim.ok && active) setSimilarBooks(await sim.json())
        } else {
          setSimilarBooks([])
        }
      } catch {
        if (active) { setError("Unable to load search results."); setBooks([]) }
      } finally {
        if (active) setLoading(false)
      }
    }

    run()
    return () => { active = false }
  }, [query])

  const uniqueCategories = ["All", ...Array.from(new Set(books.map(b => b.category?.name || "General")))]

  const processedBooks = React.useMemo(() => {
    let result = [...books]
    if (selectedCategory !== "All") {
      result = result.filter(b => (b.category?.name || "General") === selectedCategory)
    }
    if (sortBy === "price-asc") result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    if (sortBy === "price-desc") result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    return result
  }, [books, sortBy, selectedCategory])

  return (
    <main className="min-h-screen bg-neutral-50 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-3.5 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-all"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>

            {books.length > 0 && !loading && (
              <>
                <div className="flex items-center gap-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Category:
                </div>
                {uniqueCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                      selectedCategory === cat
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </>
            )}
          </div>

          {books.length > 0 && !loading && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center gap-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort:
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1.5 text-neutral-700 outline-none focus:border-neutral-400 transition-all cursor-pointer"
              >
                <option value="none">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>

        {/* Results count */}
        {!loading && books.length > 0 && (
          <p className="text-sm text-neutral-400">
            {processedBooks.length} result{processedBooks.length !== 1 ? "s" : ""} for{" "}
            <span className="font-semibold text-neutral-700">"{query}"</span>
          </p>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-purple-50 p-6 text-center text-sm font-medium text-primary max-w-md mx-auto">
            ⚠️ {error}
          </div>
        ) : processedBooks.length > 0 ? (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {processedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => router.push(`/books/${book.id}`)}
              />
            ))}
          </div>
        ) : query ? (
          <div className="space-y-12">
            {/* No results */}
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center max-w-md mx-auto">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <p className="text-base font-bold text-neutral-800">No books found</p>
              <p className="mt-1 text-sm text-neutral-500">
                Try different keywords or clear your filters.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() => { setSelectedCategory("All"); setSortBy("none") }}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all"
                >
                  Clear filters
                </button>
                <Link
                  href="/"
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-700 rounded-xl transition-all"
                >
                  Back to Home
                </Link>
              </div>
            </div>

            {/* Similar books */}
            {similarBooks.length > 0 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">You might also like</h3>
                  <p className="text-sm text-neutral-400 mt-0.5">Some titles you may enjoy</p>
                </div>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {similarBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onClick={() => router.push(`/books/${book.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Empty — no query yet
          <div className="rounded-2xl border border-neutral-100 bg-white p-16 text-center max-w-lg mx-auto">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mb-4">
              <BookOpen className="h-7 w-7" />
            </div>
            <p className="text-lg font-bold text-neutral-900">Your next story awaits</p>
            <p className="mt-2 text-sm text-neutral-500 max-w-xs mx-auto">
              Type a title, author, or genre in the search bar above.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-700 rounded-xl transition-all"
            >
              <Home className="h-4 w-4" /> Go to Homepage
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}