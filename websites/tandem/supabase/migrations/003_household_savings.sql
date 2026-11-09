-- Poupança da casa: depósitos e levantamentos por membro

create table if not exists public.household_savings_movements (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  user_id uuid not null references public.profiles (id),
  direction text not null check (direction in ('deposit', 'withdrawal')),
  amount numeric(12, 2) not null check (amount > 0),
  occurred_on date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists household_savings_movements_household_idx
  on public.household_savings_movements (household_id, occurred_on desc);

alter table public.household_savings_movements enable row level security;

drop policy if exists household_savings_select on public.household_savings_movements;
create policy household_savings_select on public.household_savings_movements
  for select to authenticated
  using (household_id = public.my_household_id());

drop policy if exists household_savings_insert on public.household_savings_movements;
create policy household_savings_insert on public.household_savings_movements
  for insert to authenticated
  with check (
    household_id = public.my_household_id()
    and user_id = auth.uid()
  );

drop policy if exists household_savings_delete_own on public.household_savings_movements;
create policy household_savings_delete_own on public.household_savings_movements
  for delete to authenticated
  using (household_id = public.my_household_id() and user_id = auth.uid());
