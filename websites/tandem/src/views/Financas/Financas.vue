<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import MoneyField from '@/components/MoneyField.vue'
import { useAuth } from '@/composables/useAuth'
import { HOUSE_JOINT_SAVINGS_CATEGORY_SLUG } from '@/domain/financeCategories'
import { contributionsByMember, savingsBalance } from '@/domain/householdSavings'
import { monthStart, toISODate } from '@/domain/dates'
import { formatEuro } from '@/domain/money'
import { requireSupabase } from '@/lib/supabase'
import type {
  FinanceCategory,
  FinanceEntryType,
  FinanceEntryWithCategory,
  HouseholdSavingsMovement,
  Profile,
  SavingsMovementDirection,
} from '@/types/supabase'

const { profile, householdMembers, hasHousehold, user, ready, displayName, houseLabel } = useAuth()

const movimentosSubview = ref<'lista' | 'categorias' | 'novo'>('lista')
const contaConjuntaSubview = ref<'lista' | 'novo'>('lista')
const scope = ref<'household' | 'me'>('me')
const month = ref(monthStart().slice(0, 7))

const categories = ref<FinanceCategory[]>([])
const entries = ref<FinanceEntryWithCategory[]>([])
const savingsMovements = ref<HouseholdSavingsMovement[]>([])
const loading = ref(false)
const formError = ref<string | null>(null)

const form = ref({
  entry_type: 'expense' as FinanceEntryType,
  category_id: '',
  amount: 0,
  occurred_on: toISODate(),
  note: '',
})

const savingsForm = ref({
  direction: 'deposit' as SavingsMovementDirection,
  amount: 0,
  occurred_on: toISODate(),
  note: '',
  /** false = aporte em teu nome; true = saldo só da conta (sem pessoa) */
  onlyHouseLedger: false,
})

const filteredCategories = computed(() =>
  categories.value.filter((c) => c.kind === (form.value.entry_type === 'income' ? 'income' : 'expense')),
)

const selectedFinanceCategory = computed(() =>
  categories.value.find((c) => c.id === form.value.category_id),
)

const addsHouseSavingsOnSave = computed(
  () =>
    form.value.entry_type === 'expense' &&
    selectedFinanceCategory.value?.slug === HOUSE_JOINT_SAVINGS_CATEGORY_SLUG,
)

const monthStartISO = computed(() => `${month.value}-01`)

const myEntries = computed(() =>
  user.value ? entries.value.filter((e) => e.user_id === user.value!.id) : [],
)

const totals = computed(() => {
  let income = 0
  let expense = 0
  for (const entry of myEntries.value) {
    if (entry.entry_type === 'income') income += Number(entry.amount)
    else expense += Number(entry.amount)
  }
  return { income, expense, balance: income - expense }
})

const byCategory = computed(() => {
  const map = new Map<string, { label: string; total: number; type: FinanceEntryType }>()
  for (const entry of myEntries.value) {
    if (entry.entry_type === 'income') continue
    const label = entry.finance_categories?.label ?? '—'
    const key = entry.category_id
    const prev = map.get(key) ?? { label, total: 0, type: 'expense' }
    prev.total += Number(entry.amount)
    map.set(key, prev)
  }
  return [...map.values()].sort((a, b) => b.total - a.total)
})

const jointAccountBalance = computed(() => savingsBalance(savingsMovements.value))

const jointSavingsByMember = computed(() =>
  contributionsByMember(savingsMovements.value, householdMembers.value),
)

const scopeSummaryLabel = computed(() => {
  if (scope.value === 'me') return `As tuas finanças (${displayName.value})`
  return `Conta conjunta — ${houseLabel.value}`
})

function memberName(p: Profile): string {
  return p.display_name?.trim() || p.id.slice(0, 8)
}

