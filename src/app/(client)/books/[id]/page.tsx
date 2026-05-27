import React from "react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import Navbar from "@/app/aayushma/Navbar"
import BookDetailClient from "./BookDetailClient"

export const metadata = {
  title: "Book Details",
  description: "View detailed information about a book",
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookId } = await params

  try {
    // 1. Fetch the main book details
    const book = await prisma.book.findUnique({
      where: { id: parseInt(bookId) },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    })

    if (!book) {
      return (
        <div>
          <Navbar />
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900">Book not found</h1>
              <p className="mt-2 text-slate-600">This book could not be found.</p>
              <Link href="/" className="mt-4 inline-block text-red-600 hover:text-red-700 underline">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    // 2. Fetch similar books in the same category, excluding the current book
    const similarBooks = await prisma.book.findMany({
      where: {
        categoryId: book.categoryId, 
        id: { not: book.id },
        isActive: true, // Only show active books
      },
      take: 4,
      include: {
        images: {
          orderBy: { order: "asc" },
          take: 1, // Only get the first image for similar books
        },
      },
    })

    // 3. Get user data if logged in
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    let userData = null
    if (authUser) {
      userData = await prisma.user.findUnique({
        where: { authId: authUser.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      })
    }

    // Convert Decimal to number if needed (Prisma returns Decimal for Float)
    const serializedBook = {
      ...book,
      price: Number(book.price),
      originalPrice: book.originalPrice ? Number(book.originalPrice) : null,
    }

    const serializedSimilarBooks = similarBooks.map(book => ({
      ...book,
      price: Number(book.price),
      originalPrice: book.originalPrice ? Number(book.originalPrice) : null,
    }))

    return (
      <div>
        <Navbar />
        <BookDetailClient 
          book={serializedBook} 
          similarBooks={serializedSimilarBooks} 
          user={userData} 
        />
      </div>
    )
  } catch (error) {
    console.error("Error loading book:", error)
    return (
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Error loading book</h1>
            <p className="mt-2 text-slate-600">Failed to load book details. Please try again later.</p>
            <Link href="/" className="mt-4 inline-block text-red-600 hover:text-red-700 underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }
}