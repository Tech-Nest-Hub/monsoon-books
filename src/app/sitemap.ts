import { prisma } from "@/lib/prisma"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await prisma.book.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true },
  })

  const bookUrls = books.map((book) => ({
    url: `https://monsoonbooks.com.np/books/${book.id}`,
    lastModified: book.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  return [
    {
      url: "https://monsoonbooks.com.np",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: ["https://www.monsoonbooks.com.np/Monsoon_Books_Logo_Black_%26_White.jpeg"],
    },
    {
      url: "https://monsoonbooks.com.np/books",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://monsoonbooks.com.np/search",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://monsoonbooks.com.np/contact-us",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...bookUrls,
  ]
}