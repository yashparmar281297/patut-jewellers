import Image from "next/image";
import Link from "next/link";
import { deleteProduct, setPublished } from "@/app/admin/actions/products";
import DeleteButton from "@/components/admin/DeleteButton";
import PageHeader from "@/components/admin/PageHeader";
import StatusToggle from "@/components/admin/StatusToggle";
import JewelIcon from "@/components/JewelIcon";
import { getAdminSession } from "@/lib/admin";
import { inr } from "@/lib/pricing";
import { categories, getCategory, mediaUrl, metals, type CategorySlug, type MetalSlug } from "@/lib/catalog";

const selectClass =
  "rounded-full border border-gold/30 bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-gold";

export default async function AdminProductsPage(props: PageProps<"/admin/products">) {
  const params = await props.searchParams;
  const metal = typeof params.metal === "string" ? params.metal : "";
  const category = typeof params.category === "string" ? params.category : "";
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const photos = typeof params.photos === "string" ? params.photos : "";

  const { supabase } = await getAdminSession();
  let query = supabase
    .from("products")
    .select("id, slug, name, metal, category, purity, weight, price, images, is_published, is_new, is_bestseller, updated_at")
    .order("updated_at", { ascending: false });
  if (metals.some((m) => m.slug === metal)) query = query.eq("metal", metal);
  if (categories.some((c) => c.slug === category)) query = query.eq("category", category);
  if (q) query = query.ilike("name", `%${q.replace(/[%_\\]/g, "\\$&")}%`);
  if (photos === "missing") query = query.filter("images", "eq", "{}");

  const { data: products, error } = await query;
  const filtered = Boolean(metal || category || q || photos);
  const count = products?.length ?? 0;

  return (
    <div>
      <PageHeader
        section="Catalogue"
        title="All Products"
        subtitle={`${count} product${count === 1 ? "" : "s"} ${filtered ? "matching" : "in the catalogue"}`}
        back={{ href: "/admin", label: "Back to Dashboard" }}
        action={{ href: "/admin/products/new", label: "+ Add New Product" }}
      />

      <form className="flex flex-wrap gap-2 sm:gap-3" action="/admin/products">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name…"
          className={`${selectClass} w-full sm:w-auto sm:min-w-56 sm:flex-1`}
        />
        <select name="metal" defaultValue={metal} className={selectClass}>
          <option value="">All metals</option>
          {metals.map((m) => (
            <option key={m.slug} value={m.slug}>{m.name}</option>
          ))}
        </select>
        <select name="category" defaultValue={category} className={selectClass}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select name="photos" defaultValue={photos} className={selectClass}>
          <option value="">Any photos</option>
          <option value="missing">Missing photos</option>
        </select>
        <button type="submit" className="bg-gold rounded-full px-6 py-2.5 text-sm text-paper">Filter</button>
        {filtered && (
          <Link href="/admin/products" className="self-center text-sm text-gold-deep underline underline-offset-4">
            Clear
          </Link>
        )}
      </form>

      {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error.message}</p>}

      {count === 0 ? (
        <div className="mt-6 rounded-2xl border border-gold/25 bg-paper p-10 text-center text-muted">
          {filtered ? "No products match these filters." : "No products have been added yet."}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gold/25 bg-paper">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-gold/20 bg-cream/60 font-caps text-[10px] tracking-[0.2em] text-muted">
                <th className="px-4 py-3 font-normal">Product</th>
                <th className="px-4 py-3 font-normal">Category</th>
                <th className="px-4 py-3 font-normal">Weight</th>
                <th className="px-4 py-3 font-normal">Website</th>
                <th className="px-4 py-3 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products!.map((p) => {
                const cover = p.images[0];
                return (
                  <tr
                    key={p.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-gold/15 px-4 py-4 last:border-0 md:table-row md:p-0"
                  >
                    <td className="w-full md:w-auto md:px-4 md:py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream"
                        >
                          {cover ? (
                            <Image src={mediaUrl(cover)} alt="" fill sizes="56px" className="object-cover" />
                          ) : (
                            <JewelIcon
                              category={p.category as CategorySlug}
                              metal={p.metal as MetalSlug}
                              className="absolute inset-0 m-auto h-10 w-10 text-gold/70"
                            />
                          )}
                        </Link>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="block truncate font-display text-xl text-ink hover:text-gold-deep"
                          >
                            {p.name}
                          </Link>
                          <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                            <span className={p.images.length ? "" : "text-amber-700"}>
                              {p.images.length ? `${p.images.length} photo${p.images.length > 1 ? "s" : ""}` : "No photos"}
                            </span>
                            {p.is_new && <span className="rounded-full bg-cream px-2 py-0.5 text-gold-deep">New</span>}
                            {p.is_bestseller && (
                              <span className="rounded-full bg-cream px-2 py-0.5 text-gold-deep">Bestseller</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted md:px-4 md:py-3">
                      {p.metal === "gold" ? "Gold" : "Diamond"} · {getCategory(p.category)?.name}
                    </td>
                    <td className="text-muted md:px-4 md:py-3">
                      {p.metal === "diamond"
                        ? `${p.price ? inr.format(Number(p.price)) : "No price set"} · ${Number(p.weight)} g`
                        : `${p.purity} · ${Number(p.weight)} g`}
                    </td>
                    <td className="md:px-4 md:py-3">
                      <StatusToggle id={p.id} value={p.is_published} action={setPublished} />
                    </td>
                    <td className="ml-auto md:px-4 md:py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-gold/40 px-3 text-xs font-medium text-gold-deep transition hover:border-gold hover:bg-gold hover:text-ink"
                        >
                          Edit
                        </Link>
                        <DeleteButton id={p.id} name={p.name} action={deleteProduct} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
