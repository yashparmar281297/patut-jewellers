"use client";

import { useEffect, useState } from "react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { generalWhatsappLink, site } from "@/lib/site";

/** Floating chat button; appears once the visitor scrolls so it never covers the hero. */
export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!site.whatsapp) return null;
  return (
    <a
      href={generalWhatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Patut Jewellers on WhatsApp"
      tabIndex={visible ? 0 : -1}
      className={`group fixed bottom-4 right-3 z-40 flex items-center gap-2 rounded-full bg-whatsapp p-3 text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition-all duration-500 hover:-translate-y-0.5 sm:bottom-6 sm:right-6 sm:p-3.5 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.5s]" />
      <WhatsAppIcon className="relative h-6 w-6 sm:h-7 sm:w-7" />
      <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-500 group-hover:max-w-40 group-hover:pr-1 sm:inline">
        Chat with us
      </span>
    </a>
  );
}
