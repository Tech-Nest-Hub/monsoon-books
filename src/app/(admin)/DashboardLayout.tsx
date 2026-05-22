"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

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
            <div className="flex items-center gap-3 px-4 py-4">
              {!isMobile && <SidebarTrigger />}
              <h1 className="text-xl font-semibold">Dashboard</h1>
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