import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const orderId = parseInt(id)
    if (isNaN(orderId)) return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })

    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                coverImage: true,
                publisher: true,
              },
            },
          },
        },
        payment: true,
      },
    })

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

    // Make sure user can only see their own orders
    if (order.userId !== dbUser.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    return NextResponse.json(order)
  } catch (error) {
    console.error("[GET /api/orders/:id]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}