"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { Book, Category } from "@prisma/client";

type BookWithCategory = Book & { category: Category };

export default function AdminBooksPage() {
  const [books, setBooks] = useState<BookWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((data) => {
  if (Array.isArray(data)) setBooks(data);
  else console.error("API error:", data);
})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this book? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  // Derived: unique categories from loaded books
  const categories = Array.from(
    new Map(books.map((b) => [b.category.id, b.category])).values()
  );

  // Filtered books
  const filtered = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || b.category.id.toString() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1>Books</h1>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
              Admin
            </p>
          </div>
          <Link
            href="/dashboard/books/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add book
          </Link>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats row */}
        {!loading && (
          <p className="text-sm text-neutral-400">
            {filtered.length} {filtered.length === 1 ? "book" : "books"}
            {categoryFilter !== "all" || search
              ? ` matching filters`
              : ` total`}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="aspect-3/4 bg-neutral-200 rounded-xl" />
                <div className="h-3 bg-neutral-200 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-2xl">
              📚
            </div>
            <p className="text-neutral-500 font-medium">
              {books.length === 0 ? "No books yet" : "No books match your search"}
            </p>
            {books.length === 0 && (
              <Link
                href="/dashboard/books/new"
                className="text-sm text-neutral-900 underline underline-offset-4"
              >
                Add your first book
              </Link>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((book) => (
              <div key={book.id} className="group flex flex-col gap-2">

                {/* Cover */}
                <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    sizes="100%"
                    className="object-cover transition group-hover:scale-105 duration-300"
                  />

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <Link
                      href={`/dashboard/books/${book.id}`}
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-neutral-100 transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4 text-neutral-700" />
                    </Link>
                    <button
                      onClick={() => handleDelete(book.id)}
                      disabled={deletingId === book.id}
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-red-50 transition disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  {/* Stock badge */}
                  {book.stock === 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Out of stock
                    </div>
                  )}
                  {book.stock > 0 && book.stock <= 5 && (
                    <div className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Only {book.stock} left
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-0.5 px-0.5">
                  <p
                    className="text-sm font-semibold text-neutral-800 leading-tight line-clamp-1"
                    title={book.title}
                  >
                    {book.title}
                  </p>
                  <p className="text-xs text-neutral-400 line-clamp-1">{book.author}</p>
                  <div className="flex items-center justify-between pt-0.5">
                    <p className="text-sm font-bold text-neutral-900">
                      NPR {book.price.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-md">
                      {book.category.name}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}