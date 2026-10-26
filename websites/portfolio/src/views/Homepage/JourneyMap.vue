<template>
  <div>
    <button
      type="button"
      class="tw-h-[7.25rem] tw-w-[7.25rem] tw-cursor-pointer tw-overflow-hidden tw-rounded-2xl tw-border tw-border-[#17211c22] tw-bg-[#f7f3eaf0] tw-p-1.5 tw-shadow-[0_10px_24px_#17211c24] hover:tw-bg-white focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
      :aria-expanded="open"
      aria-label="Abrir o mapa"
      @click="open = true"
    >
      <MapSheet :wide="false" />
    </button>

    <div
      v-if="open"
      class="tw-fixed tw-inset-0 tw-z-[30] tw-flex tw-items-center tw-justify-center tw-bg-[#17211ccc] tw-p-4"
      role="dialog"
      aria-modal="true"
        aria-label="Mapa do vale"
      @click.self="open = false"
    >
      <div
        class="tw-flex tw-max-h-[min(86vh,760px)] tw-w-[min(440px,100%)] tw-flex-col tw-gap-3 tw-overflow-auto tw-rounded-[22px] tw-bg-[#f7f3eaf0] tw-p-4 tw-shadow-[0_16px_40px_#17211c1f]"
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
        <MapSheet :wide="true" class="tw-h-[min(62vh,520px)] tw-w-full" />
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
            <span class="tw-h-2 tw-w-2 tw-rounded-full tw-bg-[#b91c1c]" /> Tu
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
import { ref } from 'vue'
import MapSheet from './MapSheet.vue'

const open = ref(false)
</script>
