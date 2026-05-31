"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutGrid } from "lucide-react"

type Category = {
  id: number
  name: string
  image?: string | null
  bookCount?: number
}

const TopCategoriesComp = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <LayoutGrid className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-bold tracking-widest uppercase text-neutral-500">
              Browse
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Categories
          </h2>
        </div>
        <button
          onClick={() => router.push("/books")}
          className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4"
        >
          View all
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-px bg-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white p-3 space-y-2 flex flex-col items-center">
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? null : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-px bg-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(`/books?category=${cat.id}`)}
              className="group bg-white hover:bg-neutral-50 transition-colors duration-150 p-3 flex flex-col items-center gap-2 text-center"
            >
              {/* Image */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl text-neutral-300">
                    📚
                  </div>
                )}
              </div>

              {/* Name */}
              <p className="text-xs font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors line-clamp-2 leading-tight w-full">
                {cat.name}
              </p>
            </button>
          ))}
        </div>
      )}

    </section>
  )
}

export default TopCategoriesComp