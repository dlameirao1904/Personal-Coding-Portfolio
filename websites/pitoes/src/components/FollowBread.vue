<script lang="ts" setup>
import BakeryStage from '@/components/BakeryStage.vue'
import { ovenSteps } from '@/data/site'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const track = ref<HTMLElement | null>(null)
const progress = ref(0)
const pointerX = ref(0)
const pointerY = ref(0)
let reduce = false

const forced = computed(() => {
  const raw = route.query.forno
  if (typeof raw !== 'string') return null
  const value = Number(raw)
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : null
})

const displayed = computed(() => forced.value ?? progress.value)
const stepIndex = computed(() => Math.min(ovenSteps.length - 1, Math.floor(Math.min(displayed.value, 0.999) * ovenSteps.length)))
const step = computed(() => ovenSteps[stepIndex.value] ?? ovenSteps[0])

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

function onScroll() {
  const el = track.value
  if (!el) return
  const total = el.offsetHeight - window.innerHeight
  const passed = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 0))
  progress.value = total > 0 ? clamp(passed / total) : 0
}

function onPointer(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || !track.value) return
  const rect = track.value.getBoundingClientRect()
  pointerX.value = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  pointerY.value = ((event.clientY - rect.top) / rect.height - 0.5) * 2
}

function onLeave() {
  pointerX.value = 0
  pointerY.value = 0
}

function goTo(index: number) {
  const el = track.value
  if (!el) return
  const total = el.offsetHeight - window.innerHeight
  const top = window.scrollY + el.getBoundingClientRect().top + ((index + 0.08) / ovenSteps.length) * total
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (forced.value !== null) track.value?.scrollIntoView()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <section id="forno" ref="track" class="tw-relative tw-h-[420vh] tw-bg-flour" @pointermove="onPointer" @pointerleave="onLeave">
    <div class="tw-sticky tw-top-0 tw-h-screen">
      <BakeryStage :progress="displayed" :pointer-x="pointerX" :pointer-y="pointerY" />
      <div class="tw-pointer-events-none tw-absolute tw-inset-x-0 tw-bottom-0 tw-bg-gradient-to-t tw-from-flour tw-via-flour/80 tw-to-transparent tw-px-5 tw-pb-8 tw-pt-24 md:tw-px-10">
        <p class="tw-text-[11px] tw-uppercase tw-tracking-[0.22em] tw-text-crust">0{{ stepIndex + 1 }} / 0{{ ovenSteps.length }} · {{ step.kicker }}</p>
        <h2 class="tw-mt-2 tw-max-w-xl tw-font-serif tw-text-4xl tw-leading-none tw-text-ink md:tw-text-6xl">{{ step.title }}</h2>
        <p class="tw-mt-3 tw-max-w-md tw-text-sm tw-font-light tw-leading-relaxed tw-text-ink/75 md:tw-text-base">{{ step.text }}</p>
        <div class="tw-pointer-events-auto tw-mt-5 tw-flex tw-flex-wrap tw-gap-2">
          <button
            v-for="(item, index) in ovenSteps"
            :key="item.title"
            type="button"
            class="tw-rounded-full tw-border tw-px-3 tw-py-1.5 tw-text-xs"
            :class="index === stepIndex ? 'tw-border-rye tw-text-rye' : 'tw-border-ink/20 tw-text-ink/55'"
            @click="goTo(index)">
            {{ item.kicker }}
          </button>
        </div>
      </div>
      <div class="tw-pointer-events-none tw-absolute tw-inset-x-0 tw-bottom-0 tw-h-1 tw-bg-ink/10">
        <div class="tw-h-full tw-bg-crust" :style="{ width: `${displayed * 100}%` }" />
      </div>
    </div>
  </section>
</template>
