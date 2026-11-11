<script lang="ts" setup>
import SiteLogo from '@/components/SiteLogo.vue'
import { contacts, navigation } from '@/data/site'
</script>

<template>
  <footer class="tw-bg-stone tw-text-flour">
    <div class="tw-mx-auto tw-grid tw-max-w-6xl tw-gap-12 tw-px-5 tw-py-16 md:tw-grid-cols-4 md:tw-px-8">
      <div class="md:tw-col-span-2">
        <SiteLogo variant="badge" logo-class="md:tw-h-[4.5rem]" />
        <p class="tw-mt-6 tw-max-w-sm tw-text-sm tw-leading-relaxed tw-text-flour/75">
          Pão centeio cozido em Pitões das Júnias, no alto do Parque Nacional da Peneda-Gerês.
        </p>
      </div>

      <div>
        <p class="tw-text-xs tw-uppercase tw-tracking-[0.22em] tw-text-wheat">Casa</p>
        <ul class="tw-mt-4 tw-space-y-3 tw-text-sm">
          <li v-for="item in navigation" :key="item.label">
            <router-link :to="item.to" class="hover:tw-text-white">{{ item.label }}</router-link>
          </li>
        </ul>
      </div>

      <div>
        <p class="tw-text-xs tw-uppercase tw-tracking-[0.22em] tw-text-wheat">Visita</p>
        <a :href="contacts.maps" class="tw-mt-4 tw-block tw-text-sm tw-leading-relaxed hover:tw-text-white" target="_blank" rel="noopener noreferrer">
          <span v-for="line in contacts.address" :key="line" class="tw-block">{{ line }}</span>
        </a>
        <a :href="contacts.phoneHref" class="tw-mt-4 tw-block tw-text-sm hover:tw-text-white">{{ contacts.phoneDisplay }}</a>
        <router-link :to="{ name: 'encomendas' }" class="tw-mt-3 tw-block tw-text-sm hover:tw-text-white">Fazer um pedido</router-link>
        <div class="tw-mt-4 tw-flex tw-gap-4 tw-text-sm">
          <a :href="contacts.instagram" class="hover:tw-text-white" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a :href="contacts.facebook" class="hover:tw-text-white" target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
      </div>
    </div>
    <div class="tw-border-t tw-border-flour/15 tw-px-5 tw-py-6 tw-text-center tw-text-xs tw-text-flour/60">
      © {{ new Date().getFullYear() }} Padaria Pitões · Família Marinho
    </div>
  </footer>
</template>
