-- Making charges become a percentage of the gold value (no per-gram values had been set).
alter table public.products drop column making_charge_per_gram;
alter table public.products
  add column making_charge_percent numeric(5, 2) not null default 0
  check (making_charge_percent >= 0 and making_charge_percent <= 100);

-- Gold pieces can be offered in 22K, 18K or both.
alter table public.products
  add column gold_purities text[] not null default '{}'
  check (gold_purities <@ array['22K', '18K']::text[]);

update public.products
set gold_purities = case when purity in ('22K', '18K') then array[purity] else array['22K'] end
where metal = 'gold';

alter table public.products
  add constraint products_gold_purities_required
  check (metal <> 'gold' or cardinality(gold_purities) >= 1);
