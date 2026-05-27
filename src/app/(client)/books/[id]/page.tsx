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

    // 2. FIX: Fetch similar books in the same category, excluding the current book
    const similarBooks = await prisma.book.findMany({
      where: {
        categoryId: book.categoryId, 
        id: { not: book.id }, // Avoid recommending the same book
      },
      take: 4, // Limits results to fill up your 4-column layout nicely
      include: {
        images: {
          orderBy: { order: "asc" },
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

    return (
      <div>
        <Navbar />
        {/* 4. FIX: Pass the newly fetched similarBooks array here */}
        <BookDetailClient book={book} similarBooks={similarBooks} user={userData} />
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