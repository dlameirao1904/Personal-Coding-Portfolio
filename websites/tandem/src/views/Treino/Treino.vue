<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import WorkoutTimeChart from '@/components/WorkoutTimeChart.vue'
import { useAuth } from '@/composables/useAuth'
import { buildWorkoutStats, formatDuration, parseMinutesSeconds } from '@/domain/workoutTimes'
import { toISODate } from '@/domain/dates'
import { requireSupabase } from '@/lib/supabase'
import {
  DAY_LABELS,
  TRAINING_DAY_KIND_LABELS,
  WORKOUT_ACTIVITY_LABELS,
  type BodyMetric,
  type TrainingPlan,
  type TrainingPlanDay,
  type TrainingPlanExercise,
  type WorkoutActivityType,
  type WorkoutLog,
} from '@/types/supabase'

const { user } = useAuth()

const metrics = ref<BodyMetric[]>([])
const workouts = ref<WorkoutLog[]>([])
const trainingPlan = ref<TrainingPlan | null>(null)
const trainingDays = ref<TrainingPlanDay[]>([])
const selectedPlanDay = ref(0)
const loading = ref(false)
const treinoTab = ref<'plano' | 'registar' | 'tempos'>('plano')

const weightForm = ref({
  recorded_on: toISODate(),
  weight_kg: 0,
  notes: '',
})

const workoutForm = ref({
  occurred_on: toISODate(),
  activity_type: 'treino_indoor' as WorkoutActivityType,
  duration_min: 0,
  duration_sec_part: 0,
  distance_km: 0,
  notes: '',
})

const workoutTypes = Object.keys(WORKOUT_ACTIVITY_LABELS) as WorkoutActivityType[]

const todayDayIndex = computed(() => {
  const d = new Date().getDay()
  return (d + 6) % 7
})

const selectedDay = computed(() => trainingDays.value.find((d) => d.day_index === selectedPlanDay.value))

const murphWeeks = computed(() => {
  const rows = trainingPlan.value?.meta?.murph_weeks
  return Array.isArray(rows) ? rows : []
})

const longRunProgression = computed(() => {
  const rows = trainingPlan.value?.meta?.long_run_progression
  return Array.isArray(rows) ? rows : []
})

const latestWeight = computed(() => metrics.value[0]?.weight_kg ?? null)
const weightDelta = computed(() => {
  if (metrics.value.length < 2) return null
  const a = metrics.value[0].weight_kg
  const b = metrics.value[1].weight_kg
  if (a == null || b == null) return null
  return a - b
})

const workoutStats = computed(() => buildWorkoutStats(workouts.value, WORKOUT_ACTIVITY_LABELS))

const isRunType = computed(() =>
  ['corrida_indoor', 'corrida_outdoor'].includes(workoutForm.value.activity_type),
)

function parseExercises(raw: unknown): TrainingPlanExercise[] {
  if (!Array.isArray(raw)) return []
  return raw as TrainingPlanExercise[]
}

async function loadPlan() {
  if (!user.value) return
  const sb = requireSupabase()
  const { data: plan } = await sb.from('training_plans').select('*').maybeSingle()
  if (!plan) {
    trainingPlan.value = null
    trainingDays.value = []
    return
  }
  trainingPlan.value = plan as TrainingPlan
  const { data: days } = await sb
    .from('training_plan_days')
    .select('*')
    .eq('plan_id', plan.id)
    .order('day_index')
  trainingDays.value = (days ?? []).map((d) => ({
    ...(d as TrainingPlanDay),
    exercises: parseExercises((d as TrainingPlanDay).exercises),
  }))
  selectedPlanDay.value = todayDayIndex.value
}

async function load() {
  if (!user.value) return
  loading.value = true
  const sb = requireSupabase()
  const [{ data: m }, { data: w }] = await Promise.all([
    sb
      .from('body_metrics')
      .select('*')
      .eq('user_id', user.value.id)
      .order('recorded_on', { ascending: false })
      .limit(30),
    sb
      .from('workout_logs')
      .select('*')
      .eq('user_id', user.value.id)
      .order('occurred_on', { ascending: false })
      .limit(80),
  ])
  metrics.value = m ?? []
  workouts.value = (w ?? []) as WorkoutLog[]
  await loadPlan()
  loading.value = false
}

