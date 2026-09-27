import "server-only";

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
const refreshSeconds = Math.max(5, Number(process.env.METALS_REFRESH_MINUTES) || 30) * 60;

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
