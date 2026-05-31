"use client"

interface BookImageMainProps {
  src: string | null
  alt: string
}

export function BookImageMain({ src, alt }: BookImageMainProps) {
  return (
    <div className="flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain mix-blend-multiply transition-opacity duration-200"
        />
      ) : (
        <p className="text-xs text-gray-300 uppercase tracking-widest">No Image</p>
      )}
    </div>
  )
}