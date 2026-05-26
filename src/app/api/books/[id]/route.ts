import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const parsedBookId = Number(id)

    if (Number.isNaN(parsedBookId)) {
      return NextResponse.json(
        { error: "Invalid book ID" },
        { status: 400 }
      )
    }

    const body = await req.json()

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
      categoryId,
      coverImage,
      images,
    } = body

    // Validation
    if (
      price !== undefined &&
      price !== "" &&
      Number.isNaN(parseFloat(price))
    ) {
      return NextResponse.json(
        { error: "Invalid price" },
        { status: 400 }
      )
    }

    if (
      originalPrice !== undefined &&
      originalPrice !== "" &&
      Number.isNaN(parseFloat(originalPrice))
    ) {
      return NextResponse.json(
        { error: "Invalid original price" },
        { status: 400 }
      )
    }

    if (
      stock !== undefined &&
      stock !== "" &&
      Number.isNaN(parseInt(stock))
    ) {
      return NextResponse.json(
        { error: "Invalid stock" },
        { status: 400 }
      )
    }

    if (
      categoryId !== undefined &&
      categoryId !== "" &&
      Number.isNaN(parseInt(categoryId))
    ) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      )
    }

    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return NextResponse.json(
          { error: "Invalid images payload" },
          { status: 400 }
        )
      }

      if (
        images.some(
          (url: unknown) =>
            typeof url !== "string" || !url.trim()
        )
      ) {
        return NextResponse.json(
          { error: "Invalid image URL(s)" },
          { status: 400 }
        )
      }
    }

    try {
      const book = await prisma.book.update({
        where: {
          id: parsedBookId,
        },

        data: {
          ...(title && { title }),

          ...(description && { description }),

          ...(author && { author }),

          ...(language && { language }),

          ...(price !== undefined &&
            price !== "" && {
              price: parseFloat(price),
            }),

          ...(originalPrice !== undefined &&
            originalPrice !== "" && {
              originalPrice: parseFloat(originalPrice),
            }),

          ...(stock !== undefined &&
            stock !== "" && {
              stock: parseInt(stock),
            }),

          ...(publisher !== undefined && {
            publisher: publisher || null,
          }),

          // FIXED EDITION
          ...(edition !== undefined && {
            edition: edition || null,
          }),

          ...(categoryId !== undefined &&
            categoryId !== "" && {
              categoryId: parseInt(categoryId),
            }),

          // FIXED COVER IMAGE
          ...(coverImage !== undefined && {
            coverImage,
          }),

          ...(status && { status }),

          ...(images !== undefined && {
            images: {
              deleteMany: {},
              create: images.map(
                (url: string, i: number) => ({
                  url,
                  order: i,
                })
              ),
            },
          }),
        },

        include: {
          images: true,
          category: true,
        },
      })

      return NextResponse.json(book)
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { error: "Book not found" },
            { status: 404 }
          )
        }

        if (error.code === "P2003") {
          return NextResponse.json(
            { error: "Invalid related record" },
            { status: 400 }
          )
        }
      }

      throw error
    }
  } catch (error: any) {
    console.error("[PATCH /api/books/:id]", error)

    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const parsedBookId = Number(id)

    if (Number.isNaN(parsedBookId)) {
      return NextResponse.json(
        { error: "Invalid book ID" },
        { status: 400 }
      )
    }

    await prisma.book.delete({
      where: {
        id: parsedBookId,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("[DELETE /api/books/:id]", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const bookId = parseInt(id)

    if (Number.isNaN(bookId)) {
      return NextResponse.json(
        { error: "Invalid book ID" },
        { status: 400 }
      )
    }

    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },

      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },

        category: true,
      },
    })

    if (!book) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("[GET /api/books/:id]", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}