"use client";

import { useState } from "react";
import { inr, karats, priceBreakup, ratePerGram, type GoldRates, type KaratKey } from "@/lib/pricing";
import { formatIstDate } from "@/lib/format";
import { useLiveRates } from "@/lib/useLiveRates";

interface Props {
  weightGrams: number;
  makingPercent: number;
  /** Purities this piece is offered in; the first is selected initially. */
  available: KaratKey[];
  /** Total diamond weight for diamond pieces. */
  diamondCarat: number | null;
  initialRates: GoldRates | null;
}

function rateDate(iso: string) {
  return formatIstDate(iso);
}

/** Karat buttons and the price for the chosen purity, from the rates set for the day. */
export default function GoldPriceCalculator({ weightGrams, makingPercent, available, diamondCarat, initialRates }: Props) {
  const options = karats.filter((k) => available.includes(k.key));
  const [karat, setKarat] = useState<KaratKey>(options[0]?.key ?? "22K");
  const { rates, changed } = useLiveRates(initialRates);

  if (options.length === 0) return null;
  const selected = options.find((k) => k.key === karat) ?? options[0];

  const needsDiamondRate = (diamondCarat ?? 0) > 0;
  const diamondRate = rates?.diamondPerCarat ?? null;
  const priceReady = rates !== null && (!needsDiamondRate || diamondRate !== null);

  const rate = rates ? ratePerGram(rates, selected.key) : 0;
  const diamondValue = needsDiamondRate && diamondRate ? diamondRate * (diamondCarat ?? 0) : 0;
  const price = priceBreakup(rate, weightGrams, makingPercent, diamondValue);

  return (
    <div className="mt-8 rounded-3xl border border-gold/25 bg-paper p-5 sm:p-6">
      <p className="font-caps text-[11px] tracking-[0.3em] text-ink">Select Karat Purity</p>
      <div className={`mt-3 grid gap-3 ${options.length > 1 ? "grid-cols-2" : "grid-cols-1 sm:max-w-[50%]"}`} role="radiogroup" aria-label="Karat purity">
        {options.map((k) => {
          const active = k.key === selected.key;
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
              <span className="block font-sans font-semibold tabular-nums tracking-tight text-2xl leading-none">{k.hallmark}</span>
              <span className={`mt-1 block font-caps text-[10px] tracking-[0.2em] ${active ? "text-paper/80" : "text-muted"}`}>
                {k.label}
              </span>
            </button>
          );
        })}
      </div>

      {priceReady ? (
        <>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs text-muted">
                {selected.hallmark} · {selected.label} · {weightGrams} g
                {needsDiamondRate ? ` · ${diamondCarat} ct diamonds` : ""}
              </p>
              <p
                className={`mt-1.5 font-sans font-semibold tabular-nums tracking-tight text-3xl leading-none transition-colors duration-700 sm:text-4xl ${
                  changed ? "text-emerald-700" : "text-ink"
                }`}
                aria-live="polite"
              >
                {inr.format(price.total)}
              </p>
            </div>
            <p className="text-xs text-muted">
              Gold rate {inr.format(rate)}/g · {rateDate(rates!.updatedAt)}
            </p>
          </div>

          <p className="mt-3 text-sm text-ink/80">Inclusive of making charges &amp; GST · Final billing at store</p>
          <p className="mt-1 text-sm text-muted">📌 Patna Gold Market · {new Date().getFullYear()}</p>
        </>
      ) : (
        <p className="mt-5 rounded-2xl bg-ivory/60 px-4 py-3 text-sm text-muted">
          Today&apos;s {selected.label} price will be updated shortly — connect with us on WhatsApp for the current
          price.
        </p>
      )}
    </div>
  );
}
