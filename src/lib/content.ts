import "server-only";

import { cache } from "react";
import { mediaUrl } from "@/lib/catalog";
import type { OfferRow, TestimonialRow } from "@/lib/supabase/database.types";
import { publicClient as supabase } from "@/lib/supabase/public";

export interface Offer {
  id: string;
  title: string;
  description: string;
  badge: string;
  image: string | null;
  validUntil: string | null;
}

export interface Testimonial {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  message: string;
  photo: string | null;
}

function toOffer(row: OfferRow): Offer {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    badge: row.badge,
    image: row.image ? mediaUrl(row.image) : null,
    validUntil: row.valid_until,
  };
}

function toTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    customerName: row.customer_name,
    location: row.location,
    rating: row.rating,
    message: row.message,
    photo: row.photo ? mediaUrl(row.photo) : null,
  };
}

/** Active offers that have not expired. */
export const getOffers = cache(async () => {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("is_active", true)
    .or(`valid_until.is.null,valid_until.gte.${today}`)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load offers: ${error.message}`);
  return data.map(toOffer);
});

export const getTestimonials = cache(async () => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load testimonials: ${error.message}`);
  return data.map(toTestimonial);
});
