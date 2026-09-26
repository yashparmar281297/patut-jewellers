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

`/admin` opens a dashboard with Manage and Add pages for **Products**, **Offers** and **Testimonials** — each list has Edit, Delete and a Live/Hidden switch. Active offers and published testimonials appear on the home page automatically.

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

## Store details

Phone, WhatsApp, email, address and the announcement-bar lines are set in `src/lib/site.ts`. Empty fields are hidden. Set `NEXT_PUBLIC_SITE_URL` once the site is live so WhatsApp product messages include a link to the product.
