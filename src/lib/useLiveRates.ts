"use client";

import { useEffect, useRef, useState } from "react";
import type { GoldRates } from "@/lib/pricing";

const POLL_MS = 10_000;

/**
 * Keeps gold rates fresh by polling /api/rates, and reports how many seconds ago
 * they were last confirmed (ticks every second).
 */
export function useLiveRates(initial: GoldRates | null) {
  const [rates, setRates] = useState<GoldRates | null>(initial);
  const [changed, setChanged] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const checkedAt = useRef(0);

  useEffect(() => {
    checkedAt.current = Date.now();
    let cancelled = false;

    async function refresh() {
      try {
        const res = await fetch("/api/rates", { cache: "no-store" });
        if (!res.ok) return;
        const { rates: next } = (await res.json()) as { rates: GoldRates | null };
        if (cancelled) return;
        checkedAt.current = Date.now();
        setRates((prev) => {
          if (prev && next && (prev.rate22kPerGram !== next.rate22kPerGram || prev.rate18kPerGram !== next.rate18kPerGram)) {
            setChanged(true);
            window.setTimeout(() => setChanged(false), 1500);
          }
          return next ?? prev;
        });
      } catch {
        // Keep the last known rates.
      }
    }

    const poll = window.setInterval(refresh, POLL_MS);
    const tick = window.setInterval(() => setSecondsAgo(Math.round((Date.now() - checkedAt.current) / 1000)), 1000);
    return () => {
      cancelled = true;
      window.clearInterval(poll);
      window.clearInterval(tick);
    };
  }, []);

  return { rates, changed, secondsAgo };
}
