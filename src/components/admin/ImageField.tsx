"use client";

import { useRef, useState } from "react";
import { mediaUrl } from "@/lib/catalog";
import { uploadImage, type UploadFolder } from "@/lib/upload";

interface Props {
  value: string | null;
  onChange: (path: string | null) => void;
  onUploadingChange?: (uploading: boolean) => void;
  folder: UploadFolder;
  label: string;
  hint?: string;
  round?: boolean;
}

/** Single optional photo with upload, replace and remove. */
export default function ImageField({ value, onChange, onUploadingChange, folder, label, hint, round }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ? mediaUrl(value) : null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setError(null);
    setUploading(true);
    onUploadingChange?.(true);
    setPreview(URL.createObjectURL(file));
    try {
      onChange(await uploadImage(file, folder, round ? 600 : 1600));
    } catch (e) {
      setError((e as Error).message || "Upload failed");
      setPreview(value ? mediaUrl(value) : null);
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div>
      <span className="font-caps text-[10px] tracking-[0.25em] text-muted">{label}</span>
      <div className="mt-1.5 flex items-center gap-4">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className={`relative flex shrink-0 items-center justify-center overflow-hidden border-2 border-dashed border-gold/40 bg-cream/50 text-gold transition hover:border-gold ${
            round ? "h-24 w-24 rounded-full" : "aspect-[16/10] w-48 rounded-2xl sm:w-60"
          }`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob previews
            <img src={preview} alt="" className={`h-full w-full object-cover ${uploading ? "opacity-50" : ""}`} />
          ) : (
            <span className="text-3xl">+</span>
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </span>
          )}
        </button>
        <div className="flex flex-col items-start gap-2 text-sm">
          <button type="button" onClick={() => input.current?.click()} className="text-gold-deep underline underline-offset-4">
            {preview ? "Replace photo" : "Upload photo"}
          </button>
          {preview && !uploading && (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setPreview(null);
              }}
              className="text-red-700"
            >
              Remove
            </button>
          )}
          {hint && <span className="text-xs text-muted">{hint}</span>}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
