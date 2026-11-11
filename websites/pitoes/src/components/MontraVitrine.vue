<script lang="ts" setup>
import ProductMark from '@/components/ProductMark.vue'
import type { CatalogProduct } from '@/data/catalog'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    title: string
    lede: string
    items: CatalogProduct[]
    /** Vitrine a ocupar o ecrã, com o ambiente do balcão. */
    immersive?: boolean
  }>(),
  { immersive: false },
)

const track = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

let scrollTimer = 0

const active = computed(() => props.items[activeIndex.value] ?? props.items[0])

function clampIndex(index: number) {
  if (!props.items.length) return 0
  return ((index % props.items.length) + props.items.length) % props.items.length
}

function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
  const el = track.value
  if (!el) return
  const child = el.children.item(clampIndex(index)) as HTMLElement | null
  if (!child) return
  const left = child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2
  el.scrollTo({ left: Math.max(0, left), behavior })
}

function syncFromScroll() {
  const el = track.value
  if (!el || !el.children.length) return
  const center = el.scrollLeft + el.clientWidth / 2
  let closest = 0
  let min = Infinity
  for (let i = 0; i < el.children.length; i += 1) {
    const child = el.children.item(i) as HTMLElement
    const childCenter = child.offsetLeft + child.offsetWidth / 2
    const dist = Math.abs(childCenter - center)
    if (dist < min) {
      min = dist
      closest = i
    }
  }
  activeIndex.value = closest
}

function onScroll() {
  window.clearTimeout(scrollTimer)
  scrollTimer = window.setTimeout(syncFromScroll, 80)
}

function goNext() {
  const next = clampIndex(activeIndex.value + 1)
  activeIndex.value = next
  scrollToIndex(next)
}

function goPrev() {
  const prev = clampIndex(activeIndex.value - 1)
  activeIndex.value = prev
  scrollToIndex(prev)
}

function onWheel(event: WheelEvent) {
  if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
  event.stopPropagation()
}

onMounted(() => {
  scrollToIndex(0, 'auto')
})

watch(
  () => props.items.length,
  () => {
    activeIndex.value = clampIndex(activeIndex.value)
  },
)

onUnmounted(() => {
  window.clearTimeout(scrollTimer)
})
</script>

