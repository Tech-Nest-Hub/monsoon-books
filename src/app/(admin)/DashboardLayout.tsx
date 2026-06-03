"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { DashboardBreadcrumb } from "./DashboardBreadcrumb"
import { Bell, HomeIcon } from "lucide-react"
import Link from "next/link"
import { NotificationBell } from "@/components/manual-ui/NotificationsBell"

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <main className="flex-1 overflow-x-hidden">
          <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-4 justify-between">
              <div className="flex items-center gap-3">
                {!isMobile && <SidebarTrigger />}
                <DashboardBreadcrumb />
              </div>
              <div className="flex items-center gap-3">
                <Link href="/" className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  <HomeIcon className="h-5 w-5" />
                </Link>
               <NotificationBell/>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}