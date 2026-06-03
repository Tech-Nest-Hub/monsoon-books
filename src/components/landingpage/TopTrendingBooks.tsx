"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import type { Book, Category, BookImage } from "@prisma/client"
import { Button } from "../ui/button"

type BookWithRelations = Book & {
  category?: Category | null
  images?: BookImage[]
}

type TopTrendingBooksProps = {
  books: BookWithRelations[]
  loading?: boolean
}

export function TopTrendingBooks({ books, loading = false }: TopTrendingBooksProps) {
  const router = useRouter()
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [isHovering, setIsHovering] = React.useState(false)

  React.useEffect(() => {
    if (!carouselApi) return
    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }
    update()
    carouselApi.on("select", update)
    return () => { carouselApi.off("select", update) }
  }, [carouselApi])

  const getDiscount = (originalPrice: number | null, price: number) => {
    if (!originalPrice || originalPrice <= price) return null
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  if (loading) {
    return (
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-3 w-20 bg-neutral-200 rounded animate-pulse" />
            <div className="h-7 w-52 bg-neutral-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-20 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
          ))}
        </div>
      </section>
    )
  }

  if (books.length === 0) return null

  return (
    <section className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary">
              Trending
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Top Trending Books
          </h2>
        </div>
        <Button
        variant={"outline"}
          onClick={() => router.push("/books")}
        >
          View all
        </Button>
      </div>

      {/* Carousel */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Carousel
          setApi={setCarouselApi}
          opts={{ align: "start", loop: false }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {books.map((book) => {
              const discount = getDiscount(book.originalPrice, book.price)
              const isOutOfStock = book.stock === 0

              return (
                <CarouselItem
                  key={book.id}
                  className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <div
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
                        <div className="flex h-full items-center justify-center text-neutral-300 text-3xl">
                          📚
                        </div>
                      )}

                      {/* Dim overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {discount && (
                          <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -{discount}%
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
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
                      <p className="text-sm font-bold text-neutral-800 line-clamp-2 leading-snug group-hover:text-neutral-600 transition-colors">
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
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>



        {/* Nav arrows — appear on hover */}
       <button
        onClick={() => carouselApi?.scrollPrev()}
        disabled={!canScrollPrev}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2",
          "h-24 md:h-32 w-10 md:w-12",
          "bg-black/50 backdrop-blur-sm",
          "text-white",
          "transition-all duration-300 ease-in-out",
          "flex items-center justify-center",
          "hover:bg-black/80 hover:w-14 md:hover:w-16",
          "disabled:opacity-0 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-white/50",
          "rounded-r-lg",
          "z-10",
          !isHovering && "opacity-0",
          isHovering && "opacity-100"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
      </button>

      <button
        onClick={() => carouselApi?.scrollNext()}
        disabled={!canScrollNext}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2",
          "h-24 md:h-32 w-10 md:w-12",
          "bg-black/50 backdrop-blur-sm",
          "text-white",
          "transition-all duration-300 ease-in-out",
          "flex items-center justify-center",
          "hover:bg-black/80 hover:w-14 md:hover:w-16",
          "disabled:opacity-0 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-white/50",
          "rounded-l-lg",
          "z-10",
          !isHovering && "opacity-0",
          isHovering && "opacity-100"
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
      </button>
      </div>

    </section>
  )
}