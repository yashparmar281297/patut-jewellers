import type { Metadata } from "next";
import Link from "next/link";
import JewelIcon from "@/components/JewelIcon";
import ProductCard from "@/components/ProductCard";
import { SearchIcon } from "@/components/SearchOverlay";
import { categories, metals } from "@/lib/catalog";
import { searchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default async function SearchPage(props: PageProps<"/search">) {
  const params = await props.searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const results = q ? await searchProducts(q) : [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <p className="font-caps text-[11px] tracking-[0.35em] text-gold-deep">Search</p>
      <form action="/search" className="mt-4 flex items-center gap-3 border-b-2 border-gold pb-3">
        <SearchIcon className="h-6 w-6 shrink-0 text-gold-deep" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search rings, jhumka, mangalsutra…"
          className="min-w-0 flex-1 bg-transparent font-display text-3xl text-ink outline-none placeholder:text-muted/60 sm:text-4xl"
        />
        <button type="submit" className="bg-gold shrink-0 rounded-full px-5 py-2.5 font-caps text-[11px] tracking-[0.2em] text-paper">
          Search
        </button>
      </form>

      {q && (
        <p className="mt-6 text-sm text-muted">
          {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
        </p>
      )}

      {results.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10">
          {q && (
            <p className="font-display text-3xl text-ink">
              No pieces found — try a category below.
            </p>
          )}
          <p className="mt-6 font-caps text-[10px] tracking-[0.3em] text-muted">Browse by category</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <div key={c.slug} className="flex items-center gap-3 rounded-2xl border border-gold/25 bg-paper p-3">
                <JewelIcon category={c.slug} className="h-10 w-10 shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="truncate font-display text-lg text-ink">{c.name}</p>
                  <p className="flex gap-2 text-xs">
                    {metals.map((m) => (
                      <Link key={m.slug} href={`/collections/${m.slug}/${c.slug}`} className="text-gold-deep underline-offset-2 hover:underline">
                        {m.name}
                      </Link>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
