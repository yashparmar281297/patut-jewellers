"use client";

import { PRODUCT_IMAGE_BUCKET } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/client";

const MAX_EDGE = 2000;
const UPLOADABLE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export type UploadFolder = "products" | "offers" | "testimonials";

/** Downscale to MAX_EDGE and re-encode as WebP so phone photos upload fast. */
async function prepareImage(file: File, maxEdge: number): Promise<{ blob: Blob; ext: string }> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.88));
    if (blob) return { blob, ext: "webp" };
  } catch {
    // Fall through to uploading the original file.
  }
  if (UPLOADABLE_TYPES.includes(file.type)) {
    return { blob: file, ext: file.type.split("/")[1].replace("jpeg", "jpg") };
  }
  throw new Error("This file type is not supported. Use JPG, PNG or WebP.");
}

/** Resizes and uploads one photo; returns its storage path (e.g. "offers/<uuid>.webp"). */
export async function uploadImage(file: File, folder: UploadFolder, maxEdge = MAX_EDGE) {
  const { blob, ext } = await prepareImage(file, maxEdge);
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await createClient()
    .storage.from(PRODUCT_IMAGE_BUCKET)
    .upload(path, blob, { contentType: blob.type || `image/${ext}`, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return path;
}
