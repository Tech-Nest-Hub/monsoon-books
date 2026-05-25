"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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

  const [productLimit, setProductLimit] = React.useState(10)
  const [showMoreTopSelling, setShowMoreTopSelling] = React.useState(false)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)

  const router = useRouter()
  const observerTarget = React.useRef<HTMLDivElement>(null)

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

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          !isLoadingMore &&
          books.length > productLimit
        ) {
          handleLoadMoreProducts()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [productLimit, books.length, loading, isLoadingMore])

  const topSellingBooks = books.slice(
    0,
    showMoreTopSelling ? 15 : 10
  )

  const productBooks = books.slice(0, productLimit)

  const handleLoadMoreProducts = () => {
    setIsLoadingMore(true)

    setTimeout(() => {
      setProductLimit((current) =>
        Math.min(current + 10, books.length)
      )

      setIsLoadingMore(false)
    }, 300)
  }

  const toggleMoreTopSelling = () => {
    setShowMoreTopSelling((current) => !current)
  }

  const handleBookClick = (bookId: number) => {
    router.push(`/books/${bookId}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        {/* HERO CAROUSEL */}
        <section className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 p-3 shadow-lg sm:p-4">
            <CarouselSpacing />
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* TOP TRENDING BOOKS */}
        <section className="mt-12 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-700">
                Trending
              </p>

              <h2 className="text-3xl font-bold">
                Top Trending Books
              </h2>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleMoreTopSelling}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              {showMoreTopSelling ? "Show less" : "More"}
            </Button>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm sm:p-6">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-48 rounded-3xl"
                  />
                ))}
              </div>
            ) : (
              <Carousel key={`carousel-${showMoreTopSelling}`} className="w-full">
                <CarouselContent>
                  {topSellingBooks.length ? (
                    topSellingBooks.map((book) => (
                      <CarouselItem
                        key={book.id}
                        className="basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                      >
                        <div className="pr-2 sm:pr-4">
                          <Card
                            onClick={() =>
                              handleBookClick(book.id)
                            }
                            className="h-full min-h-[16rem] sm:min-h-[18rem] overflow-hidden rounded-lg sm:rounded-xl border border-red-100 bg-gradient-to-br from-white to-red-50 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-red-300 hover:shadow-lg cursor-pointer"
                          >
                            <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                              {book.coverImage ? (
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs sm:text-sm text-muted-foreground">
                                  No cover
                                </div>
                              )}
                            </div>

                            <CardContent className="space-y-1 sm:space-y-2 pt-2 sm:pt-3 px-3 sm:px-4">
                              <CardTitle className="line-clamp-2 text-xs sm:text-sm font-semibold">
                                {book.title}
                              </CardTitle>

                              <CardDescription className="line-clamp-1 text-xs">
                                {book.author}
                              </CardDescription>

                              <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                                <span className="truncate">
                                  {book.category?.name ?? "General"}
                                </span>

                                <span className="font-bold text-red-700 whitespace-nowrap ml-1">
                                  ₹{book.price ?? "--"}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                      No top selling books available yet.
                    </p>
                  )}
                </CarouselContent>

                <CarouselPrevious className="-left-2" />
                <CarouselNext className="-right-2" />
              </Carousel>
            )}
          </div>
        </section>

        {/* FEATURED BOOKS */}
        <section className="mt-12 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-700">
                Our sales
              </p>

              <h2 className="text-3xl font-bold">
                Featured Books & Products
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-56 sm:h-64 rounded-lg sm:rounded-xl"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {productBooks.length ? (
                  productBooks.map((book) => (
                    <Card
                      key={book.id}
                      onClick={() =>
                        handleBookClick(book.id)
                      }
                      className="overflow-hidden rounded-lg sm:rounded-xl border border-red-100 bg-gradient-to-br from-white to-red-50 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-red-300 hover:shadow-lg cursor-pointer"
                    >
                      <div className="flex h-full flex-col overflow-hidden">
                        <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs sm:text-sm text-muted-foreground">
                              No cover
                            </div>
                          )}
                        </div>

                        <CardContent className="flex flex-1 flex-col space-y-1 sm:space-y-2 pt-2 sm:pt-3 px-2 sm:px-4">
                          <CardTitle className="line-clamp-2 text-xs sm:text-sm font-semibold">
                            {book.title}
                          </CardTitle>

                          <CardDescription className="line-clamp-1 flex-1 text-xs">
                            {book.author}
                          </CardDescription>

                          <div className="flex items-center justify-between border-t border-red-100 pt-2 text-xs text-muted-foreground">
                            <span className="truncate">
                              {book.category?.name ?? "General"}
                            </span>

                            <span className="font-bold text-red-700 whitespace-nowrap ml-1">
                              ₹{book.price ?? "--"}
                            </span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
                    No products available right now.
                  </p>
                )}
              </div>

              {/* LOAD MORE */}
              {!loading && books.length > productLimit && (
                <div className="flex justify-center pb-4 pt-8">
                  <button
                    onClick={handleLoadMoreProducts}
                    disabled={isLoadingMore}
                    className="group relative overflow-hidden rounded-lg px-8 py-3 font-semibold text-white transition-all duration-300 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-300 group-hover:from-red-700 group-hover:to-orange-700"></div>

                    <div className="relative flex items-center gap-2">
                      {isLoadingMore ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>

                          Loading...
                        </>
                      ) : (
                        <>
                          Load More Books

                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              )}

              <div ref={observerTarget} className="h-4" />
            </>
          )}
        </section>
      </div>

      <LandingFooterComp />
    </main>
  )
}