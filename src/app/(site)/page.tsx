import Image from "next/image";
import Link from "next/link";
import JewelIcon from "@/components/JewelIcon";
import LiveRates from "@/components/LiveRates";
import OfferCard from "@/components/OfferCard";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import TestimonialCard from "@/components/TestimonialCard";
import TiltCard from "@/components/TiltCard";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import JewelCanvas from "@/components/three/JewelCanvas";
import { categories, metals, type CategorySlug } from "@/lib/catalog";
import { getOffers, getTestimonials } from "@/lib/content";
import { getNewArrivals } from "@/lib/products";
import { generalWhatsappLink, site } from "@/lib/site";

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center">
      <p className="font-caps text-[11px] tracking-[0.4em] text-gold-deep">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl font-light text-ink sm:text-5xl lg:text-6xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-4 max-w-xl text-muted">{subtitle}</p>}
      <div className="mx-auto mt-6 flex items-center justify-center gap-3">
        <span className="gold-rule w-16" />
        <span className="text-gold">✦</span>
        <span className="gold-rule w-16" />
      </div>
    </div>
  );
}

const bridalPieces: CategorySlug[] = ["necklace", "tika", "nathiya", "jhumka"];

const promises = [
  { title: "BIS Hallmarked", text: "6-digit HUID guaranteed on every gold piece — purity you can verify." },
  { title: "Custom Orders", text: "Custom orders welcome. Visit the store and we will craft your design." },
  { title: "Gold Exchange", text: "Easy gold exchange at fair market value, with transparent weighing." },
  { title: "Certified Diamonds", text: "IGI certified natural diamonds, with certificate in hand." },
];

// Rebuild at most every 5 minutes; saving in the admin panel refreshes immediately.
export const revalidate = 300;

