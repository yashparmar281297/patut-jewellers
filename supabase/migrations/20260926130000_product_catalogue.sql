-- Admins: users allowed to manage the catalogue
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create policy "Admins can see their own admin row"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

-- RLS on public.admins lets a signed-in user see only their own row,
-- so the check works without elevated privileges.
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 120),
  metal text not null check (metal in ('gold', 'diamond')),
  category text not null check (category in (
    'ladies-ring', 'gents-ring', 'necklace', 'earring', 'jhumka',
    'bangles', 'chain', 'mangalsutra', 'bracelet'
  )),
  purity text not null default '22K' check (purity in ('24K', '22K', '18K', '14K')),
  weight numeric(8, 2) not null check (weight > 0),
  diamond_carat numeric(6, 2) check (diamond_carat is null or diamond_carat > 0),
  description text not null default '',
  images text[] not null default '{}',
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_listing_idx on public.products (metal, category, sort_order) where is_published;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;

create policy "Anyone can view published products"
  on public.products for select to anon, authenticated
  using (is_published or (select public.is_admin()));

create policy "Admins can add products"
  on public.products for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins can edit products"
  on public.products for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete products"
  on public.products for delete to authenticated
  using ((select public.is_admin()));

-- Product photos: public to view, only admins can upload/replace/delete
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images', 'product-images', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

create policy "Admins can view product image objects"
  on storage.objects for select to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));

create policy "Admins can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and (select public.is_admin()));

create policy "Admins can update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));

create policy "Admins can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));
