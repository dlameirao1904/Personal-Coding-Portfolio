<script lang="ts" setup>
import { mountBakery, type BakeryHandle } from '@/scene/bakery'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  progress: number
  pointerX: number
  pointerY: number
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const failed = ref(false)
let bakery: BakeryHandle | null = null
let observer: IntersectionObserver | null = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  try {
    bakery = mountBakery(canvas)
    bakery.setProgress(props.progress)
    bakery.setPointer(props.pointerX, props.pointerY)
    bakery.start()
  } catch {
    failed.value = true
    return
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) bakery?.start()
    else bakery?.stop()
  })
  observer.observe(canvas)
})

watch(
  () => props.progress,
  (value) => bakery?.setProgress(value),
)
watch(
  () => [props.pointerX, props.pointerY] as const,
  ([x, y]) => bakery?.setPointer(x, y),
)

onUnmounted(() => {
  observer?.disconnect()
  bakery?.dispose()
  bakery = null
})
</script>

<template>
  <div class="tw-relative tw-h-full tw-w-full">
    <canvas
      ref="canvasRef"
      class="tw-block tw-h-full tw-w-full"
      role="img"
      aria-label="Dois padeiros a preparar a broa, a passá-la para a tela e a metê-la no forno" />
    <p
      v-if="failed"
      class="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-px-6 tw-text-center tw-text-sm tw-text-flour/80">
      O modelo dos padeiros precisa de WebGL neste ecrã.
    </p>
  </div>
</template>
