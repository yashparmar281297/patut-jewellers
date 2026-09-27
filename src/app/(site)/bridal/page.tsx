import type { Metadata } from "next";
import Link from "next/link";
import JewelIcon from "@/components/JewelIcon";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { bridalCategories, getCategory, type CategorySlug } from "@/lib/catalog";
import { getBridalProducts } from "@/lib/products";
import { generalWhatsappLink, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bridal Collection",
  description:
    "Bridal jewellery by Patut Jewellers — necklaces, tika, nathiya, jhumkas, mangalsutra, bangles and dholna for every wedding ritual.",
};

export default async function BridalPage(props: PageProps<"/bridal">) {
  const params = await props.searchParams;
  const requested = typeof params.category === "string" ? params.category : "";
  const category = bridalCategories.includes(requested as CategorySlug) ? (requested as CategorySlug) : undefined;
  const products = await getBridalProducts(category);
  const categoryName = category ? getCategory(category)?.name : undefined;

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_70%_40%,#fffdf8,#f6e8cc_45%,#e6cc98)]">
        <div className="pointer-events-none absolute -right-24 top-0 h-[26rem] w-[26rem] max-w-full rounded-full bg-white/60 blur-[100px]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-12 text-center sm:px-6 md:flex-row md:justify-between md:py-20 md:text-left lg:px-10">
          <div>
            <nav className="font-caps text-[10px] tracking-[0.3em] text-ink/60">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span>Bridal</span>
            </nav>
            <p className="mt-5 font-caps text-[11px] tracking-[0.4em] text-gold-deep">The Bridal Edit</p>
            <h1 className="mt-3 font-display text-[2.6rem] font-light leading-tight text-ink sm:text-7xl">
              Bridal <em className="text-gilded">Collection</em>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted sm:text-base md:mx-0">
              Tika, nathiya, necklaces, jhumkas, mangalsutra, bangles and dholna — everything the bride
              wears, from haldi to vidaai, crafted in hallmarked gold and certified diamonds.
            </p>
          </div>
          <div className="flex shrink-0 gap-3 sm:gap-5">
            {(["tika", "nathiya", "necklace"] as const).map((slug, i) => (
              <div
                key={slug}
                className={`flex h-24 w-24 items-center justify-center rounded-full bg-white/70 shadow-[0_20px_40px_-25px_rgba(120,90,40,0.7)] ring-1 ring-gold/30 sm:h-32 sm:w-32 ${
                  i === 1 ? "animate-float" : "translate-y-4"
                }`}
              >
                <JewelIcon category={slug} className="h-16 w-16 text-gold sm:h-20 sm:w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b border-gold/15 bg-ivory/90 backdrop-blur-md lg:top-20">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 lg:px-10">
          <Link
            href="/bridal"
            className={`shrink-0 rounded-full border px-4 py-2 font-caps text-[10px] tracking-[0.2em] transition-colors ${
              !category ? "border-gold bg-gold text-ink" : "border-gold/30 text-ink hover:border-gold"
            }`}
          >
            All Bridal
          </Link>
          {bridalCategories.map((slug) => (
            <Link
              key={slug}
              href={`/bridal?category=${slug}`}
              className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-2 pr-4 font-caps text-[10px] tracking-[0.2em] transition-colors ${
                category === slug ? "border-gold bg-gold text-ink" : "border-gold/30 text-ink hover:border-gold"
              }`}
            >
              <JewelIcon category={slug} className="h-6 w-6 text-gold-deep" />
              {getCategory(slug)?.name}
            </Link>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <p className="text-sm text-muted">
          {products.length} bridal {products.length === 1 ? "design" : "designs"}
          {categoryName ? ` in ${categoryName}` : ""}
        </p>

        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 4) * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-gold/40 px-6 py-16 text-center">
            <JewelIcon category={category ?? "necklace"} className="h-24 w-24 text-gold/70" />
            <p className="mt-6 font-display text-3xl text-ink">New bridal designs arriving soon</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Visit our showroom to see the complete bridal collection in person.
            </p>
          </div>
        )}

        {site.whatsapp && (
          <div className="bg-gold mt-16 flex flex-col items-center gap-4 rounded-[2rem] px-6 py-10 text-center text-ink sm:mt-20 sm:py-12">
            <p className="font-caps text-[11px] tracking-[0.35em] text-ink/70">Bridal Consultation</p>
            <p className="max-w-xl font-display text-3xl leading-tight sm:text-4xl">
              Planning your wedding jewellery? Let us help you put the complete look together.
            </p>
            <a
              href={generalWhatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2.5 rounded-full bg-whatsapp px-7 py-3.5 text-sm font-medium text-white shadow-[0_12px_30px_-10px_rgba(37,211,102,0.9)]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Connect on WhatsApp
            </a>
          </div>
        )}
      </section>
    </>
  );
}
