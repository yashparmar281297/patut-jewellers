import Image from "next/image";
import Link from "next/link";
import JewelIcon from "@/components/JewelIcon";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import JewelCanvas from "@/components/three/JewelCanvas";
import { categories, metals, type CategorySlug } from "@/lib/catalog";
import { getNewArrivals } from "@/lib/products";
import { site } from "@/lib/site";

function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: React.ReactNode; light?: boolean }) {
  return (
    <div className="text-center">
      <p className={`font-caps text-[11px] tracking-[0.4em] ${light ? "text-gold-light" : "text-gold-deep"}`}>{eyebrow}</p>
      <h2 className={`mt-4 font-display text-4xl font-light sm:text-5xl lg:text-6xl ${light ? "text-ivory" : "text-ink"}`}>
        {title}
      </h2>
      <div className="mx-auto mt-6 flex items-center justify-center gap-3">
        <span className="gold-rule w-16" />
        <span className="text-gold">✦</span>
        <span className="gold-rule w-16" />
      </div>
    </div>
  );
}

const bridalPieces: CategorySlug[] = ["necklace", "jhumka", "bangles", "mangalsutra"];

const promises = [
  { title: "BIS Hallmarked", text: "Every gold piece carries the HUID hallmark — purity you can verify." },
  { title: "Certified Diamonds", text: "Natural diamonds graded by IGI / GIA, with certificate in hand." },
  { title: "Lifetime Exchange", text: "Transparent exchange and buyback on all Patut jewellery." },
  { title: "Bespoke Design", text: "Bring an idea or an heirloom — our karigars will shape it for you." },
];

// Rebuild at most every 5 minutes; saving in the admin panel refreshes immediately.
export const revalidate = 300;

