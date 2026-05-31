"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@prisma/client";
import ImageUpload from "../file-upload/UploadImage";


interface CategoryFormProps {
  initialData?: Category;
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [name, setName] = useState(initialData?.name ?? "");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Category name is required");

    setLoading(true);
    try {
      const payload = { name: name.trim(), image: image || null };
      const url = isEditing ? `/api/categories/${initialData.id}` : "/api/categories";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      router.push("/dashboard/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto py-10 px-4 space-y-10">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
          {isEditing ? "Edit Category" : "New Category"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {isEditing ? initialData.name : "Add a category"}
        </h1>
      </div>

      {/* Fields */}
      <div className="space-y-6">

        {/* Name */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-neutral-700">
            Category Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            placeholder="e.g. Fiction, Non-Fiction, Children's Books..."
            className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition disabled:opacity-50 disabled:bg-neutral-50"
          />
          <p className="text-xs text-neutral-400">
            Appears in the category dropdown when adding or editing books.
          </p>
        </div>

        {/* Image */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-neutral-700">
            Category Image
          </label>
          <ImageUpload
            value={image}
            onChange={(url) => setImage(url)}
            disabled={loading}
          />
          <p className="text-xs text-neutral-400">
            Optional. Shows on the categories page and browse filters.
          </p>
        </div>

        {/* Preview */}
        {name && (
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
              Preview
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 flex items-center justify-center shrink-0">
                {image ? (
                  <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg">📚</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{name}</p>
                <p className="text-xs text-neutral-400">Category</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? isEditing ? "Saving..." : "Adding..."
            : isEditing ? "Save changes" : "Add category"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-2.5 bg-white text-neutral-700 text-sm font-semibold rounded-lg border border-neutral-200 hover:bg-neutral-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}