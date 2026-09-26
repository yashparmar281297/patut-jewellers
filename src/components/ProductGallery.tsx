"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  images: string[];
  name: string;
}

/** Main photo with hover-to-zoom and a thumbnail strip. */
export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const current = images[Math.min(active, images.length - 1)];

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div>
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[2rem] bg-cream shadow-[0_40px_80px_-40px_rgba(60,40,15,0.45)]"
        onPointerMove={onMove}
        onPointerLeave={() => setZoom(null)}
      >
        <Image
          key={current}
          src={current}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 ease-out"
          style={
            zoom
              ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
              : undefined
          }
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
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
