// app/books/page.tsx (Server Component)
import { prisma } from "@/lib/prisma"
import BooksPageShowComp from "./BooksPageShowComp"


export default async function BooksPage() {
  const [books, categories] = await Promise.all([
    prisma.book.findMany({
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.category.findMany(),
  ])

  return <BooksPageShowComp initialBooks={books} categories={categories} />
}