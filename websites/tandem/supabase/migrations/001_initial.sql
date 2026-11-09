-- Planilha: finanças partilhadas (household) + alimentação/treino individuais

create extension if not exists "pgcrypto";

create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Casa',
  invite_code text not null unique default substr(encode(gen_random_bytes(9), 'hex'), 1, 12),
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  household_id uuid references public.households (id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create table public.finance_categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  slug text not null,
  label text not null,
  kind text not null check (kind in ('income', 'expense')),
  sort_order int not null default 0,
  unique (household_id, slug)
);

create table public.finance_entries (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  user_id uuid not null references public.profiles (id),
  category_id uuid not null references public.finance_categories (id),
  amount numeric(12, 2) not null check (amount > 0),
  entry_type text not null check (entry_type in ('income', 'expense')),
  occurred_on date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create table public.meal_weeks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  week_start date not null,
  unique (user_id, week_start)
);

create table public.meal_items (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.meal_weeks (id) on delete cascade,
  day_index smallint not null check (day_index between 0 and 6),
  meal_slot text not null check (
    meal_slot in ('pequeno_almoco', 'almoco', 'jantar', 'lanche')
  ),
  title text not null,
  calories int not null default 0 check (calories >= 0),
  protein_g numeric(6, 1),
  notes text
);

create table public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  recorded_on date not null,
  weight_kg numeric(5, 2) check (weight_kg is null or weight_kg > 0),
  notes text,
  unique (user_id, recorded_on)
);

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  occurred_on date not null default current_date,
  activity text not null,
  duration_min int check (duration_min is null or duration_min > 0),
  notes text
);

create or replace function public.seed_finance_categories(p_household_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.finance_categories (household_id, slug, label, kind, sort_order) values
    (p_household_id, 'salario', 'Salário / rendimentos', 'income', 1),
    (p_household_id, 'outros_rendimentos', 'Outros rendimentos', 'income', 2),
    (p_household_id, 'poupanca', 'Poupança', 'expense', 10),
    (p_household_id, 'alimentacao', 'Alimentação', 'expense', 11),
    (p_household_id, 'saidas', 'Saídas', 'expense', 12),
    (p_household_id, 'combustivel', 'Combustível', 'expense', 13),
    (p_household_id, 'carro', 'Carro', 'expense', 14),
    (p_household_id, 'saude', 'Saúde', 'expense', 15),
    (p_household_id, 'educacao', 'Educação', 'expense', 16),
    (p_household_id, 'casa', 'Casa', 'expense', 17),
    (p_household_id, 'outro', 'Outro', 'expense', 99);
end;
$$;

create or replace function public.my_household_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select household_id from public.profiles where id = auth.uid();
$$;

create or replace function public.create_household(household_name text default 'Casa')
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Não autenticado';
  end if;
  insert into public.households (name) values (coalesce(nullif(trim(household_name), ''), 'Casa'))
  returning id into new_id;
  update public.profiles set household_id = new_id where id = auth.uid();
  perform public.seed_finance_categories(new_id);
  return new_id;
end;
$$;

create or replace function public.join_household(code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  hid uuid;
  current_household uuid;
begin
  if auth.uid() is null then
    raise exception 'Não autenticado';
  end if;
  select household_id into current_household from public.profiles where id = auth.uid();
  if current_household is not null then
    raise exception 'Já pertences a uma casa';
  end if;
  select id into hid from public.households where invite_code = lower(trim(code));
  if hid is null then
    raise exception 'Código inválido';
  end if;
  update public.profiles set household_id = hid where id = auth.uid();
  return hid;
end;
$$;

grant execute on function public.create_household(text) to authenticated;
grant execute on function public.join_household(text) to authenticated;

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.finance_categories enable row level security;
alter table public.finance_entries enable row level security;
alter table public.meal_weeks enable row level security;
alter table public.meal_items enable row level security;
alter table public.body_metrics enable row level security;
alter table public.workout_logs enable row level security;

create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or household_id = public.my_household_id());

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy households_select on public.households
  for select to authenticated
  using (id = public.my_household_id());

create policy finance_categories_select on public.finance_categories
  for select to authenticated
  using (household_id = public.my_household_id());

create policy finance_entries_select on public.finance_entries
  for select to authenticated
  using (household_id = public.my_household_id());

create policy finance_entries_insert on public.finance_entries
  for insert to authenticated
  with check (
    household_id = public.my_household_id()
    and user_id = auth.uid()
  );

create policy finance_entries_update on public.finance_entries
  for update to authenticated
  using (household_id = public.my_household_id() and user_id = auth.uid())
  with check (household_id = public.my_household_id() and user_id = auth.uid());

create policy finance_entries_delete on public.finance_entries
  for delete to authenticated
  using (household_id = public.my_household_id() and user_id = auth.uid());

create policy meal_weeks_all on public.meal_weeks
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy meal_items_all on public.meal_items
  for all to authenticated
  using (
    exists (
      select 1 from public.meal_weeks w
      where w.id = week_id and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.meal_weeks w
      where w.id = week_id and w.user_id = auth.uid()
    )
  );

create policy body_metrics_all on public.body_metrics
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy workout_logs_all on public.workout_logs
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
