import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionView from "@/components/CollectionView";
import { getMetal, metals } from "@/lib/catalog";
import { getProducts } from "@/lib/products";

export const revalidate = 300;

export function generateStaticParams() {
  return metals.map((m) => ({ metal: m.slug }));
}

export async function generateMetadata(props: PageProps<"/collections/[metal]">): Promise<Metadata> {
  const { metal } = await props.params;
  const found = getMetal(metal);
  return found ? { title: `${found.name} Jewellery`, description: found.description } : {};
}

export default async function MetalPage(props: PageProps<"/collections/[metal]">) {
  const { metal } = await props.params;
  const found = getMetal(metal);
  if (!found) notFound();
  const products = await getProducts(found.slug);
  return <CollectionView metal={found} products={products} />;
}
