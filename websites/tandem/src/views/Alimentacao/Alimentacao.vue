<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { weekStartMonday, toISODate } from '@/domain/dates'
import { requireSupabase } from '@/lib/supabase'
import { DAY_LABELS, MEAL_SLOT_LABELS, type MealItem, type MealSlot, type UserNutritionTargets } from '@/types/supabase'

const { user } = useAuth()

const weekStart = ref(weekStartMonday())
const weekId = ref<string | null>(null)
const items = ref<MealItem[]>([])
const nutritionTargets = ref<UserNutritionTargets | null>(null)
const loading = ref(false)
const copyBusy = ref(false)
const copyError = ref<string | null>(null)
/** Qualquer dia da semana de origem; usamos a segunda-feira calculada. */
const copyFromDate = ref(weekStartMonday())

const form = ref({
  day_index: 0,
  meal_slot: 'almoco' as MealSlot,
  title: '',
  calories: 0,
  protein_g: 0,
})

const slots: MealSlot[] = ['pequeno_almoco', 'almoco', 'jantar', 'lanche']

const caloriesByDay = computed(() => {
  const totals = Array(7).fill(0)
  for (const item of items.value) {
    totals[item.day_index] += item.calories
  }
  return totals
})

const proteinByDay = computed(() => {
  const totals = Array(7).fill(0)
  for (const item of items.value) {
    totals[item.day_index] += Number(item.protein_g ?? 0)
  }
  return totals
})

const weekTotalCalories = computed(() => caloriesByDay.value.reduce((a, b) => a + b, 0))

const avgDailyCalories = computed(() =>
  caloriesByDay.value.length ? Math.round(weekTotalCalories.value / 7) : 0,
)

const avgDailyProtein = computed(() => {
  const total = proteinByDay.value.reduce((a, b) => a + b, 0)
  return Math.round(total / 7)
})

const copySourceWeekStart = computed(() => weekStartMonday(new Date(copyFromDate.value)))

function shiftWeek(delta: number) {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() + delta * 7)
  weekStart.value = toISODate(d)
}

function itemsFor(day: number, slot: MealSlot) {
  return items.value.filter((i) => i.day_index === day && i.meal_slot === slot)
}

async function ensureWeek() {
  if (!user.value) return
  const sb = requireSupabase()
  const { data: existing } = await sb
    .from('meal_weeks')
    .select('id')
    .eq('user_id', user.value.id)
    .eq('week_start', weekStart.value)
    .maybeSingle()

  if (existing?.id) {
    weekId.value = existing.id
    return
  }

  const { data, error } = await sb
    .from('meal_weeks')
    .insert({ user_id: user.value.id, week_start: weekStart.value })
    .select('id')
    .single()

  if (error) throw error
  weekId.value = data.id
}

async function loadTargets() {
  if (!user.value) return
  const { data } = await requireSupabase().from('user_nutrition_targets').select('*').maybeSingle()
  nutritionTargets.value = (data as UserNutritionTargets | null) ?? null
}

async function loadItems() {
  if (!weekId.value) return
  loading.value = true
  const { data } = await requireSupabase()
    .from('meal_items')
    .select('*')
    .eq('week_id', weekId.value)
    .order('day_index')
  items.value = data ?? []
  loading.value = false
}

async function addMeal() {
  if (!weekId.value || !form.value.title.trim()) return
  await requireSupabase().from('meal_items').insert({
    week_id: weekId.value,
    day_index: form.value.day_index,
    meal_slot: form.value.meal_slot,
    title: form.value.title.trim(),
    calories: Math.max(0, Math.round(form.value.calories)),
    protein_g: form.value.protein_g > 0 ? form.value.protein_g : null,
  })
  form.value.title = ''
  form.value.calories = 0
  form.value.protein_g = 0
  await loadItems()
}

async function removeMeal(id: string, title: string) {
  if (!confirm(`Apagar «${title}»?`)) return
  await requireSupabase().from('meal_items').delete().eq('id', id)
  await loadItems()
}

