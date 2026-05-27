"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../file-upload/UploadImage";
import { MultiImageUpload } from "../file-upload/MultipleImageUpload";
import { Book } from "@prisma/client";


// Types matching your Prisma schema
interface BookImage {
  id: number;
  url: string;
  order: number;
}

interface Category {
  id: number;
  name: string;
}


interface BookFormProps {
  initialData?: Book & { images: BookImage[] };
  categories: Category[]; // pass from server component
}

export default function BookForm({ initialData, categories }: BookFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  // Form state — pre-filled if editing
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [author, setAuthor] = useState(initialData?.author ?? "");
  const [language, setLanguage] = useState(initialData?.language ?? "Nepali");
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
  const [stock, setStock] = useState(initialData?.stock?.toString() ?? "0");
  const [publisher, setPublisher] = useState(initialData?.publisher ?? "");
  const [edition, setEdition] = useState(
    initialData?.edition?.toString() ?? ""
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId?.toString() ?? ""
  );
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [images, setImages] = useState<string[]>(
    initialData?.images.map((img) => img.url) ?? []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!coverImage) return setError("Please upload a cover image.");
    if (!categoryId) return setError("Please select a category.");

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        author,
        language,
        price,
        stock,
        originalPrice: price,
        status: "AVAILABLE",
        publisher: publisher || null,
        edition: edition || null,
        categoryId,
        coverImage,
        images,
      };

      const url = isEditing ? `/api/books/${initialData.id}` : "/api/books";
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

      router.push("/dashboard/books");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-7xl mx-auto py-10 px-4 space-y-10">

      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
          {isEditing ? "Edit Book" : "New Book"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {isEditing ? initialData.title : "Add a book"}
        </h1>
      </div>

      {/* Images section */}
      <section className="space-y-4">
        <SectionLabel>Images</SectionLabel>
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="space-y-1.5">
            <FieldLabel>Cover image *</FieldLabel>
            <ImageUpload
              value={coverImage}
              onChange={setCoverImage}
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5 flex-1">
            <FieldLabel>Gallery images</FieldLabel>
            <MultiImageUpload
              value={images}
              onChange={setImages}
              disabled={loading}
              max={8}
            />
            <p className="text-xs text-neutral-400">
              These show as thumbnails on the book page
            </p>
          </div>
        </div>
      </section>

      {/* Basic info */}
      <section className="space-y-4">
        <SectionLabel>Book details</SectionLabel>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Title *">
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              placeholder="e.g. Seto Dharti"
              className={input}
            />
          </Field>

          <Field label="Author *">
            <input
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={loading}
              placeholder="e.g. Amar Neupane"
              className={input}
            />
          </Field>
        </div>

        <Field label="Description *">
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            placeholder="Write a short description of the book..."
            rows={4}
            className={`${input} resize-none`}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Publisher">
            <input
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              disabled={loading}
              placeholder="e.g. Fine Print"
              className={input}
            />
          </Field>

          <Field label="Edition">
            <input
              type="number"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              disabled={loading}
              placeholder="e.g. 2019"
              min={1900}
              max={new Date().getFullYear()}
              className={input}
            />
          </Field>
        </div>
      </section>

      {/* Pricing & stock */}
      <section className="space-y-4">
        <SectionLabel>Pricing & stock</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Price (NPR) *">
            <input
              required
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
              placeholder="e.g. 450"
              min={0}
              className={input}
            />
          </Field>

          <Field label="Stock *">
            <input
              required
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              disabled={loading}
              placeholder="e.g. 50"
              min={0}
              className={input}
            />
          </Field>

          <Field label="Language *">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={loading}
              className={input}
            >
              <option value="Nepali">Nepali</option>
              <option value="English">English</option>
            </select>
          </Field>
        </div>
      </section>

      {/* Category */}
      <section className="space-y-4">
        <SectionLabel>Category</SectionLabel>
        <Field label="Category *">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={loading}
            className={input}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </section>

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
            : isEditing ? "Save changes" : "Add book"}
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

// ─── Small helpers ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2">
      {children}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-neutral-700">{children}</label>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}

const input =
  "w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition disabled:opacity-50 disabled:bg-neutral-50";