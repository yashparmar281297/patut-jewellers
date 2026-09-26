import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JewelIcon from "@/components/JewelIcon";
import ProductCard from "@/components/ProductCard";
import TiltCard from "@/components/TiltCard";
import { getCategory, getMetal, getProduct, getProducts, products } from "@/lib/catalog";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const metal = getMetal(product.metal)!;
  const category = getCategory(product.category)!;
  const isDiamond = product.metal === "diamond";
  const related = getProducts(product.metal, product.category).filter((p) => p.slug !== product.slug);

  const specs = [
    ["Metal", isDiamond ? "18K Gold" : `${product.purity} Gold`],
    ["Gross weight", `${product.weight} g`],
    ...(product.diamondCarat ? [["Diamond weight", `${product.diamondCarat} ct`], ["Certification", "IGI / GIA"]] : []),
    ["Hallmark", "BIS HUID"],
    ["Category", category.name],
  ];

  const enquiryText = `Hello Patut Jewellers, I am interested in the ${product.name} (${metal.name} ${category.name}).`;
  const enquiryHref = site.whatsapp
    ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(enquiryText)}`
    : site.phone
      ? `tel:${site.phone}`
      : "/#visit";

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-20">
        <div className="group">
          <TiltCard max={8} className="rounded-[2rem]">
            <div
              className={`sheen relative aspect-square overflow-hidden rounded-[2rem] ${
                isDiamond
                  ? "bg-[radial-gradient(circle_at_50%_35%,#ffffff,#eef0f3_45%,#cfd4db)]"
                  : "bg-[radial-gradient(circle_at_50%_35%,#fffaf0,#f1e5d0_50%,#dcc39a)]"
              }`}
            >
              <div className="absolute inset-x-16 bottom-14 h-10 rounded-full bg-noir/15 blur-2xl" />
              <JewelIcon
                category={product.category}
                metal={product.metal}
                className={`animate-float absolute inset-0 m-auto h-3/5 w-3/5 [transform:translateZ(60px)] ${
                  isDiamond ? "text-[#8b8f97]" : "text-gold"
                }`}
              />
              <span className="animate-twinkle absolute right-[22%] top-[20%] text-2xl text-gold-light">✦</span>
            </div>
          </TiltCard>
        </div>

        <div className="flex flex-col justify-center">
          <nav className="font-caps text-[10px] tracking-[0.3em] text-muted">
            <Link href={`/collections/${metal.slug}`} className="hover:text-gold-deep">{metal.name}</Link>
            <span className="mx-2">/</span>
            <Link href={`/collections/${metal.slug}/${category.slug}`} className="hover:text-gold-deep">{category.name}</Link>
          </nav>
          <h1 className="mt-4 font-display text-5xl font-light text-ink sm:text-6xl">{product.name}</h1>
          <p className="mt-3 font-caps text-[11px] tracking-[0.3em] text-gold-deep">{metal.purity}</p>
          <div className="gold-rule my-8 w-full opacity-60" />
          <p className="leading-relaxed text-muted">{product.description}</p>

          <dl className="mt-8 divide-y divide-gold/15 border-y border-gold/15">
            {specs.map(([label, value]) => (
              <div key={label} className="flex justify-between py-3 text-sm">
                <dt className="font-caps text-[10px] tracking-[0.25em] text-muted">{label}</dt>
                <dd className="text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-sm text-muted">
            Price is calculated on the day&apos;s {isDiamond ? "gold rate and diamond grade" : "gold rate"}, plus making charges.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={enquiryHref}
              target={site.whatsapp ? "_blank" : undefined}
              rel="noreferrer"
              className="bg-gold rounded-full px-8 py-4 font-caps text-xs tracking-[0.25em] text-noir shadow-[0_10px_40px_-12px_rgba(184,137,59,0.7)]"
            >
              Enquire for Price
            </a>
            <Link
              href="/#visit"
              className="rounded-full border border-gold px-8 py-4 font-caps text-xs tracking-[0.25em] text-gold-deep transition-colors hover:bg-gold hover:text-ivory"
            >
              Try in Store
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 text-sm text-muted">
            <li>✦ Lifetime exchange</li>
            <li>✦ {isDiamond ? "Certified diamonds" : "HUID hallmarked"}</li>
            <li>✦ Resizing available</li>
            <li>✦ Secure gift packaging</li>
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <h2 className="text-center font-display text-4xl font-light text-ink sm:text-5xl">
              More {metal.name} <em className="text-gilded">{category.name}</em>
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
