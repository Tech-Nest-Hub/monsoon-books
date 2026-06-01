import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ user: null }, { status: 401 })

    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
      include: { cart: true },
    })

    if (!dbUser) return NextResponse.json({ user: null }, { status: 404 })
    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { firstName, lastName } = body

    if (!firstName?.trim() || !lastName?.trim())
      return NextResponse.json({ error: "First and last name are required" }, { status: 400 })

    const updated = await prisma.user.update({
      where: { authId: user.id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}