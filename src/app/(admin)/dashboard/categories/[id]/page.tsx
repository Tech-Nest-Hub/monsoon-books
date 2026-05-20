'use client'

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const CategoryDetailPage = () => {
  const params = useParams<{ id: string }>();
  const [category, setCategory] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    fetch(`/api/categories/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setCategory)
      .catch(console.error);
  }, [params.id]);

  return (
    <div>
      <p>ID: {params.id}</p>

      {category ? (
        <h1>{category.name}</h1>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CategoryDetailPage;