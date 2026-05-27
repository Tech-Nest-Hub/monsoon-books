import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { itemIds } = body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json({ error: "Item IDs required" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete only items that belong to this user
    await prisma.cartItem.deleteMany({
      where: {
        id: { in: itemIds },
        cart: { userId: dbUser.id }
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CLEAR_SELECTED_CART]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}