function applyPlanDayToForm(day: TrainingPlanDay) {
  if (day.suggested_activity_type) {
    workoutForm.value.activity_type = day.suggested_activity_type
  }
  const hint = day.duration_hint && day.duration_hint !== '—' ? ` · ${day.duration_hint}` : ''
  workoutForm.value.notes = `${day.title}${hint}`
  treinoTab.value = 'registar'
}

async function saveWeight() {
  if (!user.value || weightForm.value.weight_kg <= 0) return
  await requireSupabase().from('body_metrics').upsert(
    {
      user_id: user.value.id,
      recorded_on: weightForm.value.recorded_on,
      weight_kg: weightForm.value.weight_kg,
      notes: weightForm.value.notes.trim() || null,
    },
    { onConflict: 'user_id,recorded_on' },
  )
  weightForm.value.weight_kg = 0
  weightForm.value.notes = ''
  await load()
}

async function saveWorkout() {
  if (!user.value) return
  const durationSec = parseMinutesSeconds(
    workoutForm.value.duration_min,
    workoutForm.value.duration_sec_part,
  )
  if (durationSec == null) return

  const label = WORKOUT_ACTIVITY_LABELS[workoutForm.value.activity_type]

  await requireSupabase().from('workout_logs').insert({
    user_id: user.value.id,
    occurred_on: workoutForm.value.occurred_on,
    activity: label,
    activity_type: workoutForm.value.activity_type,
    duration_sec: durationSec,
    duration_min: Math.ceil(durationSec / 60),
    distance_km:
      isRunType.value && workoutForm.value.distance_km > 0 ? workoutForm.value.distance_km : null,
    notes: workoutForm.value.notes.trim() || null,
  })

  workoutForm.value.duration_min = 0
  workoutForm.value.duration_sec_part = 0
  workoutForm.value.distance_km = 0
  workoutForm.value.notes = ''
  treinoTab.value = 'tempos'
  await load()
}

function displayWorkoutTime(w: WorkoutLog): string {
  if (w.duration_sec) return formatDuration(w.duration_sec)
  if (w.duration_min) return `${w.duration_min} min`
  return '—'
}

onMounted(() => void load())
</script>