export default async function Home() {
  const [newArrivals, offers, testimonials] = await Promise.all([
    getNewArrivals(),
    getOffers(),
    getTestimonials(),
  ]);

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative -mt-16 overflow-hidden bg-[radial-gradient(ellipse_at_72%_42%,#fffdf8_0%,#f7ecd8_38%,#ecdab8_100%)] pt-16 lg:-mt-20 lg:pt-20">
        <div className="pointer-events-none absolute right-[10%] top-1/3 h-[28rem] w-[28rem] max-w-full rounded-full bg-gold-light/30 blur-[110px]" />
        {/*
          Phones/tablets: exactly one screen tall (screen minus the 2.25rem announcement bar and
          4rem header); the 3D ring takes whatever height the text leaves.
        */}
        <div className="relative mx-auto flex h-[calc(100svh-6.25rem)] max-h-[60rem] min-h-[31rem] max-w-7xl flex-col px-4 sm:px-6 lg:grid lg:h-auto lg:max-h-none lg:min-h-[calc(100svh-2.25rem-5rem)] lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-6 lg:px-10 lg:pb-16">
          <div className="relative min-h-[140px] flex-1 lg:order-2 lg:h-[min(600px,calc(100svh-10rem))] lg:flex-none">
            <JewelCanvas />
          </div>

          <div className="shrink-0 pb-6 pt-1 text-center sm:pb-10 lg:order-1 lg:p-0 lg:text-left">
            <p className="animate-rise font-caps text-[9px] tracking-[0.35em] text-gold-deep sm:text-[11px] sm:tracking-[0.4em]">
              Fine Gold &amp; Diamond Jewellery
            </p>
            <h1 className="animate-rise mt-2.5 font-display text-[2.35rem] font-light leading-[1.04] text-ink [animation-delay:100ms] sm:mt-5 sm:text-6xl lg:mt-6 lg:text-7xl xl:text-[5.25rem] [@media(max-height:680px)]:text-[2.1rem] [@media(max-height:760px)]:lg:text-6xl">
              Crafted in <span className="text-gilded italic">Gold</span>,
              <br />
              Kissed by <span className="text-gilded italic">Light</span>
            </h1>
            <p className="animate-rise mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-muted [animation-delay:200ms] sm:mt-5 sm:text-base lg:mx-0 lg:mt-6 lg:text-lg">
              Heirloom craftsmanship meets modern brilliance — rings, necklaces, jhumkas and
              mangalsutras made to be treasured for generations.
            </p>
            <div className="animate-rise mt-5 flex justify-center gap-2.5 [animation-delay:300ms] sm:mt-8 sm:gap-4 lg:mt-9 lg:justify-start">
              <Link
                href="/collections/gold"
                className="bg-gold whitespace-nowrap rounded-full px-5 py-3 font-caps text-[10px] tracking-[0.16em] text-ink shadow-[0_12px_35px_-12px_rgba(184,137,59,0.9)] transition-[background-position,transform] duration-700 hover:-translate-y-0.5 hover:[background-position:100%_0] sm:px-8 sm:py-4 sm:text-xs sm:tracking-[0.22em]"
              >
                Explore Gold
              </Link>
              <Link
                href="/collections/diamond"
                className="whitespace-nowrap rounded-full border border-gold bg-white/50 px-5 py-3 font-caps text-[10px] tracking-[0.16em] text-gold-deep backdrop-blur transition-colors hover:bg-gold hover:text-ivory sm:px-8 sm:py-4 sm:text-xs sm:tracking-[0.22em]"
              >
                Explore Diamond
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Marquee ───────────── */}
      <div className="bg-gold overflow-hidden py-3.5 text-ink sm:py-4">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-caps text-xs tracking-[0.35em] sm:text-sm">
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

      <LiveRates />

      {/* ───────────── Offers ───────────── */}
      {offers.length > 0 && (
        <section id="offers" className="scroll-mt-24 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <Reveal>
              <SectionHeading eyebrow="Offers" title={<>Special <em className="text-gilded">offers</em></>} />
            </Reveal>
          </div>
          <div className="mx-auto mt-12 max-w-7xl sm:px-6 lg:mt-16 lg:px-10">
            <div className={`flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 ${offers.length >= 3 ? "lg:grid-cols-3" : "mx-auto max-w-5xl"}`}>
              {offers.map((offer, i) => (
                <div key={offer.id} className="w-[82%] shrink-0 snap-center sm:w-auto">
                  <Reveal delay={(i % 3) * 100} className="h-full">
                    <OfferCard offer={offer} index={i} />
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── Gold & Diamond ───────────── */}
      <section id="worlds" className="scroll-mt-24 bg-cream/60 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal>
            <SectionHeading eyebrow="Two Worlds" title={<>Choose your <em className="text-gilded">radiance</em></>} />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:gap-8">
            {metals.map((metal, i) => {
              const isGold = metal.slug === "gold";
              return (
                <Reveal key={metal.slug} delay={i * 150}>
                  <Link href={`/collections/${metal.slug}`} className="group block">
                    <TiltCard max={6} className="rounded-[2rem]">
                      <div
                        className={`sheen relative flex min-h-[26rem] flex-col overflow-hidden rounded-[2rem] p-7 text-ink sm:min-h-[32rem] sm:p-10 lg:min-h-[38rem] ${
                          isGold
                            ? "bg-[radial-gradient(ellipse_at_50%_22%,#fff6dc,#e7c77f_38%,#c79b48_75%,#b08132)]"
                            : "bg-[radial-gradient(ellipse_at_50%_22%,#ffffff,#eef1f4_35%,#cdd3db_75%,#b4bcc7)]"
                        }`}
                      >
                        <div className="flex flex-1 items-center justify-center py-4">
                          <JewelIcon
                            category={isGold ? "jhumka" : "ladies-ring"}
                            metal={metal.slug}
                            className={`h-36 w-36 transition-transform duration-1000 ease-[var(--ease-luxe)] [transform:translateZ(60px)] group-hover:rotate-[-6deg] group-hover:scale-110 sm:h-52 sm:w-52 ${
                              isGold ? "text-[#6f4c14]" : "text-[#4a515c]"
                            }`}
                          />
                        </div>
                        <div className="relative [transform:translateZ(40px)]">
                          <p className="font-caps text-[11px] tracking-[0.3em] opacity-75">{metal.purity}</p>
                          <h3 className="mt-3 font-display text-6xl font-light sm:text-7xl">{metal.name}</h3>
                          <p className="mt-2 font-display text-2xl italic opacity-85">{metal.tagline}</p>
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
        </div>
      </section>

      {/* ───────────── Categories ───────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal>
            <SectionHeading eyebrow="Shop by Category" title={<>Every piece, <em className="text-gilded">every story</em></>} />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:mt-16 lg:grid-cols-3">
            {categories.map((category, i) => (
              <Reveal key={category.slug} delay={(i % 3) * 100}>
                <div className="group">
                  <TiltCard max={10} className="rounded-3xl">
                    <div className="sheen relative flex flex-col items-center rounded-3xl border border-gold/20 bg-white px-3 pb-5 pt-7 text-center shadow-[0_20px_50px_-30px_rgba(120,90,40,0.45)] sm:px-6 sm:pb-8 sm:pt-10">
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fffaf0,#f1e3c6)] ring-1 ring-gold/30 [transform:translateZ(50px)] sm:h-32 sm:w-32">
                        <JewelIcon category={category.slug} className="h-14 w-14 text-gold transition-transform duration-700 group-hover:scale-110 sm:h-20 sm:w-20" />
                      </div>
                      <h3 className="mt-4 font-display text-[1.4rem] leading-tight text-ink sm:mt-5 sm:text-3xl">{category.name}</h3>
                      <p className="mt-1 hidden text-sm text-muted sm:block">{category.blurb}</p>
                      <div className="relative z-10 mt-4 flex flex-wrap justify-center gap-1.5 sm:mt-5 sm:gap-2">
                        {metals.map((metal) => (
                          <Link
                            key={metal.slug}
                            href={`/collections/${metal.slug}/${category.slug}`}
                            className="rounded-full border border-gold/40 px-2.5 py-1.5 font-caps text-[9px] tracking-[0.15em] text-gold-deep transition-colors hover:bg-gold hover:text-ivory sm:px-4 sm:text-[10px] sm:tracking-[0.2em]"
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
      <section className="bg-cream/60 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal>
            <SectionHeading eyebrow="Just Arrived" title={<>New <em className="text-gilded">treasures</em></>} />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:mt-16 lg:grid-cols-4">
            {newArrivals.map((product, i) => (
              <Reveal key={product.slug} delay={i * 100}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Bridal ───────────── */}
      <section id="bridal" className="relative scroll-mt-24 overflow-hidden bg-[linear-gradient(135deg,#f7ecd8,#ead6ae)] py-20 lg:py-28">
        <div className="pointer-events-none absolute -right-40 top-0 h-[40rem] w-[40rem] rounded-full bg-white/50 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <Reveal className="text-center lg:text-left">
            <p className="font-caps text-[11px] tracking-[0.4em] text-gold-deep">The Bridal Edit</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-tight text-ink sm:text-6xl">
              For the day you <em className="text-gilded">will always</em> remember
            </h2>
            <p className="mx-auto mt-6 max-w-md leading-relaxed text-muted lg:mx-0">
              Tika, nathiya, temple necklaces, swaying jhumkas and a mangalsutra made just for you —
              the complete bridal look for every ritual, from haldi to vidaai.
            </p>
            <Link
              href="/bridal"
              className="bg-gold mt-8 inline-flex rounded-full px-8 py-4 font-caps text-xs tracking-[0.22em] text-ink shadow-[0_12px_35px_-12px_rgba(184,137,59,0.9)] transition-transform hover:-translate-y-0.5"
            >
              Explore Bridal Collection
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 pb-10 sm:gap-6">
            {bridalPieces.map((slug, i) => {
              const category = categories.find((c) => c.slug === slug)!;
              return (
                <Reveal key={slug} delay={i * 120} className={i % 2 ? "translate-y-10" : ""}>
                  <Link href={`/bridal?category=${slug}`} className="group block">
                    <div className="sheen relative flex aspect-square flex-col items-center justify-center rounded-3xl border border-gold/30 bg-white/70 shadow-[0_25px_50px_-35px_rgba(120,90,40,0.7)] backdrop-blur-sm transition-colors duration-500 group-hover:border-gold">
                      <JewelIcon category={slug} className="animate-float h-1/2 w-1/2 text-gold" />
                      <p className="mt-2 font-display text-xl text-ink sm:text-2xl">{category.name}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── Testimonials ───────────── */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="scroll-mt-24 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <Reveal>
              <SectionHeading
                eyebrow="Customer Stories"
                title={<>Loved by <em className="text-gilded">our families</em></>}
              />
            </Reveal>
          </div>
          <div className="mx-auto mt-12 max-w-7xl sm:px-6 lg:mt-16 lg:px-10">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <div key={t.id} className="w-[85%] shrink-0 snap-center md:w-auto">
                  <Reveal delay={(i % 3) * 100} className="h-full">
                    <TestimonialCard testimonial={t} />
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── Story ───────────── */}
      <section id="story" className="scroll-mt-24 bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-10 lg:py-28">
          <Reveal className="relative mx-auto w-full max-w-[18rem] sm:max-w-md">
            <div className="animate-float relative aspect-square overflow-hidden rounded-full shadow-[0_40px_80px_-30px_rgba(120,90,40,0.55)] ring-1 ring-gold/40">
              <Image src="/brand/logo.jpg" alt="Patut Jewellers logo" fill sizes="(min-width: 1024px) 448px, 80vw" className="scale-110 object-cover" />
            </div>
            <span className="animate-twinkle absolute right-6 top-4 text-3xl text-gold">✦</span>
            <span className="animate-twinkle absolute bottom-8 left-2 text-xl text-gold [animation-delay:1.4s]">✦</span>
          </Reveal>
          <Reveal delay={150} className="text-center lg:text-left">
            <p className="font-caps text-[11px] tracking-[0.4em] text-gold-deep">Our Story</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-tight text-ink sm:text-6xl">
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {promises.map((promise, i) => (
            <Reveal key={promise.title} delay={i * 100} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-white font-display text-2xl text-gold sm:h-16 sm:w-16">
                {["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ"][i]}
              </div>
              <h3 className="mt-4 font-caps text-xs tracking-[0.2em] text-ink sm:mt-5 sm:text-sm sm:tracking-[0.25em]">{promise.title}</h3>
              <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-muted sm:mt-3">{promise.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── Visit ───────────── */}
      <section id="visit" className="scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-10 lg:pb-24">
        <Reveal className="bg-gold relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-16 text-center text-ink sm:rounded-[2.5rem] sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-white/40 blur-[100px]" />
          <div className="relative">
            <p className="font-caps text-[11px] tracking-[0.4em] text-ink/70">Visit the Showroom</p>
            <h2 className="mt-5 font-display text-4xl font-light sm:text-6xl">
              See it. <em>Feel it.</em> Make it yours.
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-ink/80">
              Book a private viewing with our jewellery consultants and try on pieces in person.
            </p>
            {site.address && (
              <a
                href={site.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mx-auto mt-5 flex max-w-md items-start justify-center gap-2 text-ink hover:underline"
              >
                <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                <span>{site.address}</span>
              </a>
            )}
            <p className="mt-3 font-caps text-[11px] tracking-[0.25em] text-ink/70">{site.hours}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {site.whatsapp && (
                <a
                  href={generalWhatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-whatsapp px-7 py-3.5 text-sm font-medium text-white shadow-[0_12px_30px_-10px_rgba(37,211,102,0.9)]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Book on WhatsApp
                </a>
              )}
              {site.email && (
                <a
                  href={`mailto:${site.email}`}
                  className="rounded-full border border-ink/25 bg-white/40 px-6 py-3.5 text-sm text-ink backdrop-blur hover:bg-white/70"
                >
                  {site.email}
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
