<script lang="ts" setup>
defineProps<{
  eyebrow: string
  lede: string
}>()
</script>

<template>
  <header class="tw-mx-auto tw-max-w-3xl tw-px-5 tw-pb-4 tw-pt-32 md:tw-px-8 md:tw-pt-36">
    <p class="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.28em] tw-text-crust">{{ eyebrow }}</p>
    <h1 class="tw-mt-4 tw-font-serif tw-text-5xl tw-leading-[0.95] tw-text-ink md:tw-text-7xl">
      <slot />
    </h1>
    <p class="tw-mt-6 tw-max-w-2xl tw-text-lg tw-font-light tw-leading-relaxed tw-text-ink/75">{{ lede }}</p>
  </header>
</template>
