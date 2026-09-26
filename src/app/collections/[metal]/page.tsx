import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionView from "@/components/CollectionView";
import { getMetal, metals } from "@/lib/catalog";

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
  return <CollectionView metal={found} />;
}
