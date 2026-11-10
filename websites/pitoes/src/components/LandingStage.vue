<script lang="ts" setup>
import BreadMark from '@/components/BreadMark.vue'
import { featuredProducts } from '@/data/site'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const rotX = ref(0)
const rotY = ref(0)
let frame = 0
let smoothX = 0
let smoothY = 0
let targetX = 0
let targetY = 0
let reduce = false

const pose = computed(() => ({ transform: `rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)` }))

function onPointer(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
}

function onLeave() {
  targetX = 0
  targetY = 0
}

function tick(now: number) {
  const swayX = reduce ? 0 : Math.sin(now / 1800) * 0.08
  const swayY = reduce ? 0 : Math.cos(now / 2200) * 0.05
  smoothX += (targetX + swayX - smoothX) * 0.08
  smoothY += (targetY + swayY - smoothY) * 0.08
  rotX.value = smoothY * 6
  rotY.value = -smoothX * 8
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduce) frame = requestAnimationFrame(tick)
})

onUnmounted(() => cancelAnimationFrame(frame))
</script>

<template>
  <section class="tw-mx-auto tw-grid tw-min-h-[100svh] tw-max-w-6xl tw-items-center tw-gap-12 tw-px-5 tw-pb-16 tw-pt-28 md:tw-grid-cols-2 md:tw-px-8">
    <div>
      <p class="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.28em] tw-text-crust">Pitões das Júnias · 1100 m</p>
      <h1 class="tw-mt-4 tw-font-serif tw-text-5xl tw-leading-[0.95] tw-text-ink sm:tw-text-6xl lg:tw-text-7xl">
        Pão centeio,<br />
        <span class="tw-italic tw-text-rye">acabado de sair.</span>
      </h1>
      <p class="tw-mt-6 tw-max-w-md tw-text-lg tw-font-light tw-leading-relaxed tw-text-ink/75">
        Em Pitões, a família Marinho coze para a aldeia e para quem sobe até cá. A broa, o cacete e a rosca flor são os que mais saem. O balcão tem mais.
      </p>
      <div class="tw-mt-8 tw-flex tw-flex-wrap tw-items-center tw-gap-3">
        <a href="#forno" class="tw-inline-flex tw-rounded-full tw-bg-ink tw-px-5 tw-py-3 tw-text-sm tw-text-flour hover:tw-bg-rye">Acompanhar o pão</a>
        <a href="#paes" class="tw-inline-flex tw-rounded-full tw-border tw-border-ink/20 tw-px-5 tw-py-3 tw-text-sm hover:tw-border-ink">Ver o balcão</a>
      </div>
    </div>

    <div class="tilt-perspective" @pointermove="onPointer" @pointerleave="onLeave">
      <div class="tilt-preserve tw-grid tw-grid-cols-3 tw-gap-3" :style="pose">
        <article
          v-for="(product, index) in featuredProducts"
          :key="product.slug"
          class="tw-rounded-3xl tw-bg-paper tw-p-3"
          :style="{ transform: `translateZ(${index === 1 ? 36 : 8}px)` }">
          <div class="tw-h-24 md:tw-h-32">
            <BreadMark :kind="product.kind" />
          </div>
          <p class="tw-mt-2 tw-font-serif tw-text-lg tw-leading-none">{{ product.name }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
