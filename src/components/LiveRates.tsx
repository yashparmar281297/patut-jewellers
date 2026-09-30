import MarketClock from "@/components/MarketClock";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { inr } from "@/lib/pricing";
import { getGoldRates } from "@/lib/rates";
import { generalWhatsappLink, site } from "@/lib/site";

/** Live clock, MCX status and today's Patna gold rates. */
export default async function LiveRates() {
  const rates = await getGoldRates();

  const cards = rates
    ? [
        { label: "916 · 22K", unit: "per 10 g", value: rates.rate22kPerGram * 10, tone: "from-[#f3eadd] to-[#dbc6ab]" },
        { label: "750 · 18K", unit: "per 10 g", value: rates.rate18kPerGram * 10, tone: "from-[#f3eadd] to-[#e7d5bc]" },
        ...(rates.rate24kPerGram
          ? [{ label: "999 · 24K", unit: "per 10 g", value: rates.rate24kPerGram * 10, tone: "from-[#f3eadd] to-[#dbc6ab]" }]
          : []),
        ...(rates.diamondPerCarat
          ? [{ label: "Diamond", unit: "per carat", value: rates.diamondPerCarat, tone: "from-[#f6eff4] to-[#eadde6]" }]
          : []),
      ]
    : [];

  return (
    <section aria-label="Live gold rates" className="border-b border-gold/20 bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <MarketClock />
        </div>

        {cards.length > 0 ? (
          <div className={`grid gap-3 ${cards.length === 3 ? "grid-cols-3" : "grid-cols-2"} lg:flex lg:gap-4`}>
            {cards.map((card) => (
              <div key={card.label} className={`rounded-2xl border border-gold/25 bg-gradient-to-br ${card.tone} px-3 py-3 sm:px-4 lg:min-w-44 lg:px-5`}>
                <p className="font-caps text-[9px] tracking-[0.2em] text-ink/70 sm:text-[10px] sm:tracking-[0.25em]">
                  {card.label}
                </p>
                <p className="mt-1.5 font-sans font-semibold tabular-nums tracking-tight text-lg leading-none text-ink sm:text-2xl">{inr.format(card.value)}</p>
                <p className="mt-1 text-[11px] text-muted">{card.unit}</p>
              </div>
            ))}
          </div>
        ) : (
          site.whatsapp && (
            <a
              href={generalWhatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-full border border-gold/40 px-4 py-2 text-sm text-gold-deep hover:bg-cream lg:self-auto"
            >
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
              Ask today&apos;s gold rate on WhatsApp
            </a>
          )
        )}
      </div>
    </section>
  );
}
