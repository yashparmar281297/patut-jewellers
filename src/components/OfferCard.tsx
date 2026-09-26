import Image from "next/image";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import type { Offer } from "@/lib/content";
import { site, whatsappLink } from "@/lib/site";

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  return (
    <article className="sheen group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-gold/30 bg-[linear-gradient(160deg,#fffaf0,#f4e6cb)] shadow-[0_25px_60px_-35px_rgba(120,90,40,0.55)] transition-transform duration-500 hover:-translate-y-1">
      {offer.image ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={offer.image}
            alt={offer.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="relative flex aspect-[16/7] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#fdf1d3,#e2bf78_55%,#c3953f)]">
          <span className="text-gilded font-display text-7xl italic opacity-90">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="animate-twinkle absolute right-8 top-6 text-2xl text-white">✦</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {offer.badge && (
          <span className="self-start rounded-full border border-gold/50 bg-white/70 px-3 py-1 font-caps text-[10px] tracking-[0.25em] text-gold-deep">
            {offer.badge}
          </span>
        )}
        <h3 className="mt-4 font-display text-3xl leading-tight text-ink">{offer.title}</h3>
        {offer.description && <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{offer.description}</p>}
        {offer.validUntil && (
          <p className="mt-4 font-caps text-[10px] tracking-[0.25em] text-gold-deep">
            Valid till {formatDate(offer.validUntil)}
          </p>
        )}
        {site.whatsapp && (
          <a
            href={whatsappLink(`Hello Patut Jewellers, I would like to know more about your offer: ${offer.title}.`)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-full bg-whatsapp px-5 py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Ask about this offer
          </a>
        )}
      </div>
    </article>
  );
}
