import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const addresses = await prisma.shippingAddress.findMany({
      where: { userId: dbUser.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error("[GET /api/user/addresses]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const body = await req.json()
    const { fullName, phone, street, city, district, postalCode, label, isDefault } = body

    if (!fullName?.trim() || !phone?.trim() || !street?.trim() || !city?.trim() || !district?.trim()) {
      return NextResponse.json({ error: "Full name, phone, street, city, and district are required" }, { status: 400 })
    }

    // If setting as default, unset all others first
    if (isDefault) {
      await prisma.shippingAddress.updateMany({
        where: { userId: dbUser.id },
        data: { isDefault: false },
      })
    }

    // If this is the first address, auto-set as default
    const count = await prisma.shippingAddress.count({ where: { userId: dbUser.id } })
    const shouldBeDefault = isDefault || count === 0

    const address = await prisma.shippingAddress.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        district: district.trim(),
        postalCode: postalCode?.trim() || null,
        label: label || "HOME",
        isDefault: shouldBeDefault,
        userId: dbUser.id,
      },
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    console.error("[POST /api/user/addresses]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}