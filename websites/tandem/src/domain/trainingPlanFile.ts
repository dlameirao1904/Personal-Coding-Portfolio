import {
  WORKOUT_ACTIVITY_LABELS,
  type TrainingPlan,
  type TrainingPlanDay,
  type TrainingPlanDayKind,
  type TrainingPlanExercise,
  type WorkoutActivityType,
} from '@/types/supabase'

export const TRAINING_PLAN_FILE_FORMAT = 'tandem.training-plan'
export const TRAINING_PLAN_FILE_VERSION = 1

const DAY_KINDS: readonly TrainingPlanDayKind[] = [
  'strength',
  'hypertrophy',
  'cardio',
  'murph',
  'rest',
  'mixed',
]

const ACTIVITY_TYPES = Object.keys(WORKOUT_ACTIVITY_LABELS) as WorkoutActivityType[]

export interface TrainingPlanFileDay {
  day_index: number
  title: string
  kind: TrainingPlanDayKind
  duration_hint: string | null
  focus: string | null
  description: string | null
  suggested_activity_type: WorkoutActivityType | null
  exercises: TrainingPlanExercise[]
}

export interface TrainingPlanFile {
  format: typeof TRAINING_PLAN_FILE_FORMAT
  version: typeof TRAINING_PLAN_FILE_VERSION
  title: string
  summary: string | null
  meta: Record<string, unknown>
  days: TrainingPlanFileDay[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function optionalText(value: unknown, label: string): string | null {
  if (value == null || value === '') return null
  if (typeof value !== 'string') throw new Error(`${label} tem de ser texto.`)
  const trimmed = value.trim()
  return trimmed || null
}

function requiredText(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} em falta.`)
  return value.trim()
}

export function buildTrainingPlanFile(plan: TrainingPlan, days: TrainingPlanDay[]): TrainingPlanFile {
  return {
    format: TRAINING_PLAN_FILE_FORMAT,
    version: TRAINING_PLAN_FILE_VERSION,
    title: plan.title,
    summary: plan.summary,
    meta: isRecord(plan.meta) ? plan.meta : {},
    days: [...days]
      .sort((a, b) => a.day_index - b.day_index)
      .map((day) => ({
        day_index: day.day_index,
        title: day.title,
        kind: day.kind,
        duration_hint: day.duration_hint,
        focus: day.focus,
        description: day.description,
        suggested_activity_type: day.suggested_activity_type,
        exercises: day.exercises.map((exercise) => ({
          name: exercise.name,
          ...(exercise.sets != null ? { sets: exercise.sets } : {}),
          ...(exercise.reps != null && exercise.reps !== '' ? { reps: exercise.reps } : {}),
          ...(exercise.note != null && exercise.note !== '' ? { note: exercise.note } : {}),
        })),
      })),
  }
}

export function trainingPlanFileName(title: string): string {
  const slug = title
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  return `${slug || 'plano-treino'}.json`
}

function parseExercise(value: unknown, dayTitle: string, index: number): TrainingPlanExercise {
  if (!isRecord(value)) throw new Error(`Exercício ${index + 1} de «${dayTitle}» é inválido.`)
  const name = requiredText(value.name, `Nome do exercício ${index + 1} de «${dayTitle}»`)
  const exercise: TrainingPlanExercise = { name }
  if (value.sets != null && value.sets !== '') {
    const sets = typeof value.sets === 'number' ? value.sets : Number(value.sets)
    if (!Number.isInteger(sets) || sets < 0) throw new Error(`Séries de «${name}» são inválidas.`)
    exercise.sets = sets
  }
  if (value.reps != null && value.reps !== '') {
    if (typeof value.reps !== 'string' && typeof value.reps !== 'number') {
      throw new Error(`Repetições de «${name}» são inválidas.`)
    }
    exercise.reps = String(value.reps).trim()
  }
  if (value.note != null && value.note !== '') {
    exercise.note = optionalText(value.note, `Nota de «${name}»`)
  }
  return exercise
}

function parseDay(value: unknown): TrainingPlanFileDay {
  if (!isRecord(value)) throw new Error('Um dos dias do plano é inválido.')
  const dayIndex = typeof value.day_index === 'number' ? value.day_index : Number(value.day_index)
  if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) {
    throw new Error('Cada dia tem de ir de 0 (segunda) a 6 (domingo).')
  }
  const title = requiredText(value.title, `Título do dia ${dayIndex + 1}`)
  if (typeof value.kind !== 'string' || !(DAY_KINDS as readonly string[]).includes(value.kind)) {
    throw new Error(`Tipo de «${title}» é inválido.`)
  }
  let activity: WorkoutActivityType | null = null
  if (value.suggested_activity_type != null && value.suggested_activity_type !== '') {
    if (
      typeof value.suggested_activity_type !== 'string' ||
      !(ACTIVITY_TYPES as readonly string[]).includes(value.suggested_activity_type)
    ) {
      throw new Error(`Actividade sugerida de «${title}» é inválida.`)
    }
    activity = value.suggested_activity_type as WorkoutActivityType
  }
  const rawExercises = value.exercises ?? []
  if (!Array.isArray(rawExercises)) throw new Error(`Exercícios de «${title}» são inválidos.`)
  return {
    day_index: dayIndex,
    title,
    kind: value.kind as TrainingPlanDayKind,
    duration_hint: optionalText(value.duration_hint, `Duração de «${title}»`),
    focus: optionalText(value.focus, `Foco de «${title}»`),
    description: optionalText(value.description, `Descrição de «${title}»`),
    suggested_activity_type: activity,
    exercises: rawExercises.map((exercise, index) => parseExercise(exercise, title, index)),
  }
}

export function parseTrainingPlanFile(raw: string): TrainingPlanFile {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error('O ficheiro não é JSON válido.')
  }
  if (!isRecord(data)) throw new Error('O ficheiro não tem o formato de um plano de treino.')
  if (data.format !== TRAINING_PLAN_FILE_FORMAT || data.version !== TRAINING_PLAN_FILE_VERSION) {
    throw new Error('Este ficheiro não é um plano exportado por esta aplicação.')
  }
  if (!Array.isArray(data.days) || data.days.length === 0) {
    throw new Error('O ficheiro não tem dias de treino.')
  }
  const days = data.days.map(parseDay)
  const seen = new Set<number>()
  for (const day of days) {
    if (seen.has(day.day_index)) throw new Error('Há dois dias com o mesmo índice.')
    seen.add(day.day_index)
  }
  const meta = data.meta == null ? {} : data.meta
  if (!isRecord(meta)) throw new Error('Os dados extra do plano são inválidos.')
  return {
    format: TRAINING_PLAN_FILE_FORMAT,
    version: TRAINING_PLAN_FILE_VERSION,
    title: requiredText(data.title, 'Título do plano'),
    summary: optionalText(data.summary, 'Resumo do plano'),
    meta,
    days: days.sort((a, b) => a.day_index - b.day_index),
  }
}
