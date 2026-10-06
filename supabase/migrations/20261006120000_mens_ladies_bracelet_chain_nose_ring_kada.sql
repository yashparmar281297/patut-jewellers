-- Split Bracelet and Chain into Men's and Ladies, and add Nose Ring and Kada.
alter table public.products drop constraint products_category_check;

update public.products set category = 'mens-bracelet'
where slug in ('gold-cuban-link-bracelet', 'gold-bracelet', 'gold-bracelet-1');
update public.products set category = 'ladies-bracelet' where category = 'bracelet';
update public.products set category = 'mens-chain' where slug = 'gold-box-chain';
update public.products set category = 'ladies-chain' where category = 'chain';

alter table public.products add constraint products_category_check check (category in (
  'ladies-ring', 'gents-ring', 'necklace', 'earring', 'jhumka', 'bangles', 'kada',
  'mens-chain', 'ladies-chain', 'mangalsutra', 'mens-bracelet', 'ladies-bracelet',
  'dholna', 'tika', 'nathiya', 'nose-pin', 'nose-ring'
));