async function copyWeekMeals() {
  if (!user.value) return

  const sourceWeekStart = copySourceWeekStart.value
  copyError.value = null

  if (sourceWeekStart === weekStart.value) {
    copyError.value = 'Escolhe outra semana — a origem é a mesma que esta semana.'
    return
  }

  const confirmed = confirm(
    `Copiar todas as refeições da semana ${sourceWeekStart} para a semana ${weekStart.value}? ` +
      'As refeições actuais desta semana serão substituídas.',
  )
  if (!confirmed) return

  copyBusy.value = true
  const sb = requireSupabase()

  try {
    await ensureWeek()
    if (!weekId.value) {
      copyError.value = 'Não foi possível preparar a semana de destino.'
      return
    }

    const { data: sourceWeek, error: weekError } = await sb
      .from('meal_weeks')
      .select('id')
      .eq('user_id', user.value.id)
      .eq('week_start', sourceWeekStart)
      .maybeSingle()

    if (weekError) throw weekError
    if (!sourceWeek?.id) {
      copyError.value = `Não há plano na semana ${sourceWeekStart}.`
      return
    }

    const { data: sourceItems, error: itemsError } = await sb
      .from('meal_items')
      .select('day_index, meal_slot, title, calories, protein_g, notes')
      .eq('week_id', sourceWeek.id)

    if (itemsError) throw itemsError
    if (!sourceItems?.length) {
      copyError.value = 'A semana de origem não tem refeições.'
      return
    }

    const { error: deleteError } = await sb.from('meal_items').delete().eq('week_id', weekId.value)
    if (deleteError) throw deleteError

    const rows = sourceItems.map((row) => ({
      week_id: weekId.value!,
      day_index: row.day_index,
      meal_slot: row.meal_slot,
      title: row.title,
      calories: row.calories,
      protein_g: row.protein_g,
      notes: row.notes,
    }))

    const { error: insertError } = await sb.from('meal_items').insert(rows)
    if (insertError) throw insertError

    await loadItems()
  } catch (e) {
    copyError.value = e instanceof Error ? e.message : 'Erro ao copiar refeições.'
  } finally {
    copyBusy.value = false
  }
}

watch(weekStart, async () => {
  weekId.value = null
  items.value = []
  await ensureWeek()
  await loadItems()
})

onMounted(async () => {
  await loadTargets()
  await ensureWeek()
  await loadItems()
})
</script>

