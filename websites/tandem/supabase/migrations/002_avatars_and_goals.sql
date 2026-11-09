-- Correr no SQL Editor depois do 001_initial (projeto já criado)

alter table public.profiles
  add column if not exists avatar_url text;

alter table public.households
  add column if not exists avatar_url text;

create table if not exists public.household_goals (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  kind text not null check (kind in ('poupanca', 'gastos_conjuntos', 'ferias', 'outro')),
  title text not null,
  target_amount numeric(12, 2),
  target_date date,
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.household_goals enable row level security;

drop policy if exists household_goals_all on public.household_goals;
create policy household_goals_all on public.household_goals
  for all to authenticated
  using (household_id = public.my_household_id())
  with check (household_id = public.my_household_id());

drop policy if exists households_update on public.households;
create policy households_update on public.households
  for update to authenticated
  using (id = public.my_household_id())
  with check (id = public.my_household_id());

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

drop policy if exists "avatars profile write" on storage.objects;
create policy "avatars profile write"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername (name))[1] = 'profiles'
    and (storage.foldername (name))[2] = auth.uid()::text
  );

drop policy if exists "avatars profile update" on storage.objects;
create policy "avatars profile update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername (name))[1] = 'profiles'
    and (storage.foldername (name))[2] = auth.uid()::text
  );

drop policy if exists "avatars household write" on storage.objects;
create policy "avatars household write"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername (name))[1] = 'households'
    and (storage.foldername (name))[2] = public.my_household_id()::text
  );

drop policy if exists "avatars household update" on storage.objects;
create policy "avatars household update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername (name))[1] = 'households'
    and (storage.foldername (name))[2] = public.my_household_id()::text
  );
