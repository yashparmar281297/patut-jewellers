import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm, { type ProductFormValues } from "@/components/admin/ProductForm";
import type { GoldPurity } from "@/lib/catalog";
import { getAdminSession } from "@/lib/admin";
import { getGoldRates } from "@/lib/rates";

export default async function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  const { id } = await props.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { supabase } = await getAdminSession();
  const [{ data: p }, initialRates] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    getGoldRates(),
  ]);
  if (!p) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-muted hover:text-gold-deep">← All products</Link>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{p.name}</h1>
      <div className="mt-8">
        <ProductForm
          initialRates={initialRates}
          initial={{
            id: p.id,
            name: p.name,
            slug: p.slug,
            metal: p.metal as ProductFormValues["metal"],
            category: p.category as ProductFormValues["category"],
            purity: p.purity as ProductFormValues["purity"],
            weight: String(p.weight),
            diamondCarat: p.diamond_carat === null ? "" : String(p.diamond_carat),
            makingChargePercent: String(p.making_charge_percent ?? 0),
            goldPurities: p.gold_purities.filter((x): x is GoldPurity => x === "22K" || x === "18K"),
            price: p.price === null ? "" : String(p.price),
            description: p.description,
            images: p.images,
            isNew: p.is_new,
            isBestseller: p.is_bestseller,
            isBridal: p.is_bridal,
            isPublished: p.is_published,
            sortOrder: String(p.sort_order),
          }}
        />
      </div>
    </div>
  );
}
