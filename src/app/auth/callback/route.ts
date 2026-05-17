import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Upsert into your Prisma User table
         const dbUser =  await prisma.user.upsert({
          where: { authId: user.id },
          update: {
            email: user.email!,
            // Update name if changed on provider side
            firstName: user.user_metadata?.given_name 
              ?? user.user_metadata?.full_name?.split(" ")[0] 
              ?? "",
            lastName: user.user_metadata?.family_name 
              ?? user.user_metadata?.full_name?.split(" ").slice(1).join(" ") 
              ?? "",
          },
          create: {
            authId: user.id,
            email: user.email!,
            firstName: user.user_metadata?.given_name 
              ?? user.user_metadata?.full_name?.split(" ")[0] 
              ?? "",
            lastName: user.user_metadata?.family_name 
              ?? user.user_metadata?.full_name?.split(" ").slice(1).join(" ") 
              ?? "",
            provider: user.app_metadata?.provider ?? "email",
          },
        })
        if (dbUser?.role === "ADMIN") {
            return NextResponse.redirect(`${origin}/dashboard`)
        } else {
            return NextResponse.redirect(`${origin}/`) // Redirect to homepage or user dashboard
        }
    }
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}