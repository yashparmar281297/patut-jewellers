import "server-only";

import { karats, type GoldRates } from "@/lib/pricing";
import { publicClient } from "@/lib/supabase/public";

export interface McxRates {
  /** MCX gold (999) in INR per 10 grams. */
  gold10g: number;
  /** MCX silver (999) in INR per kilogram. */
  silver1kg: number;
  /** When the exchange price was last updated (ISO time). */
  updatedAt: string;
}

// One cached request serves every visitor; 30 minutes stays within Metals.Dev's 2,000-request plan.
// On the free plan (100 requests/month) set METALS_REFRESH_MINUTES to 480 or more.
const refreshSeconds = Math.round(Math.max(1, Number(process.env.METALS_REFRESH_MINUTES) || 30) * 60);

/**
 * Live MCX (Multi Commodity Exchange of India) gold and silver prices from Metals.Dev.
 * Returns null when no API key is configured or the provider is unavailable, so the page
 * simply hides the rates instead of showing stale or wrong numbers.
 */
export async function getMcxRates(): Promise<McxRates | null> {
  const key = process.env.METALS_DEV_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://api.metals.dev/v1/latest?api_key=${encodeURIComponent(key)}&currency=INR&unit=g`,
      { next: { revalidate: refreshSeconds, tags: ["mcx-rates"] } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const goldPerGram = Number(data?.metals?.mcx_gold);
    const silverPerGram = Number(data?.metals?.mcx_silver);
    if (!(goldPerGram > 0) || !(silverPerGram > 0)) return null;
    return {
      gold10g: goldPerGram * 10,
      silver1kg: silverPerGram * 1000,
      updatedAt: data?.timestamps?.metal ?? data?.timestamp ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export interface RateSettings {
  mode: "live" | "manual";
  rate22kPer10g: number | null;
  rate18kPer10g: number | null;
  livePremiumPer10g: number;
  diamondPerCarat: number | null;
  updatedAt: string;
}

/** The store's gold rate settings from the admin panel (Admin → Gold Rates). */
export async function getRateSettings(): Promise<RateSettings | null> {
  const { data, error } = await publicClient.from("gold_rate_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return null;
  return {
    mode: data.mode === "manual" ? "manual" : "live",
    rate22kPer10g: data.rate_22k_per_10g === null ? null : Number(data.rate_22k_per_10g),
    rate18kPer10g: data.rate_18k_per_10g === null ? null : Number(data.rate_18k_per_10g),
    livePremiumPer10g: Number(data.live_premium_per_10g) || 0,
    diamondPerCarat: data.diamond_rate_per_carat === null ? null : Number(data.diamond_rate_per_carat),
    updatedAt: data.updated_at,
  };
}

function manualRates(settings: RateSettings | null): GoldRates | null {
  if (!settings?.rate22kPer10g || !settings.rate18kPer10g) return null;
  return {
    rate22kPerGram: settings.rate22kPer10g / 10,
    rate18kPerGram: settings.rate18kPer10g / 10,
    rate24kPerGram: null,
    diamondPerCarat: settings.diamondPerCarat,
    source: "manual",
    updatedAt: settings.updatedAt,
  };
}

/**
 * Today's 22K and 18K rates for the Patna market.
 * Live mode: MCX 24K (999) plus the store premium, scaled by purity (916 / 750).
 * Manual mode — or live mode with no MCX feed — uses the rates entered in the admin.
 */
export async function getGoldRates(): Promise<GoldRates | null> {
  const settings = await getRateSettings();
  if (settings?.mode === "manual") return manualRates(settings);

  const mcx = await getMcxRates();
  if (mcx) {
    const rate24 = (mcx.gold10g + (settings?.livePremiumPer10g ?? 0)) / 10;
    return {
      rate22kPerGram: rate24 * karats[0].purity,
      rate18kPerGram: rate24 * karats[1].purity,
      rate24kPerGram: rate24,
      diamondPerCarat: settings?.diamondPerCarat ?? null,
      source: "live",
      updatedAt: mcx.updatedAt,
    };
  }
  return manualRates(settings);
}
