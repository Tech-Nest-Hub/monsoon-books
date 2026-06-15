"use client";

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Book, BookImage, Category } from "@prisma/client"
import { AddWishlistButton } from "@/app/(client)/(profilesettings)/wishlist/AddWishlistButton"
import { Share2 } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { BookImageGallery } from "./BookImageGallery";
import { bookUrl } from "@/lib/slugUrl";


type BookWithRelations = Book & {
  category: Category
  images: BookImage[]
}

type SimilarBook = Book & {
  images?: BookImage[]
}

type BookDetailClientProps = {
  book: BookWithRelations
  similarBooks?: SimilarBook[]
  user?: {
    id?: number
    firstName: string | null
    lastName: string | null
    email: string
  } | null
}

export default function BookDetailClient({ book, similarBooks = [], user }: BookDetailClientProps) {
  const router = useRouter()
const [quantity, setQuantity] = useState(1)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [showShareTooltip, setShowShareTooltip] = useState(false)
  const { addToCart } = useCart()

  const adjustQuantity = (amount: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + amount, book.stock)))
  }

  const handleAddToCart = async () => {
    if (!user) { router.push("/login"); return }
    setIsAddedToCart(true)
    const success = await addToCart(book.id, quantity)
    if (success) setTimeout(() => setIsAddedToCart(false), 2000)
    else setIsAddedToCart(false)
  }

  const handleBuyNow = async () => {
    if (!user) { router.push("/login"); return }
    setIsBuyingNow(true)
    const success = await addToCart(book.id, quantity)
    if (success) router.push("/checkout")
    else setIsBuyingNow(false)
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: book.title, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setShowShareTooltip(true)
      setTimeout(() => setShowShareTooltip(false), 2000)
    }
  }

  const discountPercentage =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : 0

  return (
    <div className="bg-[#F4F5F8] min-h-screen text-gray-900 selection:bg-red-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">

        {/* Breadcrumb + actions */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs tracking-wider uppercase text-gray-400">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium truncate max-w-45 sm:max-w-none">
              {book.title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user?.id && <AddWishlistButton bookId={book.id} userId={user.id} />}
            <div className="relative">
              <button onClick={handleShare} className="hover:text-primary transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
              </button>
              {showShareTooltip && (
                <div className="absolute right-0 top-full mt-2 z-20 px-2 py-1 bg-black text-white text-[10px] rounded shadow-md whitespace-nowrap normal-case">
                  Link copied!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="grid gap-12 lg:grid-cols-12 items-start bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-xs">

          {/* ── Left: image gallery ── */}
          <div className="lg:col-span-6">
            <BookImageGallery
              coverImage={book.coverImage}
              images={book.images}
              title={book.title}
            />
          </div>

          {/* ── Right: info + actions ── */}
          <div className="lg:col-span-6 space-y-6 lg:pl-4">

            {/* Title block */}
            <div className="space-y-1">
              {book.category && (
                <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase block">
                  {book.category.name}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black leading-tight">
                {book.title}
              </h1>
              <p className="text-sm text-gray-600">by {book.author}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 pt-1 flex-wrap">
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-gray-500 line-through text-sm">
                  Rs. {book.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-2xl font-bold text-black">
                Rs. {book.price.toLocaleString()}
              </span>
              {discountPercentage > 0 && (
                <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 tracking-wider rounded-full">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="text-sm">
              {book.stock > 0 ? (
                <span className="text-green-600">✓ In Stock ({book.stock} available)</span>
              ) : (
                <span className="text-red-600">✗ Out of Stock</span>
              )}
            </div>

            {/* Quantity */}
            {book.stock > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs text-gray-500 tracking-wide block">Quantity</label>
                <div className="inline-flex items-center border border-gray-300 rounded-full bg-white px-2">
                  <button
                    onClick={() => adjustQuantity(-1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-light text-lg transition-colors disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-xs font-medium text-black select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => adjustQuantity(1)}
                    disabled={quantity >= book.stock}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-light text-lg transition-colors disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTAs */}
            {book.stock > 0 && (
              <div className="space-y-3 pt-2 max-w-md">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-6 rounded-full text-xs font-medium tracking-wider border border-black bg-white text-black hover:bg-gray-50 transition-all"
                >
                  {isAddedToCart ? "✓ Added to cart" : "Add to cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                  className="w-full py-3 px-6 rounded-full text-xs font-medium tracking-wider bg-primary text-white hover:bg-red-800 transition-all disabled:opacity-50"
                >
                  {isBuyingNow ? "Processing..." : "Buy it now"}
                </button>
              </div>
            )}

            {/* Description */}
            {book.description && (
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-black mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>
            )}

            {/* Meta */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-x-8 gap-y-2 text-xs text-gray-500">
              {book.language && <p>Language: <span className="font-medium text-gray-700">{book.language}</span></p>}
              {book.publisher && <p>Publisher: <span className="font-medium text-gray-700">{book.publisher}</span></p>}
              {book.edition && <p>Edition: <span className="font-medium text-gray-700">{book.edition}</span></p>}
            </div>

            {/* Similar books */}
            {similarBooks.length > 0 && (
              <div className="space-y-4 pt-8 border-t border-gray-100">
                <h2 className="text-base font-bold text-black tracking-tight">You may also like</h2>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {similarBooks.map((simBook) => {
                    const simImage = simBook.images?.[0]?.url || simBook.coverImage || null
                    const simDiscount =
                      simBook.originalPrice && simBook.originalPrice > simBook.price
                        ? Math.round(((simBook.originalPrice - simBook.price) / simBook.originalPrice) * 100)
                        : 0
                    return (
                      <Link
                        href={bookUrl(simBook.title, simBook.id)}
                        key={simBook.id}
                        scroll={true}
                        className="group flex flex-col p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200"
                      >
                        <div className="aspect-[2/3] mb-3 overflow-hidden relative rounded-lg bg-white flex items-center justify-center">
                          {simImage ? (
                            <img
                              src={simImage}
                              alt={simBook.title}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-300 uppercase tracking-widest">No Cover</span>
                          )}
                          {simDiscount > 0 && (
                            <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                              -{simDiscount}%
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-black text-xs line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {simBook.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">by {simBook.author}</p>
                        <div className="pt-1.5 flex items-baseline gap-1.5 text-xs">
                          {simBook.originalPrice && simBook.originalPrice > simBook.price && (
                            <span className="text-gray-400 line-through">Rs.{simBook.originalPrice}</span>
                          )}
                          <span className="font-bold text-black">Rs.{simBook.price}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}