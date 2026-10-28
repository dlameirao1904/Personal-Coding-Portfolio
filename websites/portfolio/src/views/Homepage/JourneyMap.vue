<template>
  <div>
    <button
      type="button"
      class="map-thumb tw-h-[7.25rem] tw-w-[7.25rem] tw-cursor-pointer tw-overflow-hidden tw-rounded-2xl tw-border tw-border-[#17211c22] tw-bg-[#f7f3eaf0] tw-p-1.5 tw-shadow-[0_10px_24px_#17211c24] hover:tw-bg-white focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
      :aria-expanded="open"
      aria-label="Abrir o mapa"
      @click="open = true"
    >
      <MapSheet :wide="false" />
    </button>
    <p
      v-if="cue && !open"
      class="tw-m-0 tw-mt-2 tw-max-w-[11rem] tw-rounded-xl tw-bg-[#f7f3eaf0] tw-px-2.5 tw-py-1.5 tw-text-[0.75rem] tw-leading-snug tw-text-[#17211c] tw-shadow-[0_8px_18px_#17211c24]"
    >
      {{ cue }}
    </p>

    <div
      v-if="open"
      class="tw-fixed tw-inset-0 tw-z-[30] tw-flex tw-items-center tw-justify-center tw-bg-[#17211ccc] tw-p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Mapa do vale"
      @click.self="open = false"
    >
      <div
        class="map-panel tw-flex tw-max-h-[min(90vh,820px)] tw-w-[min(680px,100%)] tw-flex-col tw-gap-3 tw-overflow-auto tw-rounded-[22px] tw-bg-[#f7f3eaf0] tw-p-4 tw-shadow-[0_16px_40px_#17211c1f]"
      >
        <div class="tw-flex tw-items-center tw-justify-between tw-gap-3">
          <p class="tw-m-0 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.14em] tw-text-[#8a4632]">
            Mapa
          </p>
          <button
            type="button"
            class="tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e332814] tw-px-3 tw-py-1 tw-font-[inherit] tw-text-[0.85rem] tw-text-[#17211c]"
            @click="open = false"
          >
            Fechar
          </button>
        </div>
        <MapSheet :wide="true" class="map-sheet tw-h-[min(64vh,560px)] tw-w-full" @pick="choose" />
        <p class="tw-m-0 tw-text-[0.92rem] tw-leading-snug tw-text-[#17211c]">
          {{ cue || 'Escolhe um ponto no mapa.' }}
        </p>
        <button
          v-if="trailGoal"
          type="button"
          class="tw-w-fit tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e332814] tw-px-3 tw-py-1 tw-font-[inherit] tw-text-[0.85rem] tw-text-[#17211c]"
          @click="clearTrailGoal"
        >
          Limpar caminho
        </button>
        <ul
          class="tw-m-0 tw-flex tw-list-none tw-flex-wrap tw-gap-x-4 tw-gap-y-1 tw-p-0 tw-text-[0.78rem] tw-text-[#3d4943]"
        >
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span class="tw-h-2 tw-w-2 tw-rounded-full tw-bg-[#0e3328]" /> Educação
          </li>
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span class="tw-h-2 tw-w-2 tw-rounded-full tw-bg-[#8a4632]" /> Trabalho
          </li>
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span class="tw-h-2 tw-w-2 tw-rounded-full tw-bg-[#8a6a32]" /> Pessoal
          </li>
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span class="tw-h-2 tw-w-2 tw-rounded-full tw-bg-[#8d5a45]" /> Atelier
          </li>
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span
              class="tw-h-2 tw-w-2 tw-rounded-full tw-border tw-border-[#8d7b66] tw-bg-[#f4efe4]"
            />
            Capela
          </li>
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span class="tw-h-2 tw-w-3 tw-rounded-sm tw-bg-[#2f7a3e]" />
            Campo
          </li>
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span class="tw-h-2 tw-w-2 tw-rounded-sm tw-bg-[#1e4b73]" />
            Ringue
          </li>
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span class="tw-h-2 tw-w-2 tw-rounded-full tw-bg-[#6b2430]" />
            Discos
          </li>
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span class="tw-h-2 tw-w-2 tw-rounded-full tw-bg-[#b91c1c]" /> Tu
          </li>
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span class="tw-h-0.5 tw-w-3 tw-rounded-sm tw-bg-[#b45309]" />
            Caminho
          </li>
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span class="tw-h-2 tw-w-3 tw-rounded-sm tw-bg-[#8b7d62]" /> Montanha
          </li>
          <li class="tw-flex tw-items-center tw-gap-1.5">
            <span class="tw-h-2 tw-w-3 tw-rounded-sm tw-bg-[#3d7f9a]" /> Cávado
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { clearTrailGoal, setTrailGoal, trailCue, trailGoal, trailPoints } from '@/game/route'
import { hikerSpot } from '@/game/spot'
import MapSheet from './MapSheet.vue'

const open = ref(false)

const cue = computed(() => trailCue(hikerSpot.value.x, hikerSpot.value.z, trailPoints.value))

function choose(point: { x: number; z: number }) {
  setTrailGoal(point.x, point.z)
}

let arriving = false
watch(cue, (value) => {
  if (value !== 'Chegaste.' || arriving) return
  arriving = true
  window.setTimeout(() => {
    arriving = false
    if (cue.value === 'Chegaste.') clearTrailGoal()
  }, 1800)
})
</script>
