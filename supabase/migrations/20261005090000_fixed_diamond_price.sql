-- Diamond jewellery is sold at a fixed price set per product.
alter table public.products
  add column price numeric(12, 2) check (price is null or price > 0);

-- Karat purity (22K/18K) only applies to gold pieces.
alter table public.products drop constraint products_gold_purities_required;
update public.products set gold_purities = '{}' where metal = 'diamond';
alter table public.products
  add constraint products_gold_purities_required check (metal <> 'gold' or cardinality(gold_purities) >= 1);

-- The per-carat diamond rate is no longer used.
alter table public.gold_rate_settings drop column diamond_rate_per_carat;
