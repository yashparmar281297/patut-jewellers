"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const suggestions = ["Jhumka", "Mangalsutra", "Tika", "Nathiya", "Dholna", "Gold chain", "Diamond ring", "Bangles"];

export function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

/** Full-width search panel that slides down from the header. */
export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function go(query: string) {
    const q = query.trim();
    if (!q) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-ink/30 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search jewellery"
        className={`fixed inset-x-0 top-0 z-[71] border-b border-gold/25 bg-ivory shadow-[0_30px_60px_-30px_rgba(123,83,33,0.5)] transition-transform duration-500 ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-3xl px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(input.current?.value ?? "");
            }}
            className="flex items-center gap-3 border-b-2 border-gold pb-3"
          >
            <SearchIcon className="h-6 w-6 shrink-0 text-gold-deep" />
            <input
              ref={input}
              type="search"
              name="q"
              placeholder="Search rings, jhumka, mangalsutra…"
              className="min-w-0 flex-1 bg-transparent font-display text-2xl text-ink outline-none placeholder:text-muted/60 sm:text-3xl"
            />
            <button type="button" onClick={onClose} className="shrink-0 p-1 text-muted hover:text-ink" aria-label="Close search">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </form>
          <p className="mt-5 font-caps text-[10px] tracking-[0.3em] text-muted">Popular searches</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => go(s)}
                className="rounded-full border border-gold/35 bg-paper px-4 py-2 text-sm text-ink transition-colors hover:border-gold hover:bg-cream"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