<template>
  <section :id="id" class="tw-scroll-mt-28" :class="immersive ? 'montra-screen' : ''">
    <div :class="immersive ? 'montra-room' : ''">
      <div v-if="immersive" class="montra-room__ambience" aria-hidden="true">
        <div class="montra-room__tiles" />
        <div class="montra-room__photo" />
        <div class="montra-room__warmth" />
        <div class="montra-lamp montra-lamp--left" />
        <div class="montra-lamp montra-lamp--right" />
      </div>

      <div :class="immersive ? 'montra-room__content' : ''">
        <div
          class="tw-flex tw-flex-col tw-gap-3"
          :class="
            immersive
              ? 'tw-px-5 tw-pt-20 md:tw-flex-row md:tw-items-end md:tw-justify-between md:tw-px-10 md:tw-pt-[5.25rem]'
              : 'md:tw-flex-row md:tw-items-end md:tw-justify-between'
          ">
          <div>
            <p v-if="immersive" class="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.28em] tw-text-wheat/90">A montra</p>
            <h2 class="tw-font-serif tw-text-4xl md:tw-text-5xl" :class="immersive ? 'tw-mt-2 tw-text-flour' : ''">{{ title }}</h2>
            <p class="tw-mt-3 tw-max-w-xl tw-text-sm tw-leading-relaxed" :class="immersive ? 'tw-text-flour/80' : 'tw-text-ink/65'">
              {{ lede }}
            </p>
          </div>
          <p class="tw-text-xs tw-uppercase tw-tracking-[0.2em]" :class="immersive ? 'tw-text-flour/55' : 'tw-text-ink/45'">
            {{ activeIndex + 1 }} / {{ items.length }}
          </p>
        </div>

        <div class="montra-case" :class="immersive ? 'montra-case--immersive tw-mt-4 md:tw-mt-5' : 'tw-mt-8'">
          <div class="montra-case__lip" aria-hidden="true" />
          <div class="montra-glass tw-relative">
            <div
              class="tw-pointer-events-none tw-absolute tw-inset-x-0 tw-top-0 tw-z-10 tw-h-24 tw-bg-gradient-to-b tw-from-white/35 tw-to-transparent"
              aria-hidden="true" />

            <p class="tw-sr-only">Arrasta na horizontal ou usa as setas para mudar de produto.</p>

            <div
              ref="track"
              class="montra-track"
              :class="immersive ? 'montra-track--immersive' : ''"
              @scroll.passive="onScroll"
              @wheel="onWheel"
              @keydown.left.prevent="goPrev"
              @keydown.right.prevent="goNext"
              tabindex="0"
              :aria-label="`Montra: ${title}`">
              <article
                v-for="(item, index) in items"
                :key="item.name"
                class="montra-slide"
                :class="[index === activeIndex ? 'is-active' : '', immersive ? 'montra-slide--immersive' : '']"
                :aria-current="index === activeIndex ? 'true' : undefined">
                <div class="montra-slide__plate">
                  <div class="montra-slide__visual" :class="immersive ? 'montra-slide__visual--tall' : ''">
                    <ProductMark :name="item.name" />
                  </div>
                  <div class="tw-border-t tw-border-ink/8 tw-bg-paper tw-px-4 tw-py-3 md:tw-py-4">
                    <div class="tw-flex tw-items-baseline tw-justify-between tw-gap-2">
                      <h3 class="tw-font-serif tw-text-xl tw-leading-tight md:tw-text-2xl">{{ item.name }}</h3>
                      <p v-if="item.price" class="tw-shrink-0 tw-text-xs tw-text-rye md:tw-text-sm">{{ item.price }}</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <span v-if="immersive" class="montra-shelf-rail" aria-hidden="true" />

            <div
              class="tw-absolute tw-inset-y-0 tw-left-0 tw-z-20 tw-hidden tw-w-20 tw-bg-gradient-to-r tw-from-[#1a1410]/50 tw-to-transparent md:tw-block"
              aria-hidden="true" />
            <div
              class="tw-absolute tw-inset-y-0 tw-right-0 tw-z-20 tw-hidden tw-w-20 tw-bg-gradient-to-l tw-from-[#1a1410]/50 tw-to-transparent md:tw-block"
              aria-hidden="true" />

            <div class="tw-absolute tw-inset-x-0 tw-bottom-5 tw-z-20 tw-flex tw-justify-center tw-gap-3">
              <button
                type="button"
                class="tw-inline-flex tw-h-11 tw-w-11 tw-items-center tw-justify-center tw-rounded-full tw-bg-flour/95 tw-text-lg tw-text-ink tw-shadow-md hover:tw-bg-white"
                aria-label="Produto anterior"
                @click="goPrev">
                ←
              </button>
              <button
                type="button"
                class="tw-inline-flex tw-h-11 tw-w-11 tw-items-center tw-justify-center tw-rounded-full tw-bg-flour/95 tw-text-lg tw-text-ink tw-shadow-md hover:tw-bg-white"
                aria-label="Produto seguinte"
                @click="goNext">
                →
              </button>
            </div>
          </div>
        </div>

        <div
          class="montra-plinth"
          :class="immersive ? 'montra-plinth--immersive' : 'tw-mt-6 tw-rounded-[1.5rem] tw-border tw-border-ink/10 tw-bg-paper'"
          aria-live="polite">
          <div :class="immersive ? 'tw-px-5 tw-py-4 md:tw-px-10 md:tw-py-5' : 'tw-p-5 md:tw-p-6'">
            <p class="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.22em] tw-text-crust">No balcão</p>
            <h3 class="tw-mt-2 tw-font-serif tw-text-3xl md:tw-text-4xl" :class="immersive ? 'tw-text-flour' : ''">{{ active?.name }}</h3>
            <p v-if="active?.price" class="tw-mt-1 tw-text-sm" :class="immersive ? 'tw-text-wheat' : 'tw-text-rye'">{{ active.price }}</p>
            <p
              v-if="active?.detail"
              class="tw-mt-4 tw-max-w-2xl tw-text-sm tw-leading-relaxed"
              :class="immersive ? 'tw-text-flour/80' : 'tw-text-ink/75'">
              {{ active.detail }}
            </p>
            <ul
              v-if="active?.options?.length"
              class="tw-mt-4 tw-space-y-1.5 tw-text-sm tw-leading-relaxed"
              :class="immersive ? 'tw-text-flour/75' : 'tw-text-ink/75'">
              <li v-for="option in active.options" :key="option">{{ option }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
