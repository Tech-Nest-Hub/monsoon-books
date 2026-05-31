import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ bookId: string }>
}

// GET /api/reviews/[bookId]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { bookId } = await params
    const id = parseInt(bookId)
    if (isNaN(id)) return NextResponse.json({ error: "Invalid book ID" }, { status: 400 })

    const reviews = await prisma.review.findMany({
      where: { bookId: id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        likes: { select: { isLike: true, userId: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("[GET /api/reviews/:bookId]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/reviews/[bookId] — create or update review
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { bookId } = await params
    const id = parseInt(bookId)
    if (isNaN(id)) return NextResponse.json({ error: "Invalid book ID" }, { status: 400 })

    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const { rating, comment } = await req.json()
    if (!rating || rating < 1 || rating > 5)
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 })

    const review = await prisma.review.upsert({
      where: { userId_bookId: { userId: dbUser.id, bookId: id } },
      update: { rating, comment: comment || null },
      create: { rating, comment: comment || null, userId: dbUser.id, bookId: id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        likes: { select: { isLike: true, userId: true } },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("[POST /api/reviews/:bookId]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/reviews/[bookId] — delete own review
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { bookId } = await params
    const id = parseInt(bookId)

    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    await prisma.review.delete({
      where: { userId_bookId: { userId: dbUser.id, bookId: id } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/reviews/:bookId]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/reviews/[bookId] — like or dislike a review
// body: { reviewId: number, isLike: boolean }
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await params // bookId not needed here but must be awaited

    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const { reviewId, isLike } = await req.json()
    if (typeof reviewId !== "number" || typeof isLike !== "boolean")
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

    // Check existing vote
    const existing = await prisma.reviewLike.findUnique({
      where: { userId_reviewId: { userId: dbUser.id, reviewId } },
    })

    if (existing) {
      if (existing.isLike === isLike) {
        // Same vote — toggle off (remove)
        await prisma.reviewLike.delete({
          where: { userId_reviewId: { userId: dbUser.id, reviewId } },
        })
        return NextResponse.json({ action: "removed" })
      } else {
        // Different vote — switch it
        await prisma.reviewLike.update({
          where: { userId_reviewId: { userId: dbUser.id, reviewId } },
          data: { isLike },
        })
        return NextResponse.json({ action: "switched" })
      }
    }

    // New vote
    await prisma.reviewLike.create({
      data: { userId: dbUser.id, reviewId, isLike },
    })
    return NextResponse.json({ action: "added" })
  } catch (error) {
    console.error("[PATCH /api/reviews/:bookId]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}