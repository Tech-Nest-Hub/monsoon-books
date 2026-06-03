import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

function generateOrderNumber() {
  const date = new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  const rand = Math.floor(Math.random() * 100000).toString().padStart(5, "0")
  return `ORD-${y}${m}${d}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const body = await req.json()
    const {
      items,           // { bookId, quantity, priceAtBuy }[]
      addressId,       // saved ShippingAddress id
      notes,
      tax = 0,
      shippingCost = 0,
      discount = 0,
    } = body

    if (!items?.length) return NextResponse.json({ error: "No items provided" }, { status: 400 })
    if (!addressId) return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })

    // Fetch address and verify ownership
    const address = await prisma.shippingAddress.findUnique({ where: { id: addressId } })
    if (!address || address.userId !== dbUser.id)
      return NextResponse.json({ error: "Address not found" }, { status: 404 })

    // Verify stock for all items
    for (const item of items) {
      const book = await prisma.book.findUnique({ where: { id: item.bookId } })
      if (!book) return NextResponse.json({ error: `Book ${item.bookId} not found` }, { status: 404 })
      if (book.stock < item.quantity)
        return NextResponse.json({ error: `"${book.title}" only has ${book.stock} in stock` }, { status: 400 })
    }

    const subtotal = items.reduce((s: number, i: any) => s + i.priceAtBuy * i.quantity, 0)
    const total = subtotal + tax + shippingCost - discount

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: dbUser.id,
          status: "PENDING",
          paymentMethod: "CASH_ON_DELIVERY",
          paymentStatus: "PENDING",
          total,
          subtotal,
          tax,
          shippingCost,
          discount,
          deliveryAddress: `${address.street}, ${address.city}, ${address.district}${address.postalCode ? ` - ${address.postalCode}` : ""}`,
          phone: address.phone,
          email: dbUser.email,
          notes: notes || null,
          items: {
            create: items.map((item: any) => ({
              bookId: item.bookId,
              quantity: item.quantity,
              priceAtBuy: item.priceAtBuy,
            })),
          },
        },
        include: {
          items: {
            include: {
              book: { select: { id: true, title: true, coverImage: true } },
            },
          },
        },
      })

      // Decrease stock
      for (const item of items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return newOrder
    })

    // Clear purchased items from cart
    const cart = await prisma.cart.findUnique({ where: { userId: dbUser.id } })
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          bookId: { in: items.map((i: any) => i.bookId) },
        },
      })
    }

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/checkout/cashondelivery]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}