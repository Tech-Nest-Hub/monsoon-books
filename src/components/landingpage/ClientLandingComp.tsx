"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { CarouselSpacing } from "@/components/landingpage/CarouselHeroSectionComp"
import { LandingFooterComp } from "@/components/landingpage/LandingFooterComp"

type Book = {
  id: number
  title: string
  author: string
  price?: number
  coverImage?: string
  description?: string
  category?: { name: string } | null
}

export function ClientLandingComp() {
  const [books, setBooks] = React.useState<Book[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [productLimit, setProductLimit] = React.useState(15)
  const [showMoreTopSelling, setShowMoreTopSelling] = React.useState(false)
  const router = useRouter()

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
      } catch (error) {
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

  const topSellingBooks = books.slice(0, showMoreTopSelling ? 15 : 10)
  const productBooks = books.slice(0, productLimit)

  const handleLoadMoreProducts = () => {
    setProductLimit((current) => Math.min(current + 15, books.length))
  }

  const toggleMoreTopSelling = () => {
    setShowMoreTopSelling((current) => !current)
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {/* HERO CAROUSEL */}
        <section className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-700">Book search</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl text-red-700">
              Explore our collection
            </h1>
          </div>

          <div className="rounded-2xl bg-red-50 p-4 shadow-xl sm:p-6">
            <CarouselSpacing />
          </div>
        </section>

        {/* TOP SELLING CAROUSEL */}
        <section className="mt-12 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-700">Top selling</p>
              <h2 className="text-3xl font-semibold">Trending books</h2>
            </div>
            <Button variant="outline" size="sm" onClick={toggleMoreTopSelling}>
              {showMoreTopSelling ? "Show less" : "More carousel"}
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-48 rounded-3xl" />
                ))}
              </div>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {topSellingBooks.length ? (
                    topSellingBooks.map((book) => (
                      <CarouselItem key={book.id} className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                        <div className="pr-4">
                          <Card className="h-full min-h-72 overflow-hidden rounded-xl border border-border bg-slate-50">
                            <div className="aspect-4/3 bg-slate-100">
                              {book.coverImage ? (
                                <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">No cover</div>
                              )}
                            </div>
                            <CardContent className="space-y-3">
                              <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                              <CardDescription className="line-clamp-1">{book.author}</CardDescription>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{book.category?.name ?? "General"}</span>
                                <span className="font-semibold">₹{book.price ?? "--"}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <p className="py-12 text-center text-sm text-muted-foreground">No top selling books available yet.</p>
                  )}
                </CarouselContent>
                <CarouselPrevious className="-left-2" />
                <CarouselNext className="-right-2" />
              </Carousel>
            )}
          </div>
        </section>
        
        

        {/* SALES PRODUCTS SECTION */}
        <section className="mt-12 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-700">Our sales</p>
              <h2 className="text-3xl font-semibold">Top products</h2>
            </div>
            {!loading && books.length > productLimit ? (
              <Button variant="outline" size="sm" onClick={handleLoadMoreProducts}>More</Button>
            ) : null}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productBooks.length ? (
                productBooks.map((book) => (
                  <Card key={book.id} className="rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <div className="overflow-hidden rounded-xl">
                      <div className="aspect-4/3 bg-slate-100 transition-transform duration-200 hover:scale-105">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">No cover</div>
                        )}
                      </div>
                    </div>
                    <CardContent className="space-y-3">
                      <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                      <CardDescription className="line-clamp-1">{book.author}</CardDescription>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="text-xs">{book.category?.name ?? "General"}</span>
                        <span className="font-semibold">₹{book.price ?? "--"}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground col-span-full">No products available right now.</p>
              )}
            </div>
          )}
        </section>
      </div>
      


      <LandingFooterComp />
    </main>
  )
}
