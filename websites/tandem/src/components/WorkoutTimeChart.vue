<script setup lang="ts">
import { computed } from 'vue'
import { barPercent, formatDuration, type WorkoutTypeStats } from '@/domain/workoutTimes'

const props = defineProps<{
  stats: WorkoutTypeStats[]
}>()

const activeStats = computed(() => props.stats.filter((s) => s.sessions.length > 0))

function sessionBarWidth(durationSec: number, sessions: WorkoutTypeStats['sessions']): number {
  const times = sessions.map((s) => s.duration_sec)
  const min = Math.min(...times)
  const max = Math.max(...times)
  return barPercent(durationSec, max, min)
}
</script>

<template>
  <div class="tw-space-y-6">
    <p v-if="!activeStats.length" class="tw-m-0 tw-text-sm tw-text-muted">
      Ainda não há tempos registados. Escolhe o tipo de treino e indica a duração.
    </p>

    <section
      v-for="block in activeStats"
      :key="block.type"
      class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-4"
    >
      <div class="tw-mb-3 tw-flex tw-flex-wrap tw-items-baseline tw-justify-between tw-gap-2">
        <h3 class="tw-m-0 tw-text-sm tw-font-semibold">{{ block.label }}</h3>
        <p class="tw-m-0 tw-font-mono tw-text-xs tw-text-muted">
          PB
          <strong class="tw-text-teal">{{ block.personalBestSec != null ? formatDuration(block.personalBestSec) : '—' }}</strong>
          <span v-if="block.latestSec != null && block.personalBestSec !== block.latestSec">
            · último {{ formatDuration(block.latestSec) }}
          </span>
        </p>
      </div>

      <ul class="tw-m-0 tw-list-none tw-space-y-2 tw-p-0">
        <li
          v-for="session in block.sessions.slice(-12)"
          :key="session.occurred_on + session.duration_sec"
          class="tw-grid tw-grid-cols-[4.5rem_1fr_3.5rem] tw-items-center tw-gap-2 tw-text-xs"
        >
          <span class="tw-text-muted">{{ session.occurred_on.slice(5) }}</span>
          <div class="tw-h-2 tw-overflow-hidden tw-rounded-full tw-bg-salt">
            <div
              class="tw-h-full tw-rounded-full tw-bg-teal"
              :class="session.duration_sec === block.personalBestSec ? '!tw-bg-amber' : ''"
              :style="{ width: `${sessionBarWidth(session.duration_sec, block.sessions)}%` }"
            />
          </div>
          <span class="tw-text-right tw-font-mono">{{ formatDuration(session.duration_sec) }}</span>
        </li>
      </ul>
      <p class="tw-m-0 tw-mt-2 tw-text-[10px] tw-text-muted">Barras mais curtas = tempos mais rápidos. Amarelo = melhor marca.</p>
    </section>
  </div>
</template>
