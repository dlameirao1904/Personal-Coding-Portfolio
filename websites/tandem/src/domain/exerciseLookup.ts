import { EXERCISE_DEMO_DATA } from '@/domain/exerciseDemos'

export interface ExerciseDemo {
  exerciseId: string
  name: string
  gifUrl: string
  targetMuscles: string[]
  equipments: string[]
  instructions: string[]
  /** Rótulo curto quando um exercício do plano abre vários movimentos. */
  label?: string
  /** Nota em português quando o GIF não é exatamente o exercício do plano. */
  caption?: string
}

interface StoredDemo {
  exerciseId: string
  name: string
  gifUrl: string
  targetMuscles: readonly string[]
  equipments: readonly string[]
  instructions: readonly string[]
}

interface StoredLink {
  id: string
  label?: string
  caption?: string
}

const demos = EXERCISE_DEMO_DATA.demos as unknown as Record<string, StoredDemo>
const links = EXERCISE_DEMO_DATA.links as unknown as Record<string, readonly StoredLink[]>

const MUSCLE_PT: Record<string, string> = {
  abdominals: 'abdominais',
  abductors: 'abdutores',
  abs: 'abdominais',
  adductors: 'adutores',
  biceps: 'bíceps',
  calves: 'gémeos',
  'cardiovascular system': 'cardio',
  deltoids: 'ombros',
  'erector spinae': 'lombar',
  forearms: 'antebraços',
  glutes: 'glúteos',
  hamstrings: 'isquiotibiais',
  'hip flexors': 'flexores da anca',
  lats: 'dorsais',
  'latissimus dorsi': 'dorsais',
  'levator scapulae': 'pescoço',
  obliques: 'oblíquos',
  pectorals: 'peitorais',
  quads: 'quadríceps',
  quadriceps: 'quadríceps',
  spine: 'coluna',
  traps: 'trapézio',
  triceps: 'tríceps',
  'upper back': 'costas',
}

const EQUIPMENT_PT: Record<string, string> = {
  assisted: 'assistido',
  band: 'banda',
  barbell: 'barra',
  bodyweight: 'peso corporal',
  cable: 'cabo',
  dumbbell: 'halteres',
  'ez barbell': 'barra EZ',
  kettlebell: 'kettlebell',
  'leverage machine': 'máquina',
  machine: 'máquina',
  rope: 'corda',
  weighted: 'com carga',
}

export function normalizeExerciseName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/\b(com barra|leve)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function demosForExercise(planName: string): ExerciseDemo[] {
  const rules = links[normalizeExerciseName(planName)] ?? []
  return rules.flatMap((rule) => {
    const demo = demos[rule.id]
    if (!demo) return []
    return [
      {
        exerciseId: demo.exerciseId,
        name: demo.name,
        gifUrl: demo.gifUrl,
        targetMuscles: [...demo.targetMuscles],
        equipments: [...demo.equipments],
        instructions: [...demo.instructions],
        label: rule.label,
        caption: rule.caption,
      },
    ]
  })
}

export function formatTerm(value: string, dict: Record<string, string>): string {
  const key = value.trim().toLowerCase()
  return dict[key] ?? value
}

export function formatMuscles(values: string[]): string {
  return values.map((value) => formatTerm(value, MUSCLE_PT)).join(' · ')
}

export function formatEquipment(values: string[]): string {
  return values.map((value) => formatTerm(value, EQUIPMENT_PT)).join(' · ')
}