function savingsMemberName(movement: HouseholdSavingsMovement): string {
  if (!movement.user_id) return 'Casa (sem pessoa)'
  const fromJoin = movement.profiles?.display_name?.trim()
  if (fromJoin) return fromJoin
  const m = householdMembers.value.find((x) => x.id === movement.user_id)
  return m ? memberName(m) : movement.user_id.slice(0, 8)
}

async function loadFinance() {
  if (!profile.value?.household_id) return
  const sb = requireSupabase()
  const householdId = profile.value.household_id

  const year = Number(month.value.slice(0, 4))
  const mon = Number(month.value.slice(5, 7))
  const lastDay = new Date(year, mon, 0).getDate()
  const end = `${month.value}-${String(lastDay).padStart(2, '0')}`

  const [{ data: cats }, { data: rows }] = await Promise.all([
    sb
      .from('finance_categories')
      .select('*')
      .eq('household_id', householdId)
      .order('sort_order'),
    sb
      .from('finance_entries')
      .select('*, finance_categories(label, slug)')
      .eq('household_id', householdId)
      .gte('occurred_on', monthStartISO.value)
      .lte('occurred_on', end)
      .order('occurred_on', { ascending: false }),
  ])

  categories.value = cats ?? []
  entries.value = (rows ?? []) as FinanceEntryWithCategory[]

  if (!form.value.category_id && filteredCategories.value[0]) {
    form.value.category_id = filteredCategories.value[0].id
  }
}

async function loadSavings() {
  if (!profile.value?.household_id) return
  const { data, error } = await requireSupabase()
    .from('household_savings_movements')
    .select('*')
    .eq('household_id', profile.value.household_id)
    .order('occurred_on', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    formError.value = error.message
    return
  }

  savingsMovements.value = (data ?? []) as HouseholdSavingsMovement[]
}

async function load() {
  if (!profile.value?.household_id) return
  loading.value = true
  formError.value = null
  try {
    await Promise.all([loadFinance(), loadSavings()])
  } finally {
    loading.value = false
  }
}

async function addEntry() {
  if (!profile.value?.household_id || !user.value) return
  if (form.value.amount <= 0 || !form.value.category_id) return

  formError.value = null
  const amount = form.value.amount
  const occurredOn = form.value.occurred_on
  const note = form.value.note.trim() || null

  const { error } = await requireSupabase().from('finance_entries').insert({
    household_id: profile.value.household_id,
    user_id: user.value.id,
    category_id: form.value.category_id,
    amount,
    entry_type: form.value.entry_type,
    occurred_on: occurredOn,
    note,
  })

  if (error) {
    formError.value = error.message
    return
  }

  if (addsHouseSavingsOnSave.value) {
    const savingsNote = note ? `${note} (finanças)` : 'Aporte via finanças'
    const { error: savingsError } = await requireSupabase().from('household_savings_movements').insert({
      household_id: profile.value.household_id,
      user_id: user.value.id,
      direction: 'deposit',
      amount,
      occurred_on: occurredOn,
      note: savingsNote,
    })
    if (savingsError) {
      formError.value = `Movimento guardado, mas falhou o depósito na poupança: ${savingsError.message}`
      await loadFinance()
      return
    }
    await loadSavings()
  }

  form.value.amount = 0
  form.value.note = ''
  await loadFinance()
  movimentosSubview.value = 'lista'
}

const expenseCategories = computed(() =>
  categories.value.filter((c) => c.kind === 'expense').sort((a, b) => a.sort_order - b.sort_order),
)
const incomeCategories = computed(() =>
  categories.value.filter((c) => c.kind === 'income').sort((a, b) => a.sort_order - b.sort_order),
)

async function addSavingsMovement() {
  if (!profile.value?.household_id || !user.value) return
  if (savingsForm.value.amount <= 0) return

  const userId = savingsForm.value.onlyHouseLedger ? null : user.value.id

  formError.value = null
  const { error } = await requireSupabase().from('household_savings_movements').insert({
    household_id: profile.value.household_id,
    user_id: userId,
    direction: savingsForm.value.direction,
    amount: savingsForm.value.amount,
    occurred_on: savingsForm.value.occurred_on,
    note: savingsForm.value.note.trim() || null,
  })

  if (error) {
    formError.value = error.message
    return
  }

  savingsForm.value.amount = 0
  savingsForm.value.note = ''
  savingsForm.value.direction = 'deposit'
  savingsForm.value.onlyHouseLedger = false
  contaConjuntaSubview.value = 'lista'
  await loadSavings()
}

