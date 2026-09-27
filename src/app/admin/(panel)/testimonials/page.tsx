import Image from "next/image";
import Link from "next/link";
import { deleteTestimonial, setTestimonialPublished } from "@/app/admin/actions/testimonials";
import DeleteButton from "@/components/admin/DeleteButton";
import PageHeader from "@/components/admin/PageHeader";
import StatusToggle from "@/components/admin/StatusToggle";
import { Stars } from "@/components/TestimonialCard";
import { getAdminSession } from "@/lib/admin";
import { mediaUrl } from "@/lib/catalog";

export default async function AdminTestimonialsPage() {
  const { supabase } = await getAdminSession();
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  const count = testimonials?.length ?? 0;

  return (
    <div>
      <PageHeader
        section="Testimonials"
        title="Customer Testimonials"
        subtitle={`${count} testimonial${count === 1 ? "" : "s"} · the section appears on the home page once one is live`}
        back={{ href: "/admin", label: "Back to Dashboard" }}
        action={{ href: "/admin/testimonials/new", label: "+ Add Testimonial" }}
      />
      {error && <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error.message}</p>}

      {count === 0 ? (
        <div className="rounded-2xl border border-gold/25 bg-paper p-10 text-center text-muted">
          No testimonials yet. Add your customers&apos; feedback to show it on the website.
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {testimonials!.map((t) => (
            <li key={t.id} className="flex flex-col rounded-2xl border border-gold/25 bg-paper p-5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cream font-caps text-xs text-gold-deep">
                  {t.photo ? (
                    <Image src={mediaUrl(t.photo)} alt="" fill sizes="44px" className="object-cover" />
                  ) : (
                    t.customer_name.slice(0, 1).toUpperCase()
                  )}
                </span>
                <div className="min-w-0">
                  <Link
                    href={`/admin/testimonials/${t.id}`}
                    className="block truncate font-medium text-ink hover:text-gold-deep"
                  >
                    {t.customer_name}
                  </Link>
                  <p className="text-xs text-muted">{t.location || "—"}</p>
                </div>
                <Stars rating={t.rating} className="ml-auto" />
              </div>
              <p className="mt-3 line-clamp-3 font-display text-lg italic text-ink/85">&ldquo;{t.message}&rdquo;</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                <StatusToggle id={t.id} value={t.is_published} action={setTestimonialPublished} />
                <div className="flex gap-2">
                  <Link
                    href={`/admin/testimonials/${t.id}`}
                    className="inline-flex h-8 items-center rounded-lg border border-gold/40 px-3 text-xs font-medium text-gold-deep hover:bg-gold hover:text-ink"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={t.id} name={`${t.customer_name}'s testimonial`} action={deleteTestimonial} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
