"use client";

import { useEffect, useRef } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";
import { ImageIcon, Pencil, Plus, X } from "lucide-react";

// ─── Single cover upload (for Book.coverImage) ────────────────────────────────

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
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
              <Image src={value} alt="Book cover" fill sizes="100%" className="object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-4 gap-1">
                <Pencil className="text-white w-4 h-4" />
                <span className="text-white text-sm font-medium">Edit your cover</span>
              </div>
            </>
          ) : (
            <>
              <ImageIcon className="w-10 h-10 text-neutral-400" strokeWidth={1.5} />
              <span className="text-sm text-neutral-500 font-medium">Add a cover</span>
            </>
          )}
        </button>
      )}
    </CldUploadWidget>
  );
}

// ─── Multi image upload (for Book.images / BookImage[]) ───────────────────────

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  max?: number;
}

export function MultiImageUpload({
  value = [],
  onChange,
  disabled,
  max = 8,
}: MultiImageUploadProps) {
  // Fix stale closure: keep a ref that always points to latest value.
  // Without this, every onSuccess callback sees the value array from
  // when the widget first opened, so uploading 3 images gives you 3
  // separate arrays of length 1 instead of one array of length 3.
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.event !== "success") return;
    const info = result.info as { secure_url: string };
    const latest = valueRef.current;
    if (latest.includes(info.secure_url)) return;
    onChange([...latest, info.secure_url]);
  };

  const handleRemove = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  const canAddMore = value.length < max;

  return (
    <div className="flex flex-wrap gap-3">

      {/* Existing images */}
      {value.map((url, i) => (
        <div
          key={url}
          className="relative w-30 h-30 rounded-xl overflow-hidden border border-neutral-200 group"
        >
          <Image src={url} alt={`Image ${i + 1}`} fill sizes="100%" className="object-cover" />

          {/* Remove button */}
          <button
            type="button"
            onClick={() => handleRemove(url)}
            disabled={disabled}
            className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center transition opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Index badge */}
          <div className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
            {i + 1}
          </div>
        </div>
      ))}

      {/* Add more button — hidden when max reached */}
      {canAddMore && (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            multiple: true,
            maxFiles: max - value.length,
            maxFileSize: 5_000_000,
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
            folder: "monsoon-books/gallery",
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
              className="w-30 h-30 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center gap-1.5 text-neutral-400 hover:border-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-6 h-6" strokeWidth={1.5} />
              <span className="text-xs font-medium">Add image</span>
              <span className="text-[10px] text-neutral-300">
                {value.length}/{max}
              </span>
            </button>
          )}
        </CldUploadWidget>
      )}

      {/* Max reached message */}
      {!canAddMore && (
        <p className="self-center text-xs text-neutral-400 ml-1">
          Max {max} images reached
        </p>
      )}
    </div>
  );
}