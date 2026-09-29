"use client";

import { useEffect, useState } from "react";
import { inr, karats, priceBreakup, ratePerGram, type GoldRates, type KaratKey } from "@/lib/pricing";

interface Props {
  weightGrams: number;
  makingPerGram: number;
  defaultKarat: KaratKey;
  initialRates: GoldRates | null;
}

const POLL_MS = 60_000;

/** Live gold price for a product in 22K or 18K, following the Patna market rate. */
export default function GoldPriceCalculator({ weightGrams, makingPerGram, defaultKarat, initialRates }: Props) {
  const [karat, setKarat] = useState<KaratKey>(defaultKarat);
  const [rates, setRates] = useState<GoldRates | null>(initialRates);
  const [flash, setFlash] = useState(false);
  const [showBreakup, setShowBreakup] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const res = await fetch("/api/rates", { cache: "no-store" });
        if (!res.ok) return;
        const { rates: next } = (await res.json()) as { rates: GoldRates | null };
        if (cancelled || !next) return;
        setRates((prev) => {
          if (prev && prev.rate22kPerGram !== next.rate22kPerGram) {
            setFlash(true);
            window.setTimeout(() => setFlash(false), 1500);
          }
          return next;
        });
      } catch {
        // Keep showing the last known rate.
      }
    }
    const id = window.setInterval(refresh, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (!rates) {
    return (
      <div className="mt-8 rounded-2xl border border-gold/25 bg-paper p-5 text-sm text-muted">
        Today&apos;s gold rate is being updated — connect with us on WhatsApp for the current price.
      </div>
    );
  }

  const rate = ratePerGram(rates, karat);
  const price = priceBreakup(rate, weightGrams, makingPerGram);
  const selected = karats.find((k) => k.key === karat)!;

  return (
    <div className="mt-8 rounded-3xl border border-gold/25 bg-paper p-5 sm:p-6">
      <p className="font-caps text-[10px] tracking-[0.3em] text-muted">Choose gold purity</p>
      <div className="mt-3 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Gold purity">
        {karats.map((k) => {
          const active = k.key === karat;
          return (
            <button
              key={k.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setKarat(k.key)}
              className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                active ? "border-gold bg-gold text-paper shadow-[0_12px_30px_-15px_rgba(123,83,33,0.9)]" : "border-gold/30 bg-ivory/50 text-ink hover:border-gold"
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
            className={`mt-1 font-display text-4xl leading-none text-ink transition-colors duration-700 sm:text-5xl ${
              flash ? "text-emerald-700" : ""
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
          {inr.format(rate)}/g {rates.source === "live" ? "live" : "today"}
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
          <div className="flex justify-between">
            <dt className="text-muted">
              Gold value ({weightGrams} g × {inr.format(rate)}/g)
            </dt>
            <dd className="text-ink">{inr.format(price.goldValue)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">
              Making charges ({weightGrams} g × {inr.format(makingPerGram)}/g)
            </dt>
            <dd className="text-ink">{inr.format(price.makingCharges)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">GST (3%)</dt>
            <dd className="text-ink">{inr.format(price.gst)}</dd>
          </div>
          <div className="flex justify-between border-t border-gold/20 pt-2 font-medium">
            <dt className="text-ink">Total</dt>
            <dd className="text-ink">{inr.format(price.total)}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
