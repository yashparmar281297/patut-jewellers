export type MetalSlug = "gold" | "diamond";

export type CategorySlug =
  | "ladies-ring"
  | "gents-ring"
  | "necklace"
  | "earring"
  | "jhumka"
  | "bangles"
  | "chain"
  | "mangalsutra"
  | "bracelet";

export interface Metal {
  slug: MetalSlug;
  name: string;
  tagline: string;
  description: string;
  purity: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  metal: MetalSlug;
  category: CategorySlug;
  purity: string;
  weight: number;
  diamondCarat: number | null;
  description: string;
  /** Public image URLs, cover first. */
  images: string[];
  isNew: boolean;
  isBestseller: boolean;
  isPublished: boolean;
}

export const metals: Metal[] = [
  {
    slug: "gold",
    name: "Gold",
    tagline: "Heritage, hand-forged",
    description:
      "BIS hallmarked 22K and 18K gold, shaped by karigars who have carried the craft for generations.",
    purity: "22K · 18K BIS Hallmarked",
  },
  {
    slug: "diamond",
    name: "Diamond",
    tagline: "Light, perfectly held",
    description:
      "Certified natural diamonds set in 18K gold, cut and matched for brilliance that lasts a lifetime.",
    purity: "IGI / GIA Certified",
  },
];

export const categories: Category[] = [
  { slug: "ladies-ring", name: "Ladies Ring", blurb: "Delicate bands to statement solitaires" },
  { slug: "gents-ring", name: "Gents Ring", blurb: "Bold signets with quiet confidence" },
  { slug: "necklace", name: "Necklace", blurb: "Chokers, haars and heirloom sets" },
  { slug: "earring", name: "Earring", blurb: "Studs, drops and everyday sparkle" },
  { slug: "jhumka", name: "Jhumka", blurb: "Temple bells with a graceful sway" },
  { slug: "bangles", name: "Bangles", blurb: "Kadas and bangles for every ritual" },
  { slug: "chain", name: "Chain", blurb: "Rope, box and Cuban links" },
  { slug: "mangalsutra", name: "Mangalsutra", blurb: "Sacred black beads, modern grace" },
  { slug: "bracelet", name: "Bracelet", blurb: "Tennis, charm and cuff bracelets" },
];

export const purities = ["24K", "22K", "18K", "14K"] as const;

export const PRODUCT_IMAGE_BUCKET = "product-images";

export function getMetal(slug: string) {
  return metals.find((m) => m.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Public URL for an object in the site image bucket (products/, offers/, testimonials/). */
export function mediaUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${path}`;
}
