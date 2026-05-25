import React from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/app/aayushma/Navbar"
import BookDetailClient from "./BookDetailClient"

export const metadata = {
  title: "Book Details",
  description: "View detailed information about a book",
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookId } = await params

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/books/${bookId}`)
    
    if (!response.ok) {
      return (
        <div>
          <Navbar />
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900">Book not found</h1>
              <p className="mt-2 text-slate-600">This book could not be found.</p>
            </div>
          </div>
        </div>
      )
    }

    const book = await response.json()

    return (
      <div>
        <Navbar />
        <BookDetailClient book={book} />
      </div>
    )
  } catch (error) {
    return (
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Error loading book</h1>
            <p className="mt-2 text-slate-600">Failed to load book details. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }
}
