# Patut Jewellers

Storefront and catalogue admin for Patut Jewellers — Next.js 16, Tailwind CSS 4, React Three Fiber and Supabase.

## Getting started

1. Copy `.env.example` to `.env.local` and fill in the Supabase URL and anon key.
2. Install and run:

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000 and the admin panel at http://localhost:3000/admin.

## Admin panel

`/admin` opens a dashboard with Manage and Add pages for **Products**, **Offers** and **Testimonials** — each list has Edit, Delete and a Live/Hidden switch. Active offers and published testimonials appear on the home page automatically. Tick **Bridal collection** on a product to include it on the `/bridal` page.

## Data (Supabase)

- `public.products` holds every piece. Visitors can read published products only; row-level security limits all writes to admins.
- Photos live in the public `product-images` storage bucket under `products/`. The admin panel resizes photos to at most 2000px WebP in the browser before uploading.
- `public.offers` and `public.testimonials` hold the home page offers and customer feedback (images under `offers/` and `testimonials/` in the same bucket).
- `public.admins` lists the users allowed to manage the catalogue.
- The schema is in `supabase/migrations/`.

Storefront pages are cached for up to 5 minutes; saving in the admin panel refreshes them immediately.

### Adding an admin

1. In the Supabase dashboard, open **Authentication → Users → Add user** and create a user with email and password (tick *Auto confirm*).
2. In the **SQL editor**, run:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'owner@example.com';
```

3. Sign in at `/admin/login`.

## Gold rates and live prices

- The home page shows a live clock (IST), MCX open/closed status (Mon–Fri 9:00 AM – 11:30 PM, 11:55 PM in winter; exchange holidays not included) and today's Patna 22K (916) and 18K (750) rates.
- Gold product pages let customers pick 916 · 22 Karat or 750 · 18 Karat and show a live price: (rate per gram + the product's making charge per gram) × weight, plus 3% GST. The price re-checks `/api/rates` every minute.
- **Admin → Gold Rates** chooses the source:
  - **Live (MCX-linked)** — MCX 24K from [Metals.Dev](https://metals.dev) plus a Patna premium per 10 g; 22K = 24K × 0.916, 18K = 24K × 0.75. Needs `METALS_DEV_API_KEY`; refreshes every `METALS_REFRESH_MINUTES` (default 30; use 480+ on the free plan).
  - **Manual** — today's Patna 22K and 18K rates per 10 g. These also act as the backup when the live feed is unavailable.
- Set each product's making charges (₹ per gram) in the product form.

## Store details

Phone, WhatsApp, email, address and the announcement-bar lines are set in `src/lib/site.ts`. Empty fields are hidden. Set `NEXT_PUBLIC_SITE_URL` once the site is live so WhatsApp product messages include a link to the product.
