import { inr } from "@/lib/pricing";

/** Fixed price for a diamond piece, set per product in the admin. */
export default function DiamondPrice({ price }: { price: number | null }) {
  return (
    <div className="mt-8 rounded-3xl border border-gold/25 bg-paper p-5 sm:p-6">
      <p className="font-caps text-[11px] tracking-[0.3em] text-ink">Price</p>
      {price ? (
        <>
          <p className="mt-2 font-sans font-semibold tabular-nums tracking-tight text-3xl leading-none text-ink sm:text-4xl">
            {inr.format(price)}
          </p>
          <p className="mt-3 text-sm text-ink/80">Final billing at store</p>
        </>
      ) : (
        <p className="mt-3 rounded-2xl bg-ivory/60 px-4 py-3 text-sm text-muted">
          Price on request — connect with us on WhatsApp for the price of this piece.
        </p>
      )}
    </div>
  );
}
