import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// In your POST /api/books route.ts
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      author,
      language,
      price,
      originalPrice,
      stock,
      status,
      publisher,
      edition,
      isTrending,
      isFeatured,
      categoryId,
      coverImage,
      images,
    } = body;

    // Basic validation
    if (!title || !description || !author || !price || !categoryId || !coverImage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        description,
        author,
        language: language ?? "Nepali",
        price: parseFloat(price),
        ...(originalPrice && { originalPrice: parseFloat(originalPrice) }),
        stock: parseInt(stock) ?? 0,
        publisher: publisher || null,
        edition: edition || null,
        categoryId: parseInt(categoryId),
        coverImage,
        status: status || "AVAILABLE",
        isTrending: isTrending === true || isTrending === "true",
        isFeatured: isFeatured === true || isFeatured === "true",
        images: {
          create: (images ?? []).map((url: string, i: number) => ({
            url,
            order: i,
          })),
        },
      },
      include: { images: true, category: true },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error("[POST /api/books]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get("q")
    const trending = url.searchParams.get("trending")
    const featured = url.searchParams.get("featured")

    let where: any = {}

    // Search query filter
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" as const } },
        { author: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
      ]
    }

    // Trending filter
    if (trending === "true") {
      where.isTrending = true
    }

    // Featured filter
    if (featured === "true") {
      where.isFeatured = true
    }

    const books = await prisma.book.findMany({
      where,
      include: { category: true, images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(books);
  } catch (error) {
    console.error("[GET /api/books]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}