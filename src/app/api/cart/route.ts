import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/cart - Get user's cart
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

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: dbUser.id },
      include: {
        items: {
          include: {
            book: true,
          },
          // Remove orderBy since there's no createdAt field
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: dbUser.id },
        include: {
          items: {
            include: {
              book: true,
            },
          },
        },
      });
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0);

    return NextResponse.json({
      id: cart.id,
      items: cart.items,
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error("[CART_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookId, quantity = 1 } = body;

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

    // Get book details
    const book = await prisma.book.findUnique({
      where: { id: parseInt(bookId) },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.stock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: dbUser.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: dbUser.id },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_bookId: {
          cartId: cart.id,
          bookId: parseInt(bookId),
        },
      },
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > book.stock) {
        return NextResponse.json({ error: "Quantity exceeds stock" }, { status: 400 });
      }
      
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { book: true },
      });
    } else {
      // Add new item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          bookId: parseInt(bookId),
          quantity,
          priceAtAdd: book.price,
        },
        include: { book: true },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("[CART_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}