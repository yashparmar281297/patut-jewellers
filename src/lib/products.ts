import "server-only";

import { cache } from "react";
import type { ProductRow } from "@/lib/supabase/database.types";
import { publicClient as supabase } from "@/lib/supabase/public";
import {
  categories,
  goldPurities,
  mediaUrl,
  metals,
  type CategorySlug,
  type GoldPurity,
  type MetalSlug,
  type Product,
} from "@/lib/catalog";

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    metal: row.metal as MetalSlug,
    category: row.category as CategorySlug,
    purity: row.purity,
    weight: Number(row.weight),
    diamondCarat: row.diamond_carat === null ? null : Number(row.diamond_carat),
    description: row.description,
    images: row.images.map(mediaUrl),
    isNew: row.is_new,
    isBestseller: row.is_bestseller,
    isPublished: row.is_published,
    isBridal: row.is_bridal,
    makingChargePercent: Number(row.making_charge_percent) || 0,
    goldPurities: row.gold_purities.filter((p): p is GoldPurity => (goldPurities as readonly string[]).includes(p)),
  };
}

export const getProducts = cache(async (metal?: MetalSlug, category?: CategorySlug) => {
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (metal) query = query.eq("metal", metal);
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return data.map(toProduct);
});

export const getProduct = cache(async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw new Error(`Could not load product: ${error.message}`);
  return data ? toProduct(data) : null;
});

/** Newest "New" pieces: two gold and two diamond when available. */
export const getNewArrivals = cache(async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .eq("is_new", true)
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) throw new Error(`Could not load new arrivals: ${error.message}`);

  const items = data.map(toProduct);
  // Prefer pieces that have photos.
  items.sort((a, b) => Number(b.images.length > 0) - Number(a.images.length > 0));
  const gold = items.filter((p) => p.metal === "gold").slice(0, 2);
  const diamond = items.filter((p) => p.metal === "diamond").slice(0, 2);
  const picked = [...gold, ...diamond];
  return picked.length >= 4 ? picked : items.slice(0, 4);
});

export const getProductSlugs = cache(async () => {
  const { data, error } = await supabase.from("products").select("slug").eq("is_published", true);
  if (error) throw new Error(`Could not load product slugs: ${error.message}`);
  return data.map((row) => row.slug);
});

/** Published pieces tagged for the Bridal collection, optionally within one category. */
export const getBridalProducts = cache(async (category?: CategorySlug) => {
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .eq("is_bridal", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw new Error(`Could not load bridal products: ${error.message}`);
  return data.map(toProduct);
});

/**
 * Search published products by name and description, and by category or metal words
 * ("gold jhumka", "tika", "diamond ring").
 */
export const searchProducts = cache(async (rawQuery: string) => {
  // Keep only characters that are safe inside a PostgREST filter.
  const q = rawQuery.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
  if (!q) return [];

  const words = q.split(" ");
  const metal = metals.find((m) => words.includes(m.slug))?.slug;
  const rest = words.filter((w) => w !== metal);
  const text = rest.join(" ");
  const matchedCategories = categories
    .filter((c) => rest.some((w) => w.length > 2 && (c.name.toLowerCase().includes(w) || c.slug.includes(w))))
    .map((c) => c.slug);

  let query = supabase.from("products").select("*").eq("is_published", true).limit(60);
  if (metal) query = query.eq("metal", metal);

  const conditions = [];
  if (text) conditions.push(`name.ilike.%${text}%`, `description.ilike.%${text}%`);
  if (matchedCategories.length) conditions.push(`category.in.(${matchedCategories.join(",")})`);
  if (conditions.length) query = query.or(conditions.join(","));
  else if (!metal) return [];

  const { data, error } = await query.order("sort_order").order("created_at", { ascending: false });
  if (error) throw new Error(`Could not search products: ${error.message}`);
  return data.map(toProduct);
});
