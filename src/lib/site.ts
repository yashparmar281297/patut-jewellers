// Store details shown across the website.
// Leave a field empty to hide it until the real details are available.
const address = "Patut Jewellers, Bikram - Bihta Rd, Rajpur, Bihar 801103";

export const site = {
  name: "Patut Jewellers",
  // Public website address, used in shared WhatsApp messages (set NEXT_PUBLIC_SITE_URL when deployed).
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, ""),
  phone: "+91 99317 10204",
  whatsapp: "919931710204", // digits only with country code
  email: "patutjewellers@gmail.com",
  address,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
  hours: "Monday to Sunday · 9 AM – 9 PM",
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

/** Message used by every general "chat with us" button. */
export const GENERAL_WHATSAPP_MESSAGE =
  "Namaste 🙏, I would like to know more about your jewellery collection at Patut Jewellers.";

/** WhatsApp link for a general enquiry. */
export function generalWhatsappLink() {
  return whatsappLink(GENERAL_WHATSAPP_MESSAGE);
}

/** WhatsApp link for a specific product: the product page link first, then the greeting. */
export function productWhatsappLink(productName: string, productUrl: string) {
  const message = `Namaste 🙏, I would like to know more about ${productName} at Patut Jewellers.`;
  return whatsappLink(productUrl ? `${productUrl}\n\n${message}` : message);
}
