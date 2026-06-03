import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET /api/admin/customers - Fetch all customers with their orders
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { authId: user.id },
      select: { role: true }
    })

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const statusFilter = searchParams.get("status") || "all"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build where clause
    let whereClause: any = {
      role: "USER" // Only get regular users, not admins
    }
    
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    if (statusFilter !== "all") {
      whereClause.status = statusFilter.toUpperCase()
    }

    // Get total count
    const total = await prisma.user.count({ where: whereClause })

    // Fetch customers with their orders and addresses
    const customers = await prisma.user.findMany({
      where: whereClause,
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: { id: "desc" },
        },
        shippingAddresses: {
          take: 1,
          select: {
            city: true,
            district: true,
            street: true,
          },
        },
      },
      skip,
      take: limit,
    })

    // Format customers data
    const formattedCustomers = customers.map(customer => {
      const totalOrders = customer.orders.length
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)
      const lastOrder = customer.orders[0]
      
      // Calculate completed orders
      const completedOrders = customer.orders.filter(o => o.status === "DELIVERED").length
      const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

      // Handle status - default to "active" if undefined
      let status = "active"
      if (customer.status) {
        status = customer.status.toLowerCase()
      }

      return {
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        avatar: customer.image,
        status: status,
        provider: customer.provider,
        stats: {
          totalOrders,
          totalSpent,
          lastOrderDate: lastOrder?.createdAt || null,
          lastOrderNumber: lastOrder?.orderNumber || null,
          lastOrderStatus: lastOrder?.status || null,
          completionRate: Math.round(completionRate),
        },
        location: customer.shippingAddresses[0] 
          ? `${customer.shippingAddresses[0].city}, ${customer.shippingAddresses[0].district}`
          : "No address",
      }
    })

    return NextResponse.json({
      customers: formattedCustomers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/admin/customers - Update customer status
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { authId: user.id },
      select: { role: true }
    })

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const body = await req.json()
    const { customerId, status } = body

    if (!customerId || !status) {
      return NextResponse.json({ error: "Customer ID and status are required" }, { status: 400 })
    }

    const validStatuses = ["ACTIVE", "INACTIVE", "BANNED"]
    if (!validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: customerId },
      data: { status: status.toUpperCase() as any },
    })

    return NextResponse.json({ 
      success: true, 
      message: `Customer status updated to ${status}`,
      customer: {
        id: updated.id,
        status: updated.status ? updated.status.toLowerCase() : "active",
      }
    })
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}