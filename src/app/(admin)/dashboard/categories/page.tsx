"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Plus, Search, BookOpen } from "lucide-react";
import type { Category } from "@prisma/client";

type CategoryWithCount = Category & { bookCount?: number };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
        else console.error("API error:", data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category? Books in this category must be reassigned first.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message ?? data.error ?? "Could not delete category");
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Categories</h1>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">Admin</p>
          </div>
          <Link
            href="/dashboard/categories/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add category
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
          />
        </div>

        {/* Stats */}
        {!loading && (
          <p className="text-sm text-neutral-400">
            {filtered.length} {filtered.length === 1 ? "category" : "categories"}
            {search ? ` matching "${search}"` : " total"}
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-200 rounded-xl h-24" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-2xl">
              📁
            </div>
            <p className="text-neutral-500 font-medium">
              {categories.length === 0 ? "No categories yet" : `No categories match "${search}"`}
            </p>
            {categories.length === 0 && (
              <Link
                href="/dashboard/categories/new"
                className="text-sm text-neutral-900 underline underline-offset-4"
              >
                Add your first category
              </Link>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((category) => (
              <div
                key={category.id}
                className="group bg-white border border-neutral-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 flex items-center gap-4"
              >
                {/* Image or fallback */}
                <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-6 h-6 text-neutral-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">
                    {category.name}
                  </p>
                  {category.bookCount !== undefined && (
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {category.bookCount} {category.bookCount === 1 ? "book" : "books"}
                    </p>
                  )}
                </div>

                {/* Actions — visible on hover */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Link
                    href={`/dashboard/categories/${category.id}`}
                    className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5 text-neutral-700" />
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                    className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-purple-50 transition disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-primary" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}