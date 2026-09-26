import Image from "next/image";
import Link from "next/link";
import JewelIcon from "@/components/JewelIcon";
import PublishToggle from "@/components/admin/PublishToggle";
import { getAdminSession } from "@/lib/admin";
import { categories, getCategory, metals, productImageUrl, type CategorySlug, type MetalSlug } from "@/lib/catalog";

const selectClass =
  "rounded-full border border-gold/30 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-gold";

export default async function AdminProductsPage(props: PageProps<"/admin">) {
  const params = await props.searchParams;
  const metal = typeof params.metal === "string" ? params.metal : "";
  const category = typeof params.category === "string" ? params.category : "";
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const photos = typeof params.photos === "string" ? params.photos : "";

  const { supabase } = await getAdminSession();
  let query = supabase
    .from("products")
    .select("id, slug, name, metal, category, purity, weight, images, is_published, is_new, is_bestseller, updated_at")
    .order("updated_at", { ascending: false });
  if (metals.some((m) => m.slug === metal)) query = query.eq("metal", metal);
  if (categories.some((c) => c.slug === category)) query = query.eq("category", category);
  if (q) query = query.ilike("name", `%${q.replace(/[%_\\]/g, "\\$&")}%`);
  if (photos === "missing") query = query.filter("images", "eq", "{}");

  const { data: products, error } = await query;
  const filtered = Boolean(metal || category || q || photos);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink sm:text-5xl">Products</h1>
          <p className="mt-1 text-sm text-muted">
            {products?.length ?? 0} {filtered ? "matching" : "in the catalogue"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-gold rounded-full px-6 py-3 font-caps text-xs tracking-[0.2em] text-noir shadow-[0_10px_30px_-12px_rgba(184,137,59,0.8)]"
        >
          + Add product
        </Link>
      </div>

      <form className="mt-8 flex flex-wrap gap-3" action="/admin">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name…"
          className={`${selectClass} min-w-56 flex-1`}
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
        <button type="submit" className="rounded-full bg-noir px-6 py-2.5 text-sm text-ivory">Filter</button>
        {filtered && (
          <Link href="/admin" className="self-center text-sm text-gold-deep underline underline-offset-4">Clear</Link>
        )}
      </form>

      {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error.message}</p>}

      <ul className="mt-6 divide-y divide-gold/15 overflow-hidden rounded-2xl border border-gold/20 bg-white">
        {products?.map((p) => {
          const cover = p.images[0];
          return (
            <li key={p.id} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-cream/40 sm:px-5">
              <Link href={`/admin/products/${p.id}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                {cover ? (
                  <Image src={productImageUrl(cover)} alt="" fill sizes="64px" className="object-cover" />
                ) : (
                  <JewelIcon
                    category={p.category as CategorySlug}
                    metal={p.metal as MetalSlug}
                    className="absolute inset-0 m-auto h-11 w-11 text-gold/70"
                  />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/products/${p.id}`} className="font-display text-xl text-ink hover:text-gold-deep">
                  {p.name}
                </Link>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {p.metal === "gold" ? "Gold" : "Diamond"} · {getCategory(p.category)?.name} · {p.purity} · {Number(p.weight)} g
                  {" · "}
                  <span className={p.images.length ? "" : "text-amber-700"}>
                    {p.images.length ? `${p.images.length} photo${p.images.length > 1 ? "s" : ""}` : "No photos"}
                  </span>
                </p>
              </div>
              <div className="hidden gap-1.5 md:flex">
                {p.is_new && <span className="rounded-full bg-noir px-2.5 py-1 text-[10px] text-gold-light">New</span>}
                {p.is_bestseller && <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] text-gold-deep">Bestseller</span>}
              </div>
              <PublishToggle id={p.id} published={p.is_published} />
              <Link
                href={`/admin/products/${p.id}`}
                className="hidden rounded-full border border-gold/40 px-4 py-1.5 text-xs text-gold-deep hover:bg-gold hover:text-ivory sm:inline"
              >
                Edit
              </Link>
            </li>
          );
        })}
        {products?.length === 0 && (
          <li className="px-6 py-16 text-center text-muted">
            {filtered ? "No products match these filters." : "No products yet — add your first piece."}
          </li>
        )}
      </ul>
    </div>
  );
}
