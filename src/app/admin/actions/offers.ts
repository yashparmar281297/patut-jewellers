"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fieldErrorsFrom, withAdmin, type ActionResult } from "@/lib/admin";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/catalog";

const offerSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(600),
  badge: z.string().trim().max(40),
  image: z
    .string()
    .regex(/^offers\/[a-z0-9-]+\.(webp|jpe?g|png|avif)$/i, "Invalid image")
    .nullable(),
  validUntil: z.iso.date("Choose a valid date").nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});

export type OfferInput = z.input<typeof offerSchema>;

function refresh() {
  revalidatePath("/", "layout");
}

export async function saveOffer(input: OfferInput): Promise<ActionResult> {
  const parsed = offerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const o = parsed.data;
  const row = {
    title: o.title,
    description: o.description,
    badge: o.badge,
    image: o.image,
    valid_until: o.validUntil,
    is_active: o.isActive,
    sort_order: o.sortOrder,
  };

  return withAdmin(async (supabase) => {
    let previousImage: string | null = null;
    let id = o.id;
    if (id) {
      const { data: existing } = await supabase.from("offers").select("image").eq("id", id).maybeSingle();
      if (!existing) return { ok: false, error: "This offer no longer exists." };
      previousImage = existing.image;
      const { error } = await supabase.from("offers").update(row).eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data, error } = await supabase.from("offers").insert(row).select("id").single();
      if (error) return { ok: false, error: error.message };
      id = data.id;
    }
    if (previousImage && previousImage !== o.image) {
      await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([previousImage]);
    }
    refresh();
    return { ok: true, id };
  });
}

export async function deleteOffer(id: string): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Invalid offer." };
  return withAdmin(async (supabase) => {
    const { data, error } = await supabase.from("offers").delete().eq("id", id).select("image").maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (data?.image) await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([data.image]);
    refresh();
    return { ok: true };
  });
}

export async function setOfferActive(id: string, isActive: boolean): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Invalid offer." };
  return withAdmin(async (supabase) => {
    const { error } = await supabase.from("offers").update({ is_active: isActive }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  });
}
