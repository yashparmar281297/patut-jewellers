import "server-only";

import { cache } from "react";
import type { ProductRow } from "@/lib/supabase/database.types";
import { publicClient as supabase } from "@/lib/supabase/public";
import { mediaUrl, type CategorySlug, type MetalSlug, type Product } from "@/lib/catalog";

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
