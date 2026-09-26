"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fieldErrorsFrom, withAdmin, type ActionResult } from "@/lib/admin";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/catalog";

const testimonialSchema = z.object({
  id: z.uuid().optional(),
  customerName: z.string().trim().min(1, "Customer name is required").max(80),
  location: z.string().trim().max(80),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(1, "Write the customer's feedback").max(1000),
  photo: z
    .string()
    .regex(/^testimonials\/[a-z0-9-]+\.(webp|jpe?g|png|avif)$/i, "Invalid photo")
    .nullable(),
  isPublished: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});

export type TestimonialInput = z.input<typeof testimonialSchema>;

function refresh() {
  revalidatePath("/", "layout");
}

export async function saveTestimonial(input: TestimonialInput): Promise<ActionResult> {
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const t = parsed.data;
  const row = {
    customer_name: t.customerName,
    location: t.location,
    rating: t.rating,
    message: t.message,
    photo: t.photo,
    is_published: t.isPublished,
    sort_order: t.sortOrder,
  };

  return withAdmin(async (supabase) => {
    let previousPhoto: string | null = null;
    let id = t.id;
    if (id) {
      const { data: existing } = await supabase.from("testimonials").select("photo").eq("id", id).maybeSingle();
      if (!existing) return { ok: false, error: "This testimonial no longer exists." };
      previousPhoto = existing.photo;
      const { error } = await supabase.from("testimonials").update(row).eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data, error } = await supabase.from("testimonials").insert(row).select("id").single();
      if (error) return { ok: false, error: error.message };
      id = data.id;
    }
    if (previousPhoto && previousPhoto !== t.photo) {
      await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([previousPhoto]);
    }
    refresh();
    return { ok: true, id };
  });
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Invalid testimonial." };
  return withAdmin(async (supabase) => {
    const { data, error } = await supabase.from("testimonials").delete().eq("id", id).select("photo").maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (data?.photo) await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([data.photo]);
    refresh();
    return { ok: true };
  });
}

export async function setTestimonialPublished(id: string, isPublished: boolean): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Invalid testimonial." };
  return withAdmin(async (supabase) => {
    const { error } = await supabase.from("testimonials").update({ is_published: isPublished }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  });
}
