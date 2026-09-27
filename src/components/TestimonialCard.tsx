import Image from "next/image";
import type { Testimonial } from "@/lib/content";

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`flex gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 20 20" className={`h-4 w-4 ${n <= rating ? "text-gold" : "text-sand"}`} fill="currentColor" aria-hidden>
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  );
}

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.customerName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <figure className="relative flex h-full flex-col rounded-[1.75rem] border border-gold/25 bg-ivory p-7 shadow-[0_25px_60px_-40px_rgba(123,83,33,0.6)] sm:p-8">
      <span aria-hidden className="text-gilded absolute right-7 top-3 font-display text-8xl leading-none">
        &ldquo;
      </span>
      <Stars rating={testimonial.rating} />
      <blockquote className="mt-5 flex-1 font-display text-xl italic leading-relaxed text-ink sm:text-[1.35rem]">
        {testimonial.message}
      </blockquote>
      <figcaption className="mt-7 flex items-center gap-3 border-t border-gold/20 pt-5">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_25%,#f3eadd,#cdb497)] font-caps text-sm text-ink ring-2 ring-paper">
          {testimonial.photo ? (
            <Image src={testimonial.photo} alt="" fill sizes="48px" className="object-cover" />
          ) : (
            initials
          )}
        </span>
        <span>
          <span className="block font-medium text-ink">{testimonial.customerName}</span>
          {testimonial.location && <span className="block text-sm text-muted">{testimonial.location}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
