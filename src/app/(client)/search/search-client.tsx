"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  BookOpen, 
  Search, 
  ArrowRight, 
  Tag, 
  Home
} from "lucide-react"

type Book = {
  id: number
  title: string
  author: string
  description?: string
  price?: number
  coverImage?: string
  category?: { name: string } | null
}

function generateDescription(book: Book) {
  if (book.description) return book.description
  const authorPart = book.author ? ` by ${book.author}` : ""
  return `${book.title}${authorPart} — an engaging read that explores themes readers will love.`
}

export default function SearchClientComp() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams?.get("q") || ""
  
  const [books, setBooks] = React.useState<Book[]>([])
  const [similarBooks, setSimilarBooks] = React.useState<Book[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  // UI feature states
  const [sortBy, setSortBy] = React.useState<"none" | "price-asc" | "price-desc">("none")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")

  React.useEffect(() => {
    if (!query) {
      setBooks([])
      setSimilarBooks([])
      setLoading(false)
      return
    }

    let active = true
    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`)
        if (!response.ok) {
          throw new Error("Unable to load search results")
        }
        const data = await response.json()
        if (active) {
          setBooks(data || [])
          setError(null)
          
          // If no results, fetch a small set of similar/recommended books
          if (!data || data.length === 0) {
            const similarRes = await fetch(`/api/books?limit=6`)
            if (similarRes.ok) {
              const similarData = await similarRes.json()
              setSimilarBooks(similarData || [])
            }
          } else {
            setSimilarBooks([])
          }
        }
      } catch (err) {
        if (active) {
          setError("Unable to load search results.")
          setBooks([])
          setSimilarBooks([])
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchResults()
    return () => {
      active = false
    }
  }, [query])

  // Process and filter data clientside for instant feedback
  const uniqueCategories = ["All", ...Array.from(new Set(books.map(b => b.category?.name || "General")))]
  
  const processedBooks = React.useMemo(() => {
    let result = [...books]
    
    if (selectedCategory !== "All") {
      result = result.filter(b => (b.category?.name || "General") === selectedCategory)
    }
    
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0))
    }
    
    return result
  }, [books, sortBy, selectedCategory])

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-red-50/40 via-slate-50 to-white px-4 pb-20 pt-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Toolbar Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all border border-slate-200/60 shadow-sm mr-2"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>

            {books.length > 0 && !loading && (
              <>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1 uppercase tracking-wider md:inline-flex">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Categories:
                </div>
                {uniqueCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                      selectedCategory === cat
                        ? "bg-red-600 text-white shadow-sm shadow-red-200"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Sorting Actions */}
          {books.length > 0 && !loading && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort:
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 outline-none focus:border-red-400 transition-all cursor-pointer"
              >
                <option value="none">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>

        {/* Content Section Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="space-y-3 p-3 bg-white border rounded-2xl">
                  <Skeleton className="aspect-3/4 w-full rounded-xl bg-slate-100" />
                  <Skeleton className="h-4 w-3/4 bg-slate-100" />
                  <Skeleton className="h-3 w-1/2 bg-slate-100" />
                  <Skeleton className="h-6 w-1/3 bg-slate-100" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center text-sm font-medium text-red-600 max-w-md mx-auto shadow-inner">
              ⚠️ {error}
            </div>
          ) : processedBooks.length ? (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {processedBooks.map((book) => (
                <Card 
                  key={book.id} 
                  onClick={() => router.push(`/books/${book.id}`)}
                  className="p-0 group relative h-full rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex flex-col h-full min-h-0">
                    <div className="relative aspect-3/4 bg-slate-50 overflow-hidden group-hover:brightness-95 transition-all duration-300">
                      <span className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-sm shadow-sm border border-slate-100 text-[10px] font-bold text-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Tag className="h-2.5 w-2.5 text-red-500" />
                        {book.category?.name ?? "General"}
                      </span>

                      {book.coverImage ? (
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400 bg-linear-to-brom-slate-50 to-slate-100">
                          <BookOpen className="h-8 w-8 stroke-[1.5]" />
                          <span className="text-xs font-medium">No Cover Art</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-2 rounded-xl text-slate-900 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1">
                          View details <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h2 className="line-clamp-2 text-sm font-bold text-slate-800 tracking-tight group-hover:text-red-600 transition-colors">
                          {book.title}
                        </h2>
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          by {book.author || "Unknown Author"}
                        </p>
                        <p className="line-clamp-2 text-xs text-slate-500 pt-1 leading-relaxed">
                          {book.description ?? generateDescription(book)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <span className="text-[13px] font-extrabold text-slate-900">
                          {book.price ? `₹${book.price}` : "—"}
                        </span>
                        {book.price && (
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            In Stock
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : query ? (
            /* No results: show message then similar books below */
            <div className="space-y-12">
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 backdrop-blur p-12 text-center max-w-xl mx-auto shadow-sm">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <p className="text-lg font-bold text-slate-800">No books found</p>
                <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">No books found matching your search. Try different keywords or filters.</p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button 
                    onClick={() => { setSelectedCategory("All"); setSortBy("none"); }} 
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                  >
                    Clear active filters
                  </button>
                  <Link 
                    href="/" 
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm shadow-red-100"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>

              {/* Similar books section shown when no results */}
              {similarBooks.length > 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900">Similar books you may like</h3>
                    <p className="text-sm text-slate-600 mt-2">Here are some titles you may enjoy</p>
                  </div>
                  
                  <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {similarBooks.map((book) => (
                      <Card 
                        key={book.id} 
                        onClick={() => router.push(`/books/${book.id}`)}
                        className="p-0 group relative h-full rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer overflow-hidden flex flex-col justify-between"
                      >
                        <div className="flex flex-col h-full min-h-0">
                          <div className="relative aspect-3/4 bg-slate-50 overflow-hidden group-hover:brightness-95 transition-all duration-300">
                            <span className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-sm shadow-sm border border-slate-100 text-[10px] font-bold text-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Tag className="h-2.5 w-2.5 text-orange-500" />
                              {book.category?.name ?? "General"}
                            </span>

                            {book.coverImage ? (
                              <img 
                                src={book.coverImage} 
                                alt={book.title} 
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400 bg-linear-to-b from-slate-50 to-slate-100">
                                <BookOpen className="h-8 w-8 stroke-[1.5]" />
                                <span className="text-xs font-medium">No Cover Art</span>
                              </div>
                            )}
                            
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-2 rounded-xl text-slate-900 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1">
                                View details <ArrowRight className="h-3 w-3" />
                              </div>
                            </div>
                          </div>

                          <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div className="space-y-1">
                              <h2 className="line-clamp-2 text-sm font-bold text-slate-800 tracking-tight group-hover:text-red-600 transition-colors">
                                {book.title}
                              </h2>
                              <p className="text-[11px] text-slate-400 font-medium truncate">
                                by {book.author || "Unknown Author"}
                              </p>
                              <p className="line-clamp-2 text-xs text-slate-500 pt-1 leading-relaxed">
                                {book.description ?? generateDescription(book)}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                              <span className="text-[13px] font-extrabold text-slate-900">
                                {book.price ? `₹${book.price}` : "—"}
                              </span>
                              {book.price && (
                                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  In Stock
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-100 bg-gradient-to-tr from-white via-slate-50/50 to-red-50/30 p-16 text-center max-w-2xl mx-auto shadow-sm">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-red-100 mb-4">
                <BookOpen className="h-7 w-7" />
              </div>
              <p className="text-xl font-bold text-slate-900">Your next story awaits</p>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">Type the name of a title, genre, author, or interest in the search bar above to generate custom collections.</p>
              <div className="mt-6">
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-all shadow-md"
                >
                  <Home className="h-4 w-4" /> Go to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}