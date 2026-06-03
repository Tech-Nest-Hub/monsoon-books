import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getUserNotifications, getUnreadCount } from "@/lib/notifications"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
      select: { id: true, role: true }
    })

    if (dbUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const notifications = await getUserNotifications(dbUser.id)
    const unreadCount = await getUnreadCount(dbUser.id)

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
      select: { id: true, role: true }
    })

    if (dbUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { notificationId, markAll } = await req.json()

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId: dbUser.id, isRead: false },
        data: { isRead: true }
      })
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId, userId: dbUser.id },
        data: { isRead: true }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}