import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import DashboardLayoutClient from "../DashboardLayout"
import { prisma } from "@/lib/prisma"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }


  const dbUser = await prisma.user.findUnique({
    where: {
      authId: user.id,
    },
  })

  if (dbUser?.role !== "ADMIN") {
    redirect("/")
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}