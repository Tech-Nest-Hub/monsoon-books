import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const categories = await prisma.category.findMany();
    return new Response(JSON.stringify(categories), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}