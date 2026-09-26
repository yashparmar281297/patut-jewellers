"use client";

import { useEffect, useState } from "react";
import { announcements } from "@/lib/site";

/** All three promises on wide screens; one at a time (rotating) on smaller ones. */
export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % announcements.length), 3500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="bg-gold relative z-[51] text-ink">
      <div className="mx-auto hidden h-9 max-w-7xl items-center justify-center gap-6 px-6 font-caps text-[11px] font-medium tracking-[0.22em] xl:flex">
        {announcements.map((text, i) => (
          <span key={text} className="flex items-center gap-6">
            {i > 0 && <span aria-hidden className="text-[9px]">✦</span>}
            {text}
          </span>
        ))}
      </div>

      <div className="relative h-9 overflow-hidden xl:hidden" aria-live="polite">
        {announcements.map((text, i) => (
          <p
            key={text}
            className={`absolute inset-0 flex items-center justify-center px-4 text-center font-caps text-[10px] font-medium tracking-[0.18em] transition-all duration-700 sm:text-[11px] ${
              i === index ? "translate-y-0 opacity-100" : i === (index + announcements.length - 1) % announcements.length ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
