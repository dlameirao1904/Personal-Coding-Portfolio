<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import ExerciseDemoSheet from '@/components/ExerciseDemoSheet.vue'
import WorkoutTimeChart from '@/components/WorkoutTimeChart.vue'
import { useAuth } from '@/composables/useAuth'
import {
  buildTrainingPlanFile,
  parseTrainingPlanFile,
  trainingPlanFileName,
  type TrainingPlanFile,
} from '@/domain/trainingPlanFile'
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
const demoExercise = ref<TrainingPlanExercise | null>(null)

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

const TIMER_KEY = 'tandem.workout-timer'
const TIMER_MAX_MS = 8 * 60 * 60 * 1000

const timerStartedAt = ref<number | null>(null)
const timerNow = ref(Date.now())
const linkToday = ref(false)
const savingWorkout = ref(false)
const workoutSaveError = ref<string | null>(null)
const planFileInput = ref<HTMLInputElement | null>(null)
const planFileBusy = ref(false)
const planFileError = ref<string | null>(null)
const planFileMessage = ref<string | null>(null)
let timerTick = 0

const todayPlanDay = computed(
  () => trainingDays.value.find((day) => day.day_index === todayDayIndex.value) ?? null,
)
const canLinkToday = computed(() => todayPlanDay.value != null && todayPlanDay.value.kind !== 'rest')
const elapsedSec = computed(() => {
  if (timerStartedAt.value == null) return 0
  return Math.max(0, Math.floor((timerNow.value - timerStartedAt.value) / 1000))
})
const timerLabel = computed(() => formatDuration(elapsedSec.value))

interface TimerDraft {
  startedAt: number
  linkToday: boolean
  activity_type: WorkoutActivityType
  occurred_on: string
  notes: string
  distance_km: number
}

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

function downloadTrainingPlan() {
  if (!trainingPlan.value || planFileBusy.value) return
  planFileError.value = null
  planFileMessage.value = null
  const file = buildTrainingPlanFile(trainingPlan.value, trainingDays.value)
  const blob = new Blob([`${JSON.stringify(file, null, 2)}\n`], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = trainingPlanFileName(file.title)
  link.click()
  URL.revokeObjectURL(url)
}

async function onImportPlan(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !user.value || planFileBusy.value) return

  planFileError.value = null
  planFileMessage.value = null
  if (file.size > 1_000_000) {
    planFileError.value = 'O ficheiro é demasiado grande para um plano de treino.'
    return
  }

  let parsed: TrainingPlanFile
  try {
    parsed = parseTrainingPlanFile(await file.text())
  } catch (error) {
    planFileError.value = error instanceof Error ? error.message : 'Não foi possível ler o ficheiro.'
    return
  }

  const confirmed = confirm(
    trainingPlan.value
      ? `Substituir o plano actual por «${parsed.title}»?`
      : `Importar o plano «${parsed.title}»?`,
  )
  if (!confirmed) return

  planFileBusy.value = true
  try {
    const sb = requireSupabase()
    let planId = trainingPlan.value?.id
    if (planId) {
      const { error } = await sb
        .from('training_plans')
        .update({
          title: parsed.title,
          summary: parsed.summary,
          meta: parsed.meta,
        })
        .eq('id', planId)
      if (error) throw error
      const { error: deleteError } = await sb.from('training_plan_days').delete().eq('plan_id', planId)
      if (deleteError) throw deleteError
    } else {
      const { data, error } = await sb
        .from('training_plans')
        .insert({
          user_id: user.value.id,
          title: parsed.title,
          summary: parsed.summary,
          meta: parsed.meta,
        })
        .select('id')
        .single()
      if (error) throw error
      planId = data.id as string
    }

    const { error: insertError } = await sb.from('training_plan_days').insert(
      parsed.days.map((day) => ({
        plan_id: planId,
        day_index: day.day_index,
        title: day.title,
        kind: day.kind,
        duration_hint: day.duration_hint,
        focus: day.focus,
        description: day.description,
        suggested_activity_type: day.suggested_activity_type,
        exercises: day.exercises,
      })),
    )
    if (insertError) throw insertError
    await loadPlan()
    planFileMessage.value = 'Plano importado.'
  } catch {
    planFileError.value = 'Não foi possível importar o plano.'
    await loadPlan()
  } finally {
    planFileBusy.value = false
  }
}

