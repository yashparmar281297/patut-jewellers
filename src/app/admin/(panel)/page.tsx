import Link from "next/link";
import { getAdminSession } from "@/lib/admin";

export default async function AdminDashboardPage() {
  const { supabase } = await getAdminSession();
  const head = { count: "exact" as const, head: true };

  const [products, liveProducts, noPhotos, offers, activeOffers, testimonials] = await Promise.all([
    supabase.from("products").select("id", head),
    supabase.from("products").select("id", head).eq("is_published", true),
    supabase.from("products").select("id", head).filter("images", "eq", "{}"),
    supabase.from("offers").select("id", head),
    supabase.from("offers").select("id", head).eq("is_active", true),
    supabase.from("testimonials").select("id", head),
  ]);

  const stats = [
    { label: "Products", value: products.count ?? 0, note: `${liveProducts.count ?? 0} live on website` },
    {
      label: "Need photos",
      value: noPhotos.count ?? 0,
      note: "products without photos",
      href: "/admin/products?photos=missing",
    },
    { label: "Offers", value: offers.count ?? 0, note: `${activeOffers.count ?? 0} active` },
    { label: "Testimonials", value: testimonials.count ?? 0, note: "customer stories" },
  ];

  const tiles = [
    { section: "Catalogue", title: "Manage Products", text: "View every product, edit details and photos, hide or delete.", href: "/admin/products" },
    { section: "Catalogue", title: "Add New Product", text: "Add a gold or diamond piece with up to 12 photos.", href: "/admin/products/new", primary: true },
    { section: "Offers", title: "Manage Offers", text: "Edit, switch off or delete the offers shown on the home page.", href: "/admin/offers" },
    { section: "Offers", title: "Add Offer", text: "Create a new offer with a badge, photo and end date.", href: "/admin/offers/new" },
    { section: "Testimonials", title: "Manage Testimonials", text: "Edit, hide or delete customer feedback.", href: "/admin/testimonials" },
    { section: "Testimonials", title: "Add Testimonial", text: "Add customer feedback with a star rating and photo.", href: "/admin/testimonials/new" },
  ];

  return (
    <div>
      <p className="font-caps text-[10px] tracking-[0.3em] text-gold-deep">Patut Jewellers</p>
      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Admin Dashboard</h1>
      <p className="mt-1 text-muted">Manage your jewellery collection and website content.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const body = (
            <>
              <p className="font-caps text-[10px] tracking-[0.25em] text-muted">{stat.label}</p>
              <p className="mt-2 font-display text-4xl text-ink sm:text-5xl">{stat.value}</p>
              <p className="mt-1 text-xs text-muted">{stat.note}</p>
            </>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="rounded-2xl border border-gold/25 bg-white p-5 transition hover:border-gold">
              {body}
            </Link>
          ) : (
            <div key={stat.label} className="rounded-2xl border border-gold/25 bg-white p-5">
              {body}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className={`group rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-25px_rgba(120,90,40,0.6)] ${
              tile.primary ? "bg-gold border-transparent" : "border-gold/25 bg-white hover:border-gold"
            }`}
          >
            <p className={`text-sm ${tile.primary ? "text-ink/70" : "text-muted"}`}>{tile.section}</p>
            <h2 className="mt-2 font-display text-2xl text-ink">
              {tile.title} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </h2>
            <p className={`mt-2 text-sm ${tile.primary ? "text-ink/80" : "text-muted"}`}>{tile.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
