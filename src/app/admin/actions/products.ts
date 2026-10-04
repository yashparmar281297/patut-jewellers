"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fieldErrorsFrom, requireAdmin, type ActionResult } from "@/lib/admin";
import { categories, goldPurities, metals, PRODUCT_IMAGE_BUCKET, purities } from "@/lib/catalog";

const productSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, "Name is required").max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens only"),
  metal: z.enum(metals.map((m) => m.slug) as [string, ...string[]]),
  category: z.enum(categories.map((c) => c.slug) as [string, ...string[]]),
  purity: z.enum(purities),
  weight: z.number({ error: "Enter the weight in grams" }).positive("Weight must be more than 0").max(10000),
  goldPurities: z.array(z.enum(goldPurities)).max(2),
  makingChargePercent: z
    .number({ error: "Enter making charges as a percentage" })
    .min(0, "Cannot be negative")
    .max(100, "Cannot be more than 100%"),
  diamondCarat: z.number().positive("Carat must be more than 0").max(1000).nullable(),
  description: z.string().trim().max(2000),
  images: z
    .array(z.string().regex(/^products\/[a-z0-9-]+\.(webp|jpe?g|png|avif)$/i, "Invalid image path"))
    .max(12, "Up to 12 photos per product"),
  isNew: z.boolean(),
  isBestseller: z.boolean(),
  isBridal: z.boolean(),
  isPublished: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
}).refine((p) => p.goldPurities.length > 0, {
  message: "Choose 22K, 18K or both",
  path: ["goldPurities"],
});

export type ProductInput = z.input<typeof productSchema>;

export type SaveResult = ActionResult;

function refreshStorefront() {
  // Every storefront page lists products, so refresh them all.
  revalidatePath("/", "layout");
}

export async function saveProduct(input: ProductInput): Promise<SaveResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  const p = parsed.data;
  const row = {
    name: p.name,
    slug: p.slug,
    metal: p.metal,
    category: p.category,
    // The first offered purity doubles as the main purity shown in listings.
    purity: p.goldPurities[0],
    gold_purities: Array.from(new Set(p.goldPurities)),
    weight: p.weight,
    diamond_carat: p.diamondCarat,
    making_charge_percent: p.makingChargePercent,
    description: p.description,
    images: p.images,
    is_new: p.isNew,
    is_bestseller: p.isBestseller,
    is_bridal: p.isBridal,
    is_published: p.isPublished,
    sort_order: p.sortOrder,
  };

  let previousImages: string[] = [];
  let id = p.id;

  if (id) {
    const { data: existing, error: loadError } = await supabase
      .from("products")
      .select("images")
      .eq("id", id)
      .maybeSingle();
    if (loadError) return { ok: false, error: loadError.message };
    if (!existing) return { ok: false, error: "This product no longer exists." };
    previousImages = existing.images;

    const { error } = await supabase.from("products").update(row).eq("id", id);
    if (error) return saveError(error);
  } else {
    const { data, error } = await supabase.from("products").insert(row).select("id").single();
    if (error) return saveError(error);
    id = data.id;
  }

  // Delete photos that were removed from the product.
  const removed = previousImages.filter((path) => !p.images.includes(path));
  if (removed.length > 0) {
    await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(removed);
  }

  refreshStorefront();
  return { ok: true, id };
}

function saveError(error: { code?: string; message: string }): SaveResult {
  if (error.code === "23505") {
    return {
      ok: false,
      error:
        "A product with this web address already exists (usually the same name). Change the product name or web address, or edit the existing product from Products.",
      fieldErrors: { slug: "Already used by another product — change it, e.g. add -2 at the end" },
    };
  }
  return { ok: false, error: error.message };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Invalid product." };

  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  const { data: deleted, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("images")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };

  if (deleted && deleted.images.length > 0) {
    await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(deleted.images);
  }

  refreshStorefront();
  return { ok: true };
}

export async function setPublished(id: string, isPublished: boolean): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Invalid product." };

  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  const { error } = await supabase.from("products").update({ is_published: isPublished }).eq("id", id);
  if (error) return { ok: false, error: error.message };

  refreshStorefront();
  revalidatePath("/admin", "layout");
  return { ok: true };
}

