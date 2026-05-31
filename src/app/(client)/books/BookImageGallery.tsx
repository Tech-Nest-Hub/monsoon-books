"use client"

import { useState } from "react"
import type { BookImage } from "@prisma/client"
import { BookImageThumbnails } from "./BooksImageThumbNail"
import { BookImageMain } from "./BooksImageMain"


interface BookImageGalleryProps {
  coverImage: string
  images: BookImage[]
  title: string
}

export function BookImageGallery({ coverImage, images, title }: BookImageGalleryProps) {
  // Build full image list: gallery images sorted, fallback to coverImage
  const allImages: BookImage[] =
    images.length > 0
      ? [...images].sort((a, b) => a.order - b.order)
      : [{ id: 0, url: coverImage, bookId: 0, order: 0 }]

  const [selectedIndex, setSelectedIndex] = useState(0)

  const currentImage = allImages[selectedIndex]?.url ?? coverImage

  return (
    <div className="flex gap-3 lg:sticky lg:top-6">
      {/* Left — thumbnail strip (hidden if only 1 image) */}
      <BookImageThumbnails
        images={allImages}
        selectedIndex={selectedIndex}
        onHover={setSelectedIndex}   // hover changes main image instantly
        onSelect={setSelectedIndex}  // click also selects
      />

      {/* Right — main image */}
      <BookImageMain src={currentImage} alt={title} />
    </div>
  )
}