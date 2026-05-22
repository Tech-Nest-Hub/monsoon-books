// components/dashboard-breadcrumb.tsx
"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function DashboardBreadcrumb() {
  const pathname = usePathname()

  // "/dashboard/books/123" → ["dashboard", "books", "123"]
  const segments = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/")
          const isLast = index === segments.length - 1

          // Prettify: "books" → "Books", "123" → "123"
          const label = isNaN(Number(segment))
            ? segment.charAt(0).toUpperCase() + segment.slice(1)
            : `#${segment}`

          return (
            <span key={href} className="flex items-center gap-1.5">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}