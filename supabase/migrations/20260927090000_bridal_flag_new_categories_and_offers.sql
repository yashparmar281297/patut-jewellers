-- New sub-categories: Dholna, Tika, Nathiya
alter table public.products drop constraint products_category_check;
alter table public.products add constraint products_category_check check (category in (
  'ladies-ring', 'gents-ring', 'necklace', 'earring', 'jhumka', 'bangles',
  'chain', 'mangalsutra', 'bracelet', 'dholna', 'tika', 'nathiya'
));

-- Products can be tagged into the Bridal collection
alter table public.products add column is_bridal boolean not null default false;
create index products_bridal_idx on public.products (sort_order) where is_bridal and is_published;

-- Starter bridal tags for the sample pieces in traditional bridal categories
update public.products set is_bridal = true
where category in ('necklace', 'jhumka', 'bangles', 'mangalsutra');

-- Replace the starter offers with the store's current offers
delete from public.offers
where title in ('Easy Gold Exchange', 'Custom Orders Welcome', 'BIS Hallmarked Purity');

insert into public.offers (title, description, badge, sort_order) values
  ('Flat 100% Off on Making Charges', 'Flat 100% off on making charges of all diamond jewellery at Patut Jewellers.', 'Diamond Jewellery', 0),
  ('Free Silver Coin', 'Get a free silver coin of equal weight with every purchase of gold jewellery.', 'Gold Jewellery', 1);
