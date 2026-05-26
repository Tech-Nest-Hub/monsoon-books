import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/wishlist - Get user's wishlist
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get wishlist with book details
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: dbUser.id },
      include: {
        book: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookId } = body;

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: parseInt(bookId) },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Add to wishlist (using upsert to handle duplicates safely)
    const wishlistItem = await prisma.wishlist.upsert({
      where: {
        userId_bookId: {
          userId: dbUser.id,
          bookId: parseInt(bookId),
        },
      },
      update: {}, // If exists, do nothing
      create: {
        userId: dbUser.id,
        bookId: parseInt(bookId),
      },
      include: {
        book: true,
      },
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove from wishlist
    await prisma.wishlist.deleteMany({
      where: {
        userId: dbUser.id,
        bookId: parseInt(bookId),
      },
    });

    return NextResponse.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}