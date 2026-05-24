"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
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
    <main className="min-h-screen bg-white px-4 pb-16 pt-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {query && (
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-700">Results</p>
            <h1 className="text-4xl font-semibold sm:text-5xl text-red-700">Results for "{query}"</h1>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
              {error}
            </div>
          ) : books.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <Card key={book.id} className="h-full rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <div className="overflow-hidden rounded-xl">
                    <div className="aspect-[4/3] bg-slate-100 transition-transform duration-200 hover:scale-105">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">No cover</div>
                      )}
                    </div>
                  </div>
                  <CardContent className="space-y-3">
                    <div>
                      <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                      <CardDescription className="line-clamp-1 mt-1">{book.author}</CardDescription>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="text-xs">{book.category?.name ?? "General"}</span>
                      <span className="font-semibold">₹{book.price ?? "--"}</span>
                    </div>
                  </CardContent>
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
