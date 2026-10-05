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
  | "bracelet"
  | "dholna"
  | "tika"
  | "nathiya";

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
  isBridal: boolean;
  /** Making charges as a percentage of the gold value. */
  makingChargePercent: number;
  /** Fixed price in rupees (diamond pieces); gold prices come from the day's rate. */
  price: number | null;
  /** Gold purities this piece is offered in (gold only). */
  goldPurities: GoldPurity[];
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
    purity: "IGI Certified",
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
  { slug: "dholna", name: "Dholna", blurb: "The traditional dholna, treasured by every bride" },
  { slug: "tika", name: "Tika", blurb: "Maang tikka to crown the bridal look" },
  { slug: "nathiya", name: "Nathiya", blurb: "Nose rings from delicate to grand bridal nath" },
];

/** Categories highlighted in the Bridal Edit, in display order. */
export const bridalCategories: CategorySlug[] = [
  "necklace", "tika", "nathiya", "jhumka", "mangalsutra", "bangles", "dholna",
];

export const purities = ["24K", "22K", "18K", "14K"] as const;

/** Purities offered for gold pieces; customers pick one on the product page. */
export const goldPurities = ["22K", "18K"] as const;
export type GoldPurity = (typeof goldPurities)[number];

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
