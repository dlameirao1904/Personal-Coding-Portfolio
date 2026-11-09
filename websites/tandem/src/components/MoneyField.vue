<script setup lang="ts">
import { ref, watch } from 'vue'

const model = defineModel<number>({ default: 0 })

defineProps<{
  label: string
  hint?: string
  id?: string
  min?: number
}>()

const inputText = ref('')
let focused = false

function parseAmount(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.')
  if (normalized === '' || normalized === '.') return null
  const n = Number.parseFloat(normalized)
  return Number.isFinite(n) ? n : null
}

watch(
  model,
  (v) => {
    if (focused) return
    inputText.value = v > 0 ? String(v).replace('.', ',') : ''
  },
  { immediate: true },
)

function onFocus() {
  focused = true
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  inputText.value = target.value
  const parsed = parseAmount(target.value)
  if (parsed !== null && parsed >= 0) model.value = parsed
  else if (target.value.trim() === '') model.value = 0
}

function onBlur() {
  focused = false
  const parsed = parseAmount(inputText.value)
  if (parsed !== null && parsed >= 0) {
    const cents = Math.round(parsed * 100) / 100
    model.value = cents
    inputText.value = cents > 0 ? String(cents).replace('.', ',') : ''
  } else {
    model.value = 0
    inputText.value = ''
  }
}
</script>

<template>
  <label class="tw-block tw-space-y-1">
    <span class="tw-text-sm tw-font-medium tw-text-ink">{{ label }}</span>
    <div class="tw-relative">
      <span class="tw-pointer-events-none tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-sm tw-text-muted"
        >€</span
      >
      <input
        :id="id"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-bg-white tw-py-2.5 tw-pl-8 tw-pr-3 tw-font-mono tw-text-sm"
        :value="inputText"
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
      />
    </div>
    <span v-if="hint" class="tw-block tw-text-xs tw-text-muted">{{ hint }}</span>
  </label>
</template>
