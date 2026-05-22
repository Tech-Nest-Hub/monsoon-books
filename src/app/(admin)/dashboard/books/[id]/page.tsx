import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookForm from "../BookForm";

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
     const { id } = await params;
  const [book, categories] = await Promise.all([
    prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: { images: { orderBy: { order: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!book) notFound();

  return <BookForm initialData={book} categories={categories} />;
}