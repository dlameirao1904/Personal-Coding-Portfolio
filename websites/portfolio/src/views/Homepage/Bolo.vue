<template>
  <div
    class="cake-dock tw-absolute tw-bottom-[max(1rem,env(safe-area-inset-bottom,0px))] tw-left-1/2 tw-z-[5] tw-w-[min(42rem,calc(100%-1.5rem))] tw--translate-x-1/2 tw-rounded-[22px] tw-bg-[#f7f3eaf2] tw-p-4 tw-shadow-[0_16px_40px_#17211c33]"
  >
    <div class="cake-dock__top">
      <div class="tw-min-w-0 tw-flex-1 tw-text-center">
        <p
          class="cake-kicker tw-m-0 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.14em] tw-text-[#8a4632]"
        >
          Atelier
        </p>
        <p
          class="cake-dock__title tw-m-0 tw-mt-1 tw-font-[Fraunces,Georgia,serif] tw-text-[1.35rem] tw-font-[560] tw-leading-tight"
        >
          {{ done ? 'O bolo está pronto.' : step.put }}
        </p>
      </div>
      <button
        type="button"
        class="cake-dock__leave tw-hidden tw-shrink-0 tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea] max-md:tw-inline-block [@media(pointer:coarse)]:tw-inline-block"
        @click="leaveAtelier"
      >
        Sair
      </button>
    </div>
    <p
      v-if="cakeHint && !done"
      class="tw-m-0 tw-mt-1 tw-text-center tw-text-[0.92rem] tw-text-[#8a4632]"
    >
      {{ cakeHint }}
    </p>
    <div
      ref="stepsEl"
      class="cake-steps tw-mt-3 tw-flex tw-flex-wrap tw-justify-center tw-gap-2"
      role="group"
      aria-label="Camadas do bolo"
    >
      <button
        v-for="(item, index) in CAKE_STEPS"
        :key="item.id"
        type="button"
        class="cake-step tw-cursor-pointer tw-rounded-full tw-border tw-border-[#0e332822] tw-px-3 tw-py-2 tw-font-[inherit] tw-text-[0.92rem] disabled:tw-cursor-default"
        :class="
          index < cakePlaced
            ? 'tw-bg-[#0e332814] tw-text-[#5c675f]'
            : index === cakePlaced
              ? 'cake-next tw-border-[#0e3328] tw-bg-[#0e3328] tw-text-[#f7f3ea]'
              : 'tw-bg-transparent tw-text-[#17211c] hover:tw-bg-[#0e332814]'
        "
        :disabled="index < cakePlaced || done"
        :aria-current="index === cakePlaced && !done ? 'step' : undefined"
        @click="placeCakeLayer(index)"
      >
        <span class="tw-mr-1 tw-text-[0.72rem] tw-opacity-70">{{ index + 1 }}</span>
        {{ index < cakePlaced ? '✓ ' : '' }}{{ item.name }}
      </button>
    </div>
    <p class="cake-dock__help tw-m-0 tw-mt-3 tw-text-center tw-text-[0.86rem] tw-text-[#5c675f]">
      <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden">
        Arrasta para olhar. E para sair.
      </span>
      <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline">
        Arrasta no bolo para o ver de lado.
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { CAKE_STEPS, cakeHint, cakePlaced, leaveAtelier, placeCakeLayer } from '@/game/cake'

const done = computed(() => cakePlaced.value >= CAKE_STEPS.length)
const step = computed(() => CAKE_STEPS[Math.min(cakePlaced.value, CAKE_STEPS.length - 1)])
const stepsEl = ref<HTMLElement | null>(null)

watch(cakePlaced, async () => {
  await nextTick()
  const root = stepsEl.value
  const next = root?.querySelector('.cake-next')
  if (!root || !(next instanceof HTMLElement)) return
  root.scrollTo({
    left: next.offsetLeft - root.clientWidth / 2 + next.clientWidth / 2,
    behavior: 'smooth',
  })
})
</script>

<style scoped>
.cake-next {
  animation: cake-next 1.4s ease-in-out infinite;
}

@keyframes cake-next {
  50% {
    transform: translateY(-2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cake-next {
    animation: none;
  }
}
</style>
