"use client";

import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";
import { ImageIcon, Pencil } from "lucide-react";

interface ImageUploadProps {
  value?: string;           // current image URL (from DB / form state)
  onChange: (url: string) => void;  // called with new Cloudinary URL
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.event !== "success") return;
    const info = result.info as { secure_url: string };
    onChange(info.secure_url);
  };

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{
        multiple: false,
        maxFileSize: 5_000_000,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        folder: "monsoon-books/covers",
        cropping: false,
        showPoweredBy: false,
      }}
      onSuccess={handleSuccess}
    >
      {({ open }) => (
        <button
          type="button"
          disabled={disabled}
          onClick={() => open()}
          className="relative group w-45 h-60 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 flex flex-col items-center justify-center gap-2 transition hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {value ? (
            <>
              {/* Filled state — show uploaded cover */}
              <Image
                src={value}
                alt="Book cover"
                height={400}
                width={300}
                className="object-cover"
              />

              {/* Hover overlay — "Edit your cover" */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-4 gap-1">
                <Pencil className="text-white w-4 h-4" />
                <span className="text-white text-sm font-medium">
                  Edit your cover
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Empty state — "Add a cover" */}
              <ImageIcon className="w-10 h-10 text-neutral-400" strokeWidth={1.5} />
              <span className="text-sm text-neutral-500 font-medium">Add a cover</span>
            </>
          )}
        </button>
      )}
    </CldUploadWidget>
  );
}