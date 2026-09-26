import Link from "next/link";
import JewelIcon from "@/components/JewelIcon";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { categories, metals, type Category, type Metal, type Product } from "@/lib/catalog";

interface Props {
  metal: Metal;
  category?: Category;
  products: Product[];
}

export default function CollectionView({ metal, category, products: items }: Props) {
  const isGold = metal.slug === "gold";
  const otherMetal = metals.find((m) => m.slug !== metal.slug)!;

  return (
    <>
      <section
        className={`grain relative overflow-hidden ${
          isGold
            ? "bg-[radial-gradient(ellipse_at_75%_40%,#e9c67c,#b8893b_35%,#5a3e14_75%,#241709)] text-noir"
            : "bg-[radial-gradient(ellipse_at_75%_40%,#ffffff,#cfd4db_30%,#4b515c_70%,#14161a)] text-ivory"
        }`}
      >
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10 lg:py-24">
          <div className={isGold ? "" : "md:text-ivory"}>
            <nav className="font-caps text-[10px] tracking-[0.3em] opacity-70">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <Link href={`/collections/${metal.slug}`} className="hover:underline">{metal.name}</Link>
              {category && (
                <>
                  <span className="mx-2">/</span>
                  <span>{category.name}</span>
                </>
              )}
            </nav>
            <h1 className="mt-5 font-display text-5xl font-light sm:text-7xl">
              {category ? (
                <>
                  {metal.name} <em>{category.name}</em>
                </>
              ) : (
                <>
                  The <em>{metal.name}</em> Collection
                </>
              )}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed opacity-80">
              {category
                ? `${category.blurb}, crafted in ${isGold ? "BIS hallmarked 22K and 18K gold" : "certified natural diamonds and 18K gold"}.`
                : metal.description}
            </p>
          </div>
          <JewelIcon
            category={category?.slug ?? (isGold ? "necklace" : "ladies-ring")}
            metal={metal.slug}
            className={`animate-float h-40 w-40 shrink-0 self-center sm:h-56 sm:w-56 ${isGold ? "text-noir/70" : "text-ivory"}`}
          />
        </div>
      </section>

      {/* Sub-category navigation */}
      <div className="sticky top-20 z-30 border-b border-gold/15 bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 lg:px-10">
          <Link
            href={`/collections/${metal.slug}`}
            className={`shrink-0 rounded-full border px-4 py-2 font-caps text-[10px] tracking-[0.2em] transition-colors ${
              !category ? "border-gold bg-gold text-ivory" : "border-gold/30 text-ink hover:border-gold"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${metal.slug}/${c.slug}`}
              className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-2 pr-4 font-caps text-[10px] tracking-[0.2em] transition-colors ${
                category?.slug === c.slug ? "border-gold bg-gold text-ivory" : "border-gold/30 text-ink hover:border-gold"
              }`}
            >
              <JewelIcon category={c.slug} metal={metal.slug} className="h-6 w-6" />
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <p className="text-sm text-muted">
          {items.length} {items.length === 1 ? "design" : "designs"}
        </p>
        {items.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
            {items.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 4) * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
            </div>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-gold/40 px-6 py-20 text-center">
            <JewelIcon category={category?.slug ?? "necklace"} metal={metal.slug} className="h-24 w-24 text-gold/70" />
            <p className="mt-6 font-display text-3xl text-ink">New designs arriving soon</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Visit our showroom to see the full {metal.name.toLowerCase()} collection in person.
            </p>
            <Link href="/#visit" className="mt-6 font-caps text-[11px] tracking-[0.25em] text-gold-deep underline underline-offset-8">
              Book a visit
            </Link>
          </div>
        )}

        {category && (
          <div className="mt-24 rounded-3xl border border-gold/20 bg-cream p-8 text-center sm:p-12">
            <p className="font-caps text-[11px] tracking-[0.35em] text-gold-deep">Also in {otherMetal.name}</p>
            <Link
              href={`/collections/${otherMetal.slug}/${category.slug}`}
              className="mt-3 inline-block font-display text-4xl text-ink underline decoration-gold/40 underline-offset-8 hover:text-gold-deep"
            >
              {otherMetal.name} {category.name}
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
