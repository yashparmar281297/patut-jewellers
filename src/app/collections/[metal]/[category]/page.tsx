import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionView from "@/components/CollectionView";
import { categories, getCategory, getMetal, metals } from "@/lib/catalog";

export function generateStaticParams() {
  return metals.flatMap((m) => categories.map((c) => ({ metal: m.slug, category: c.slug })));
}

export async function generateMetadata(props: PageProps<"/collections/[metal]/[category]">): Promise<Metadata> {
  const { metal, category } = await props.params;
  const m = getMetal(metal);
  const c = getCategory(category);
  return m && c ? { title: `${m.name} ${c.name}`, description: `${c.blurb} — ${m.name} ${c.name.toLowerCase()} by Patut Jewellers.` } : {};
}

export default async function CategoryPage(props: PageProps<"/collections/[metal]/[category]">) {
  const { metal, category } = await props.params;
  const m = getMetal(metal);
  const c = getCategory(category);
  if (!m || !c) notFound();
  return <CollectionView metal={m} category={c} />;
}
