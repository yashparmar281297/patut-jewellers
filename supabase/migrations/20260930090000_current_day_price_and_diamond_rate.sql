-- Prices come from the rates the store sets each day.
alter table public.gold_rate_settings
  add column diamond_rate_per_carat numeric(12, 2)
  check (diamond_rate_per_carat is null or diamond_rate_per_carat > 0);
alter table public.gold_rate_settings alter column mode set default 'manual';
update public.gold_rate_settings set mode = 'manual';

-- Diamond pieces also offer 22K and/or 18K gold settings.
update public.products
set gold_purities = case when purity in ('22K', '18K') then array[purity] else array['18K'] end
where metal = 'diamond' and cardinality(gold_purities) = 0;

alter table public.products drop constraint products_gold_purities_required;
alter table public.products
  add constraint products_gold_purities_required check (cardinality(gold_purities) >= 1);
