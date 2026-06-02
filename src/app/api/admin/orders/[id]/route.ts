import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET single order detail
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const orderId = parseInt(id)

    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser || dbUser.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        items: {
          include: {
            book: { select: { id: true, title: true, author: true, coverImage: true } },
          },
        },
        payment: true,
      },
    })

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    return NextResponse.json(order)
  } catch (error) {
    console.error("[GET /api/admin/orders/:id]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH — update order status or add tracking number
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const orderId = parseInt(id)

    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser || dbUser.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const { status, trackingNumber, cancelReason } = body

    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
    if (status && !validStatuses.includes(status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status && { status }),
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(status === "SHIPPED" && { shippedAt: new Date() }),
        ...(status === "DELIVERED" && { deliveredAt: new Date() }),
        ...(status === "CANCELLED" && {
          cancelledAt: new Date(),
          cancelReason: cancelReason || null,
        }),
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[PATCH /api/admin/orders/:id]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}