// Store details shown across the website.
// Leave a field empty to hide it until the real details are available.
export const site = {
  name: "Patut Jewellers",
  // Public website address, used in shared WhatsApp messages (set NEXT_PUBLIC_SITE_URL when deployed).
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, ""),
  phone: "+91 99317 10204",
  whatsapp: "919931710204", // digits only with country code
  email: "patutjewellers@gmail.com",
  address: "",
  hours: "Mon – Sat · 10:30 AM – 8:30 PM",
  instagram: "",
};

export const announcements = [
  "BIS Hallmarked • 6-Digit HUID Guaranteed",
  "Custom Orders Welcome — Visit Store",
  "Easy Gold Exchange at Fair Market Value",
];

/** WhatsApp chat link with a pre-filled message. */
export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
