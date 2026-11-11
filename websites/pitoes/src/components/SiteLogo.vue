<script lang="ts" setup>
withDefaults(
  defineProps<{
    /** `mark` em fundos claros; `badge` com o fundo creme em zonas escuras. */
    variant?: 'mark' | 'badge'
    logoClass?: string
  }>(),
  { variant: 'mark' },
)

const sources = {
  mark: '/brand/logo.png',
  badge: '/brand/logo.jpg',
} as const
</script>

<template>
  <img
    :src="sources[variant]"
    alt="Padaria Pitões · Família Marinho"
    :class="[
      'tw-h-[3.25rem] tw-w-auto tw-object-contain md:tw-h-[3.75rem]',
      variant === 'badge' ? 'tw-rounded-2xl' : '',
      logoClass,
    ]" />
</template>
