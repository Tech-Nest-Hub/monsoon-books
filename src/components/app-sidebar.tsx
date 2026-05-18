// app-sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BookOpen,
    FolderKanban,
    Hash,
    Home,
    Settings,
    ShoppingCart,
    User,
    Menu,
    X,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navItems = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Books",
        url: "/books",
        icon: BookOpen,
    },
    {
        title: "Categories",
        url: "/categories",
        icon: FolderKanban,
    },
    {
        title: "Tags",
        url: "/tags",
        icon: Hash,
    },
    {
        title: "Sales",
        url: "/sales",
        icon: ShoppingCart,
    },
]

const footerItems = [
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
    {
        title: "Profile",
        url: "/profile",
        icon: User,
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const { state, setOpenMobile, openMobile } = useSidebar()

    const collapsed = state === "collapsed"
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768

    const isActive = (url: string) => {
        if (url === "/") {
            return pathname === url
        }
        return pathname.startsWith(url)
    }

    return (
        <>
            {/* Mobile Overlay */}
            {openMobile && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setOpenMobile(false)}
                />
            )}

            {/* Mobile Trigger Button */}
            <button
                onClick={() => setOpenMobile(true)}
                className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
                aria-label="Open menu"
            >
                <Menu className="h-6 w-6" />
            </button>

            <Sidebar
                collapsible="icon"
                className="z-50"
            >
                {/* Header */}
                <SidebarHeader className="border-b">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
                            B
                        </div>

                        {!collapsed && (
                            <div className="flex flex-col leading-tight">
                                <span className="font-semibold">BookStore</span>
                                <span className="text-xs text-muted-foreground">
                                    Admin Dashboard
                                </span>
                            </div>
                        )}

                        {/* Close button for mobile */}
                        {!collapsed && isMobile && (
                            <button
                                onClick={() => setOpenMobile(false)}
                                className="ml-auto rounded-md p-1 hover:bg-accent md:hidden"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </SidebarHeader>

                {/* Content */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const active = isActive(item.url)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            className={cn(
                                                "h-11 transition-all duration-200",
                                                collapsed && "w-full! justify-center! px-0!", // force full width + center
                                                active && "bg-primary/10 text-primary"
                                            )}
                                        >
                                            <Link
                                                href={item.url}
                                                onClick={() => setOpenMobile(false)}
                                                className={cn(
                                                    "flex items-center gap-3 w-full",
                                                    collapsed && "justify-center" // center icon when collapsed
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "size-8 shrink-0", // larger icon
                                                    active && "text-primary"
                                                )} />
                                                {!collapsed && <span>{item.title}</span>}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                {/* Footer */}
                {footerItems.map((item) => {
                    const active = isActive(item.url)
                    return (
                        <SidebarMenuItem key={item.title} className="">
                            <SidebarMenuButton
                                tooltip={item.title}
                                className={cn(
                                    "h-11 transition-all duration-200",
                                    collapsed && "w-full! justify-center! px-0!",
                                    active && "bg-primary/10 text-primary"
                                )}
                            >
                                <Link
                                    href={item.url}
                                    onClick={() => setOpenMobile(false)}
                                    className={cn(
                                        "flex items-center gap-3 w-full",
                                        collapsed && "justify-center"
                                    )}
                                >
                                    <item.icon className={cn("size-6 shrink-0", active && "text-primary")} />
                                    {!collapsed && <span>{item.title}</span>}  {/* 👈 add this condition */}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </Sidebar>
        </>
    )
}