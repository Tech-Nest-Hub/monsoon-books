import { prisma } from "@/lib/prisma";
import BookForm from "../BookForm";


export default async function NewBookPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return <BookForm categories={categories} />;
}