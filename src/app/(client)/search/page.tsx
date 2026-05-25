"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Book = {
  id: number
  title: string
  author: string
  price?: number
  coverImage?: string
  category?: { name: string } | null
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams?.get("q") || ""
  const [books, setBooks] = React.useState<Book[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!query) {
      setBooks([])
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
        }
      } catch (err) {
        if (active) {
          setError("Unable to load search results.")
          setBooks([])
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 px-4 pb-16 pt-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {query && (
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-700">Results</p>
            <h1 className="text-4xl font-bold sm:text-5xl text-red-700">Results for "{query}"</h1>
            {!loading && <p className="text-sm text-slate-600">{books.length} book(s) found</p>}
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
              {error}
            </div>
          ) : books.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {books.map((book) => (
                <Card 
                  key={book.id} 
                  onClick={() => router.push(`/books/${book.id}`)}
                  className="h-full rounded-xl border border-red-100 bg-gradient-to-br from-white to-red-50 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 cursor-pointer overflow-hidden hover:border-red-300"
                >
                  <div className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-[3/4] bg-slate-100 transition-transform duration-300 hover:scale-110">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">No cover</div>
                      )}
                    </div>
                    <CardContent className="space-y-2 pt-3 flex-1 flex flex-col">
                      <CardTitle className="line-clamp-2 text-sm font-semibold">{book.title}</CardTitle>
                      <CardDescription className="line-clamp-1 text-xs flex-1">{book.author}</CardDescription>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-red-100">
                        <span className="text-xs">{book.category?.name ?? "General"}</span>
                        <span className="font-bold text-red-700">₹{book.price ?? "--"}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : query ? (
            <div className="rounded-xl border border-border bg-white/90 p-10 text-center text-muted-foreground">
              <p className="text-lg font-semibold">No books found for "{query}".</p>
              <p className="mt-2 text-sm">Try a different search or browse our collection.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-white/90 p-10 text-center text-muted-foreground">
              <p className="text-lg font-semibold">Start searching to discover books</p>
              <p className="mt-2 text-sm">Use the search bar above to find your next favorite read.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
