// components/profile/ProfileSidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  User,
  MapPin,
  CreditCard,
  ShoppingBag,
  RefreshCw,
  XCircle,
  Star,
  Heart,
  Settings,
  Package,
} from "lucide-react"

const profileNavItems = [
  {
    title: "Manage My Account",
    icon: Settings,
    items: [
      { title: "My Profile", url: "/profile", icon: User },
      { title: "Address Book", url: "/profile/addresses", icon: MapPin },
      { title: "My Payment Options", url: "/profile/payments", icon: CreditCard },
    ],
  },
  {
    title: "My Orders",
    icon: ShoppingBag,
    items: [
      { title: "My Orders", url: "/profile/orders", icon: Package },
      { title: "My Returns", url: "/profile/returns", icon: RefreshCw },
      { title: "My Cancellations", url: "/profile/cancellations", icon: XCircle },
    ],
  },
  {
    title: "My Reviews",
    icon: Star,
    items: [
      { title: "My Reviews", url: "/profile/reviews", icon: Star },
    ],
  },
  {
    title: "My Wishlist",
    icon: Heart,
    items: [
      { title: "My Wishlist & Followed Stores", url: "/wishlist", icon: Heart },
    ],
  },
]

export function ProfileSidebar() {
  const pathname = usePathname()

  const isActive = (url: string) => {
    return pathname === url || pathname?.startsWith(url + "/")
  }

  return (
    <aside className="w-full md:w-72 lg:w-80 shrink-0">
      <div className="sticky top-20">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-blue-50">
            <h2 className="font-semibold text-gray-900">My Account</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage your profile and orders</p>
          </div>
          
          <nav className="p-4 space-y-5">
            {profileNavItems.map((section) => (
              <div key={section.title} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <section.icon className="h-4 w-4" />
                  <span>{section.title}</span>
                </div>
                <div className="space-y-1 pl-6">
                  {section.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                        isActive(item.url)
                          ? "bg-red-50 text-red-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}