import Image from "next/image";
import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { categories, metals } from "@/lib/catalog";
import { announcements, site, whatsappLink } from "@/lib/site";

export default function Footer() {
  const contact = [
    site.address && { label: "Showroom", value: site.address },
    site.phone && { label: "Call", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    site.email && { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Hours", value: site.hours },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <footer className="relative overflow-hidden border-t border-gold/25 bg-[linear-gradient(180deg,#f4e9d6,#ecdcbd)] text-ink/80">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] max-w-full -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pb-10 lg:px-10 lg:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <span className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-gold/50">
                <Image src="/brand/monogram.jpg" alt="" fill sizes="64px" className="object-cover" />
              </span>
              <div className="leading-none">
                <p className="text-gilded font-caps text-3xl tracking-[0.3em]">PATUT</p>
                <p className="mt-1 font-caps text-[10px] tracking-[0.55em] text-ink/70">JEWELLERS</p>
              </div>
            </div>
            <p className="mt-6 max-w-xs font-display text-xl italic leading-relaxed text-ink/70">
              Jewellery made to be worn, gifted and passed down — in hallmarked gold and certified diamonds.
            </p>
            <ul className="mt-6 space-y-1.5 text-sm">
              {announcements.map((text) => (
                <li key={text} className="flex gap-2">
                  <span className="text-gold">✦</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {metals.map((metal) => (
            <div key={metal.slug}>
              <p className="font-caps text-xs tracking-[0.3em] text-gold-deep">{metal.name}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/collections/${metal.slug}/${category.slug}`}
                      className="transition-colors hover:text-gold-deep"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 lg:col-span-1">
            <p className="font-caps text-xs tracking-[0.3em] text-gold-deep">Connect With Us</p>
            {site.whatsapp && (
              <a
                href={whatsappLink("Hello Patut Jewellers, I would like to know more about your jewellery.")}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-whatsapp px-5 py-3 text-sm font-medium text-white shadow-[0_10px_25px_-10px_rgba(37,211,102,0.8)] transition-transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Connect on WhatsApp
              </a>
            )}
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-1">
              {contact.map((item) => (
                <div key={item.label}>
                  <dt className="font-caps text-[10px] tracking-[0.3em] text-muted">{item.label}</dt>
                  <dd className="mt-1 break-words">
                    {item.href ? (
                      <a href={item.href} className="hover:text-gold-deep">{item.value}</a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="gold-rule mt-14 opacity-60" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Patut Jewellers. All rights reserved.</p>
          <p className="font-caps tracking-[0.3em]">Crafted with devotion</p>
        </div>
      </div>
    </footer>
  );
}
