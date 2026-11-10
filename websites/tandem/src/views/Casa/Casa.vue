<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AvatarPicker from '@/components/AvatarPicker.vue'
import MoneyField from '@/components/MoneyField.vue'
import { useAuth } from '@/composables/useAuth'
import { formatEuro } from '@/domain/money'
import { uploadHouseholdAvatar } from '@/lib/avatars'
import {
  HOUSEHOLD_GOAL_KIND_LABELS,
  type HouseholdGoalKind,
} from '@/types/supabase'

const router = useRouter()
const {
  hasHousehold,
  household,
  householdGoals,
  createHousehold,
  joinHousehold,
  updateHousehold,
  addHouseholdGoal,
  deleteHouseholdGoal,
  leaveHousehold,
  authError,
} = useAuth()

const householdName = ref('Casa')
const inviteCode = ref('')
const loading = ref(false)
const localError = ref<string | null>(null)
const houseMessage = ref<string | null>(null)
const leaveOpen = ref(false)
const leaveError = ref<string | null>(null)
const cancelLeaveButton = ref<HTMLButtonElement | null>(null)

const editName = ref(household.value?.name ?? '')
const goalTab = ref<'lista' | 'criar'>('lista')
const goalForm = ref({
  kind: 'poupanca' as HouseholdGoalKind,
  title: '',
  target_amount: 0,
  target_date: '',
  notes: '',
})

async function onCreate() {
  loading.value = true
  localError.value = null
  try {
    await createHousehold(householdName.value)
    await router.push('/')
  } catch (e) {
    localError.value = e instanceof Error ? e.message : 'Erro ao criar casa'
  } finally {
    loading.value = false
  }
}

async function onJoin() {
  loading.value = true
  localError.value = null
  try {
    await joinHousehold(inviteCode.value)
    await router.push('/')
  } catch (e) {
    localError.value = e instanceof Error ? e.message : 'Erro ao entrar na casa'
  } finally {
    loading.value = false
  }
}

async function saveHouseName() {
  if (!household.value) return
  loading.value = true
  localError.value = null
  houseMessage.value = null
  try {
    await updateHousehold({ name: editName.value.trim() || 'Casa' })
    houseMessage.value = 'Nome da casa atualizado.'
  } catch (e) {
    localError.value = e instanceof Error ? e.message : 'Erro ao guardar.'
  } finally {
    loading.value = false
  }
}

async function onHouseAvatar(file: File) {
  if (!household.value) return
  loading.value = true
  localError.value = null
  houseMessage.value = null
  try {
    const url = await uploadHouseholdAvatar(household.value.id, file)
    await updateHousehold({ avatar_url: url })
    houseMessage.value = 'Foto da casa atualizada.'
  } catch (e) {
    localError.value = e instanceof Error ? e.message : 'Erro no upload.'
  } finally {
    loading.value = false
  }
}

async function addGoal() {
  if (!goalForm.value.title.trim()) return
  loading.value = true
  localError.value = null
  try {
    await addHouseholdGoal({
      kind: goalForm.value.kind,
      title: goalForm.value.title.trim(),
      target_amount: goalForm.value.target_amount > 0 ? goalForm.value.target_amount : null,
      target_date: goalForm.value.target_date || null,
      notes: goalForm.value.notes.trim() || null,
    })
    goalForm.value.title = ''
    goalForm.value.target_amount = 0
    goalForm.value.target_date = ''
    goalForm.value.notes = ''
    goalTab.value = 'lista'
  } catch (e) {
    localError.value = e instanceof Error ? e.message : 'Erro ao adicionar objetivo.'
  } finally {
    loading.value = false
  }
}

function dismissLeave() {
  if (!loading.value) leaveOpen.value = false
}

function onLeaveKey(event: KeyboardEvent) {
  if (event.key === 'Escape') dismissLeave()
}

async function confirmLeave() {
  if (!household.value || loading.value) return
  loading.value = true
  leaveError.value = null
  try {
    await leaveHousehold()
    leaveOpen.value = false
  } catch (e) {
    leaveError.value = e instanceof Error ? e.message : 'Não foi possível sair da casa.'
  } finally {
    loading.value = false
  }
}

async function removeGoal(id: string) {
  loading.value = true
  try {
    await deleteHouseholdGoal(id)
  } catch (e) {
    localError.value = e instanceof Error ? e.message : 'Erro ao remover.'
  } finally {
    loading.value = false
  }
}

watch(
  household,
  (home) => {
    if (home?.name) editName.value = home.name
  },
  { immediate: true },
)

