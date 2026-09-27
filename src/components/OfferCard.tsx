import Image from "next/image";
import type { Offer } from "@/lib/content";

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Big headline for offers without a photo: "100%" / "FREE" from the title, else the card number. */
function highlightFor(title: string, index: number) {
  const percent = title.match(/\d+\s?%/)?.[0].replace(/\s/g, "");
  if (percent) return { big: percent, small: "Off" };
  if (/\bfree\b/i.test(title)) return { big: "Free", small: "Gift" };
  return { big: String(index + 1).padStart(2, "0"), small: "" };
}

export default function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  const highlight = highlightFor(offer.title, index);
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
          <span className="flex items-baseline gap-2 text-white drop-shadow-[0_2px_10px_rgba(120,80,20,0.35)]">
            <span className="font-display text-7xl font-medium italic sm:text-8xl">{highlight.big}</span>
            {highlight.small && <span className="font-caps text-xl tracking-[0.2em]">{highlight.small}</span>}
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
      </div>
    </article>
  );
}
