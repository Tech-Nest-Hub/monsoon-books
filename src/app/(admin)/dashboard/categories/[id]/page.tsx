"use client";
import { Book, Category } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type BookWithCategory = Book & { category: Category };

const EditBookPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<BookWithCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
     fetch(`/api/books/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.json();
      })
       .then((data: BookWithCategory) => {
      setBook(data);
    })
      .catch((err) => {
        console.error(err);
        setError("Unable to load book.");
      });
  }, [params.id]);

  const handleSave = async () => {
    alert("Save is frontend-only for now.");
    router.back();
  };

  if (error)
    return (
      <div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded"
        >
          Go back
        </button>
      </div>
    );

  if (!book) return <p>Loading...</p>;

  return (
    <div className="text-black bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 mb-1"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Edit Book</h1>
        </div>
        <button
          onClick={() => {
            if (confirm("Delete this book?")) {
              alert("Delete is frontend-only for now.");
              router.back();
            }
          }}
          className="px-4 py-2 rounded-lg text-sm border"
        >
          Delete
        </button>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Book Details</h2>
        <div>
          <label className="text-sm font-medium">Title *</label>
          <input
            className="w-full border rounded-lg px-3 py-2 mt-1 text-sm bg-white text-black"
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Author *</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm bg-white text-black"
              value={book.author}
              onChange={(e) => setBook({ ...book, author: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category *</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm bg-white text-black"
              value={book.category.name}
              onChange={(e) => setBook({ ...book, category: { ...book.category, name: e.target.value } })}
            >
              <option>Fiction</option>
              <option>Non-Fiction</option>
              <option>Science</option>
              <option>History</option>
              <option>Loksewa</option>
              <option>Japanese</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description *</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 mt-1 text-sm bg-white text-black"
            rows={4}
            value={book.description}
            onChange={(e) => setBook({ ...book, description: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookPage;
