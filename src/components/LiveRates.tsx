import { getMcxRates } from "@/lib/rates";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function formatUpdated(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} IST`;
}

// Drawn rather than an emoji: Windows does not render flag emoji.
function IndiaFlag() {
  return (
    <svg viewBox="0 0 30 20" className="h-3 w-[18px] shrink-0 rounded-[2px] ring-1 ring-black/10" aria-hidden>
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.67" fill="#ff9933" />
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.6" />
    </svg>
  );
}

/** Today's MCX gold and silver prices; renders nothing until rates are available. */
export default async function LiveRates() {
  const rates = await getMcxRates();
  if (!rates) return null;

  const items = [
    { label: "Gold 999", unit: "per 10 g", value: rates.gold10g, tone: "from-[#f3eadd] to-[#dbc6ab]" },
    { label: "Silver 999", unit: "per 1 kg", value: rates.silver1kg, tone: "from-[#f6eff4] to-[#eadde6]" },
  ];

  return (
    <section aria-label="Live MCX rates" className="border-b border-gold/20 bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <p className="flex items-center gap-2 whitespace-nowrap font-caps text-[11px] tracking-[0.3em] text-ink">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            Live MCX Rates
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
            <IndiaFlag />
            India · Updated {formatUpdated(rates.updatedAt)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border border-gold/25 bg-gradient-to-br ${item.tone} px-4 py-3 md:min-w-56 md:px-5`}
            >
              <p className="font-caps text-[10px] tracking-[0.25em] text-ink/70">
                MCX {item.label}
              </p>
              <p className="mt-1 font-display text-2xl leading-none text-ink sm:text-3xl">{inr.format(item.value)}</p>
              <p className="mt-1 text-[11px] text-muted">{item.unit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