watch(
  () => [ready.value, profile.value?.household_id] as const,
  ([isReady, householdId]) => {
    if (isReady && householdId) void load()
  },
  { immediate: true },
)

watch(month, () => {
  if (scope.value === 'me') void loadFinance()
})

watch(
  () => form.value.entry_type,
  () => {
    const first = filteredCategories.value[0]
    form.value.category_id = first?.id ?? ''
  },
)
</script>

<template>
  <div class="tw-mx-auto tw-max-w-3xl tw-space-y-6 tw-px-4 tw-py-10">
    <header class="tw-flex tw-flex-wrap tw-items-end tw-justify-between tw-gap-4">
      <div>
        <h1 class="tw-m-0 tw-text-2xl tw-font-semibold">Finanças</h1>
        <p class="tw-mt-1 tw-mb-0 tw-text-sm tw-text-muted">{{ scopeSummaryLabel }}</p>
      </div>
      <input
        v-if="scope === 'me'"
        v-model="month"
        type="month"
        class="tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2 tw-text-sm"
      />
    </header>

    <section v-if="!hasHousehold" class="tw-rounded-2xl tw-border tw-border-dashed tw-border-salt tw-p-6 tw-text-center tw-text-sm">
      <p class="tw-m-0">Cria ou entra numa casa para partilhar finanças.</p>
      <RouterLink to="/casa" class="tw-mt-3 tw-inline-block tw-font-semibold tw-text-teal">Configurar casa</RouterLink>
    </section>

    <template v-else>
      <div
        class="tw-flex tw-gap-2 tw-rounded-xl tw-border tw-border-salt tw-bg-white tw-p-1"
        role="group"
        aria-label="Ver finanças pessoais ou da casa"
      >
        <button
          type="button"
          class="tw-flex-1 tw-rounded-lg tw-py-2 tw-text-sm tw-font-medium"
          :class="scope === 'me' ? 'tw-bg-teal tw-text-paper' : 'tw-text-muted'"
          @click="scope = 'me'"
        >
          Eu
        </button>
        <button
          type="button"
          class="tw-flex-1 tw-rounded-lg tw-py-2 tw-text-sm tw-font-medium"
          :class="scope === 'household' ? 'tw-bg-teal tw-text-paper' : 'tw-text-muted'"
          @click="scope = 'household'"
        >
          Conta conjunta
        </button>
      </div>

      <template v-if="scope === 'me'">
        <div class="tw-grid tw-gap-3 sm:tw-grid-cols-3">
          <div class="tw-rounded-2xl tw-bg-white tw-p-4 tw-shadow-card">
            <p class="tw-m-0 tw-text-xs tw-text-muted">Ganhos</p>
            <p class="tw-m-0 tw-mt-1 tw-font-mono tw-text-lg tw-text-teal">{{ formatEuro(totals.income) }}</p>
          </div>
          <div class="tw-rounded-2xl tw-bg-white tw-p-4 tw-shadow-card">
            <p class="tw-m-0 tw-text-xs tw-text-muted">Gastos</p>
            <p class="tw-m-0 tw-mt-1 tw-font-mono tw-text-lg">{{ formatEuro(totals.expense) }}</p>
          </div>
          <div class="tw-rounded-2xl tw-bg-white tw-p-4 tw-shadow-card">
            <p class="tw-m-0 tw-text-xs tw-text-muted">Saldo</p>
            <p class="tw-m-0 tw-mt-1 tw-font-mono tw-text-lg tw-font-semibold">{{ formatEuro(totals.balance) }}</p>
          </div>
        </div>

        <div
          class="tw-flex tw-gap-1 tw-overflow-x-auto tw-rounded-xl tw-border tw-border-salt tw-bg-white tw-p-1"
          role="tablist"
          aria-label="Secções de movimentos"
        >
          <button
            type="button"
            role="tab"
            class="tw-shrink-0 tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm tw-font-medium"
            :class="movimentosSubview === 'lista' ? 'tw-bg-teal tw-text-paper' : 'tw-text-muted'"
            :aria-selected="movimentosSubview === 'lista'"
            @click="movimentosSubview = 'lista'"
          >
            Movimentos
          </button>
          <button
            type="button"
            role="tab"
            class="tw-shrink-0 tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm tw-font-medium"
            :class="movimentosSubview === 'categorias' ? 'tw-bg-teal tw-text-paper' : 'tw-text-muted'"
            :aria-selected="movimentosSubview === 'categorias'"
            @click="movimentosSubview = 'categorias'"
          >
            Por categoria
          </button>
          <button
            type="button"
            role="tab"
            class="tw-shrink-0 tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm tw-font-medium"
            :class="movimentosSubview === 'novo' ? 'tw-bg-teal tw-text-paper' : 'tw-text-muted'"
            :aria-selected="movimentosSubview === 'novo'"
            @click="movimentosSubview = 'novo'"
          >
            Novo
          </button>
        </div>

        <section
          v-show="movimentosSubview === 'lista'"
          class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-5"
          role="tabpanel"
        >
          <p v-if="loading" class="tw-m-0 tw-text-sm tw-text-muted">A carregar…</p>
          <ul v-else class="tw-m-0 tw-list-none tw-space-y-2 tw-p-0 tw-text-sm">
            <li
              v-for="e in myEntries"
              :key="e.id"
              class="tw-flex tw-flex-wrap tw-justify-between tw-gap-2 tw-border-b tw-border-salt/60 tw-py-2"
            >
              <span>
                {{ e.occurred_on }}
                · {{ e.finance_categories?.label }}
                <span class="tw-text-muted">{{ e.entry_type === 'income' ? 'ganho' : 'gasto' }}</span>
              </span>
              <span class="tw-font-mono" :class="e.entry_type === 'income' ? 'tw-text-teal' : ''">
                {{ e.entry_type === 'income' ? '+' : '-' }}{{ formatEuro(Number(e.amount)) }}
              </span>
            </li>
            <li v-if="!myEntries.length" class="tw-text-muted">Sem movimentos neste mês.</li>
          </ul>
        </section>

        <section
          v-show="movimentosSubview === 'categorias'"
          class="tw-space-y-4"
          role="tabpanel"
        >
          <div class="tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card">
            <p v-if="loading" class="tw-m-0 tw-text-sm tw-text-muted">A carregar…</p>
            <ul v-else class="tw-m-0 tw-list-none tw-space-y-2 tw-p-0">
              <li v-for="row in byCategory" :key="row.label" class="tw-flex tw-justify-between tw-text-sm">
                <span>{{ row.label }}</span>
                <span class="tw-font-mono">{{ formatEuro(row.total) }}</span>
              </li>
              <li v-if="!byCategory.length" class="tw-text-sm tw-text-muted">Sem gastos neste período.</li>
            </ul>
          </div>
          <div class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-5 tw-text-sm">
            <h2 class="tw-m-0 tw-mb-2 tw-text-base tw-font-semibold">Categorias disponíveis</h2>
            <p class="tw-m-0 tw-mb-2 tw-text-xs tw-text-muted">
              Ganhos: {{ incomeCategories.map((c) => c.label).join(', ') || '—' }}
            </p>
            <p class="tw-m-0 tw-text-xs tw-text-muted">
              Gastos: {{ expenseCategories.map((c) => c.label).join(', ') || '—' }}
            </p>
          </div>
        </section>

        <form
          v-show="movimentosSubview === 'novo'"
          class="tw-space-y-3 tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card"
          role="tabpanel"
          @submit.prevent="addEntry"
        >
          <div class="tw-flex tw-flex-wrap tw-gap-2">
            <button
              type="button"
              class="tw-rounded-lg tw-px-3 tw-py-1 tw-text-sm"
              :class="form.entry_type === 'expense' ? 'tw-bg-ink tw-text-paper' : 'tw-bg-salt'"
              @click="form.entry_type = 'expense'"
            >
              Gasto
            </button>
            <button
              type="button"
              class="tw-rounded-lg tw-px-3 tw-py-1 tw-text-sm"
              :class="form.entry_type === 'income' ? 'tw-bg-teal tw-text-paper' : 'tw-bg-salt'"
              @click="form.entry_type = 'income'"
            >
              Ganho
            </button>
          </div>
          <label class="tw-block tw-text-sm">
            Categoria
            <select v-model="form.category_id" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2">
              <option v-for="c in filteredCategories" :key="c.id" :value="c.id">{{ c.label }}</option>
            </select>
          </label>
          <p v-if="addsHouseSavingsOnSave" class="tw-m-0 tw-rounded-xl tw-bg-teal/10 tw-px-3 tw-py-2 tw-text-xs tw-text-ink">
            Ao guardar, regista-se também um <strong>depósito teu</strong> na conta conjunta (vista Conta conjunta), com o
            mesmo valor e data.
          </p>
          <MoneyField v-model="form.amount" label="Valor" />
          <label class="tw-block tw-text-sm">
            Data
            <input v-model="form.occurred_on" type="date" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
          </label>
          <input v-model="form.note" type="text" placeholder="Nota opcional" class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2 tw-text-sm" />
          <button type="submit" class="tw-rounded-xl tw-bg-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper">
            Guardar
          </button>
        </form>
      </template>

      <template v-else>
        <div class="tw-rounded-2xl tw-bg-teal tw-p-5 tw-text-paper">
          <p class="tw-m-0 tw-text-sm tw-opacity-90">Saldo da conta conjunta</p>
          <p class="tw-m-0 tw-mt-1 tw-font-mono tw-text-3xl tw-font-semibold">{{ formatEuro(jointAccountBalance) }}</p>
          <p class="tw-m-0 tw-mt-2 tw-text-xs tw-opacity-80">
            Saldo inicial da casa, mais aportes e levantamentos de cada um.
          </p>
          <p v-if="formError" class="tw-m-0 tw-mt-3 tw-rounded-lg tw-bg-white/20 tw-px-3 tw-py-2 tw-text-xs">
            {{ formError }}
          </p>
        </div>

        <section class="tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card">
          <h2 class="tw-m-0 tw-mb-3 tw-text-base tw-font-semibold">Aportes por pessoa</h2>
          <ul class="tw-m-0 tw-list-none tw-space-y-2 tw-p-0 tw-text-sm">
            <li
              v-for="row in jointSavingsByMember"
              :key="row.userId"
              class="tw-flex tw-justify-between tw-gap-2 tw-border-b tw-border-salt/60 tw-py-2"
            >
              <span>{{ row.name }}</span>
              <span class="tw-font-mono tw-text-right">
                <span class="tw-text-teal">+{{ formatEuro(row.deposited) }}</span>
                <span v-if="row.withdrawn > 0" class="tw-text-muted"> · −{{ formatEuro(row.withdrawn) }}</span>
                <span class="tw-block tw-text-xs tw-text-muted">líquido {{ formatEuro(row.net) }}</span>
              </span>
            </li>
          </ul>
        </section>

        <div
          class="tw-flex tw-gap-1 tw-rounded-xl tw-border tw-border-salt tw-bg-white tw-p-1"
          role="tablist"
          aria-label="Conta conjunta"
        >
          <button
            type="button"
            role="tab"
            class="tw-flex-1 tw-rounded-lg tw-py-2 tw-text-sm tw-font-medium"
            :class="contaConjuntaSubview === 'lista' ? 'tw-bg-teal tw-text-paper' : 'tw-text-muted'"
            @click="contaConjuntaSubview = 'lista'"
          >
            Movimentos
          </button>
          <button
            type="button"
            role="tab"
            class="tw-flex-1 tw-rounded-lg tw-py-2 tw-text-sm tw-font-medium"
            :class="contaConjuntaSubview === 'novo' ? 'tw-bg-teal tw-text-paper' : 'tw-text-muted'"
            @click="contaConjuntaSubview = 'novo'"
          >
            Novo
          </button>
        </div>

        <section
          v-show="contaConjuntaSubview === 'lista'"
          class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-5"
          role="tabpanel"
        >
          <p v-if="loading" class="tw-m-0 tw-text-sm tw-text-muted">A carregar…</p>
          <ul v-else class="tw-m-0 tw-list-none tw-space-y-2 tw-p-0 tw-text-sm">
            <li
              v-for="m in savingsMovements"
              :key="m.id"
              class="tw-flex tw-flex-wrap tw-justify-between tw-gap-2 tw-border-b tw-border-salt/60 tw-py-2"
            >
              <span>
                {{ m.occurred_on }} · {{ savingsMemberName(m) }}
                <span class="tw-text-muted"> · {{ m.direction === 'deposit' ? 'depósito' : 'levantamento' }}</span>
                <span v-if="m.note" class="tw-block tw-text-xs tw-text-muted">{{ m.note }}</span>
              </span>
              <span
                class="tw-font-mono"
                :class="m.direction === 'deposit' ? 'tw-text-teal' : 'tw-text-danger'"
              >
                {{ m.direction === 'deposit' ? '+' : '−' }}{{ formatEuro(Number(m.amount)) }}
              </span>
            </li>
            <li v-if="!savingsMovements.length" class="tw-text-muted">Ainda sem movimentos na conta conjunta.</li>
          </ul>
        </section>

        <form
          v-show="contaConjuntaSubview === 'novo'"
          class="tw-space-y-3 tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card"
          role="tabpanel"
          @submit.prevent="addSavingsMovement"
        >
          <div class="tw-flex tw-flex-wrap tw-gap-2">
            <button
              type="button"
              class="tw-rounded-lg tw-px-3 tw-py-1.5 tw-text-sm"
              :class="savingsForm.direction === 'deposit' ? 'tw-bg-teal tw-text-paper' : 'tw-bg-salt'"
              @click="savingsForm.direction = 'deposit'"
            >
              Depósito
            </button>
            <button
              type="button"
              class="tw-rounded-lg tw-px-3 tw-py-1.5 tw-text-sm"
              :class="savingsForm.direction === 'withdrawal' ? 'tw-bg-ink tw-text-paper' : 'tw-bg-salt'"
              @click="savingsForm.direction = 'withdrawal'"
            >
              Levantamento
            </button>
          </div>
          <MoneyField v-model="savingsForm.amount" label="Valor" />
          <label class="tw-flex tw-cursor-pointer tw-items-start tw-gap-2 tw-text-sm">
            <input v-model="savingsForm.onlyHouseLedger" type="checkbox" class="tw-mt-1" />
            <span>
              Movimento só da conta (sem pessoa)
              <span class="tw-block tw-text-xs tw-font-normal tw-text-muted">
                Ex.: saldo inicial. Se não marcares, fica registado no teu nome.
              </span>
            </span>
          </label>
          <label class="tw-block tw-text-sm">
            Data
            <input v-model="savingsForm.occurred_on" type="date" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
          </label>
          <input
            v-model="savingsForm.note"
            type="text"
            placeholder="Nota opcional"
            class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2 tw-text-sm"
          />
          <button type="submit" class="tw-rounded-xl tw-bg-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper">
            Registar
          </button>
        </form>
      </template>

      <p v-if="formError" class="tw-m-0 tw-text-sm tw-text-danger">{{ formError }}</p>
    </template>
  </div>
</template>
