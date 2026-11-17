"use client"

import React from "react"
import Link from "next/link"

const categories = [
  "Fiction",
  "Non-Fiction",
  "Children's Books",
  "Academic",
  "Nepali Literature",
  "Self-Help",
  "Biography",
  "Comics & Manga",
  "Science & Tech",
  "History & Politics",
]

const BrowseCategories = () => {
  return (
    <aside className="w-full overflow-hidden rounded-xl border border-primary/40 bg-white shadow-sm lg:w-[185px] lg:shrink-0">
      {/* Header */}
      <div className="bg-primary px-4 py-3 text-white">
        <h2 className="text-[11px] font-bold uppercase leading-tight tracking-wider">
          Browse
          <br />
          Categories
        </h2>
      </div>

      {/* Categories */}
      <nav className="py-1">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/category/${encodeURIComponent(
              category.toLowerCase().replace(/\s+/g, "-")
            )}`}
            className="group flex min-h-[32px] items-center justify-between px-3 py-1.5 text-[11px] text-slate-700 transition-colors hover:bg-primary/5 hover:text-primary"
          >
            <span>{category}</span>

            <svg
              className="h-3 w-3 shrink-0 text-primary/70 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 18 6-6-6-6"
              />
            </svg>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default BrowseCategories