function applyPlanDayToForm(day: TrainingPlanDay) {
  if (day.suggested_activity_type) {
    workoutForm.value.activity_type = day.suggested_activity_type
  }
  const hint = day.duration_hint && day.duration_hint !== '—' ? ` · ${day.duration_hint}` : ''
  workoutForm.value.notes = `${day.title}${hint}`
  linkToday.value = day.day_index === todayDayIndex.value && day.kind !== 'rest'
  treinoTab.value = 'registar'
}

function fillLinkedDay() {
  const day = todayPlanDay.value
  if (!day || day.kind === 'rest') return
  if (day.suggested_activity_type) workoutForm.value.activity_type = day.suggested_activity_type
  const hint = day.duration_hint && day.duration_hint !== '—' ? ` · ${day.duration_hint}` : ''
  const title = `${day.title}${hint}`
  const notes = workoutForm.value.notes.trim()
  if (!notes) workoutForm.value.notes = title
  else if (!notes.startsWith(day.title)) workoutForm.value.notes = `${title} · ${notes}`
}

function persistTimer() {
  if (timerStartedAt.value == null) return
  const draft: TimerDraft = {
    startedAt: timerStartedAt.value,
    linkToday: linkToday.value,
    activity_type: workoutForm.value.activity_type,
    occurred_on: workoutForm.value.occurred_on,
    notes: workoutForm.value.notes,
    distance_km: workoutForm.value.distance_km,
  }
  try {
    localStorage.setItem(TIMER_KEY, JSON.stringify(draft))
  } catch {
    /* modo privado ou quota */
  }
}

function startTick() {
  if (timerTick) window.clearInterval(timerTick)
  timerNow.value = Date.now()
  timerTick = window.setInterval(() => {
    timerNow.value = Date.now()
  }, 250)
}

function stopTick() {
  if (timerTick) window.clearInterval(timerTick)
  timerTick = 0
}

function clearTimer() {
  stopTick()
  timerStartedAt.value = null
  try {
    localStorage.removeItem(TIMER_KEY)
  } catch {
    /* ignore */
  }
}

function restoreTimer() {
  try {
    const raw = localStorage.getItem(TIMER_KEY)
    if (!raw) return
    const draft = JSON.parse(raw) as Partial<TimerDraft>
    if (typeof draft.startedAt !== 'number') return
    const age = Date.now() - draft.startedAt
    if (age > TIMER_MAX_MS || age < -5000) {
      localStorage.removeItem(TIMER_KEY)
      return
    }
    if (draft.activity_type && draft.activity_type in WORKOUT_ACTIVITY_LABELS) {
      workoutForm.value.activity_type = draft.activity_type
    }
    if (typeof draft.occurred_on === 'string') workoutForm.value.occurred_on = draft.occurred_on
    if (typeof draft.notes === 'string') workoutForm.value.notes = draft.notes
    if (typeof draft.distance_km === 'number') workoutForm.value.distance_km = draft.distance_km
    linkToday.value = Boolean(draft.linkToday)
    timerStartedAt.value = draft.startedAt
    startTick()
  } catch {
    /* rascunho inválido */
  }
}

function onTimerVisible() {
  if (document.visibilityState === 'visible' && timerStartedAt.value != null) {
    timerNow.value = Date.now()
  }
}

function startTimer() {
  workoutSaveError.value = null
  workoutForm.value.occurred_on = toISODate()
  if (linkToday.value) fillLinkedDay()
  timerStartedAt.value = Date.now()
  timerNow.value = timerStartedAt.value
  startTick()
  persistTimer()
}