<template>
  <div class="tw-mx-auto tw-max-w-3xl tw-space-y-6 tw-px-4 tw-py-10">
    <header>
      <h1 class="tw-m-0 tw-text-2xl tw-font-semibold">Treino</h1>
      <p class="tw-mt-1 tw-mb-0 tw-text-sm tw-text-muted">
        {{ trainingPlan?.title ?? 'Plano semanal, registo de sessões e tempos.' }}
      </p>
    </header>

    <div class="tw-flex tw-gap-1 tw-overflow-x-auto tw-rounded-xl tw-bg-salt/80 tw-p-1">
      <button
        type="button"
        class="tw-shrink-0 tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm tw-font-medium"
        :class="treinoTab === 'plano' ? 'tw-bg-white tw-shadow-sm' : 'tw-text-muted'"
        @click="treinoTab = 'plano'"
      >
        Plano
      </button>
      <button
        type="button"
        class="tw-shrink-0 tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm tw-font-medium"
        :class="treinoTab === 'registar' ? 'tw-bg-white tw-shadow-sm' : 'tw-text-muted'"
        @click="treinoTab = 'registar'"
      >
        Registar
      </button>
      <button
        type="button"
        class="tw-shrink-0 tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm tw-font-medium"
        :class="treinoTab === 'tempos' ? 'tw-bg-white tw-shadow-sm' : 'tw-text-muted'"
        @click="treinoTab = 'tempos'"
      >
        Tempos
      </button>
    </div>

    <template v-if="treinoTab === 'plano'">
      <p v-if="!trainingPlan && !loading" class="tw-text-sm tw-text-muted">
        Sem plano carregado. Corre a migration <code class="tw-text-xs">014_seed_diogo_training_nutrition.sql</code> no
        Supabase.
      </p>

      <template v-else-if="trainingPlan">
        <p v-if="trainingPlan.summary" class="tw-m-0 tw-text-sm tw-text-muted">{{ trainingPlan.summary }}</p>

        <div class="tw-flex tw-gap-1 tw-overflow-x-auto tw-rounded-xl tw-border tw-border-salt tw-bg-white tw-p-1">
          <button
            v-for="(label, idx) in DAY_LABELS"
            :key="idx"
            type="button"
            class="tw-shrink-0 tw-rounded-lg tw-px-2.5 tw-py-1.5 tw-text-xs tw-font-medium"
            :class="selectedPlanDay === idx ? 'tw-bg-teal tw-text-paper' : 'tw-text-muted'"
            @click="selectedPlanDay = idx"
          >
            {{ label }}
          </button>
        </div>

        <section v-if="selectedDay" class="tw-space-y-4 tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card">
          <div class="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-2">
            <div>
              <h2 class="tw-m-0 tw-text-lg tw-font-semibold">{{ selectedDay.title }}</h2>
              <p class="tw-m-0 tw-mt-1 tw-text-xs tw-text-muted">
                {{ TRAINING_DAY_KIND_LABELS[selectedDay.kind] }}
                <span v-if="selectedDay.duration_hint"> · {{ selectedDay.duration_hint }}</span>
              </p>
              <p v-if="selectedDay.focus" class="tw-m-0 tw-mt-1 tw-text-sm">{{ selectedDay.focus }}</p>
            </div>
            <button
              v-if="selectedDay.kind !== 'rest'"
              type="button"
              class="tw-rounded-lg tw-bg-teal tw-px-3 tw-py-1.5 tw-text-xs tw-font-semibold tw-text-paper"
              @click="applyPlanDayToForm(selectedDay)"
            >
              Registar este dia
            </button>
          </div>

          <p v-if="selectedDay.description" class="tw-m-0 tw-whitespace-pre-line tw-text-sm tw-text-ink">
            {{ selectedDay.description }}
          </p>

          <table
            v-if="selectedDay.exercises.length"
            class="tw-w-full tw-border-collapse tw-text-sm"
          >
            <thead>
              <tr class="tw-border-b tw-border-salt tw-text-left tw-text-xs tw-text-muted">
                <th class="tw-py-2 tw-pr-2">Exercício</th>
                <th class="tw-py-2 tw-pr-2">Séries</th>
                <th class="tw-py-2">Reps</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(ex, i) in selectedDay.exercises"
                :key="i"
                class="tw-border-b tw-border-salt/60"
              >
                <td class="tw-py-2 tw-pr-2">
                  {{ ex.name }}
                  <span v-if="ex.note" class="tw-block tw-text-xs tw-text-muted">{{ ex.note }}</span>
                </td>
                <td class="tw-py-2 tw-pr-2 tw-font-mono">{{ ex.sets ?? '—' }}</td>
                <td class="tw-py-2 tw-font-mono">{{ ex.reps ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="murphWeeks.length" class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-5">
          <h3 class="tw-m-0 tw-mb-2 tw-text-base tw-font-semibold">Murph — rondas por semana</h3>
          <ul class="tw-m-0 tw-list-none tw-space-y-1 tw-p-0 tw-text-sm">
            <li v-for="(row, i) in murphWeeks" :key="i" class="tw-flex tw-justify-between tw-gap-2">
              <span>Semana {{ (row as { week?: number }).week ?? '—' }}</span>
              <span class="tw-font-mono">
                {{ (row as { rounds?: number }).rounds ?? 0 }} rondas
                <span v-if="(row as { note?: string }).note" class="tw-text-muted">
                  · {{ (row as { note?: string }).note }}
                </span>
              </span>
            </li>
          </ul>
        </section>

        <section v-if="longRunProgression.length" class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-5">
          <h3 class="tw-m-0 tw-mb-2 tw-text-base tw-font-semibold">Corrida longa — progressão</h3>
          <ul class="tw-m-0 tw-list-none tw-space-y-1 tw-p-0 tw-text-sm">
            <li v-for="(row, i) in longRunProgression" :key="i" class="tw-flex tw-justify-between tw-gap-2">
              <span>Semanas {{ (row as { weeks?: string }).weeks ?? '—' }}</span>
              <span class="tw-font-mono">
                {{ (row as { km?: string }).km ?? '—' }} km
                <span v-if="(row as { note?: string }).note" class="tw-text-muted">
                  · {{ (row as { note?: string }).note }}
                </span>
              </span>
            </li>
          </ul>
        </section>
      </template>
    </template>

    <template v-else-if="treinoTab === 'tempos'">
      <section class="tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card">
        <h2 class="tw-m-0 tw-mb-4 tw-text-base tw-font-semibold">Mapa de tempos</h2>
        <WorkoutTimeChart :stats="workoutStats" />
      </section>
    </template>

    <template v-else>
      <section class="tw-grid tw-gap-3 sm:tw-grid-cols-2">
        <div class="tw-rounded-2xl tw-bg-white tw-p-4 tw-shadow-card">
          <p class="tw-m-0 tw-text-xs tw-text-muted">Peso mais recente</p>
          <p class="tw-m-0 tw-mt-1 tw-font-mono tw-text-2xl tw-font-semibold">
            {{ latestWeight != null ? `${latestWeight} kg` : '—' }}
          </p>
          <p v-if="weightDelta != null" class="tw-m-0 tw-mt-1 tw-text-xs tw-text-muted">
            vs. anterior: {{ weightDelta > 0 ? '+' : '' }}{{ weightDelta.toFixed(1) }} kg
          </p>
        </div>
      </section>

      <form class="tw-space-y-3 tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card" @submit.prevent="saveWeight">
        <h2 class="tw-m-0 tw-text-base tw-font-semibold">Peso</h2>
        <div class="tw-grid tw-gap-3 sm:tw-grid-cols-2">
          <label class="tw-text-sm">
            Data
            <input v-model="weightForm.recorded_on" type="date" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
          </label>
          <label class="tw-text-sm">
            Peso (kg)
            <input v-model.number="weightForm.weight_kg" type="number" step="0.1" min="0" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
          </label>
        </div>
        <button type="submit" class="tw-rounded-xl tw-bg-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper">Guardar peso</button>
      </form>

      <form class="tw-space-y-3 tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card" @submit.prevent="saveWorkout">
        <h2 class="tw-m-0 tw-text-base tw-font-semibold">Sessão</h2>
        <label class="tw-block tw-text-sm">
          Tipo
          <select v-model="workoutForm.activity_type" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2">
            <option v-for="t in workoutTypes" :key="t" :value="t">{{ WORKOUT_ACTIVITY_LABELS[t] }}</option>
          </select>
        </label>
        <label class="tw-block tw-text-sm">
          Data
          <input v-model="workoutForm.occurred_on" type="date" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
        </label>
        <div class="tw-grid tw-grid-cols-2 tw-gap-3">
          <label class="tw-text-sm">
            Tempo (min)
            <input v-model.number="workoutForm.duration_min" type="number" min="0" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
          </label>
          <label class="tw-text-sm">
            Tempo (seg)
            <input v-model.number="workoutForm.duration_sec_part" type="number" min="0" max="59" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
          </label>
        </div>
        <label v-if="isRunType" class="tw-block tw-text-sm">
          Distância (km, opcional)
          <input v-model.number="workoutForm.distance_km" type="number" step="0.1" min="0" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
        </label>
        <input v-model="workoutForm.notes" type="text" placeholder="Notas" class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2 tw-text-sm" />
        <button type="submit" class="tw-rounded-xl tw-border tw-border-teal tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-teal">
          Guardar e ver comparação
        </button>
      </form>

      <section class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-5">
        <h2 class="tw-m-0 tw-mb-3 tw-text-base tw-font-semibold">Últimas sessões</h2>
        <ul class="tw-m-0 tw-list-none tw-space-y-2 tw-p-0 tw-text-sm">
          <li v-for="w in workouts.slice(0, 15)" :key="w.id" class="tw-flex tw-justify-between tw-gap-2 tw-border-b tw-border-salt/60 tw-py-2">
            <span>
              {{ w.occurred_on }} · {{ w.activity_type ? WORKOUT_ACTIVITY_LABELS[w.activity_type] : w.activity }}
              <span v-if="w.notes" class="tw-block tw-text-xs tw-text-muted">{{ w.notes }}</span>
            </span>
            <span class="tw-font-mono">{{ displayWorkoutTime(w) }}</span>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
