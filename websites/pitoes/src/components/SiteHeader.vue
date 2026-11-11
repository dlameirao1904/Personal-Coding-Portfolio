<script lang="ts" setup>
import SiteLogo from '@/components/SiteLogo.vue'
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
  <!-- O segredo está aqui: adicionamos 'tw-bottom-0' quando está aberto para o header ocupar o ecrã todo -->
  <header 
    class="tw-fixed tw-inset-x-0 tw-top-0 tw-z-50 tw-transition-colors tw-duration-300" 
    :class="open ? 'tw-bottom-0 tw-bg-flour' : 'tw-bg-flour/85 tw-backdrop-blur-md'">
    
    <!-- Barra Superior -->
    <div class="tw-relative tw-z-10 tw-mx-auto tw-flex tw-h-20 tw-max-w-6xl tw-items-center tw-justify-between tw-px-5 md:tw-px-8">
      <router-link to="/" class="tw-shrink-0" @click="open = false">
        <SiteLogo variant="mark" />
      </router-link>

      <nav class="tw-hidden tw-items-center tw-gap-6 lg:tw-flex" aria-label="Principal">
        <router-link
          v-for="item in navigation"
          :key="item.label"
          :to="item.to"
          class="tw-text-sm tw-italic tw-transition hover:tw-text-ink"
          :class="isCurrent(item) ? 'tw-text-rye' : 'tw-text-ink/75'">
          {{ item.label }}
        </router-link>
      </nav>

      <router-link
        :to="{ name: 'encomendas' }"
        class="tw-hidden tw-rounded-full tw-bg-rye tw-px-5 tw-py-2.5 tw-text-sm tw-font-medium tw-text-flour hover:tw-bg-[#5c2a12] tw-transition-colors md:tw-inline-flex">
        Fazer um pedido
      </router-link>

      <!-- Botão Hamburger -->
      <button
        type="button"
        class="tw-inline-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-ink/15 lg:tw-hidden tw-transition-colors"
        :class="open ? 'tw-bg-paper tw-border-ink/5' : 'tw-bg-transparent'"
        :aria-expanded="open"
        aria-controls="menu-movel"
        @click="open = !open">
        <span class="tw-sr-only">{{ open ? 'Fechar menu' : 'Abrir menu' }}</span>
        <span class="tw-flex tw-w-5 tw-flex-col tw-gap-1.5" aria-hidden="true">
          <span class="tw-block tw-h-0.5 tw-w-full tw-origin-center tw-bg-ink tw-transition-all tw-duration-300" :class="open ? 'tw-translate-y-2 tw-rotate-45' : ''" />
          <span class="tw-block tw-h-0.5 tw-w-full tw-bg-ink tw-transition-all tw-duration-300" :class="open ? 'tw-opacity-0' : ''" />
          <span class="tw-block tw-h-0.5 tw-w-full tw-origin-center tw-bg-ink tw-transition-all tw-duration-300" :class="open ? '-tw-translate-y-2 -tw-rotate-45' : ''" />
        </span>
      </button>
    </div>

    <!-- Menu Móvel (agora absolute, estica até ao fundo do header que já está em ecrã inteiro) -->
    <div 
      v-if="open" 
      id="menu-movel" 
      class="tw-absolute tw-inset-x-0 tw-bottom-0 tw-top-20 tw-bg-flour tw-overflow-y-auto lg:tw-hidden">
      <nav class="tw-flex tw-min-h-full tw-flex-col tw-px-5 tw-py-8" aria-label="Móvel">
        
        <!-- Links de Navegação -->
        <div class="tw-flex tw-flex-col">
          <router-link 
            v-for="item in navigation" 
            :key="item.label" 
            :to="item.to" 
            class="tw-border-b tw-border-ink/10 tw-py-6 tw-font-serif tw-text-4xl tw-text-ink"
            :class="isCurrent(item) ? 'tw-text-rye' : ''">
            {{ item.label }}
          </router-link>
        </div>

        <!-- Botão CTA no fundo do ecrã -->
        <div class="tw-mt-auto tw-pt-12 tw-pb-6">
          <router-link 
            :to="{ name: 'encomendas' }" 
            class="tw-flex tw-w-full tw-items-center tw-justify-center tw-rounded-full tw-bg-ink tw-px-6 tw-py-4 tw-text-lg tw-font-medium tw-text-flour hover:tw-bg-rye tw-transition-colors">
            Fazer um pedido
          </router-link>
        </div>
        
      </nav>
    </div>
  </header>
</template>