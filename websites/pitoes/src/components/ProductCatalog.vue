<script lang="ts" setup>
import ProductMark from '@/components/ProductMark.vue'
import type { CatalogProduct } from '@/data/catalog'
import { computed, ref } from 'vue'

type Shelf = { id: string; title: string; lede: string; items: CatalogProduct[] }

const props = defineProps<{
  shelves: Shelf[]
}>()

const shelfId = ref(props.shelves[0]?.id ?? '')
const activeIndex = ref(0) // Usado apenas em mobile para o scroll

const shelf = computed(() => props.shelves.find((item) => item.id === shelfId.value) ?? props.shelves[0])
const items = computed(() => shelf.value?.items ?? [])
const active = computed(() => items.value[activeIndex.value] ?? items.value[0])

const rail = ref<HTMLElement | null>(null)

function pickShelf(id: string) {
  shelfId.value = id
  activeIndex.value = 0
}

function pickMobile(index: number) {
  activeIndex.value = index
  const el = rail.value
  const card = el?.children.item(index) as HTMLElement | undefined
  if (!el || !card) return
  const left = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2
  el.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
}
</script>

<template>
  <div class="tw-mx-auto tw-max-w-7xl tw-px-5 tw-pb-32 md:tw-px-8">
    
    <!-- Navegação / Filtros -->
    <nav class="tw-sticky tw-top-20 tw-z-30 tw--mx-5 tw-bg-flour/80 tw-px-5 tw-py-4 tw-backdrop-blur-xl md:tw-mx-0 md:tw-rounded-full md:tw-bg-paper/80 md:tw-p-2 tw-shadow-sm tw-border tw-border-ink/5 md:tw-border-ink/10 tw-w-full md:tw-w-fit md:tw-mx-auto" aria-label="Seções">
      <ul class="tw-flex tw-gap-2 tw-justify-center">
        <li v-for="option in shelves" :key="option.id">
          <button
            type="button"
            class="tw-rounded-full tw-px-6 tw-py-2.5 tw-text-sm tw-font-medium tw-transition-all tw-duration-300"
            :class="option.id === shelfId ? 'tw-bg-ink tw-text-flour tw-shadow-md' : 'tw-text-ink/60 hover:tw-text-ink hover:tw-bg-ink/5'"
            @click="pickShelf(option.id)">
            {{ option.title }}
          </button>
        </li>
      </ul>
    </nav>

    <!-- Cabeçalho da Categoria -->
    <div class="tw-mt-16 tw-mb-12 tw-text-center">
      <h2 class="tw-font-serif tw-text-4xl md:tw-text-5xl tw-text-ink">{{ shelf?.title }}</h2>
      <p class="tw-mt-4 tw-mx-auto tw-max-w-lg tw-text-base tw-leading-relaxed tw-text-ink/60">{{ shelf?.lede }}</p>
    </div>

    <!-- VISÃO DESKTOP: Grelha com flip/reveal cards -->
    <div class="tw-hidden lg:tw-grid tw-grid-cols-3 xl:tw-grid-cols-4 tw-gap-6 tw-mb-12">
      <article 
        v-for="item in items" 
        :key="item.name"
        class="tw-group tw-relative tw-h-[22rem] tw-rounded-[2rem] tw-bg-paper tw-border tw-border-ink/5 tw-overflow-hidden tw-transition-all tw-duration-500 hover:tw-shadow-xl hover:tw-border-ink/10 hover:-tw-translate-y-1"
      >
        <!-- Estado Normal -->
        <div class="tw-absolute tw-inset-0 tw-p-8 tw-flex tw-flex-col tw-items-center tw-justify-center tw-transition-opacity tw-duration-500 group-hover:tw-opacity-0">
          <div class="tw-h-32 tw-w-32 tw-mb-6 tw-opacity-80">
            <ProductMark :name="item.name" />
          </div>
          <h3 class="tw-font-serif tw-text-2xl tw-text-center tw-leading-tight">{{ item.name }}</h3>
          <p v-if="item.price" class="tw-mt-3 tw-text-sm tw-font-medium tw-text-rye">{{ item.price }}</p>
        </div>

        <!-- Estado Hover (Detalhes) -->
        <div class="tw-absolute tw-inset-0 tw-bg-ink tw-text-flour tw-p-8 tw-flex tw-flex-col tw-opacity-0 tw-translate-y-4 tw-transition-all tw-duration-500 group-hover:tw-opacity-100 group-hover:tw-translate-y-0">
          <h3 class="tw-font-serif tw-text-2xl tw-mb-4">{{ item.name }}</h3>
          <div class="tw-w-8 tw-h-px tw-bg-rye tw-mb-4"></div>
          <p v-if="item.detail" class="tw-text-sm tw-leading-relaxed tw-text-flour/80 tw-flex-grow">{{ item.detail }}</p>
          <ul v-if="item.options?.length" class="tw-mt-4 tw-space-y-1 tw-text-xs tw-text-flour/60">
            <li v-for="opt in item.options" :key="opt" class="tw-flex tw-gap-2"><span class="tw-text-rye">•</span> {{ opt }}</li>
          </ul>
          <p v-if="item.price" class="tw-mt-4 tw-text-lg tw-font-serif tw-text-rye">{{ item.price }}</p>
        </div>
      </article>
    </div>

    <!-- VISÃO MOBILE: Carousel + Detalhe -->
    <div class="lg:tw-hidden">
      <div ref="rail" class="tw-flex tw-gap-4 tw-overflow-x-auto tw-pb-6 tw-snap-x tw-snap-mandatory tw-scroll-smooth tw-hide-scrollbar" style="scroll-padding: 1.25rem;">
        <button
          v-for="(item, index) in items"
          :key="item.name"
          type="button"
          class="tw-snap-center tw-shrink-0 tw-w-64 tw-rounded-[2rem] tw-p-6 tw-transition-all tw-duration-300"
          :class="index === activeIndex ? 'tw-bg-ink tw-text-flour tw-shadow-lg' : 'tw-bg-paper tw-border tw-border-ink/10 tw-text-ink hover:tw-bg-ink/5'"
          @click="pickMobile(index)">
          <div class="tw-h-24 tw-w-24 tw-mx-auto tw-mb-6" :class="index === activeIndex ? 'tw-opacity-100' : 'tw-opacity-60'">
            <ProductMark :name="item.name" />
          </div>
          <span class="tw-block tw-font-serif tw-text-2xl tw-text-center tw-leading-tight">{{ item.name }}</span>
        </button>
      </div>

      <!-- Detalhe do item ativo em mobile -->
      <transition name="fade-slide" mode="out-in">
        <div :key="active?.name" class="tw-mt-2 tw-rounded-[2rem] tw-bg-paper tw-border tw-border-ink/10 tw-p-8 tw-shadow-sm">
          <div class="tw-flex tw-justify-between tw-items-start tw-mb-4">
            <h3 class="tw-font-serif tw-text-3xl tw-text-ink">{{ active?.name }}</h3>
            <p v-if="active?.price" class="tw-text-lg tw-font-serif tw-text-rye">{{ active.price }}</p>
          </div>
          <p v-if="active?.detail" class="tw-text-base tw-leading-relaxed tw-text-ink/70">{{ active.detail }}</p>
          <ul v-if="active?.options?.length" class="tw-mt-6 tw-space-y-2 tw-text-sm tw-text-ink/60">
            <li v-for="opt in active.options" :key="opt" class="tw-flex tw-items-center tw-gap-2">
              <div class="tw-w-1 tw-h-1 tw-bg-rye tw-rounded-full"></div>
              {{ opt }}
            </li>
          </ul>
        </div>
      </transition>
    </div>

  </div>
</template>

<style scoped>
.tw-hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.tw-hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>