import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { signOut } from "@/app/auth/callback/action/auth"


const DashboardPage = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
  })

  return (
    <div>
      <h1>Welcome, {dbUser?.firstName} {dbUser?.lastName}</h1>
      <p>Email: {dbUser?.email}</p>
      <p>Role: {dbUser?.role}</p>

      <form action={signOut}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  )
}

export default DashboardPage;