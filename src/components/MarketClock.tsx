"use client";

import { useEffect, useState } from "react";

const TIME_ZONE = "Asia/Kolkata";

/** Parts of a moment as seen in India. */
function istParts(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TIME_ZONE,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return { weekday: parts.weekday, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

/** US daylight saving (2nd Sunday of March to 1st Sunday of November) shifts MCX's closing time. */
function isUsDaylightSaving(date: Date) {
  const year = date.getUTCFullYear();
  const nthSunday = (month: number, n: number) => {
    const first = new Date(Date.UTC(year, month, 1));
    return Date.UTC(year, month, 1 + ((7 - first.getUTCDay()) % 7) + (n - 1) * 7, 7);
  };
  const t = date.getTime();
  return t >= nthSunday(2, 2) && t < nthSunday(10, 1);
}

/**
 * MCX bullion trades Monday–Friday from 9:00 AM to 11:30 PM IST (11:55 PM when US daylight
 * saving is off). Exchange holidays are not included.
 */
export function isMcxOpen(date: Date) {
  const { weekday, minutes } = istParts(date);
  if (weekday === "Sat" || weekday === "Sun") return false;
  const close = isUsDaylightSaving(date) ? 23 * 60 + 30 : 23 * 60 + 55;
  return minutes >= 9 * 60 && minutes < close;
}

export default function MarketClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const date = now
    ? now.toLocaleDateString("en-IN", { timeZone: TIME_ZONE, weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "—";
  const time = now
    ? now.toLocaleTimeString("en-IN", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })
    : "—";
  const open = now ? isMcxOpen(now) : null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink">
      <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-2.5 py-1 font-caps text-[10px] font-semibold tracking-[0.25em] text-white">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        Live
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden>📅</span>
        <span suppressHydrationWarning>{date}</span>
      </span>
      <span className="inline-flex items-center gap-1.5 tabular-nums">
        <span aria-hidden>🕐</span>
        <span suppressHydrationWarning>{time}</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden>📍</span>
        India (IST)
      </span>
      {open !== null && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            open ? "bg-emerald-600/10 text-emerald-800" : "bg-red-600/10 text-red-800"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${open ? "bg-emerald-500" : "bg-red-500"}`} />
          MCX {open ? "Open" : "Closed"}
        </span>
      )}
    </div>
  );
}