<template>
  <div class="tw-mx-auto tw-max-w-4xl tw-space-y-6 tw-px-4 tw-py-10">
    <header class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-4">
      <div>
        <h1 class="tw-m-0 tw-text-2xl tw-font-semibold">Alimentação</h1>
        <p class="tw-mt-1 tw-mb-0 tw-text-sm tw-text-muted">Plano semanal só na tua conta.</p>
      </div>
      <div class="tw-flex tw-items-center tw-gap-2">
        <button type="button" class="tw-rounded-lg tw-border tw-border-salt tw-px-2 tw-py-1" @click="shiftWeek(-1)">←</button>
        <span class="tw-font-mono tw-text-sm">Semana {{ weekStart }}</span>
        <button type="button" class="tw-rounded-lg tw-border tw-border-salt tw-px-2 tw-py-1" @click="shiftWeek(1)">→</button>
      </div>
    </header>

    <div class="tw-space-y-2 tw-rounded-xl tw-bg-teal/10 tw-p-3 tw-text-sm">
      <p v-if="nutritionTargets" class="tw-m-0">
        Meta diária:
        <strong>{{ nutritionTargets.calories }} kcal</strong>
        · <strong>{{ nutritionTargets.protein_g }} g</strong> proteína
        <span v-if="nutritionTargets.carbs_g"> · {{ nutritionTargets.carbs_g }} g HC</span>
        <span v-if="nutritionTargets.fat_g"> · {{ nutritionTargets.fat_g }} g gordura</span>
      </p>
      <p class="tw-m-0">
        Esta semana (média/dia): <strong>{{ avgDailyCalories }} kcal</strong>
        · <strong>{{ avgDailyProtein }} g</strong> proteína
      </p>
      <p v-if="nutritionTargets?.notes" class="tw-m-0 tw-text-xs tw-text-muted">{{ nutritionTargets.notes }}</p>
    </div>

    <section class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-4 tw-shadow-card">
      <h2 class="tw-m-0 tw-mb-2 tw-text-base tw-font-semibold">Copiar refeições</h2>
      <p class="tw-m-0 tw-mb-3 tw-text-xs tw-text-muted">
        Destino: semana <strong class="tw-font-mono">{{ weekStart }}</strong> (a que estás a ver). Escolhe um dia da semana
        de onde queres copiar.
      </p>
      <div class="tw-flex tw-flex-wrap tw-items-end tw-gap-3">
        <label class="tw-text-sm">
          Semana de origem
          <input
            v-model="copyFromDate"
            type="date"
            class="tw-mt-1 tw-block tw-rounded-lg tw-border tw-border-salt tw-px-3 tw-py-2"
          />
        </label>
        <p class="tw-m-0 tw-text-xs tw-text-muted">
          Segunda-feira usada: <span class="tw-font-mono">{{ copySourceWeekStart }}</span>
        </p>
        <button
          type="button"
          class="tw-rounded-xl tw-bg-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper disabled:tw-opacity-60"
          :disabled="copyBusy"
          @click="copyWeekMeals"
        >
          {{ copyBusy ? 'A copiar…' : 'Copiar para esta semana' }}
        </button>
      </div>
      <p v-if="copyError" class="tw-m-0 tw-mt-2 tw-text-sm tw-text-danger">{{ copyError }}</p>
    </section>

    <form class="tw-grid tw-gap-3 tw-rounded-2xl tw-bg-white tw-p-4 tw-shadow-card sm:tw-grid-cols-2" @submit.prevent="addMeal">
      <label class="tw-text-sm">
        Dia
        <select v-model.number="form.day_index" class="tw-mt-1 tw-w-full tw-rounded-lg tw-border tw-border-salt tw-px-2 tw-py-2">
          <option v-for="(label, idx) in DAY_LABELS" :key="idx" :value="idx">{{ label }}</option>
        </select>
      </label>
      <label class="tw-text-sm">
        Refeição
        <select v-model="form.meal_slot" class="tw-mt-1 tw-w-full tw-rounded-lg tw-border tw-border-salt tw-px-2 tw-py-2">
          <option v-for="s in slots" :key="s" :value="s">{{ MEAL_SLOT_LABELS[s] }}</option>
        </select>
      </label>
      <input v-model="form.title" type="text" placeholder="Prato / refeição" required class="tw-rounded-lg tw-border tw-border-salt tw-px-3 tw-py-2 tw-text-sm sm:tw-col-span-2" />
      <input v-model.number="form.calories" type="number" min="0" placeholder="kcal" class="tw-rounded-lg tw-border tw-border-salt tw-px-3 tw-py-2 tw-text-sm" />
      <input v-model.number="form.protein_g" type="number" min="0" step="0.1" placeholder="Proteína (g)" class="tw-rounded-lg tw-border tw-border-salt tw-px-3 tw-py-2 tw-text-sm" />
      <button type="submit" class="tw-rounded-xl tw-bg-teal tw-py-2 tw-text-sm tw-font-semibold tw-text-paper sm:tw-col-span-2">Adicionar</button>
    </form>

    <p v-if="loading" class="tw-text-sm tw-text-muted">A carregar…</p>

    <div class="tw-overflow-x-auto tw-rounded-2xl tw-border tw-border-salt tw-bg-white">
      <table class="tw-w-full tw-min-w-[640px] tw-border-collapse tw-text-xs sm:tw-text-sm">
        <thead>
          <tr class="tw-border-b tw-border-salt tw-text-left tw-text-muted">
            <th class="tw-p-2">Refeição</th>
            <th v-for="(label, day) in DAY_LABELS" :key="day" class="tw-p-2">
              {{ label }}
              <span class="tw-block tw-font-mono tw-text-[10px]">
                {{ caloriesByDay[day] }} kcal · {{ Math.round(proteinByDay[day]) }}g P
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in slots" :key="slot" class="tw-border-b tw-border-salt/70 tw-align-top">
            <td class="tw-p-2 tw-font-medium">{{ MEAL_SLOT_LABELS[slot] }}</td>
            <td v-for="day in 7" :key="day" class="tw-p-2">
              <ul class="tw-m-0 tw-list-none tw-space-y-1 tw-p-0">
                <li v-for="meal in itemsFor(day - 1, slot)" :key="meal.id" class="tw-rounded-lg tw-bg-salt/60 tw-p-1.5">
                  <span class="tw-font-medium">{{ meal.title }}</span>
                  <span class="tw-block tw-font-mono tw-text-[11px]">
                    {{ meal.calories }} kcal
                    <span v-if="meal.protein_g"> · {{ meal.protein_g }}g P</span>
                  </span>
                  <span v-if="meal.notes" class="tw-block tw-text-[10px] tw-text-muted">{{ meal.notes }}</span>
                  <button
                    type="button"
                    class="tw-text-[10px] tw-text-danger"
                    title="Apagar refeição"
                    @click="removeMeal(meal.id, meal.title)"
                  >
                    ×
                  </button>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
