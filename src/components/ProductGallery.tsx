"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface Props {
  images: string[];
  name: string;
}

/**
 * Product photos: swipe between them on phones (scroll-snap strip), hover to zoom and
 * arrows on desktop, plus a thumbnail strip and position dots.
 */
export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const strip = useRef<HTMLDivElement>(null);

  function goTo(index: number) {
    const el = strip.current;
    if (!el) return;
    const next = Math.max(0, Math.min(images.length - 1, index));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setActive(next);
  }

  function onScroll() {
    const el = strip.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== active) {
      setActive(index);
      setZoom(null);
    }
  }

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  const many = images.length > 1;

  return (
    <div>
      <div className="group relative overflow-hidden rounded-[2rem] bg-cream shadow-[0_40px_80px_-40px_rgba(123,83,33,0.45)]">
        <div
          ref={strip}
          onScroll={onScroll}
          className="flex aspect-square snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={`${name} photos`}
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="relative h-full w-full shrink-0 snap-center overflow-hidden md:cursor-zoom-in"
              onPointerMove={i === active ? onMove : undefined}
              onPointerLeave={() => setZoom(null)}
            >
              <Image
                src={src}
                alt={many ? `${name} — photo ${i + 1} of ${images.length}` : name}
                fill
                priority={i === 0}
                draggable={false}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="select-none object-cover transition-transform duration-300 ease-out"
                style={
                  zoom && i === active
                    ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : undefined
                }
              />
            </div>
          ))}
        </div>

        {many && (
          <>
            {/* Arrows for mouse users */}
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/85 text-ink shadow opacity-0 transition-opacity group-hover:opacity-100 disabled:hidden md:flex"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === images.length - 1}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/85 text-ink shadow opacity-0 transition-opacity group-hover:opacity-100 disabled:hidden md:flex"
            >
              ›
            </button>

            {/* Position dots and counter */}
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
              {images.map((src, i) => (
                <span
                  key={src}
                  className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-paper" : "w-1.5 bg-paper/60"}`}
                />
              ))}
            </div>
            <span className="absolute right-3 top-3 rounded-full bg-ink/45 px-2.5 py-1 text-xs tabular-nums text-paper">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {many && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition ${
                i === active ? "ring-gold" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
