import Image from "next/image";
import Link from "next/link";
import { deleteOffer, setOfferActive } from "@/app/admin/actions/offers";
import DeleteButton from "@/components/admin/DeleteButton";
import PageHeader from "@/components/admin/PageHeader";
import StatusToggle from "@/components/admin/StatusToggle";
import { getAdminSession } from "@/lib/admin";
import { mediaUrl } from "@/lib/catalog";

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminOffersPage() {
  const { supabase } = await getAdminSession();
  const { data: offers, error } = await supabase
    .from("offers")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  const today = new Date().toISOString().slice(0, 10);
  const count = offers?.length ?? 0;

  return (
    <div>
      <PageHeader
        section="Offers"
        title="All Offers"
        subtitle={`${count} offer${count === 1 ? "" : "s"} · active offers appear on the home page`}
        back={{ href: "/admin", label: "Back to Dashboard" }}
        action={{ href: "/admin/offers/new", label: "+ Add Offer" }}
      />
      {error && <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error.message}</p>}

      {count === 0 ? (
        <div className="rounded-2xl border border-gold/25 bg-white p-10 text-center text-muted">No offers yet.</div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {offers!.map((offer) => {
            const expired = offer.valid_until !== null && offer.valid_until < today;
            return (
              <li key={offer.id} className="flex gap-4 rounded-2xl border border-gold/25 bg-white p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_30%_20%,#fdf1d3,#e2bf78)] sm:w-28">
                  {offer.image && <Image src={mediaUrl(offer.image)} alt="" fill sizes="112px" className="object-cover" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    {offer.badge && (
                      <span className="rounded-full bg-cream px-2 py-0.5 font-caps text-[9px] tracking-[0.2em] text-gold-deep">
                        {offer.badge}
                      </span>
                    )}
                    {offer.valid_until && (
                      <span className={`text-xs ${expired ? "text-red-700" : "text-muted"}`}>
                        {expired ? "Expired" : "Until"} {formatDate(offer.valid_until)}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/admin/offers/${offer.id}`}
                    className="mt-1 font-display text-2xl leading-tight text-ink hover:text-gold-deep"
                  >
                    {offer.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{offer.description}</p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <StatusToggle id={offer.id} value={offer.is_active} action={setOfferActive} onLabel="Active" offLabel="Off" />
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/offers/${offer.id}`}
                        className="inline-flex h-8 items-center rounded-lg border border-gold/40 px-3 text-xs font-medium text-gold-deep hover:bg-gold hover:text-ink"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={offer.id} name={offer.title} action={deleteOffer} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
