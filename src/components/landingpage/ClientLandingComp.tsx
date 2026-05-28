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
  const [trendingBooks, setTrendingBooks] = React.useState<BookWithRelations[]>([])
  const [featuredBooks, setFeaturedBooks] = React.useState<BookWithRelations[]>([])
  const [loadingTrending, setLoadingTrending] = React.useState(true)
  const [loadingFeatured, setLoadingFeatured] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let active = true

    const fetchTrendingBooks = async () => {
      try {
        const response = await fetch("/api/books?trending=true")
        if (!response.ok) throw new Error("Unable to fetch trending books")
        const data = await response.json()
        if (active) {
          setTrendingBooks(data || [])
        }
      } catch (err) {
        if (active) {
          setError("Failed to load trending books. Please refresh.")
        }
      } finally {
        if (active) {
          setLoadingTrending(false)
        }
      }
    }

    const fetchFeaturedBooks = async () => {
      try {
        const response = await fetch("/api/books?featured=true")
        if (!response.ok) throw new Error("Unable to fetch featured books")
        const data = await response.json()
        if (active) {
          setFeaturedBooks(data || [])
        }
      } catch (err) {
        if (active) {
          setError("Failed to load featured books. Please refresh.")
        }
      } finally {
        if (active) {
          setLoadingFeatured(false)
        }
      }
    }

    Promise.all([fetchTrendingBooks(), fetchFeaturedBooks()])

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
      <TopTrendingBooks books={trendingBooks} loading={loadingTrending} />
      <FeaturedBooks books={featuredBooks} loading={loadingFeatured} />
    </div>
  )
}