'use client';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface CategoryPageProps {
  id: number;
  name: string;
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<CategoryPageProps[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div>
      {categories.map((cat) => (
        <Link href={`/dashboard/categories/${cat.id}`} key={cat.id}>
            <Card className="mb-4">
              <CardContent>
                <h2>{cat.name}</h2>
              </CardContent>
            </Card>
        </Link>
      ))}
    </div>
  );
};

export default CategoryPage;