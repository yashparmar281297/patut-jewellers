import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JewelIcon from "@/components/JewelIcon";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import TiltCard from "@/components/TiltCard";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getCategory, getMetal } from "@/lib/catalog";
import { getProduct, getProductSlugs, getProducts } from "@/lib/products";
import { productWhatsappLink, site } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  return product ? { title: product.name, description: product.description, openGraph: product.images[0] ? { images: [product.images[0]] } : undefined } : {};
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const metal = getMetal(product.metal)!;
  const category = getCategory(product.category)!;
  const isDiamond = product.metal === "diamond";
  const related = (await getProducts(product.metal, product.category)).filter((p) => p.slug !== product.slug);

  const specs = [
    ["Metal", isDiamond ? "18K Gold" : `${product.purity} Gold`],
    ["Gross weight", `${product.weight} g`],
    ...(product.diamondCarat ? [["Diamond weight", `${product.diamondCarat} ct`], ["Certification", "IGI"]] : []),
    ["Hallmark", "BIS HUID"],
    ["Category", category.name],
  ];

  const whatsappHref = productWhatsappLink(product.name, product.slug);

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:gap-12 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-20">
        {product.images.length > 0 ? (
          <ProductGallery images={product.images} name={product.name} />
        ) : (
          <div className="group">
            <TiltCard max={8} className="rounded-[2rem]">
              <div
                className={`sheen relative aspect-square overflow-hidden rounded-[2rem] ${
                  isDiamond
                    ? "bg-[radial-gradient(circle_at_50%_35%,#f6eff4,#eadde6_45%,#dcc6d5)]"
                    : "bg-[radial-gradient(circle_at_50%_35%,#f3eadd,#e7d5bc_50%,#dbc6ab)]"
                }`}
              >
                <div className="absolute inset-x-16 bottom-14 h-10 rounded-full bg-gold-deep/15 blur-2xl" />
                <JewelIcon
                  category={product.category}
                  metal={product.metal}
                  className={`animate-float absolute inset-0 m-auto h-3/5 w-3/5 [transform:translateZ(60px)] ${
                    isDiamond ? "text-[#8a6582]" : "text-gold"
                  }`}
                />
                <span className="animate-twinkle absolute right-[22%] top-[20%] text-2xl text-gold-light">✦</span>
              </div>
            </TiltCard>
          </div>
        )}

        <div className="flex flex-col justify-center">
          <nav className="font-caps text-[10px] tracking-[0.3em] text-muted">
            <Link href={`/collections/${metal.slug}`} className="hover:text-gold-deep">{metal.name}</Link>
            <span className="mx-2">/</span>
            <Link href={`/collections/${metal.slug}/${category.slug}`} className="hover:text-gold-deep">{category.name}</Link>
          </nav>
          <h1 className="mt-4 font-display text-4xl font-light leading-tight text-ink sm:text-6xl">{product.name}</h1>
          <p className="mt-3 font-caps text-[11px] tracking-[0.3em] text-gold-deep">{metal.purity}</p>
          <div className="gold-rule my-6 w-full opacity-60 sm:my-8" />
          <p className="leading-relaxed text-muted">{product.description}</p>

          <dl className="mt-8 divide-y divide-gold/15 border-y border-gold/15">
            {specs.map(([label, value]) => (
              <div key={label} className="flex justify-between py-3 text-sm">
                <dt className="font-caps text-[10px] tracking-[0.25em] text-muted">{label}</dt>
                <dd className="text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          {site.whatsapp && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-whatsapp px-8 py-4 text-base font-medium text-white shadow-[0_14px_35px_-12px_rgba(37,211,102,0.85)] transition-transform hover:-translate-y-0.5 sm:w-auto sm:self-start"
            >
              <WhatsAppIcon className="h-6 w-6" />
              Connect on WhatsApp
            </a>
          )}
          <p className="mt-3 text-sm text-muted">
            Chat with us for today&apos;s price, more photos or a video call.
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-muted">
            <li>✦ {isDiamond ? "IGI certified diamonds" : "6-digit HUID hallmarked"}</li>
            <li>✦ Easy gold exchange</li>
            <li>✦ Custom orders welcome</li>
            <li>✦ Try it at our store</li>
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
              {related.slice(0, 6).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
