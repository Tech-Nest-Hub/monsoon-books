import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Admin check
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser || dbUser.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q")?.trim() ?? ""          // search query
    const status = searchParams.get("status") ?? ""        // filter by status
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = 20
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (status) where.status = status

    if (q) {
      // Search by order number, customer name, email, or userId
      const userId = parseInt(q)
      where.OR = [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { user: { firstName: { contains: q, mode: "insensitive" } } },
        { user: { lastName: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        ...(isNaN(userId) ? [] : [{ userId }]),
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          items: {
            include: {
              book: { select: { id: true, title: true, coverImage: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("[GET /api/admin/orders]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}