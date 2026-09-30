"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveRateSettings } from "@/app/admin/actions/rates";
import { borderFor, Field, inputClass } from "@/components/admin/fields";
import { inr, karats, priceBreakup } from "@/lib/pricing";

interface Props {
  initial: {
    mode: "live" | "manual";
    rate22kPer10g: string;
    rate18kPer10g: string;
    diamondRatePerCarat: string;
    livePremiumPer10g: string;
  };
  /** When the rates were last saved (ISO), to remind the owner to update them daily. */
  lastSaved: string | null;
  /** Live MCX 24K rate per 10 g, or null when no feed is configured. */
  mcxGold10g: number | null;
}

function istDay(date: Date) {
  return date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" });
}

export default function RatesForm({ initial, lastSaved, mcxGold10g }: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [showAdvanced, setShowAdvanced] = useState(initial.mode === "live");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSaving, startSaving] = useTransition();
  const border = (key: string) => borderFor(fieldErrors, key);
  const num = (v: string) => (v.trim() === "" ? null : Number(v));
  const set = (key: keyof Props["initial"], value: string) => setValues((v) => ({ ...v, [key]: value }));

  const today = istDay(new Date());
  const savedToday = lastSaved !== null && istDay(new Date(lastSaved)) === today;
  const r22 = num(values.rate22kPer10g);
  const r18 = num(values.rate18kPer10g);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFieldErrors({});
    setMessage(null);
    startSaving(async () => {
      const result = await saveRateSettings({
        mode: values.mode,
        rate22kPer10g: r22,
        rate18kPer10g: r18,
        diamondRatePerCarat: num(values.diamondRatePerCarat),
        livePremiumPer10g: num(values.livePremiumPer10g) ?? 0,
      });
      if (!result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setMessage({ ok: false, text: result.error });
        return;
      }
      setMessage({ ok: true, text: `Saved — website prices now use the rates for ${today}.` });
      router.refresh();
    });
  }

  const perGram = (per10g: number | null) => (per10g ? `${inr.format(per10g / 10)} per gram` : undefined);

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <section className="space-y-6 rounded-3xl border border-gold/20 bg-paper p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-3xl text-ink">Current Day Price</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs ${
              savedToday ? "bg-emerald-600/10 text-emerald-800" : "bg-amber-500/15 text-amber-900"
            }`}
          >
            {savedToday ? `Updated today · ${today}` : `Not updated today (${today})`}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Gold 916 · 22 Karat (₹ per 10 g)" error={fieldErrors.rate22kPer10g} hint={perGram(r22)}>
            <input
              type="number"
              step="1"
              min="1"
              value={values.rate22kPer10g}
              onChange={(e) => set("rate22kPer10g", e.target.value)}
              className={`${inputClass} ${border("rate22kPer10g")}`}
            />
          </Field>
          <Field label="Gold 750 · 18 Karat (₹ per 10 g)" error={fieldErrors.rate18kPer10g} hint={perGram(r18)}>
            <input
              type="number"
              step="1"
              min="1"
              value={values.rate18kPer10g}
              onChange={(e) => set("rate18kPer10g", e.target.value)}
              className={`${inputClass} ${border("rate18kPer10g")}`}
            />
          </Field>
        </div>
        <Field
          label="Diamond (₹ per carat)"
          error={fieldErrors.diamondRatePerCarat}
          hint="Used for diamond jewellery: diamond carats × this rate is added to the gold price"
        >
          <input
            type="number"
            step="1"
            min="1"
            value={values.diamondRatePerCarat}
            onChange={(e) => set("diamondRatePerCarat", e.target.value)}
            className={`${inputClass} ${border("diamondRatePerCarat")} block sm:max-w-[50%]`}
          />
        </Field>

        <div className="rounded-2xl border border-gold/20 bg-ivory/50 p-4 text-sm">
          <button type="button" onClick={() => setShowAdvanced((v) => !v)} className="text-gold-deep underline underline-offset-4">
            {showAdvanced ? "Hide advanced" : "Advanced: follow the MCX rate automatically"}
          </button>
          {showAdvanced && (
            <div className="mt-3 space-y-3">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={values.mode === "live"}
                  onChange={(e) => set("mode", e.target.checked ? "live" : "manual")}
                  className="mt-1 accent-[#7b5321]"
                />
                <span>
                  Use the live MCX 24K rate (+ premium below) instead of the gold rates above. Your rates above stay as
                  the backup.
                  <span className="mt-1 block text-muted">
                    {mcxGold10g !== null
                      ? `Live MCX 24K now: ${inr.format(mcxGold10g)} per 10 g`
                      : "Live MCX feed not connected (METALS_DEV_API_KEY is not set)."}
                  </span>
                </span>
              </label>
              {values.mode === "live" && (
                <Field label="Patna premium (₹ per 10 g, added to MCX 24K)" error={fieldErrors.livePremiumPer10g}>
                  <input
                    type="number"
                    step="1"
                    value={values.livePremiumPer10g}
                    onChange={(e) => set("livePremiumPer10g", e.target.value)}
                    className={`${inputClass} ${border("livePremiumPer10g")} max-w-56`}
                  />
                </Field>
              )}
            </div>
          )}
        </div>

        {message && (
          <p className={`rounded-xl px-4 py-3 text-sm ${message.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="bg-gold rounded-full px-8 py-3 font-caps text-xs tracking-[0.2em] text-paper disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save today's price"}
        </button>
      </section>

      <section className="rounded-3xl border border-gold/20 bg-paper p-5 sm:p-7">
        <h2 className="font-display text-2xl text-ink">How prices are worked out</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Final price = weight × gold rate for the chosen karat + making charges % + diamond value (diamond pieces) +
          3% GST.
        </p>
        {r22 && r18 ? (
          <dl className="mt-5 space-y-3 text-sm">
            {karats.map((k) => {
              const rate = (k.key === "22K" ? r22 : r18) / 10;
              return (
                <div key={k.key} className="rounded-xl bg-ivory/60 px-4 py-3">
                  <dt className="text-muted">
                    Example · 21 g in {k.hallmark} · {k.label}, 12% making
                  </dt>
                  <dd className="mt-1 font-display text-2xl text-ink">{inr.format(priceBreakup(rate, 21, 12).total)}</dd>
                </div>
              );
            })}
          </dl>
        ) : (
          <p className="mt-5 text-sm text-muted">Enter today&apos;s 22K and 18K rates to see example prices.</p>
        )}
      </section>
    </form>
  );
}
