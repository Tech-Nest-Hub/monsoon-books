"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Flame, ShoppingCart, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

import { useCart } from "@/contexts/CartContext"
import { useUser } from "@/contexts/UserContext"
import type { Book, Category, BookImage } from "@prisma/client"

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
  const { user } = useUser()
  const { addToCart } = useCart()
  
  const [showMore, setShowMore] = React.useState(false)
  const [isHovering, setIsHovering] = React.useState(false)
  const [addingToCart, setAddingToCart] = React.useState<number | null>(null)
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const displayBooks = books.slice(0, showMore ? 15 : 10)

  React.useEffect(() => {
    if (!carouselApi) return
    
    const updateScrollState = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }
    
    updateScrollState()
    carouselApi.on("select", updateScrollState)
    
    return () => {
      carouselApi.off("select", updateScrollState)
    }
  }, [carouselApi])

  const handleBookClick = (bookId: number) => {
    router.push(`/books/${bookId}`)
  }

  const handleAddToCart = async (e: React.MouseEvent, bookId: number) => {
    e.stopPropagation()
    
    if (!user) {
      router.push('/login')
      return
    }

    setAddingToCart(bookId)
    const success = await addToCart(bookId, 1)
    
    if (success) {
      setTimeout(() => setAddingToCart(null), 1000)
    } else {
      setAddingToCart(null)
    }
  }

  const getDiscountPercentage = (originalPrice: number | null, price: number) => {
    if (!originalPrice || originalPrice <= price) return null
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  // Book Card Component
  const BookCard = ({ book }: { book: BookWithRelations }) => {
    const discount = getDiscountPercentage(book.originalPrice, book.price)
    const isLowStock = book.stock > 0 && book.stock <= 5
    const isOutOfStock = book.stock === 0
    const isAdding = addingToCart === book.id
    
    return (
      <Card
        onClick={() => handleBookClick(book.id)}
        className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-neutral-200 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-xs text-neutral-400">No cover</p>
              </div>
            </div>
          )}

          {/* Hover Overlay with View Details */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-2 rounded-xl text-neutral-900 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1">
              View details <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {discount && (
              <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                -{discount}%
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                Only {book.stock} left
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-neutral-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        <CardContent className="p-3 space-y-2">
          {/* Category */}
          {book.category && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full truncate">
                {book.category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-sm text-neutral-800 line-clamp-2 group-hover:text-red-600 transition-colors">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-neutral-500 line-clamp-1">
            by {book.author}
          </p>

          {/* Price Section */}
          <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-red-600">
                ₹{book.price.toLocaleString()}
              </span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-[10px] text-neutral-400 line-through">
                  ₹{book.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {/* Stock indicator */}
            {!isOutOfStock && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] text-neutral-500">In stock</span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => handleAddToCart(e, book.id)}
            disabled={isOutOfStock || isAdding}
            className={cn(
              "w-full mt-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5",
              isOutOfStock
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : isAdding
                ? "bg-green-600 text-white"
                : "bg-neutral-900 text-white hover:bg-neutral-700 active:scale-95"
            )}
          >
            {isAdding ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </>
            )}
          </button>
        </CardContent>
      </Card>
    )
  }

  // Carousel Navigation Buttons
  const CarouselNavButtons = ({ isHovering }: { isHovering: boolean }) => (
    <>
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
    </>
  )

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-neutral-200 rounded mt-1 animate-pulse" />
          </div>
          <div className="h-9 w-24 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-96 rounded-xl" />
          ))}
        </div>
      </section>
    )
  }

  if (displayBooks.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-red-600" />
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-700">
              Trending
            </p>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Top Trending Books
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Most popular books this week
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMore(!showMore)}
          className="border-red-200 text-red-700 hover:bg-red-50"
        >
          {showMore ? "Show less" : "View all"}
        </Button>
      </div>

      <div 
        className="relative rounded-2xl bg-white p-2 shadow-sm"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Carousel 
          setApi={setCarouselApi}
          opts={{ align: "start", loop: false }}
          className="w-full"
        >
          <CarouselContent>
            {displayBooks.map((book) => (
              <CarouselItem
                key={book.id}
                className="pl-2 md:pl-4 basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <BookCard book={book} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselNavButtons isHovering={isHovering} />
        </Carousel>
      </div>
    </section>
  )
}