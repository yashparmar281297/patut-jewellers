// Gold price calculation shared by the server (rates) and the product page calculator.

export const GOLD_GST_RATE = 0.03;

export const karats = [
  { key: "22k", hallmark: "916", label: "22 Karat", purity: 0.916 },
  { key: "18k", hallmark: "750", label: "18 Karat", purity: 0.75 },
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
  return karat === "22k" ? rates.rate22kPerGram : rates.rate18kPerGram;
}

export interface PriceBreakup {
  goldValue: number;
  makingCharges: number;
  gst: number;
  total: number;
}

/**
 * Gold value (rate × weight) + making charges (per gram × weight), then 3% GST on that
 * sum — GST on jewellery applies to the full sale value including making charges.
 */
export function priceBreakup(rate: number, weightGrams: number, makingPerGram: number): PriceBreakup {
  const goldValue = rate * weightGrams;
  const makingCharges = makingPerGram * weightGrams;
  const gst = (goldValue + makingCharges) * GOLD_GST_RATE;
  return {
    goldValue: Math.round(goldValue),
    makingCharges: Math.round(makingCharges),
    gst: Math.round(gst),
    total: Math.round(goldValue + makingCharges + gst),
  };
}

export const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
