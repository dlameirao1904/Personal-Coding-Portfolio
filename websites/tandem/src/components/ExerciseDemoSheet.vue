<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { demosForExercise, formatEquipment, formatMuscles } from '@/domain/exerciseLookup'
import type { TrainingPlanExercise } from '@/types/supabase'

const props = defineProps<{
  exercise: TrainingPlanExercise
}>()

const emit = defineEmits<{
  close: []
}>()

const active = ref(0)
const gifFailed = ref(false)
const closeButton = ref<HTMLButtonElement | null>(null)

const demos = computed(() => demosForExercise(props.exercise.name))
const current = computed(() => demos.value[active.value] ?? null)

const prescription = computed(() => {
  const sets = props.exercise.sets != null ? `${props.exercise.sets} séries` : null
  const reps = props.exercise.reps ? `${props.exercise.reps} reps` : null
  return [sets, reps].filter(Boolean).join(' · ')
})

watch(
  () => props.exercise.name,
  () => {
    active.value = 0
    gifFailed.value = false
  },
)

watch(active, () => {
  gifFailed.value = false
})

onMounted(() => {
  document.body.style.overflow = 'hidden'
  closeButton.value?.focus()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div class="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-end tw-justify-center sm:tw-items-center">
      <button type="button" class="tw-absolute tw-inset-0 tw-bg-ink/50" aria-label="Fechar" @click="emit('close')" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-demo-title"
        class="tw-relative tw-z-10 tw-max-h-[92dvh] tw-w-full tw-overflow-y-auto tw-rounded-t-3xl tw-bg-paper tw-p-5 tw-shadow-card sm:tw-max-w-lg sm:tw-rounded-3xl"
      >
        <div class="tw-flex tw-items-start tw-justify-between tw-gap-3">
          <div>
            <h2 id="exercise-demo-title" class="tw-m-0 tw-text-lg tw-font-semibold">{{ exercise.name }}</h2>
            <p v-if="prescription" class="tw-m-0 tw-mt-1 tw-font-mono tw-text-sm tw-text-muted">{{ prescription }}</p>
            <p v-if="exercise.note" class="tw-m-0 tw-mt-1 tw-text-xs tw-text-muted">{{ exercise.note }}</p>
          </div>
          <button
            ref="closeButton"
            type="button"
            class="tw-rounded-lg tw-px-2 tw-py-1 tw-text-sm tw-text-muted"
            @click="emit('close')"
          >
            Fechar
          </button>
        </div>

        <p v-if="!current" class="tw-mt-6 tw-text-sm tw-text-muted">
          Não há demonstração para este exercício. Séries e repetições do plano mantêm-se.
        </p>

        <div v-else class="tw-mt-4 tw-space-y-4">
          <div v-if="demos.length > 1" class="tw-flex tw-gap-1 tw-overflow-x-auto">
            <button
              v-for="(demo, index) in demos"
              :key="demo.exerciseId"
              type="button"
              class="tw-shrink-0 tw-rounded-lg tw-px-2.5 tw-py-1.5 tw-text-xs tw-font-medium"
              :class="active === index ? 'tw-bg-teal tw-text-paper' : 'tw-bg-white tw-text-muted'"
              @click="active = index"
            >
              {{ demo.label ?? demo.name }}
            </button>
          </div>

          <img
            v-if="!gifFailed"
            :src="current.gifUrl"
            :alt="`Demonstração de ${current.name}`"
            class="tw-mx-auto tw-max-h-72 tw-w-full tw-rounded-2xl tw-bg-white tw-object-contain"
            @error="gifFailed = true"
          />
          <p v-else class="tw-m-0 tw-rounded-2xl tw-bg-white tw-px-3 tw-py-6 tw-text-center tw-text-sm tw-text-muted">
            O GIF não carregou.
          </p>

          <p v-if="current.caption" class="tw-m-0 tw-text-xs tw-text-muted">{{ current.caption }}</p>
          <p
            v-else-if="current.name.toLowerCase() !== exercise.name.toLowerCase()"
            class="tw-m-0 tw-text-xs tw-text-muted"
          >
            Movimento: {{ current.name }}
          </p>

          <p v-if="formatMuscles(current.targetMuscles)" class="tw-m-0 tw-text-sm">
            <span class="tw-text-muted">Músculo</span>
            {{ formatMuscles(current.targetMuscles) }}
          </p>
          <p v-if="formatEquipment(current.equipments)" class="tw-m-0 tw-text-sm">
            <span class="tw-text-muted">Equipamento</span>
            {{ formatEquipment(current.equipments) }}
          </p>

          <div v-if="current.instructions.length">
            <h3 class="tw-m-0 tw-text-sm tw-font-semibold">Como fazer</h3>
            <p class="tw-m-0 tw-mt-1 tw-text-xs tw-text-muted">Instruções em inglês, da ExerciseDB.</p>
            <ol class="tw-mt-2 tw-list-decimal tw-space-y-2 tw-pl-5 tw-text-sm">
              <li v-for="(step, index) in current.instructions" :key="index">{{ step }}</li>
            </ol>
          </div>

          <p class="tw-m-0 tw-text-xs tw-text-muted">
            GIF e instruções:
            <a
              href="https://oss.exercisedb.dev/docs"
              class="tw-text-teal"
              target="_blank"
              rel="noreferrer"
            >ExerciseDB (AscendAPI)</a>.
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
