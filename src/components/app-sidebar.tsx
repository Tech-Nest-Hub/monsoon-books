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
    Notebook,
    Gamepad2,
    ChevronDown,
    ChevronRight,
    BookMarked,
    PenTool,
    Trophy,
    LayoutGrid,
    Tag,
    TrendingUp,
    Package,
    FolderBookmark,
} from "lucide-react"
import { useState } from "react"

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

// Define types for subitems
interface SubItem {
    title: string
    url: string
    icon?: any
}

interface NavItem {
    title: string
    url?: string
    icon: any
    subItems?: SubItem[]
}

const navItems: NavItem[] = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Books",
        icon: BookOpen,
        subItems: [
            {
                title: "All Books",
                url: "/dashboard/books",
                icon: BookMarked,
            },
            {
                title: "Add New Book",
                url: "/dashboard/books/new",
                icon: BookOpen,
            },
            {
                title: "Genre",
                url: "/genre",
                icon: FolderBookmark,
            },
            {
                title: "Authors",
                url: "/dashboard/books/authors",
                icon: User,
            },
        ],
    },
    {
        title: "Stationery",
        icon: Notebook,
        subItems: [
            {
                title: "All Stationery",
                url: "/dashboard/stationery",
                icon: Notebook,
            },
            {
                title: "Add Stationery",
                url: "/dashboard/stationery/add",
                icon: PenTool,
            },
            {
                title: "Categories",
                url: "/dashboard/stationery/categories",
                icon: FolderKanban,
            },
        ],
    },
    {
        title: "Sports",
        icon: Gamepad2,
        subItems: [
            {
                title: "All Sports Items",
                url: "/dashboard/sports",
                icon: Gamepad2,
            },
            {
                title: "Add Sports Item",
                url: "/dashboard/sports/add",
                icon: Trophy,
            },
            {
                title: "Categories",
                url: "/dashboard/sports/categories",
                icon: FolderKanban,
            },
        ],
    },
    {
        title: "Categories",
        url: "/dashboard/categories",
        icon: FolderKanban,
    },
    {
        title: "Orders",
        url: "/dashboard/orders",
        icon: Package,
    },
    {
        title: "Sales",
        icon: ShoppingCart,
        subItems: [
            {
                title: "All Sales",
                url: "/sales",
                icon: TrendingUp,
            },
            {
                title: "Reports",
                url: "/sales/reports",
                icon: FolderKanban,
            },
            {
                title: "Discounts",
                url: "/sales/discounts",
                icon: Tag,
            },
        ],
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

// Collapsible Menu Item Component
function CollapsibleMenuItem({ item, collapsed, isMobile, setOpenMobile }: {
    item: NavItem,
    collapsed: boolean,
    isMobile: boolean,
    setOpenMobile: (value: boolean) => void
}) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const hasSubItems = item.subItems && item.subItems.length > 0

    const isActive = (url: string) => {
        if (url === "/") {
            return pathname === url
        }
        return pathname.startsWith(url)
    }

    const isParentActive = () => {
        if (item.url && isActive(item.url)) return true
        if (hasSubItems) {
            return item.subItems?.some(subItem => isActive(subItem.url))
        }
        return false
    }

    const handleToggle = () => {
        if (!collapsed) {
            setIsOpen(!isOpen)
        }
    }

    // For collapsed mode, show tooltip instead of dropdown
    if (collapsed) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                        "h-11 transition-all duration-200",
                        "w-full! justify-center! px-0!",
                        isParentActive() && "bg-primary/10 text-primary"
                    )}
                >
                    <Link
                        href={item.url || "#"}
                        onClick={() => {
                            if (item.url) {
                                setOpenMobile(false)
                            }
                        }}
                        className="flex items-center justify-center w-full"
                    >
                        <item.icon className={cn(
                            "size-8 shrink-0",
                            isParentActive() && "text-primary"
                        )} />
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    // For expanded mode with subitems
    return (
        <SidebarMenuItem>
            {hasSubItems ? (
                <>
                    <SidebarMenuButton
                        onClick={handleToggle}
                        className={cn(
                            "h-11 transition-all duration-200 w-full",
                            isParentActive() && "bg-primary/10 text-primary"
                        )}
                    >
                        <div className="flex items-center gap-3 w-full">
                            <item.icon className={cn(
                                "size-8 shrink-0",
                                isParentActive() && "text-primary"
                            )} />
                            <span className="flex-1 text-left">{item.title}</span>
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </div>
                    </SidebarMenuButton>

                    {/* Subitems */}
                    {isOpen && (
                        <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                            {item.subItems?.map((subItem) => {
                                const active = isActive(subItem.url)
                                return (
                                    <SidebarMenuButton
                                        key={subItem.title}
                                        className={cn(
                                            "h-10 transition-all duration-200",
                                            active && "bg-primary/10 text-primary"
                                        )}
                                    >
                                        <Link
                                            href={subItem.url}
                                            onClick={() => setOpenMobile(false)}
                                            className="flex items-center gap-3"
                                        >
                                            {subItem.icon && (
                                                <subItem.icon className={cn(
                                                    "size-5 shrink-0",
                                                    active && "text-primary"
                                                )} />
                                            )}
                                            <span className="text-sm">{subItem.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                )
                            })}
                        </div>
                    )}
                </>
            ) : (
                <SidebarMenuButton
                    className={cn(
                        "h-11 transition-all duration-200 w-full",
                        isParentActive() && "bg-primary/10 text-primary"
                    )}
                >
                    <Link
                        href={item.url!}
                        onClick={() => setOpenMobile(false)}
                        className="flex items-center gap-3"
                    >
                        <item.icon className={cn(
                            "size-8 shrink-0",
                            isParentActive() && "text-primary"
                        )} />
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            )}
        </SidebarMenuItem>
    )
}

export function AppSidebar() {
    const pathname = usePathname()
    const { state, setOpenMobile, openMobile } = useSidebar()

    const collapsed = state === "collapsed"
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768

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
            {!openMobile && (
                <button
                    onClick={() => setOpenMobile(true)}
                    className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
            )}

            <Sidebar collapsible="icon" className="z-50">
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
                        <SidebarMenu className="space-y-1">
                            {navItems.map((item) => (
                                <CollapsibleMenuItem
                                    key={item.title}
                                    item={item}
                                    collapsed={collapsed}
                                    isMobile={isMobile}
                                    setOpenMobile={setOpenMobile}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                {/* Footer */}
                <SidebarFooter className="border-t pt-4">
                    <SidebarMenu className="space-y-1">
                        {footerItems.map((item) => {
                            const active = pathname.startsWith(item.url)
                            return (
                                <SidebarMenuItem key={item.title}>
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
                                            {!collapsed && <span>{item.title}</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </>
    )
}