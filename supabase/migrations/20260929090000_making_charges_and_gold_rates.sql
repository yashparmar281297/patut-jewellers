-- Making charges per product, in rupees per gram
alter table public.products
  add column making_charge_per_gram numeric(10, 2) not null default 0
  check (making_charge_per_gram >= 0);

-- Store-wide gold rate settings (single row)
create table public.gold_rate_settings (
  id smallint primary key default 1 check (id = 1),
  mode text not null default 'live' check (mode in ('live', 'manual')),
  rate_22k_per_10g numeric(12, 2) check (rate_22k_per_10g is null or rate_22k_per_10g > 0),
  rate_18k_per_10g numeric(12, 2) check (rate_18k_per_10g is null or rate_18k_per_10g > 0),
  live_premium_per_10g numeric(12, 2) not null default 0,
  updated_at timestamptz not null default now()
);

create trigger gold_rate_settings_set_updated_at
  before update on public.gold_rate_settings
  for each row execute function public.set_updated_at();

alter table public.gold_rate_settings enable row level security;

create policy "Anyone can read gold rate settings"
  on public.gold_rate_settings for select to anon, authenticated using (true);
create policy "Admins can update gold rate settings"
  on public.gold_rate_settings for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

insert into public.gold_rate_settings (id) values (1);
