import WhatsAppIcon from "@/components/WhatsAppIcon";
import { site, whatsappLink } from "@/lib/site";

export default function WhatsAppFloat() {
  if (!site.whatsapp) return null;
  return (
    <a
      href={whatsappLink("Hello Patut Jewellers, I would like to know more about your jewellery.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Patut Jewellers on WhatsApp"
      className="group fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full bg-whatsapp p-3.5 text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.5s]" />
      <WhatsAppIcon className="relative h-7 w-7" />
      <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-500 group-hover:max-w-40 group-hover:pr-1 sm:inline">
        Chat with us
      </span>
    </a>
  );
}
