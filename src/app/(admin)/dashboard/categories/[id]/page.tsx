import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "../CategoryForm";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id) },
  });

  if (!category) notFound();

  return <CategoryForm initialData={category} />;
}