export default async function Home() {
  const newArrivals = await getNewArrivals();

  const contactHref = site.whatsapp
    ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hello Patut Jewellers, I would like to book a visit.")}`
    : site.phone
      ? `tel:${site.phone}`
      : null;

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="grain relative -mt-20 overflow-hidden bg-noir pt-20 text-ivory">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(201,154,69,0.28),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(138,100,36,0.25),transparent_50%)]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-7rem)] max-w-7xl items-center gap-4 px-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-10">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <Reveal>
              <p className="font-caps text-[11px] tracking-[0.45em] text-gold-light">Fine Gold &amp; Diamond Jewellery</p>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-6 font-display text-5xl font-light leading-[1.02] sm:text-6xl lg:text-[5.5rem]">
                Crafted in <span className="text-gilded italic">Gold</span>,
                <br />
                Kissed by <span className="text-gilded italic">Light</span>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mx-auto mt-7 max-w-md text-base font-light leading-relaxed text-ivory/70 lg:mx-0 lg:text-lg">
                Heirloom craftsmanship meets modern brilliance. Discover rings, necklaces, jhumkas and
                mangalsutras made to be treasured for generations.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  href="/collections/gold"
                  className="bg-gold rounded-full px-8 py-4 font-caps text-xs tracking-[0.25em] text-noir shadow-[0_10px_40px_-10px_rgba(230,196,127,0.7)] transition-[background-position,transform] duration-700 hover:-translate-y-0.5 hover:[background-position:100%_0]"
                >
                  Explore Gold
                </Link>
                <Link
                  href="/collections/diamond"
                  className="rounded-full border border-ivory/40 px-8 py-4 font-caps text-xs tracking-[0.25em] transition-colors hover:border-gold-light hover:text-gold-light"
                >
                  Explore Diamond
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative order-1 h-[380px] sm:h-[460px] lg:order-2 lg:h-[640px]">
            <div className="absolute inset-[15%] rounded-full bg-gold/20 blur-[90px]" />
            <JewelCanvas />
          </div>
        </div>

        <a
          href="#worlds"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-caps text-[10px] tracking-[0.35em] text-ivory/50 lg:flex"
        >
          Scroll
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold-light to-transparent" />
        </a>
      </section>

      {/* ───────────── Marquee ───────────── */}
      <div className="bg-gold overflow-hidden py-4 text-noir">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-caps text-sm tracking-[0.35em]">
          {[0, 1].map((dup) =>
            [...categories, ...categories].map((c, i) => (
              <span key={`${dup}-${i}`} className="flex items-center gap-10">
                {c.name}
                <span aria-hidden>✦</span>
              </span>
            )),
          )}
        </div>
      </div>

      {/* ───────────── Gold & Diamond ───────────── */}
      <section id="worlds" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <Reveal>
          <SectionHeading eyebrow="Two Worlds" title={<>Choose your <em className="text-gilded">radiance</em></>} />
        </Reveal>
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {metals.map((metal, i) => {
            const isGold = metal.slug === "gold";
            return (
              <Reveal key={metal.slug} delay={i * 150}>
                <Link href={`/collections/${metal.slug}`} className="group block">
                  <TiltCard max={6} className="rounded-[2rem]">
                    <div
                      className={`sheen relative flex min-h-[34rem] flex-col overflow-hidden rounded-[2rem] p-8 sm:p-10 lg:min-h-[40rem] ${
                        isGold
                          ? "bg-[radial-gradient(ellipse_at_50%_22%,#f7e2a8,#cf9f4a_30%,#8a6424_62%,#3b2810)] text-noir"
                          : "bg-[radial-gradient(ellipse_at_50%_22%,#ffffff,#d5dae1_24%,#5d6470_55%,#16181d_85%)] text-ivory"
                      }`}
                    >
                      <div className="flex flex-1 items-center justify-center py-4">
                        <JewelIcon
                          category={isGold ? "jhumka" : "ladies-ring"}
                          metal={metal.slug}
                          className={`h-40 w-40 transition-transform duration-1000 ease-[var(--ease-luxe)] [transform:translateZ(60px)] group-hover:rotate-[-6deg] group-hover:scale-110 sm:h-52 sm:w-52 ${
                            isGold ? "text-noir/75" : "text-[#3a3f48]"
                          }`}
                        />
                      </div>
                      <div className="relative [transform:translateZ(40px)]">
                        <p className="font-caps text-[11px] tracking-[0.35em] opacity-80">{metal.purity}</p>
                        <h3 className="mt-3 font-display text-6xl font-light sm:text-7xl">{metal.name}</h3>
                        <p className="mt-2 font-display text-2xl italic opacity-90">{metal.tagline}</p>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-80">{metal.description}</p>
                        <span className="mt-6 inline-flex items-center gap-3 font-caps text-[11px] tracking-[0.3em]">
                          Discover
                          <span className="h-px w-10 bg-current transition-all duration-500 group-hover:w-16" />
                        </span>
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───────────── Categories ───────────── */}
      <section className="grain relative bg-cream py-24 lg:py-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal>
            <SectionHeading eyebrow="Shop by Category" title={<>Every piece, <em className="text-gilded">every story</em></>} />
          </Reveal>
          <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {categories.map((category, i) => (
              <Reveal key={category.slug} delay={(i % 3) * 100}>
                <div className="group">
                  <TiltCard max={10} className="rounded-3xl">
                    <div className="sheen relative flex flex-col items-center rounded-3xl border border-gold/20 bg-ivory px-4 pb-6 pt-8 text-center shadow-[0_20px_50px_-30px_rgba(60,40,15,0.45)] sm:px-6 sm:pb-8 sm:pt-10">
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fffaf0,#f1e5d0)] ring-1 ring-gold/30 [transform:translateZ(50px)] sm:h-32 sm:w-32">
                        <JewelIcon category={category.slug} className="h-16 w-16 text-gold transition-transform duration-700 group-hover:scale-110 sm:h-20 sm:w-20" />
                      </div>
                      <h3 className="mt-5 font-display text-2xl text-ink sm:text-3xl">{category.name}</h3>
                      <p className="mt-1 hidden text-sm text-muted sm:block">{category.blurb}</p>
                      <div className="relative z-10 mt-5 flex gap-2">
                        {metals.map((metal) => (
                          <Link
                            key={metal.slug}
                            href={`/collections/${metal.slug}/${category.slug}`}
                            className="rounded-full border border-gold/40 px-3 py-1.5 font-caps text-[10px] tracking-[0.2em] text-gold-deep transition-colors hover:bg-gold hover:text-ivory sm:px-4"
                          >
                            {metal.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── New arrivals ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <Reveal>
          <SectionHeading eyebrow="Just Arrived" title={<>New <em className="text-gilded">treasures</em></>} />
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
          {newArrivals.map((product, i) => (
            <Reveal key={product.slug} delay={i * 100}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── Bridal ───────────── */}
      <section id="bridal" className="grain relative scroll-mt-24 overflow-hidden bg-espresso py-24 text-ivory lg:py-32">
        <div className="pointer-events-none absolute -right-40 top-0 h-[40rem] w-[40rem] rounded-full bg-gold/15 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
          <Reveal>
            <p className="font-caps text-[11px] tracking-[0.4em] text-gold-light">The Bridal Edit</p>
            <h2 className="mt-5 font-display text-5xl font-light leading-tight sm:text-6xl">
              For the day you <em className="text-gilded">will always</em> remember
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-ivory/70">
              Temple necklaces, swaying jhumkas, rajwadi kadas and a mangalsutra made just for you —
              curated sets for every ritual, from haldi to vidaai.
            </p>
            <Link
              href="/collections/gold/mangalsutra"
              className="mt-10 inline-flex rounded-full border border-gold-light/60 px-8 py-4 font-caps text-xs tracking-[0.25em] transition-colors hover:bg-gold-light hover:text-noir"
            >
              Explore Mangalsutra
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {bridalPieces.map((slug, i) => {
              const category = categories.find((c) => c.slug === slug)!;
              return (
                <Reveal key={slug} delay={i * 120} className={i % 2 ? "translate-y-10" : ""}>
                  <Link href={`/collections/gold/${slug}`} className="group block">
                    <div className="sheen relative flex aspect-square flex-col items-center justify-center rounded-3xl border border-gold/25 bg-gradient-to-br from-white/[0.06] to-transparent backdrop-blur-sm transition-colors duration-500 group-hover:border-gold-light/60">
                      <JewelIcon category={slug} className="animate-float h-1/2 w-1/2 text-gold-light" />
                      <p className="mt-3 font-display text-2xl">{category.name}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── Story ───────────── */}
      <section id="story" className="scroll-mt-24 bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-10 lg:py-32">
          <Reveal className="relative mx-auto w-full max-w-md">
            <div className="animate-float relative aspect-square overflow-hidden rounded-full shadow-[0_40px_80px_-30px_rgba(90,60,20,0.5)] ring-1 ring-gold/40">
              <Image src="/brand/logo.jpg" alt="Patut Jewellers logo" fill sizes="(min-width: 1024px) 448px, 90vw" className="scale-110 object-cover" />
            </div>
            <span className="animate-twinkle absolute right-8 top-6 text-3xl text-gold">✦</span>
            <span className="animate-twinkle absolute bottom-10 left-4 text-xl text-gold [animation-delay:1.4s]">✦</span>
          </Reveal>
          <Reveal delay={150}>
            <p className="font-caps text-[11px] tracking-[0.4em] text-gold-deep">Our Story</p>
            <h2 className="mt-5 font-display text-5xl font-light leading-tight text-ink sm:text-6xl">
              Where tradition is <em className="text-gilded">polished</em> by hand
            </h2>
            <p className="mt-6 leading-relaxed text-muted">
              At Patut Jewellers, every piece begins at the karigar&apos;s bench — gold melted, drawn and
              shaped by hand, diamonds hand-picked and set one by one. We honour the designs our
              grandmothers loved and reimagine them for the way you live today.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Honest weights, hallmarked purity and certified stones: the promise behind the PJ monogram.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────── Promises ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((promise, i) => (
            <Reveal key={promise.title} delay={i * 100} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 font-display text-2xl text-gold">
                {["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ"][i]}
              </div>
              <h3 className="mt-5 font-caps text-sm tracking-[0.25em] text-ink">{promise.title}</h3>
              <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-relaxed text-muted">{promise.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── Visit ───────────── */}
      <section id="visit" className="scroll-mt-24 px-4 pb-24 sm:px-6 lg:px-10">
        <Reveal className="grain relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-noir px-6 py-20 text-center text-ivory sm:px-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-gold/25 blur-[100px]" />
          <div className="relative">
            <p className="font-caps text-[11px] tracking-[0.4em] text-gold-light">Visit the Showroom</p>
            <h2 className="mt-5 font-display text-5xl font-light sm:text-6xl">
              See it. <em className="text-gilded">Feel it.</em> Make it yours.
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-ivory/70">
              Book a private viewing with our jewellery consultants and try on pieces in person.
              {site.address ? ` ${site.address}.` : ""}
            </p>
            <p className="mt-3 font-caps text-[11px] tracking-[0.3em] text-ivory/50">{site.hours}</p>
            {contactHref && (
              <a
                href={contactHref}
                target={site.whatsapp ? "_blank" : undefined}
                rel="noreferrer"
                className="bg-gold mt-10 inline-flex rounded-full px-10 py-4 font-caps text-xs tracking-[0.25em] text-noir"
              >
                Book an Appointment
              </a>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
