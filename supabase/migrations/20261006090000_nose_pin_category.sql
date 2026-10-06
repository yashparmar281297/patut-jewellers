alter table public.products drop constraint products_category_check;
alter table public.products add constraint products_category_check check (category in (
  'ladies-ring', 'gents-ring', 'necklace', 'earring', 'jhumka', 'bangles',
  'chain', 'mangalsutra', 'bracelet', 'dholna', 'tika', 'nathiya', 'nose-pin'
));
