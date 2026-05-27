// app/api/user/profile/route.ts
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
      include: {
        cart: true,
      },
    })

    if (!dbUser) {
      return NextResponse.json({ user: null }, { status: 404 })
    }

    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}