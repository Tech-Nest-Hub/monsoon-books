"use client"

import type { BookImage } from "@prisma/client"

interface BookImageThumbnailsProps {
  images: BookImage[]
  selectedIndex: number
  onHover: (index: number) => void
  onSelect: (index: number) => void
}

export function BookImageThumbnails({
  images,
  selectedIndex,
  onHover,
  onSelect,
}: BookImageThumbnailsProps) {
  if (images.length <= 1) return null

  return (
    <div className="flex flex-col gap-2 w-16 shrink-0">
      {images.map((img, idx) => (
        <button
          key={img.id}
          onMouseEnter={() => onHover(idx)}
          onClick={() => onSelect(idx)}
          className={`
            relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-150
            ${selectedIndex === idx
              ? "border-red-600 opacity-100"
              : "border-transparent opacity-55 hover:opacity-100 hover:border-gray-300"
            }
          `}
        >
          <img
            src={img.url}
            alt={`Image ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  )
}