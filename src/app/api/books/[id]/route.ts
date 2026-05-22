import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Every handler in route.ts needs this:
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // Promise<>
) {
    try {
    const { id } = await params   // await it
    const body = await req.json();
    const {
      title,
      description,
      author,
      language,
      price,
      originalPrice,
      stock,
      publisher,
      edition,
      categoryId,
      coverImage,
      images, // string[] — full replacement
    } = body;

    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(author && { author }),
        ...(language && { language }),
        ...(price && { price: parseFloat(price) }),
        ...(originalPrice && { originalPrice: parseFloat(originalPrice) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(publisher !== undefined && { publisher: publisher || null }),
        ...(edition !== undefined && {
          edition: edition ? parseInt(edition) : null,
        }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(coverImage && { coverImage }),

        // Replace all gallery images on edit
        ...(images && {
          images: {
            deleteMany: {},   // wipe old ones
            create: images.map((url: string, i: number) => ({ url, order: i })),
          },
        }),
      },
      include: { images: true, category: true },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error("[PATCH /api/books/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.book.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/books/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const book = await prisma.book.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } }, category: true },
    });
    if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(book);
  } catch (error) {
    console.error("[GET /api/books/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}