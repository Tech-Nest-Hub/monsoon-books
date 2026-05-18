import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const data =  prisma.books.findMany();
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: Request) {
    const data = await request.json();
    const newBook = await prisma.books.create({ data });
    return new Response(JSON.stringify(newBook), {
        headers: {
            "Content-Type": "application/json",
        },
    });
};