"use client";

import { useState } from "react";
import { GOLD_GST_PERCENT, inr, karats, priceBreakup, ratePerGram, type GoldRates, type KaratKey } from "@/lib/pricing";
import { useLiveRates } from "@/lib/useLiveRates";

interface Props {
  weightGrams: number;
  makingPercent: number;
  /** Purities this piece is offered in; the first is selected initially. */
  available: KaratKey[];
  initialRates: GoldRates | null;
}

/** Live gold price for a product, following the Patna market rate. */
export default function GoldPriceCalculator({ weightGrams, makingPercent, available, initialRates }: Props) {
  const options = karats.filter((k) => available.includes(k.key));
  const [karat, setKarat] = useState<KaratKey>(options[0]?.key ?? "22K");
  const [showBreakup, setShowBreakup] = useState(false);
  const { rates, changed, secondsAgo } = useLiveRates(initialRates);

  if (!rates || options.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-gold/25 bg-paper p-5 text-sm text-muted">
        Today&apos;s gold rate is being updated — connect with us on WhatsApp for the current price.
      </div>
    );
  }

  const rate = ratePerGram(rates, karat);
  const price = priceBreakup(rate, weightGrams, makingPercent);
  const selected = options.find((k) => k.key === karat)!;

  return (
    <div className="mt-8 rounded-3xl border border-gold/25 bg-paper p-5 sm:p-6">
      <p className="font-caps text-[10px] tracking-[0.3em] text-muted">
        {options.length > 1 ? "Choose gold purity" : "Gold purity"}
      </p>
      <div className={`mt-3 grid gap-3 ${options.length > 1 ? "grid-cols-2" : "grid-cols-1 sm:max-w-[50%]"}`} role="radiogroup" aria-label="Gold purity">
        {options.map((k) => {
          const active = k.key === karat;
          return (
            <button
              key={k.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setKarat(k.key)}
              className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                active
                  ? "border-gold bg-gold text-paper shadow-[0_12px_30px_-15px_rgba(123,83,33,0.9)]"
                  : "border-gold/30 bg-ivory/50 text-ink hover:border-gold"
              }`}
            >
              <span className="block font-display text-2xl leading-none">{k.hallmark}</span>
              <span className={`mt-1 block font-caps text-[10px] tracking-[0.2em] ${active ? "text-paper/80" : "text-muted"}`}>
                {k.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs text-muted">
            {selected.hallmark} · {selected.label} · {weightGrams} g
          </p>
          <p
            className={`mt-1 font-display text-4xl leading-none transition-colors duration-700 sm:text-5xl ${
              changed ? "text-emerald-700" : "text-ink"
            }`}
            aria-live="polite"
          >
            {inr.format(price.total)}
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="tabular-nums">
            {inr.format(rate)}/g · live · {secondsAgo}s ago
          </span>
        </p>
      </div>

      <p className="mt-3 text-sm text-ink/80">Inclusive of making charges &amp; GST · Final billing at store</p>
      <p className="mt-1 text-sm text-muted">📌 Patna Gold Market · {new Date().getFullYear()}</p>

      <button
        type="button"
        onClick={() => setShowBreakup((v) => !v)}
        className="mt-4 text-sm text-gold-deep underline underline-offset-4"
        aria-expanded={showBreakup}
      >
        {showBreakup ? "Hide price breakup" : "View price breakup"}
      </button>
      {showBreakup && (
        <dl className="mt-3 space-y-2 border-t border-gold/20 pt-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">
              Gold value ({weightGrams} g × {inr.format(rate)}/g)
            </dt>
            <dd className="text-ink">{inr.format(price.goldValue)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Making charges ({makingPercent}%)</dt>
            <dd className="text-ink">{inr.format(price.makingCharges)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">GST ({GOLD_GST_PERCENT}%)</dt>
            <dd className="text-ink">{inr.format(price.gst)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-gold/20 pt-2 font-medium">
            <dt className="text-ink">Final price</dt>
            <dd className="text-ink">{inr.format(price.total)}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
