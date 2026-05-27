// app/api/orders/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { authId: authUser.id },
      include: {
        cart: {
          include: {
            items: {
              include: {
                book: true,
              },
            },
          },
        },
      },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { 
      items, 
      total, 
      subtotal,
      tax = 0,
      shippingCost = 0,
      discount = 0,
      paymentMethod, 
      deliveryAddress, 
      phone,
      email,
      notes 
    } = await req.json()

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    // Calculate totals if not provided
    const calculatedSubtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const calculatedTotal = calculatedSubtotal + tax + shippingCost - discount

    // Create order with all required fields
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: dbUser.id,
        total: total || calculatedTotal,
        subtotal: subtotal || calculatedSubtotal,
        tax,
        shippingCost,
        discount,
        paymentMethod: paymentMethod.toUpperCase(), // Ensure enum format
        paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PENDING',
        status: 'PENDING',
        deliveryAddress,
        phone,
        email: email || dbUser.email,
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            priceAtBuy: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    })

    // Clear cart after order
    if (dbUser.cart) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: dbUser.cart.id,
        },
      })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}