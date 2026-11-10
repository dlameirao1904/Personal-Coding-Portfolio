<script lang="ts" setup>
import { navigation } from '@/data/site'
import { onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)

function isCurrent(item: (typeof navigation)[number]) {
  return 'to' in item && 'name' in item.to && route.name === item.to.name
}

watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)

watch(open, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="tw-fixed tw-inset-x-0 tw-top-0 tw-z-40 tw-border-b tw-border-ink/10 tw-bg-flour/85 tw-backdrop-blur-md">
    <div class="tw-mx-auto tw-flex tw-h-20 tw-max-w-6xl tw-items-center tw-justify-between tw-px-5 md:tw-px-8">
      <router-link to="/" class="tw-flex tw-flex-col">
        <span class="tw-font-serif tw-text-xl tw-leading-none tw-text-ink">Padaria Pitões</span>
        <span class="tw-mt-1 tw-text-[10px] tw-uppercase tw-tracking-[0.22em] tw-text-ink/55">Família Marinho</span>
      </router-link>

      <nav class="tw-hidden tw-items-center tw-gap-6 lg:tw-flex" aria-label="Principal">
        <router-link
          v-for="item in navigation"
          :key="item.label"
          :to="item.to"
          class="tw-text-sm tw-text-ink/75 tw-transition hover:tw-text-ink"
          :class="isCurrent(item) ? 'tw-text-rye' : ''">
          {{ item.label }}
        </router-link>
      </nav>

      <router-link
        :to="{ name: 'encomendas' }"
        class="tw-hidden tw-rounded-full tw-bg-rye tw-px-4 tw-py-2 tw-text-sm tw-text-flour hover:tw-bg-[#5c2a12] md:tw-inline-flex">
        Fazer um pedido
      </router-link>

      <button
        type="button"
        class="tw-inline-flex tw-h-11 tw-w-11 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-ink/15 lg:tw-hidden"
        :aria-expanded="open"
        aria-controls="menu-movel"
        @click="open = !open">
        <span class="tw-sr-only">{{ open ? 'Fechar menu' : 'Abrir menu' }}</span>
        <span class="tw-flex tw-w-4 tw-flex-col tw-gap-1.5" aria-hidden="true">
          <span class="tw-block tw-h-px tw-origin-center tw-bg-ink tw-transition" :class="open ? 'tw-translate-y-[3.5px] tw-rotate-45' : ''" />
          <span class="tw-block tw-h-px tw-bg-ink tw-transition" :class="open ? 'tw-opacity-0' : ''" />
          <span class="tw-block tw-h-px tw-origin-center tw-bg-ink tw-transition" :class="open ? '-tw-translate-y-[3.5px] -tw-rotate-45' : ''" />
        </span>
      </button>
    </div>

    <div v-if="open" id="menu-movel" class="tw-border-t tw-border-ink/10 tw-bg-flour lg:tw-hidden">
      <nav class="tw-flex tw-flex-col tw-px-5 tw-py-4" aria-label="Móvel">
        <router-link v-for="item in navigation" :key="item.label" :to="item.to" class="tw-border-b tw-border-ink/10 tw-py-4 tw-font-serif tw-text-3xl">
          {{ item.label }}
        </router-link>
        <router-link :to="{ name: 'encomendas' }" class="tw-mt-4 tw-inline-flex tw-w-fit tw-rounded-full tw-bg-rye tw-px-4 tw-py-2 tw-text-sm tw-text-flour">
          Fazer um pedido
        </router-link>
      </nav>
    </div>
  </header>
</template>
