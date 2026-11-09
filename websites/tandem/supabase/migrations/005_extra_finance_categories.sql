-- Categorias extra (só insere se ainda não existirem na casa)

create or replace function public.add_finance_category_if_missing(
  p_household_id uuid,
  p_slug text,
  p_label text,
  p_kind text,
  p_sort int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.finance_categories (household_id, slug, label, kind, sort_order)
  values (p_household_id, p_slug, p_label, p_kind, p_sort)
  on conflict (household_id, slug) do nothing;
end;
$$;

do $$
declare
  h record;
begin
  for h in select id from public.households loop
    perform public.add_finance_category_if_missing(h.id, 'lazer', 'Lazer', 'expense', 18);
    perform public.add_finance_category_if_missing(h.id, 'vestuario', 'Vestuário', 'expense', 19);
    perform public.add_finance_category_if_missing(h.id, 'subscricoes', 'Subscrições', 'expense', 20);
    perform public.add_finance_category_if_missing(h.id, 'telecomunicacoes', 'Telecomunicações', 'expense', 21);
    perform public.add_finance_category_if_missing(h.id, 'animais', 'Animais', 'expense', 22);
    perform public.add_finance_category_if_missing(h.id, 'presentes', 'Presentes', 'expense', 23);
    perform public.add_finance_category_if_missing(h.id, 'seguros', 'Seguros', 'expense', 24);
    perform public.add_finance_category_if_missing(h.id, 'filhos', 'Filhos', 'expense', 25);
  end loop;
end;
$$;
