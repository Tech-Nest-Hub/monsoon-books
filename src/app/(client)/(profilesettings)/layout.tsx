// app/profile/layout.tsx (with return URL)
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Navbar from "@/components/navcomp/Navbar"
import { ProfileSidebar } from "./ProfileSidebar"
import { Footer } from "@/components/landingpage/Footer"
import { prisma } from "@/lib/prisma"


export const metadata = {
  title: "My Profile - Monsoon Books",
  description: "Manage your account, orders, and preferences",
}

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

 if (!user) {
    redirect("/login?redirect=/profile")
  }

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: {
      authId: user.id,
    },
  })


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 lg:py-10">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <ProfileSidebar />
          
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}