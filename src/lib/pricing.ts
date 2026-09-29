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
  source: "live" | "manual";
  updatedAt: string;
}

export function ratePerGram(rates: GoldRates, karat: KaratKey) {
  return karat === "22K" ? rates.rate22kPerGram : rates.rate18kPerGram;
}

export interface PriceBreakup {
  goldValue: number;
  makingCharges: number;
  gst: number;
  total: number;
}

/**
 * Final price = weight × live rate (gold value)
 *             + making charges (a % of the gold value)
 *             + 3% GST on gold value and making charges together.
 */
export function priceBreakup(ratePerGramValue: number, weightGrams: number, makingPercent: number): PriceBreakup {
  // Round each line to whole rupees so the breakup always adds up to the total shown.
  const goldValue = Math.round(ratePerGramValue * weightGrams);
  const makingCharges = Math.round((goldValue * makingPercent) / 100);
  const gst = Math.round(((goldValue + makingCharges) * GOLD_GST_PERCENT) / 100);
  return { goldValue, makingCharges, gst, total: goldValue + makingCharges + gst };
}

export const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
