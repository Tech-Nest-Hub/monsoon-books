"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Filter, X, Grid3x3, List, TrendingUp, ChevronDown } from "lucide-react"
import type { Book, Category, BookImage } from "@prisma/client"

type BookWithRelations = Book & {
  category?: Category | null
  images?: BookImage[]
}

type BooksPageProps = {
  initialBooks: BookWithRelations[]
  categories: Category[]
}

export default function BooksPageShowComp({ initialBooks, categories }: BooksPageProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("")
  const [sortBy, setSortBy] = React.useState<"newest" | "price-low" | "price-high" | "title">("newest")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage] = React.useState(20)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  // Filter and sort books
  const filteredBooks = React.useMemo(() => {
    let filtered = [...initialBooks]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(book => book.categoryId === Number(selectedCategory))
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return filtered
  }, [initialBooks, searchTerm, selectedCategory, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, sortBy])

  const getDiscount = (originalPrice: number | null, price: number) => {
    if (!originalPrice || originalPrice <= price) return null
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSortBy("newest")
  }

  const hasActiveFilters = searchTerm || selectedCategory

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold tracking-widest uppercase text-orange-500">
              Book Collection
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
            All Books
          </h1>
          <p className="text-neutral-500 mt-2">
            Discover our collection of {initialBooks.length} books
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
                </button>
              )}
            </div>

            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-lg hover:bg-neutral-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-orange-500 rounded-full" />
              )}
            </button>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-neutral-200 md:hidden space-y-3">
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1 block">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1 block">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg"
                >
                  Close
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 bg-neutral-100 rounded-lg text-neutral-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-200">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-md text-sm">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-md text-sm">
                  Category: {categories.find(c => c.id === Number(selectedCategory))?.name}
                  <button onClick={() => setSelectedCategory("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-neutral-500">
          Showing {paginatedBooks.length} of {filteredBooks.length} books
        </div>

        {/* Books Grid/List */}
        {paginatedBooks.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
            <p className="text-neutral-400">No books found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-orange-500 hover:text-orange-600"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "space-y-3"
          }>
            {paginatedBooks.map((book) => {
              const discount = getDiscount(book.originalPrice, book.price)
              const isOutOfStock = book.stock === 0
              const isLowStock = book.stock > 0 && book.stock <= 5

              if (viewMode === "list") {
                return (
                  <div
                    key={book.id}
                    onClick={() => router.push(`/books/${book.id}`)}
                    className="group cursor-pointer bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-lg transition-all flex gap-4"
                  >
                    <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                      {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl text-neutral-300">
                          📚
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      {book.category && (
                        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                          {book.category.name}
                        </p>
                      )}
                      <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors mt-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-neutral-500">{book.author}</p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-xl font-bold text-neutral-900">
                          NPR {book.price.toLocaleString()}
                        </span>
                        {book.originalPrice && book.originalPrice > book.price && (
                          <span className="text-sm text-neutral-400 line-through">
                            NPR {book.originalPrice.toLocaleString()}
                          </span>
                        )}
                        {discount && (
                          <span className="text-sm font-semibold text-red-500">
                            -{discount}%
                          </span>
                        )}
                      </div>
                      {isLowStock && !isOutOfStock && (
                        <p className="text-xs text-amber-600 mt-1">Only {book.stock} left!</p>
                      )}
                      {isOutOfStock && (
                        <p className="text-xs text-red-600 mt-1">Out of stock</p>
                      )}
                    </div>
                  </div>
                )
              }

              // Grid view
              return (
                <div
                  key={book.id}
                  onClick={() => router.push(`/books/${book.id}`)}
                  className="group cursor-pointer space-y-2"
                >
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
                      <div className="flex h-full items-center justify-center text-3xl text-neutral-300">
                        📚
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {discount && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{discount}%
                        </span>
                      )}
                      {isLowStock && !isOutOfStock && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Only {book.stock} left
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Sold out
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-0.5 px-0.5">
                    {book.category && (
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-500">
                        {book.category.name}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-neutral-800 line-clamp-2 leading-snug">
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
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-neutral-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-orange-500 text-white"
                        : "border border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-neutral-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}