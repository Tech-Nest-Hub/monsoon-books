import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isInWishlist: false });
    }

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Book ID required" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ isInWishlist: false });
    }

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_bookId: {
          userId: dbUser.id,
          bookId: parseInt(bookId),
        },
      },
    });

    return NextResponse.json({ isInWishlist: !!wishlistItem });
  } catch (error) {
    console.error("[WISHLIST_CHECK]", error);
    return NextResponse.json({ isInWishlist: false });
  }
}