watch(leaveOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    leaveError.value = null
    window.addEventListener('keydown', onLeaveKey)
    void nextTick(() => cancelLeaveButton.value?.focus())
  } else {
    window.removeEventListener('keydown', onLeaveKey)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onLeaveKey)
})
</script>

<template>
  <div class="tw-mx-auto tw-max-w-lg tw-space-y-6 tw-px-4 tw-py-10">
    <header>
      <h1 class="tw-m-0 tw-text-2xl tw-font-semibold">Casa</h1>
      <p class="tw-mt-2 tw-mb-0 tw-text-sm tw-text-muted">
        Finanças e objetivos em conjunto. Alimentação e treino ficam no perfil de cada um.
      </p>
    </header>

    <section v-if="hasHousehold && household" class="tw-space-y-4">
      <div class="tw-rounded-2xl tw-bg-teal/10 tw-p-5">
        <p class="tw-m-0 tw-text-sm">Código para convidar:</p>
        <p class="tw-m-0 tw-mt-2 tw-font-mono tw-text-lg tw-font-semibold">{{ household.invite_code }}</p>
      </div>

      <section class="tw-space-y-4 tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card">
        <h2 class="tw-m-0 tw-text-base tw-font-semibold">Editar casa</h2>
        <AvatarPicker
          label="Foto da casa"
          :name="household.name"
          :image-url="household.avatar_url"
          :disabled="loading"
          @pick="onHouseAvatar"
        />
        <label class="tw-block tw-space-y-1 tw-text-sm">
          <span class="tw-font-medium">Nome da casa</span>
          <input v-model="editName" type="text" class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
        </label>
        <button
          type="button"
          class="tw-rounded-xl tw-bg-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper"
          :disabled="loading"
          @click="saveHouseName"
        >
          Guardar
        </button>
        <p v-if="houseMessage" class="tw-m-0 tw-text-sm tw-text-teal">{{ houseMessage }}</p>
      </section>

      <div class="tw-flex tw-gap-1 tw-rounded-xl tw-bg-salt/80 tw-p-1">
        <button
          type="button"
          class="tw-flex-1 tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm tw-font-medium"
          :class="goalTab === 'lista' ? 'tw-bg-white tw-shadow-sm' : 'tw-text-muted'"
          @click="goalTab = 'lista'"
        >
          Objetivos
        </button>
        <button
          type="button"
          class="tw-flex-1 tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm tw-font-medium"
          :class="goalTab === 'criar' ? 'tw-bg-white tw-shadow-sm' : 'tw-text-muted'"
          @click="goalTab = 'criar'"
        >
          Criar objetivo
        </button>
      </div>

      <section v-if="goalTab === 'lista'" class="tw-space-y-4 tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card">
        <h2 class="tw-m-0 tw-text-base tw-font-semibold">Objetivos da casa</h2>
        <p class="tw-m-0 tw-text-xs tw-text-muted">Poupanças, férias e outros alvos da casa.</p>

        <ul v-if="householdGoals.length" class="tw-m-0 tw-list-none tw-space-y-2 tw-p-0">
          <li
            v-for="goal in householdGoals"
            :key="goal.id"
            class="tw-flex tw-items-start tw-justify-between tw-gap-2 tw-rounded-xl tw-border tw-border-salt tw-p-3 tw-text-sm"
          >
            <div>
              <p class="tw-m-0 tw-font-medium">{{ goal.title }}</p>
              <p class="tw-m-0 tw-mt-1 tw-text-xs tw-text-muted">
                {{ HOUSEHOLD_GOAL_KIND_LABELS[goal.kind] }}
                <span v-if="goal.target_amount"> · {{ formatEuro(Number(goal.target_amount)) }}</span>
                <span v-if="goal.target_date"> · até {{ goal.target_date }}</span>
              </p>
              <p v-if="goal.notes" class="tw-m-0 tw-mt-1 tw-text-xs">{{ goal.notes }}</p>
            </div>
            <button type="button" class="tw-shrink-0 tw-text-xs tw-text-danger" :disabled="loading" @click="removeGoal(goal.id)">
              Remover
            </button>
          </li>
        </ul>
        <p v-else class="tw-m-0 tw-text-sm tw-text-muted">Ainda sem objetivos.</p>
      </section>

      <form v-else class="tw-space-y-3 tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card" @submit.prevent="addGoal">
        <h2 class="tw-m-0 tw-text-base tw-font-semibold">Criar objetivo</h2>
        <label class="tw-block tw-text-sm">
          Tipo
          <select v-model="goalForm.kind" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2">
            <option v-for="(label, key) in HOUSEHOLD_GOAL_KIND_LABELS" :key="key" :value="key">{{ label }}</option>
          </select>
        </label>
        <label class="tw-block tw-text-sm">
          Nome
          <input
            v-model="goalForm.title"
            type="text"
            required
            placeholder="Ex.: Fundo para férias no Gerês"
            class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2"
          />
        </label>
        <MoneyField v-model="goalForm.target_amount" label="Valor alvo (opcional)" />
        <label class="tw-block tw-text-sm">
          Data alvo (opcional)
          <input v-model="goalForm.target_date" type="date" class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
        </label>
        <label class="tw-block tw-text-sm">
          Notas (opcional)
          <input
            v-model="goalForm.notes"
            type="text"
            class="tw-mt-1 tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2"
          />
        </label>
        <button type="submit" class="tw-rounded-xl tw-border tw-border-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-teal" :disabled="loading">
          Adicionar objetivo
        </button>
      </form>

      <section class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-5">
        <h2 class="tw-m-0 tw-text-base tw-font-semibold">Sair da casa</h2>
        <p class="tw-m-0 tw-mt-1 tw-text-sm tw-text-muted">
          Deixas de ver as finanças e os objetivos desta casa. A alimentação e o treino ficam na tua conta.
        </p>
        <button
          type="button"
          class="tw-mt-4 tw-rounded-xl tw-bg-danger/10 tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-danger disabled:tw-opacity-60"
          :disabled="loading"
          @click="leaveOpen = true"
        >
          Sair da casa
        </button>
      </section>

      <RouterLink to="/" class="tw-inline-block tw-text-sm tw-font-medium tw-text-teal">Ir para início</RouterLink>
    </section>

    <template v-else>
      <section class="tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card">
        <h2 class="tw-m-0 tw-mb-3 tw-text-base tw-font-semibold">Criar casa</h2>
        <label class="tw-block tw-space-y-1 tw-text-sm">
          <span class="tw-text-muted">Nome</span>
          <input v-model="householdName" type="text" class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
        </label>
        <button
          type="button"
          class="tw-mt-4 tw-rounded-xl tw-bg-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper disabled:tw-opacity-60"
          :disabled="loading"
          @click="onCreate"
        >
          Criar e obter código
        </button>
      </section>

      <section class="tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card">
        <h2 class="tw-m-0 tw-mb-3 tw-text-base tw-font-semibold">Entrar com código</h2>
        <input
          v-model="inviteCode"
          type="text"
          placeholder="código de convite"
          class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2 tw-font-mono tw-text-sm"
        />
        <button
          type="button"
          class="tw-mt-4 tw-rounded-xl tw-border tw-border-teal tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-teal disabled:tw-opacity-60"
          :disabled="loading || !inviteCode.trim()"
          @click="onJoin"
        >
          Juntar-me
        </button>
      </section>
    </template>

    <Teleport to="body">
      <div
        v-if="leaveOpen && household"
        class="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-end tw-justify-center tw-bg-ink/40 tw-p-4 sm:tw-items-center"
        @click.self="dismissLeave"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-house-title"
          class="tw-w-full tw-max-w-md tw-rounded-2xl tw-bg-paper tw-p-5 tw-shadow-card"
        >
          <h2 id="leave-house-title" class="tw-m-0 tw-text-lg tw-font-semibold">Sair de {{ household.name }}?</h2>
          <p class="tw-m-0 tw-mt-2 tw-text-sm tw-text-muted">
            Deixas de ver as finanças e os objetivos desta casa. A alimentação e o treino ficam na tua conta.
            Os movimentos que registaste continuam na casa, para quem ficar.
          </p>
          <p v-if="leaveError" class="tw-m-0 tw-mt-3 tw-text-sm tw-text-danger">{{ leaveError }}</p>
          <div class="tw-mt-5 tw-flex tw-justify-end tw-gap-2">
            <button
              ref="cancelLeaveButton"
              type="button"
              class="tw-rounded-xl tw-border tw-border-salt tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-semibold"
              :disabled="loading"
              @click="dismissLeave"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="tw-rounded-xl tw-bg-danger tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper disabled:tw-opacity-60"
              :disabled="loading"
              @click="confirmLeave"
            >
              {{ loading ? 'A sair…' : 'Sair da casa' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <p v-if="localError || authError" class="tw-m-0 tw-text-sm tw-text-danger">{{ localError ?? authError }}</p>
  </div>
</template>
