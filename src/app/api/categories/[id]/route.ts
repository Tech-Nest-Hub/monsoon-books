import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      return Response.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json(category);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}