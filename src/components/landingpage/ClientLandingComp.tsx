"use client"

import * as React from "react"
import { TopTrendingBooks } from "./TopTrendingBooks"
import { FeaturedBooks } from "./FeaturedBooks"
import type { Book, Category, BookImage } from "@prisma/client"

type BookWithRelations = Book & {
  category?: Category | null
  images?: BookImage[]
}

export function ClientLandingComp() {
  const [books, setBooks] = React.useState<BookWithRelations[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let active = true

    const loadBooks = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/books")

        if (!response.ok) {
          throw new Error("Unable to fetch books")
        }

        const data = await response.json()

        if (active) {
          setBooks(data || [])
          setError(null)
        }
      } catch (err) {
        if (active) {
          setError("Failed to load books. Please refresh.")
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadBooks()

    return () => {
      active = false
    }
  }, [])

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-16">
      <TopTrendingBooks books={books} loading={loading} />
      <FeaturedBooks books={books} loading={loading} />
    </div>
  )
}