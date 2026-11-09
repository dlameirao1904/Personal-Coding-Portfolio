-- Tipos de treino e tempos para comparação

alter table public.workout_logs
  add column if not exists activity_type text check (
    activity_type in ('treino_indoor', 'treino_outdoor', 'corrida_indoor', 'corrida_outdoor')
  ),
  add column if not exists duration_sec int check (duration_sec is null or duration_sec > 0),
  add column if not exists distance_km numeric(6, 2) check (distance_km is null or distance_km > 0);

update public.workout_logs
set activity_type = 'treino_indoor'
where activity_type is null;

create index if not exists workout_logs_user_type_idx
  on public.workout_logs (user_id, activity_type, occurred_on desc);
