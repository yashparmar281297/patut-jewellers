// Gold price calculation shared by the server (rates), the product page and the admin form.

export const GOLD_GST_PERCENT = 3;

export const karats = [
  { key: "22K", hallmark: "916", label: "22 Karat", purity: 0.916 },
  { key: "18K", hallmark: "750", label: "18 Karat", purity: 0.75 },
] as const;

export type KaratKey = (typeof karats)[number]["key"];

/** Gold rates in rupees per gram. */
export interface GoldRates {
  rate22kPerGram: number;
  rate18kPerGram: number;
  /** Live MCX 24K (999) rate per gram including the store premium; null for manual rates. */
  rate24kPerGram: number | null;
  /** Diamond rate in rupees per carat, set daily in the admin; null when not set. */
  diamondPerCarat: number | null;
  source: "live" | "manual";
  updatedAt: string;
}

export function ratePerGram(rates: GoldRates, karat: KaratKey) {
  return karat === "22K" ? rates.rate22kPerGram : rates.rate18kPerGram;
}

export interface PriceBreakup {
  goldValue: number;
  makingCharges: number;
  diamondValue: number;
  gst: number;
  total: number;
}

/**
 * Final price = weight × today's gold rate (gold value)
 *             + making charges (a % of the gold value)
 *             + diamond value (carats × today's diamond rate, diamond pieces only)
 *             + 3% GST on all of the above.
 */
export function priceBreakup(
  ratePerGramValue: number,
  weightGrams: number,
  makingPercent: number,
  diamondValueRupees = 0,
): PriceBreakup {
  // Round each line to whole rupees so the breakup always adds up to the total shown.
  const goldValue = Math.round(ratePerGramValue * weightGrams);
  const makingCharges = Math.round((goldValue * makingPercent) / 100);
  const diamondValue = Math.round(diamondValueRupees);
  const gst = Math.round(((goldValue + makingCharges + diamondValue) * GOLD_GST_PERCENT) / 100);
  return { goldValue, makingCharges, diamondValue, gst, total: goldValue + makingCharges + diamondValue + gst };
}

export const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
