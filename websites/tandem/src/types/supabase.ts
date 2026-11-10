export type FinanceEntryType = 'income' | 'expense'

export type SavingsMovementDirection = 'deposit' | 'withdrawal'

export interface HouseholdSavingsMovement {
  id: string
  household_id: string
  /** null = saldo da casa sem atribuição a membro */
  user_id: string | null
  direction: SavingsMovementDirection
  amount: number
  occurred_on: string
  note: string | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'avatar_url'> | null
}

export type MealSlot = 'pequeno_almoco' | 'almoco' | 'jantar' | 'lanche'

export type HouseholdGoalKind = 'poupanca' | 'gastos_conjuntos' | 'ferias' | 'outro'

export interface Profile {
  id: string
  display_name: string | null
  household_id: string | null
  avatar_url: string | null
  created_at: string
}

export interface Household {
  id: string
  name: string
  invite_code: string
  avatar_url: string | null
  created_at: string
}

export interface HouseholdGoal {
  id: string
  household_id: string
  kind: HouseholdGoalKind
  title: string
  target_amount: number | null
  target_date: string | null
  notes: string | null
  sort_order: number
  created_at: string
}

export const HOUSEHOLD_GOAL_KIND_LABELS: Record<HouseholdGoalKind, string> = {
  poupanca: 'Poupança',
  gastos_conjuntos: 'Gastos partilhados',
  ferias: 'Férias',
  outro: 'Outro',
}

export interface FinanceCategory {
  id: string
  household_id: string
  slug: string
  label: string
  kind: 'income' | 'expense'
  sort_order: number
}

export interface FinanceEntry {
  id: string
  household_id: string
  user_id: string
  category_id: string
  amount: number
  entry_type: FinanceEntryType
  occurred_on: string
  note: string | null
  created_at: string
}

export interface FinanceEntryWithCategory extends FinanceEntry {
  finance_categories: Pick<FinanceCategory, 'label' | 'slug'> | null
}

export interface MealWeek {
  id: string
  user_id: string
  week_start: string
}

export interface MealItem {
  id: string
  week_id: string
  day_index: number
  meal_slot: MealSlot
  title: string
  calories: number
  protein_g: number | null
  notes: string | null
}

export interface UserNutritionTargets {
  user_id: string
  calories: number
  protein_g: number
  carbs_g: number | null
  fat_g: number | null
  notes: string | null
}

export interface TrainingPlanExercise {
  name: string
  sets?: number
  reps?: string
  note?: string | null
}

export type TrainingPlanDayKind = 'strength' | 'hypertrophy' | 'cardio' | 'murph' | 'rest' | 'mixed'

export interface TrainingPlanDay {
  id: string
  plan_id: string
  day_index: number
  title: string
  kind: TrainingPlanDayKind
  duration_hint: string | null
  focus: string | null
  description: string | null
  suggested_activity_type: WorkoutActivityType | null
  exercises: TrainingPlanExercise[]
}

export interface TrainingPlan {
  id: string
  user_id: string
  title: string
  summary: string | null
  meta: Record<string, unknown>
}

export const TRAINING_DAY_KIND_LABELS: Record<TrainingPlanDayKind, string> = {
  strength: 'Força',
  hypertrophy: 'Hipertrofia',
  cardio: 'Cardio',
  murph: 'Murph',
  rest: 'Descanso',
  mixed: 'Misto',
}

export interface BodyMetric {
  id: string
  user_id: string
  recorded_on: string
  weight_kg: number | null
  notes: string | null
}

export type WorkoutActivityType =
  | 'treino_indoor'
  | 'treino_outdoor'
  | 'corrida_indoor'
  | 'corrida_outdoor'

export const WORKOUT_ACTIVITY_LABELS: Record<WorkoutActivityType, string> = {
  treino_indoor: 'Treino indoor',
  treino_outdoor: 'Treino outdoor',
  corrida_indoor: 'Corrida indoor',
  corrida_outdoor: 'Corrida outdoor',
}

export interface WorkoutLog {
  id: string
  user_id: string
  occurred_on: string
  activity: string
  activity_type: WorkoutActivityType | null
  duration_min: number | null
  duration_sec: number | null
  distance_km: number | null
  notes: string | null
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: {
          id: string
          display_name?: string | null
          household_id?: string | null
          created_at?: string
        }
        Update: {
          display_name?: string | null
          household_id?: string | null
        }
        Relationships: []
      }
      households: {
        Row: Household
        Insert: {
          id?: string
          name?: string
          invite_code?: string
          created_at?: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      finance_categories: {
        Row: FinanceCategory
        Insert: {
          id?: string
          household_id: string
          slug: string
          label: string
          kind: 'income' | 'expense'
          sort_order?: number
        }
        Update: Partial<FinanceCategory>
        Relationships: []
      }
      finance_entries: {
        Row: FinanceEntry
        Insert: {
          id?: string
          household_id: string
          user_id: string
          category_id: string
          amount: number
          entry_type: FinanceEntryType
          occurred_on?: string
          note?: string | null
          created_at?: string
        }
        Update: Partial<FinanceEntry>
        Relationships: []
      }
      meal_weeks: {
        Row: MealWeek
        Insert: {
          id?: string
          user_id: string
          week_start: string
        }
        Update: Partial<MealWeek>
        Relationships: []
      }
      meal_items: {
        Row: MealItem
        Insert: {
          id?: string
          week_id: string
          day_index: number
          meal_slot: MealSlot
          title: string
          calories?: number
          protein_g?: number | null
          notes?: string | null
        }
        Update: Partial<MealItem>
        Relationships: []
      }
      body_metrics: {
        Row: BodyMetric
        Insert: {
          id?: string
          user_id: string
          recorded_on: string
          weight_kg?: number | null
          notes?: string | null
        }
        Update: Partial<BodyMetric>
        Relationships: []
      }
      workout_logs: {
        Row: WorkoutLog
        Insert: {
          id?: string
          user_id: string
          occurred_on?: string
          activity: string
          duration_min?: number | null
          notes?: string | null
        }
        Update: Partial<WorkoutLog>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      create_household: {
        Args: { household_name?: string }
        Returns: string
      }
      join_household: {
        Args: { code: string }
        Returns: string
      }
      seed_finance_categories: {
        Args: { p_household_id: string }
        Returns: undefined
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  pequeno_almoco: 'Pequeno-almoço',
  almoco: 'Almoço',
  jantar: 'Jantar',
  lanche: 'Lanche',
}

export const DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const
