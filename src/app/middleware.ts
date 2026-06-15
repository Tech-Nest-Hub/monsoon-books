// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cache for slug to ID mapping
const slugToIdCache = new Map<string, number>();

async function getBookIdFromSlug(slug: string): Promise<number | null> {
  // Check cache
  if (slugToIdCache.has(slug)) {
    return slugToIdCache.get(slug)!;
  }

  try {
    const { prisma } = await import('@/lib/prisma');
    
    // Find book by slug (you'll need to add slug field or derive from title)
    const book = await prisma.book.findFirst({
      where: {
        title: {
          // Convert slug back to title pattern
          equals: slug.replace(/-/g, ' '),
          mode: 'insensitive'
        }
      },
      select: { id: true, title: true }
    });
    
    if (book) {
      slugToIdCache.set(slug, book.id);
      setTimeout(() => slugToIdCache.delete(slug), 3600000);
      return book.id;
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  return null;
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // Match /books/anything-except-numeric
  const booksMatch = url.pathname.match(/^\/books\/([^\/]+)$/);
  
  if (booksMatch && !/^\d+$/.test(booksMatch[1])) {
    const slug = booksMatch[1];
    const bookId = await getBookIdFromSlug(slug);
    
    if (bookId) {
      // Rewrite internally to /books/[id] without changing the URL
      const rewriteUrl = new URL(`/books/${bookId}`, request.url);
      rewriteUrl.search = url.search;
      
      return NextResponse.rewrite(rewriteUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/books/:path*',
};