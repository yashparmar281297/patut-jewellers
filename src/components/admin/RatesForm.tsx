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
    livePremiumPer10g: string;
  };
  /** Live MCX 24K rate per 10 g, or null when no feed is configured. */
  mcxGold10g: number | null;
}

export default function RatesForm({ initial, mcxGold10g }: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSaving, startSaving] = useTransition();
  const border = (key: string) => borderFor(fieldErrors, key);
  const num = (v: string) => (v.trim() === "" ? null : Number(v));

  const premium = num(values.livePremiumPer10g) ?? 0;
  const live24 = mcxGold10g !== null ? mcxGold10g + premium : null;
  const preview =
    values.mode === "live"
      ? live24 !== null
        ? { r22: live24 * karats[0].purity, r18: live24 * karats[1].purity }
        : null
      : num(values.rate22kPer10g) && num(values.rate18kPer10g)
        ? { r22: num(values.rate22kPer10g)!, r18: num(values.rate18kPer10g)! }
        : null;

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFieldErrors({});
    setMessage(null);
    startSaving(async () => {
      const result = await saveRateSettings({
        mode: values.mode,
        rate22kPer10g: num(values.rate22kPer10g),
        rate18kPer10g: num(values.rate18kPer10g),
        livePremiumPer10g: premium,
      });
      if (!result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setMessage({ ok: false, text: result.error });
        return;
      }
      setMessage({ ok: true, text: "Saved — the website now uses these rates." });
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <section className="space-y-6 rounded-3xl border border-gold/20 bg-paper p-5 sm:p-7">
        <div>
          <span className="font-caps text-[10px] tracking-[0.25em] text-muted">How should rates be set?</span>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["live", "Live (MCX-linked)", "Follows the live MCX rate automatically, plus your Patna premium."],
                ["manual", "Manual", "You type today's Patna 22K and 18K rates."],
              ] as const
            ).map(([mode, title, text]) => (
              <label
                key={mode}
                className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
                  values.mode === mode ? "border-gold bg-cream" : "border-gold/25 hover:border-gold"
                }`}
              >
                <span className="flex items-center gap-2 font-medium text-ink">
                  <input
                    type="radio"
                    name="mode"
                    checked={values.mode === mode}
                    onChange={() => setValues((v) => ({ ...v, mode }))}
                    className="accent-[#7b5321]"
                  />
                  {title}
                </span>
                <span className="mt-1 block text-sm text-muted">{text}</span>
              </label>
            ))}
          </div>
        </div>

        {values.mode === "live" ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-gold/20 bg-ivory/60 p-4 text-sm">
              {mcxGold10g !== null ? (
                <>
                  Live MCX 24K (999): <strong>{inr.format(mcxGold10g)}</strong> per 10 g
                </>
              ) : (
                <span className="text-amber-800">
                  The live MCX feed is not connected yet (METALS_DEV_API_KEY is not set). Until it is, the
                  website uses your manual rates below if you have entered them.
                </span>
              )}
            </div>
            <Field
              label="Patna premium (₹ per 10 g, added to the MCX 24K rate)"
              error={fieldErrors.livePremiumPer10g}
              hint="Use a negative number if the Patna market is below MCX"
            >
              <input
                type="number"
                step="1"
                value={values.livePremiumPer10g}
                onChange={(e) => setValues((v) => ({ ...v, livePremiumPer10g: e.target.value }))}
                className={`${inputClass} ${border("livePremiumPer10g")} max-w-56`}
              />
            </Field>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="916 · 22 Karat (₹ per 10 g)"
            error={fieldErrors.rate22kPer10g}
            hint={values.mode === "live" ? "Backup if the live feed is unavailable" : "Today's Patna rate"}
          >
            <input
              type="number"
              step="1"
              min="1"
              value={values.rate22kPer10g}
              onChange={(e) => setValues((v) => ({ ...v, rate22kPer10g: e.target.value }))}
              className={`${inputClass} ${border("rate22kPer10g")}`}
            />
          </Field>
          <Field
            label="750 · 18 Karat (₹ per 10 g)"
            error={fieldErrors.rate18kPer10g}
            hint={values.mode === "live" ? "Backup if the live feed is unavailable" : "Today's Patna rate"}
          >
            <input
              type="number"
              step="1"
              min="1"
              value={values.rate18kPer10g}
              onChange={(e) => setValues((v) => ({ ...v, rate18kPer10g: e.target.value }))}
              className={`${inputClass} ${border("rate18kPer10g")}`}
            />
          </Field>
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
          {isSaving ? "Saving…" : "Save rates"}
        </button>
      </section>

      <section className="rounded-3xl border border-gold/20 bg-paper p-5 sm:p-7">
        <h2 className="font-display text-2xl text-ink">Website preview</h2>
        {preview ? (
          <>
            <dl className="mt-4 space-y-3">
              {[
                ["916 · 22 Karat", preview.r22],
                ["750 · 18 Karat", preview.r18],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-baseline justify-between border-b border-gold/15 pb-3">
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-display text-2xl text-ink">
                    {inr.format(value as number)} <span className="text-sm text-muted">/ 10 g</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted">
              Example: a 21 g piece in 22K with 12% making charges shows{" "}
              <strong className="text-ink">{inr.format(priceBreakup(preview.r22 / 10, 21, 12).total)}</strong>{" "}
              including 3% GST.
            </p>
          </>
        ) : (
          <p className="mt-4 text-sm text-muted">
            No rates yet. Enter today&apos;s 22K and 18K rates to show prices on the website.
          </p>
        )}
      </section>
    </form>
  );
}
