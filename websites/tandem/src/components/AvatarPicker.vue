<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar.vue'

defineProps<{
  label: string
  name: string | null
  imageUrl: string | null
  disabled?: boolean
}>()

const emit = defineEmits<{
  pick: [file: File]
}>()

function onChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('pick', file)
  input.value = ''
}
</script>

<template>
  <div class="tw-flex tw-items-center tw-gap-4">
    <UserAvatar :name="name" :image-url="imageUrl" size="lg" />
    <div>
      <p class="tw-m-0 tw-text-sm tw-font-medium">{{ label }}</p>
      <label class="tw-mt-2 tw-inline-block tw-cursor-pointer tw-rounded-lg tw-border tw-border-salt tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium">
        Escolher foto
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="tw-sr-only"
          :disabled="disabled"
          @change="onChange"
        />
      </label>
    </div>
  </div>
</template>
