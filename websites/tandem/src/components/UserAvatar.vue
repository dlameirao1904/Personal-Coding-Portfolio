<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name?: string | null
    imageUrl?: string | null
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const initial = computed(() => {
  const source = props.name?.trim() || '?'
  return source.charAt(0).toUpperCase()
})

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'tw-h-8 tw-w-8 tw-text-xs'
  if (props.size === 'lg') return 'tw-h-14 tw-w-14 tw-text-lg'
  return 'tw-h-9 tw-w-9 tw-text-sm'
})
</script>

<template>
  <span
    class="tw-inline-flex tw-shrink-0 tw-items-center tw-justify-center tw-overflow-hidden tw-rounded-lg tw-bg-teal tw-font-semibold tw-text-paper"
    :class="sizeClass"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="" class="tw-h-full tw-w-full tw-object-cover" />
    <span v-else>{{ initial }}</span>
  </span>
</template>
