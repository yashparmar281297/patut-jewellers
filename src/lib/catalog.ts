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
  slug: string;
  name: string;
  metal: MetalSlug;
  category: CategorySlug;
  purity: string;
  weight: number;
  diamondCarat?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  description: string;
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

const goldNames: Record<CategorySlug, string[]> = {
  "ladies-ring": ["Aarohi Floral Band", "Meera Twist Ring", "Kesar Petal Ring", "Sanvi Filigree Ring"],
  "gents-ring": ["Rajvansh Signet", "Veer Textured Band", "Samrat Classic Ring", "Arjun Matte Band"],
  necklace: ["Rani Haar", "Padmini Choker", "Nakshi Temple Set", "Kundan Layered Necklace"],
  earring: ["Chandra Drops", "Tara Studs", "Leela Chandbali", "Noor Hoops"],
  jhumka: ["Mayur Jhumka", "Ghungroo Jhumka", "Shringar Temple Jhumka", "Kamal Jhumka"],
  bangles: ["Rajwadi Kada", "Laxmi Bangle Pair", "Nakashi Bangles", "Antique Pola Kada"],
  chain: ["Rope Chain", "Hollow Box Chain", "Singapore Chain", "Cuban Link Chain"],
  mangalsutra: ["Saubhagya Mangalsutra", "Vati Mangalsutra", "Nitya Short Mangalsutra", "Parampara Long Mangalsutra"],
  bracelet: ["Kadli Bracelet", "Mesh Bracelet", "Charm Bracelet", "Nazariya Bracelet"],
};

const diamondNames: Record<CategorySlug, string[]> = {
  "ladies-ring": ["Solitaire Eternity", "Halo Promise Ring", "Pavé Crown Ring", "Marquise Bloom Ring"],
  "gents-ring": ["Onyx Diamond Signet", "Channel-Set Band", "Prince Solitaire", "Baguette Row Ring"],
  necklace: ["Rivière Necklace", "Celestial Pendant Set", "Floral Diamond Choker", "Bridal Diamond Haar"],
  earring: ["Solitaire Studs", "Cluster Drops", "Halo Studs", "Diamond Ear Cuffs"],
  jhumka: ["Polki Diamond Jhumka", "Chandelier Jhumka", "Pavé Bell Jhumka", "Uncut Diamond Jhumka"],
  bangles: ["Eternity Bangle", "Diamond Kada", "Twisted Pavé Bangle", "Bridal Diamond Bangles"],
  chain: ["Diamond Station Chain", "Pavé Link Chain", "Solitaire Drop Chain", "Diamond Box Chain"],
  mangalsutra: ["Solitaire Mangalsutra", "Diamond Vati Mangalsutra", "Infinity Mangalsutra", "Floral Diamond Mangalsutra"],
  bracelet: ["Tennis Bracelet", "Diamond Bangle Bracelet", "Flexi Pavé Bracelet", "Solitaire Chain Bracelet"],
};

const baseWeight: Record<CategorySlug, number> = {
  "ladies-ring": 3.2,
  "gents-ring": 6.8,
  necklace: 28.5,
  earring: 4.6,
  jhumka: 9.4,
  bangles: 22.0,
  chain: 12.5,
  mangalsutra: 10.8,
  bracelet: 9.6,
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildProducts(): Product[] {
  const products: Product[] = [];
  for (const metal of metals) {
    const names = metal.slug === "gold" ? goldNames : diamondNames;
    for (const category of categories) {
      names[category.slug].forEach((name, index) => {
        const weight = +(baseWeight[category.slug] * (0.8 + index * 0.18)).toFixed(2);
        products.push({
          slug: slugify(`${metal.slug}-${name}`),
          name,
          metal: metal.slug,
          category: category.slug,
          purity: metal.slug === "gold" ? (index % 3 === 2 ? "18K" : "22K") : "18K",
          weight,
          diamondCarat: metal.slug === "diamond" ? +(0.25 + index * 0.22).toFixed(2) : undefined,
          isNew: index === 0,
          isBestseller: index === 1,
          description:
            metal.slug === "gold"
              ? `A ${category.name.toLowerCase()} hand-finished in hallmarked gold, with the warm lustre and fine detailing Patut Jewellers is known for.`
              : `A ${category.name.toLowerCase()} set with certified natural diamonds in 18K gold, crafted to catch light from every angle.`,
        });
      });
    }
  }
  return products;
}

export const products: Product[] = buildProducts();

export function getMetal(slug: string) {
  return metals.find((m) => m.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProducts(metal?: MetalSlug, category?: CategorySlug) {
  return products.filter(
    (p) => (!metal || p.metal === metal) && (!category || p.category === category),
  );
}
