<script lang="ts" setup>
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
</script>

<template>
  <div class="tw-min-h-screen tw-bg-flour tw-font-sans tw-text-ink">
    <SiteHeader />
    <main id="conteudo">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>
