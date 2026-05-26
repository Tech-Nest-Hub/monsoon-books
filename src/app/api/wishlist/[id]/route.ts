import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/wishlist/:id - Remove item from wishlist
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify ownership
    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        id: parseInt(id),
        userId: dbUser.id,
      },
    });

    if (!wishlistItem) {
      return NextResponse.json({ error: "Wishlist item not found" }, { status: 404 });
    }

    await prisma.wishlist.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error("[WISHLIST_ITEM_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}