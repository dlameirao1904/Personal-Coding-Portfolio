<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  progress: number
  pointerX?: number
  pointerY?: number
  reduceMotion?: boolean
  autoplayIdleMs?: number
  /** Só permite autoplay depois de o utilizador ter começado o scroll na secção. */
  allowAutoplay?: boolean
}>()

const emit = defineEmits<{
  autoplay: [progress: number]
  finished: []
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const ready = ref(false)
const failed = ref(false)

const idleMs = () => props.autoplayIdleMs ?? 500

let duration = 0
let targetTime = 0
let frame = 0
let visible = true
let autoPlaying = false
let finishedEmitted = false
let lastUserProgressAt = 0
let observer: IntersectionObserver | null = null
let videoEl: HTMLVideoElement | null = null

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

function setTarget(progress: number) {
  if (!Number.isFinite(duration) || duration <= 0) return
  targetTime = clamp(progress) * duration
}

function hardSeek(time: number) {
  const video = videoRef.value
  if (!video || !ready.value) return
  const safe = clamp(time / duration) * duration
  if (video.seeking) return
  try {
    const fast = video as HTMLVideoElement & { fastSeek?: (t: number) => void }
    if (typeof fast.fastSeek === 'function') fast.fastSeek(safe)
    else video.currentTime = safe
  } catch {
    /* not buffered yet */
  }
}

function syncToTarget() {
  const video = videoRef.value
  if (!video || !ready.value || !visible) return

  const diff = targetTime - video.currentTime
  if (Math.abs(diff) < 0.035) {
    video.pause()
    if (Math.abs(diff) > 0.004) hardSeek(targetTime)
    return
  }

  if (diff < -0.05) {
    video.pause()
    hardSeek(targetTime)
    return
  }

  const rate = Math.min(8, Math.max(1.4, Math.abs(diff) * 3.2))
  video.playbackRate = rate
  void video.play().catch(() => {
    hardSeek(targetTime)
  })
}

function stopAutoplay() {
  autoPlaying = false
  videoRef.value?.pause()
}

function maybeAutoplay() {
  const video = videoRef.value
  if (!video || !ready.value || !visible || props.reduceMotion || !props.allowAutoplay) return
  if (autoPlaying) return
  if (Date.now() - lastUserProgressAt < idleMs()) return
  if (video.currentTime >= duration - 0.12) return

  autoPlaying = true
  video.playbackRate = 1
  void video.play().catch(() => {
    stopAutoplay()
  })
}

function tick() {
  const video = videoRef.value
  if (autoPlaying && video && ready.value) {
    if (video.paused && !video.seeking) void video.play().catch(() => stopAutoplay())
    const p = clamp(video.currentTime / duration)
    emit('autoplay', p)
    if (p >= 0.995) {
      stopAutoplay()
      if (!finishedEmitted) {
        finishedEmitted = true
        emit('finished')
      }
    }
  } else if (!autoPlaying) {
    maybeAutoplay()
    if (!autoPlaying) syncToTarget()
  }
  frame = requestAnimationFrame(tick)
}

function hydrateMeta() {
  const video = videoRef.value
  if (!video) return
  duration = video.duration
  ready.value = Number.isFinite(duration) && duration > 0
  if (!ready.value) return
  setTarget(props.progress)
  hardSeek(targetTime)
  video.pause()
  lastUserProgressAt = Date.now()
}

function onSeeked() {
  const video = videoRef.value
  if (!video || !visible || !ready.value || autoPlaying) return
  if (targetTime - video.currentTime > 0.08 && !video.seeking) syncToTarget()
}

watch(
  () => props.progress,
  (value) => {
    const video = videoRef.value
    const echoed =
      autoPlaying && video && Number.isFinite(duration) && Math.abs(value - video.currentTime / duration) < 0.04
    if (echoed) return

    const jumped = Math.abs(value - targetTime / Math.max(duration, 1)) > 0.008
    if (jumped) stopAutoplay()

    setTarget(value)
    lastUserProgressAt = Date.now()
    if (value < 0.85) finishedEmitted = false
    if (!autoPlaying) syncToTarget()
  },
)

watch(
  () => props.reduceMotion,
  (value) => {
    if (value) stopAutoplay()
  },
)

watch(
  () => props.allowAutoplay,
  (value) => {
    if (!value) stopAutoplay()
  },
)

onMounted(() => {
  const video = videoRef.value
  if (!video) return
  videoEl = video
  lastUserProgressAt = Date.now()

  const onMeta = () => hydrateMeta()
  const onError = () => {
    failed.value = true
  }

  video.addEventListener('loadedmetadata', onMeta)
  video.addEventListener('loadeddata', onMeta)
  video.addEventListener('error', onError)
  video.addEventListener('seeked', onSeeked)
  if (video.readyState >= 1) hydrateMeta()

  observer = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting)
    if (!visible) stopAutoplay()
    else if (!autoPlaying) syncToTarget()
  })
  observer.observe(video)
  frame = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
  const video = videoEl
  if (!video) return
  video.pause()
  video.removeEventListener('seeked', onSeeked)
})
</script>

<template>
  <div class="tw-relative tw-h-full tw-w-full tw-bg-flour">
    <video
      ref="videoRef"
      class="tw-block tw-h-full tw-w-full tw-object-cover"
      src="/videos/forno.mp4?v=d80d6b8c"
      muted
      playsinline
      preload="auto"
      tabindex="-1"
      role="img"
      aria-label="Vídeo do forno: massadeira, balança, forma da broa, tela e forno" />
    <p
      v-if="failed"
      class="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-px-6 tw-text-center tw-text-sm tw-text-ink/70">
      Não foi possível carregar o vídeo do forno.
    </p>
    <p v-else-if="!ready" class="tw-pointer-events-none tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-text-sm tw-text-ink/50">
      A carregar o forno…
    </p>
  </div>
</template>
