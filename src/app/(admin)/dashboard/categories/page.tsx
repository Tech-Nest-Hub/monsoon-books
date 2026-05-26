"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search, BookOpen } from "lucide-react";
import type { Category } from "@prisma/client";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
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
    if (!confirm("Delete this category? This will also delete all books in this category. This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered categories
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
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
              Admin
            </p>
          </div>
          <Link
            href="/dashboard/categories/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add category
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            />
          </div>
        </div>

        {/* Stats row */}
        {!loading && (
          <p className="text-sm text-neutral-400">
            {filtered.length} {filtered.length === 1 ? "category" : "categories"}
            {search ? ` matching "${search}"` : " total"}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-200 rounded-xl p-6 space-y-3">
                  <div className="h-5 bg-neutral-300 rounded w-3/4" />
                  <div className="h-3 bg-neutral-300 rounded w-1/2" />
                </div>
              </div>
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
              {categories.length === 0 ? "No categories yet" : "No categories match your search"}
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

        {/* Categories Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((category) => (
              <div
                key={category.id}
                className="group bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Category Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-neutral-600" />
                  </div>

                  {/* Category Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-neutral-900 truncate">
                      {category.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      ID: {category.id}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      href={`/dashboard/categories/${category.id}`}
                      className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4 text-neutral-700" />
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={deletingId === category.id}
                      className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-red-50 transition disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
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