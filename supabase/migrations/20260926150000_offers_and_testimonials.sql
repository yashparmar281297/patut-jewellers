-- Offers shown on the home page
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 600),
  badge text not null default '' check (char_length(badge) <= 40),
  image text check (image is null or image ~ '^offers/[a-z0-9-]+\.(webp|jpe?g|png|avif)$'),
  valid_until date,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger offers_set_updated_at
  before update on public.offers
  for each row execute function public.set_updated_at();

alter table public.offers enable row level security;

create policy "Anyone can view active offers"
  on public.offers for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy "Admins can add offers"
  on public.offers for insert to authenticated with check ((select public.is_admin()));
create policy "Admins can edit offers"
  on public.offers for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete offers"
  on public.offers for delete to authenticated using ((select public.is_admin()));

-- Customer testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 1 and 80),
  location text not null default '' check (char_length(location) <= 80),
  rating smallint not null default 5 check (rating between 1 and 5),
  message text not null check (char_length(message) between 1 and 1000),
  photo text check (photo is null or photo ~ '^testimonials/[a-z0-9-]+\.(webp|jpe?g|png|avif)$'),
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

alter table public.testimonials enable row level security;

create policy "Anyone can view published testimonials"
  on public.testimonials for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy "Admins can add testimonials"
  on public.testimonials for insert to authenticated with check ((select public.is_admin()));
create policy "Admins can edit testimonials"
  on public.testimonials for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete testimonials"
  on public.testimonials for delete to authenticated using ((select public.is_admin()));

-- Starter offers based on the store's own promises; edit or replace them in the admin.
insert into public.offers (title, description, badge, sort_order) values
  ('Easy Gold Exchange', 'Bring your old gold and exchange it at fair market value for a new piece you will love.', 'Exchange', 0),
  ('Custom Orders Welcome', 'Share your idea or an heirloom design — our karigars will craft it just for you. Visit the store to begin.', 'Bespoke', 1),
  ('BIS Hallmarked Purity', 'Every gold piece carries the 6-digit HUID hallmark, guaranteed. Buy with complete confidence.', 'Guaranteed', 2);
