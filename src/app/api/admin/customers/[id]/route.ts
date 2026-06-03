import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params
    const customerId = parseInt(id)

    // Fetch customer with orders and address
    const customer = await prisma.user.findUnique({
      where: { id: customerId, role: "USER" },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
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
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const totalOrders = customer.orders.length
    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
    const completedOrders = customer.orders.filter(o => o.status === "DELIVERED").length
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

    // Get recent orders with item count
    const recentOrders = await Promise.all(
      customer.orders.slice(0, 10).map(async (order) => {
        const itemsCount = await prisma.orderItem.count({
          where: { orderId: order.id },
        })
        return {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          itemsCount,
        }
      })
    )

    // Format response
    const formattedCustomer = {
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      avatar: customer.image,
      phone: null, // Add phone to schema if needed
      status: customer.status ? customer.status.toLowerCase() : "active",
      provider: customer.provider,
      location: customer.shippingAddresses[0] 
        ? `${customer.shippingAddresses[0].city}, ${customer.shippingAddresses[0].district}`
        : "No address",
      stats: {
        totalOrders,
        totalSpent,
        averageOrderValue: Math.round(averageOrderValue),
        completionRate: Math.round(completionRate),
        lastOrderDate: customer.orders[0]?.createdAt || null,
      },
      recentOrders,
    }

    return NextResponse.json({ customer: formattedCustomer })
  } catch (error) {
    console.error("Error fetching customer details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}