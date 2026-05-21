"use client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  pages: number;
  price: number;
  originalPrice: number;
  status: "active" | "draft";
  description: string;
  image?: string;
  createdAt: string;
}

const BooksPage = () => {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "draft">("all");
  const [query, setQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;
    if (showAdd) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showAdd]);

  const fetchBooks = () => {
    fetch("/api/books")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch books");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Books response not array", data);
          setBooks([]);
        } else {
          setBooks(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setBooks([]);
      });
  };

  const activeCount = books.filter((b) => b.status === "active").length;
  const draftCount = books.filter((b) => b.status === "draft").length;
  const statusFiltered = books.filter((b) =>
    activeTab === "all" ? true : b.status === activeTab,
  );
  const filtered = statusFiltered
    .filter((b) =>
      categoryFilter === "all" ? true : b.category === categoryFilter,
    )
    .filter((b) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Books</h1>
          <p className="text-muted-foreground">Manage your book catalogue</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search title, author, category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm w-72 ml-8"
          />
          <button
            onClick={() => setShowAdd(true)}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-3xl font-semibold">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Drafts</p>
            <p className="text-3xl font-semibold">{draftCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-4">
        {(["all", "active", "draft"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm capitalize border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-black font-medium text-black"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {tab}{" "}
            {tab !== "all" && (
              <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">
                {books.filter((b) => b.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Genre filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          "all",
          "Fiction",
          "Non-Fiction",
          "Adventure",
          "City Tour",
          "Historical",
          "Romance",
          "Loksewa",
          "Japanese",
        ].map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              categoryFilter === category
                ? "bg-black text-white border border-black"
                : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-950 hover:text-white"
            }`}
          >
            {category === "all" ? "All Categories" : category}
          </button>
        ))}
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((book) => (
          <Link href={`/dashboard/categories/${book.id}`} key={book.id}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative h-44 overflow-hidden rounded-t-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${book.image || "https://placehold.co/600x360?text=Book+Cover"})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <button
                  className="absolute top-3 right-3 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer border border-slate-200"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuOpenId(book.id === menuOpenId ? null : book.id);
                  }}
                  type="button"
                >
                  ⋮
                </button>
                {menuOpenId === book.id && (
                  <div className="absolute top-12 right-3 z-30 w-44 rounded-xl bg-white border border-slate-200 shadow-lg py-2 text-sm">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpenId(null);
                        router.push(`/dashboard/categories/${book.id}`);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpenId(null);
                        setBooks((prev) =>
                          prev.filter((item) => item.id !== book.id),
                        );
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-slate-100"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpenId(null);
                        if (
                          typeof navigator !== "undefined" &&
                          navigator.clipboard
                        ) {
                          navigator.clipboard.writeText(
                            window.location.origin +
                              `/dashboard/categories/${book.id}`,
                          );
                        }
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
                <span className="absolute bottom-3 left-3 text-xs bg-black text-white px-2 py-0.5 rounded-full capitalize">
                  {book.status}
                </span>
              </div>
              <CardContent className="pt-3">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-sm">{book.title}</p>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                    {book.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  by {book.author}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {book.description}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-semibold text-sm">Rs.{book.price}</span>
                  <span className="text-xs text-muted-foreground line-through">
                    Rs.{book.originalPrice}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Add modal (in-page) */}
      {showAdd &&
        typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-6">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-4 z-60 mx-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <button
                    onClick={() => setShowAdd(false)}
                    className="text-sm text-slate-500 mr-3"
                  >
                    ← Back
                  </button>
                  <h3 className="text-xl font-bold">Add Book</h3>
                  <p className="text-sm text-slate-500">
                    Add a new book to the catalogue
                  </p>
                </div>
                <button
                  onClick={() => setShowAdd(false)}
                  className="text-sm px-3 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>

              <div className="max-h-[75vh] overflow-y-auto pr-2">
                <AddBookForm
                  onCreated={() => {
                    setShowAdd(false);
                    fetchBooks();
                  }}
                  onCancel={() => setShowAdd(false)}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default BooksPage;

function AddBookForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [pages, setPages] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [status, setStatus] = useState<"active" | "draft">("draft");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title,
      author,
      category,
      pages: typeof pages === "number" ? pages : Number(pages || 0),
      price: typeof price === "number" ? price : Number(price || 0),
      originalPrice:
        typeof originalPrice === "number"
          ? originalPrice
          : Number(originalPrice || 0),
      status,
      description,
      image,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create");
      onCreated();
    } catch (err) {
      console.error(err);
      alert("Failed to create book");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Author *</label>
          <input
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option>Fiction</option>
            <option>Non-Fiction</option>
            <option>Adventure</option>
            <option>City Tour</option>
            <option>Historical</option>
            <option>Romance</option>
            <option>Loksewa</option>
            <option>Japanese</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pages</label>
          <input
            type="number"
            value={pages as any}
            onChange={(e) =>
              setPages(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            value={price as any}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Original Price
          </label>
          <input
            type="number"
            value={originalPrice as any}
            onChange={(e) =>
              setOriginalPrice(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Cover Image URL
        </label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Paste image URL here"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded min-h-[120px]"
          placeholder="Short book description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "active" | "draft")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-slate-900 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Book"}
        </button>
      </div>
    </form>
  );
}
