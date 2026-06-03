import { prisma } from "./prisma"

type CreateNotificationData = {
  title: string
  message: string
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "ORDER" | "CUSTOMER" | "PAYMENT"
  userId?: number // if null, sends to all admins
}

export async function createNotification(data: CreateNotificationData) {
  // If no specific user, get all admin users
  if (!data.userId) {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true }
    })
    
    // Create notification for each admin
    const notifications = admins.map(admin => ({
      title: data.title,
      message: data.message,
      type: data.type,
      userId: admin.id,
    }))
    
    return await prisma.notification.createMany({ data: notifications })
  }
  
  // Create notification for specific user
  return await prisma.notification.create({
    data: {
      title: data.title,
      message: data.message,
      type: data.type,
      userId: data.userId,
    }
  })
}

export async function markNotificationAsRead(notificationId: number, userId: number) {
  return await prisma.notification.update({
    where: { id: notificationId, userId },
    data: { isRead: true }
  })
}

export async function markAllNotificationsAsRead(userId: number) {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  })
}

export async function getUserNotifications(userId: number, limit = 20) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function getUnreadCount(userId: number) {
  return await prisma.notification.count({
    where: { userId, isRead: false }
  })
}