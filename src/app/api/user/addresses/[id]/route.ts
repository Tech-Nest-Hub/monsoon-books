import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const addressId = parseInt(id)

    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Make sure address belongs to user
    const existing = await prisma.shippingAddress.findUnique({ where: { id: addressId } })
    if (!existing || existing.userId !== dbUser.id)
      return NextResponse.json({ error: "Not found" }, { status: 404 })

    const body = await req.json()
    const { fullName, phone, street, city, district, postalCode, label, isDefault } = body

    // If setting as default, unset all others first
    if (isDefault) {
      await prisma.shippingAddress.updateMany({
        where: { userId: dbUser.id },
        data: { isDefault: false },
      })
    }

    const updated = await prisma.shippingAddress.update({
      where: { id: addressId },
      data: {
        ...(fullName && { fullName: fullName.trim() }),
        ...(phone && { phone: phone.trim() }),
        ...(street && { street: street.trim() }),
        ...(city && { city: city.trim() }),
        ...(district && { district: district.trim() }),
        ...(postalCode !== undefined && { postalCode: postalCode?.trim() || null }),
        ...(label && { label }),
        ...(isDefault !== undefined && { isDefault }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[PATCH /api/user/addresses/:id]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const addressId = parseInt(id)

    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const existing = await prisma.shippingAddress.findUnique({ where: { id: addressId } })
    if (!existing || existing.userId !== dbUser.id)
      return NextResponse.json({ error: "Not found" }, { status: 404 })

    await prisma.shippingAddress.delete({ where: { id: addressId } })

    // If deleted address was default, promote the most recent one
    if (existing.isDefault) {
      const next = await prisma.shippingAddress.findFirst({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
      })
      if (next) {
        await prisma.shippingAddress.update({
          where: { id: next.id },
          data: { isDefault: true },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/user/addresses/:id]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}