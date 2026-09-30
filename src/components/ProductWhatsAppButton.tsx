"use client";

import { useSyncExternalStore } from "react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { productWhatsappLink, site } from "@/lib/site";

const noSubscribe = () => () => {};

/**
 * "Connect on WhatsApp" for one product. The message starts with a link to the product,
 * built from the address the customer is browsing, so the shop knows exactly which piece it is.
 */
export default function ProductWhatsAppButton({ name, slug }: { name: string; slug: string }) {
  const origin = useSyncExternalStore(
    noSubscribe,
    () => window.location.origin,
    () => site.url,
  );

  return (
    <a
      href={productWhatsappLink(name, origin ? `${origin}/product/${slug}` : "")}
      target="_blank"
      rel="noreferrer"
      className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-whatsapp px-8 py-4 text-base font-medium text-white shadow-[0_14px_35px_-12px_rgba(37,211,102,0.85)] transition-transform hover:-translate-y-0.5 sm:w-auto sm:self-start"
    >
      <WhatsAppIcon className="h-6 w-6" />
      Connect on WhatsApp
    </a>
  );
}