function cancelTimer() {
  clearTimer()
  workoutForm.value.duration_min = 0
  workoutForm.value.duration_sec_part = 0
  workoutSaveError.value = null
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

async function saveWorkout(): Promise<boolean> {
  if (!user.value || savingWorkout.value) return false
  const durationSec = parseMinutesSeconds(
    workoutForm.value.duration_min,
    workoutForm.value.duration_sec_part,
  )
  if (durationSec == null) return false

  savingWorkout.value = true
  workoutSaveError.value = null
  try {
    const label = WORKOUT_ACTIVITY_LABELS[workoutForm.value.activity_type]
    const { error } = await requireSupabase().from('workout_logs').insert({
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
    if (error) {
      workoutSaveError.value = 'Não foi possível guardar o treino.'
      return false
    }

    workoutForm.value.duration_min = 0
    workoutForm.value.duration_sec_part = 0
    workoutForm.value.distance_km = 0
    workoutForm.value.notes = ''
    linkToday.value = false
    treinoTab.value = 'tempos'
    await load()
    return true
  } finally {
    savingWorkout.value = false
  }
}

async function finishWorkout() {
  if (timerStartedAt.value == null || savingWorkout.value) return
  stopTick()
  const sec = Math.max(1, Math.floor((Date.now() - timerStartedAt.value) / 1000))
  workoutForm.value.duration_min = Math.floor(sec / 60)
  workoutForm.value.duration_sec_part = sec % 60
  if (linkToday.value) fillLinkedDay()
  const ok = await saveWorkout()
  if (ok) clearTimer()
  else startTick()
}

function displayWorkoutTime(w: WorkoutLog): string {
  if (w.duration_sec) return formatDuration(w.duration_sec)
  if (w.duration_min) return `${w.duration_min} min`
  return '—'
}

watch([selectedPlanDay, treinoTab], () => {
  demoExercise.value = null
})

watch(elapsedSec, (sec) => {
  if (timerStartedAt.value == null) return
  workoutForm.value.duration_min = Math.floor(sec / 60)
  workoutForm.value.duration_sec_part = sec % 60
})

watch(linkToday, (on) => {
  if (on) fillLinkedDay()
  persistTimer()
})

watch(todayPlanDay, () => {
  if (linkToday.value && !workoutForm.value.notes.trim()) fillLinkedDay()
})

watch(
  () => [
    workoutForm.value.activity_type,
    workoutForm.value.occurred_on,
    workoutForm.value.notes,
    workoutForm.value.distance_km,
    linkToday.value,
    timerStartedAt.value,
  ],
  () => persistTimer(),
)

function onMountedTimer() {
  restoreTimer()
  document.addEventListener('visibilitychange', onTimerVisible)
  void load()
}

onMounted(onMountedTimer)

onUnmounted(() => {
  stopTick()
  document.removeEventListener('visibilitychange', onTimerVisible)
})
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
        <span v-if="timerStartedAt != null" class="tw-ml-1 tw-font-mono tw-text-xs">{{ timerLabel }}</span>
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
      <div class="tw-flex tw-flex-wrap tw-gap-2">
        <button
          type="button"
          class="tw-rounded-xl tw-border tw-border-salt tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-semibold disabled:tw-opacity-50"
          :disabled="!trainingPlan || planFileBusy"
          @click="downloadTrainingPlan"
        >
          Exportar plano
        </button>
        <button
          type="button"
          class="tw-rounded-xl tw-bg-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper disabled:tw-opacity-50"
          :disabled="planFileBusy || loading"
          @click="planFileInput?.click()"
        >
          {{ planFileBusy ? 'A importar…' : 'Importar plano' }}
        </button>
        <input
          ref="planFileInput"
          type="file"
          accept="application/json,.json"
          class="tw-hidden"
          @change="onImportPlan"
        />
      </div>
      <p v-if="planFileError" class="tw-m-0 tw-text-sm tw-text-danger">{{ planFileError }}</p>
      <p v-else-if="planFileMessage" class="tw-m-0 tw-text-sm tw-text-teal">{{ planFileMessage }}</p>

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

          <p v-if="selectedDay.exercises.length" class="tw-m-0 tw-text-xs tw-text-muted">
            Toca num exercício para ver o movimento.
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
                  <button
                    type="button"
                    class="tw-bg-transparent tw-p-0 tw-text-left tw-font-medium tw-text-teal tw-underline tw-decoration-teal/30 tw-underline-offset-2"
                    :aria-label="`Ver demonstração de ${ex.name}`"
                    @click="demoExercise = ex"
                  >
                    {{ ex.name }}
                  </button>
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

      <form
        class="tw-space-y-3 tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card"
        @submit.prevent="timerStartedAt != null ? finishWorkout() : saveWorkout()"
      >
        <h2 class="tw-m-0 tw-text-base tw-font-semibold">Sessão</h2>

        <div
          class="tw-space-y-3 tw-rounded-2xl tw-p-4 tw-text-center"
          :class="timerStartedAt != null ? 'tw-bg-teal/10' : 'tw-bg-salt/40'"
        >
          <p class="tw-m-0 tw-text-xs tw-text-muted">
            {{ timerStartedAt != null ? 'Treino a decorrer' : 'Temporizador' }}
          </p>
          <p class="tw-m-0 tw-font-mono tw-text-5xl tw-font-semibold tw-tabular-nums">{{ timerLabel }}</p>
          <label
            v-if="canLinkToday"
            class="tw-mx-auto tw-flex tw-max-w-sm tw-items-start tw-justify-center tw-gap-2 tw-text-left tw-text-sm"
          >
            <input v-model="linkToday" type="checkbox" class="tw-mt-1" />
            <span>
              Associar ao treino de hoje:
              <strong>{{ todayPlanDay?.title }}</strong>
            </span>
          </label>
          <div class="tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-2">
            <button
              v-if="timerStartedAt == null"
              type="button"
              class="tw-rounded-xl tw-bg-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper"
              @click="startTimer"
            >
              Começar
            </button>
            <template v-else>
              <button
                type="submit"
                class="tw-rounded-xl tw-bg-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper disabled:tw-opacity-60"
                :disabled="savingWorkout"
              >
                {{ savingWorkout ? 'A guardar…' : 'Terminar treino' }}
              </button>
              <button
                type="button"
                class="tw-rounded-xl tw-border tw-border-salt tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-semibold"
                :disabled="savingWorkout"
                @click="cancelTimer"
              >
                Cancelar
              </button>
            </template>
          </div>
        </div>

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
            <input
              v-model.number="workoutForm.duration_min"
              type="number"
              min="0"
              class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2 disabled:tw-bg-salt/50"
              :disabled="timerStartedAt != null"
            />
          </label>
          <label class="tw-text-sm">
            Tempo (seg)
            <input
              v-model.number="workoutForm.duration_sec_part"
              type="number"
              min="0"
              max="59"
              class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2 disabled:tw-bg-salt/50"
              :disabled="timerStartedAt != null"
            />
          </label>
        </div>
        <label v-if="isRunType" class="tw-block tw-text-sm">
          Distância (km, opcional)
          <input v-model.number="workoutForm.distance_km" type="number" step="0.1" min="0" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
        </label>
        <input v-model="workoutForm.notes" type="text" placeholder="Notas" class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2 tw-text-sm" />
        <p v-if="workoutSaveError" class="tw-m-0 tw-text-sm tw-text-danger">{{ workoutSaveError }}</p>
        <button
          v-if="timerStartedAt == null"
          type="submit"
          class="tw-rounded-xl tw-border tw-border-teal tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-teal disabled:tw-opacity-60"
          :disabled="savingWorkout"
        >
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

    <ExerciseDemoSheet v-if="demoExercise" :exercise="demoExercise" @close="demoExercise = null" />
  </div>
</template>
