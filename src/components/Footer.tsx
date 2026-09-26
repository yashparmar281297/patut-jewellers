import Image from "next/image";
import Link from "next/link";
import { categories, metals } from "@/lib/catalog";
import { site } from "@/lib/site";

export default function Footer() {
  const contact = [
    site.address && { label: "Showroom", value: site.address },
    site.phone && { label: "Call", value: site.phone, href: `tel:${site.phone}` },
    site.email && { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Hours", value: site.hours },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <footer className="grain relative overflow-hidden bg-noir text-ivory/80">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <span className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-gold/50">
                <Image src="/brand/monogram.jpg" alt="" fill sizes="64px" className="object-cover" />
              </span>
              <div className="leading-none">
                <p className="font-caps text-3xl tracking-[0.3em] text-gold">PATUT</p>
                <p className="mt-1 font-caps text-[10px] tracking-[0.55em] text-ivory/70">JEWELLERS</p>
              </div>
            </div>
            <p className="mt-6 max-w-xs font-display text-xl italic leading-relaxed text-ivory/70">
              Jewellery made to be worn, gifted and passed down — in hallmarked gold and certified diamonds.
            </p>
          </div>

          {metals.map((metal) => (
            <div key={metal.slug}>
              <p className="font-caps text-xs tracking-[0.3em] text-gold">{metal.name}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/collections/${metal.slug}/${category.slug}`}
                      className="transition-colors hover:text-gold-light"
                    >
                      {metal.name} {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="font-caps text-xs tracking-[0.3em] text-gold">Visit Us</p>
            <dl className="mt-5 space-y-4 text-sm">
              {contact.map((item) => (
                <div key={item.label}>
                  <dt className="font-caps text-[10px] tracking-[0.3em] text-ivory/50">{item.label}</dt>
                  <dd className="mt-1">
                    {item.href ? (
                      <a href={item.href} className="hover:text-gold-light">{item.value}</a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="mt-8 space-y-2 text-sm">
              <li>✦ BIS Hallmarked Gold</li>
              <li>✦ IGI / GIA Certified Diamonds</li>
              <li>✦ Lifetime Exchange &amp; Buyback</li>
            </ul>
          </div>
        </div>

        <div className="gold-rule mt-16 opacity-40" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-ivory/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Patut Jewellers. All rights reserved.</p>
          <p className="font-caps tracking-[0.3em]">Crafted with devotion</p>
        </div>
      </div>
    </footer>
  );
}
