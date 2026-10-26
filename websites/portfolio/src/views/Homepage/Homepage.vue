<template>
  <div
    class="tw-fixed tw-overflow-hidden tw-bg-[#b7c4bc] tw-font-[Outfit,Lato,sans-serif] tw-text-[#17211c] [&_canvas]:tw-block [&_canvas]:tw-h-full [&_canvas]:tw-w-full [&_canvas]:tw-cursor-grab"
    :class="journeyTurned ? 'journey-turned' : 'tw-inset-0'"
  >
    <TresCanvas clear-color="#b7c4bc" shadows>
      <TresPerspectiveCamera :fov="46" :near="0.1" :far="420" />
      <TresFog :args="['#b7c4bc', 70, 340]" />
      <TresHemisphereLight :args="['#d7e4ec', '#5c7346', 0.92]" />
      <TresDirectionalLight :position="[32, 58, 22]" :intensity="1.75" cast-shadow />

      <Montanha :active-id="activeId" />
      <Montanhista
        ref="hiker"
        :reading-id="readingId"
        @arrive="onArrive"
        @started="started = true"
      />
    </TresCanvas>

    <div
      class="tw-pointer-events-none tw-absolute tw-left-[18px] tw-right-[18px] tw-top-[max(18px,env(safe-area-inset-top,0px))] tw-z-[4] tw-flex tw-items-start tw-justify-between"
    >
      <div class="tw-pointer-events-auto tw-relative">
        <button
          type="button"
          class="tw-flex tw-h-11 tw-w-11 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-border-0 tw-bg-[#f7f3eaeb] tw-text-[#17211c] hover:tw-bg-white focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
          :aria-expanded="menuOpen"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="tw-flex tw-w-4 tw-flex-col tw-gap-1" aria-hidden="true">
            <span class="tw-block tw-h-0.5 tw-rounded-full tw-bg-current" />
            <span class="tw-block tw-h-0.5 tw-rounded-full tw-bg-current" />
            <span class="tw-block tw-h-0.5 tw-rounded-full tw-bg-current" />
          </span>
        </button>
        <div
          v-if="menuOpen"
          class="tw-absolute tw-left-0 tw-top-[calc(100%+0.45rem)] tw-flex tw-w-52 tw-flex-col tw-gap-1 tw-rounded-2xl tw-bg-[#f7f3eaf0] tw-p-2 tw-shadow-[0_12px_28px_#17211c24]"
        >
          <button
            type="button"
            class="tw-cursor-pointer tw-rounded-xl tw-border-0 tw-bg-transparent tw-px-3 tw-py-2 tw-text-left tw-font-[inherit] tw-text-[0.95rem] tw-text-[#17211c] hover:tw-bg-[#0e332814]"
            @click="chooseStart"
          >
            Início do trilho
          </button>
          <RouterLink
            class="tw-rounded-xl tw-px-3 tw-py-2 tw-text-[0.95rem] tw-text-[#17211c] tw-no-underline hover:tw-bg-[#0e332814]"
            to="/"
            @click="menuOpen = false"
          >
            Portefólio
          </RouterLink>
        </div>
      </div>
      <JourneyMap class="tw-pointer-events-auto" />
    </div>

    <article
      v-if="!started"
      class="journey-card tw-absolute tw-right-[18px] tw-top-[9.6rem] tw-z-[2] tw-max-h-[min(62vh,560px)] tw-w-[min(380px,calc(100vw-36px))] tw-overflow-auto tw-rounded-[22px] tw-bg-[#f7f3eaf0] tw-p-5 tw-shadow-[0_16px_40px_#17211c1f] max-md:tw-bottom-auto max-md:tw-left-auto max-md:tw-right-3 max-md:tw-top-[9.6rem] max-md:tw-max-h-[38vh] max-md:tw-w-[min(17.5rem,calc(100vw-6.5rem))] max-md:tw-rounded-2xl max-md:tw-p-3.5 max-md:tw-shadow-[0_10px_28px_#17211c33]"
    >
      <p class="tw-mb-2 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.12em] tw-text-[#8a4632]">
        O trilho
      </p>
      <h1
        class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-text-[clamp(1.55rem,2vw,2rem)] tw-font-[560] tw-leading-[1.05] tw-tracking-[-0.03em]"
      >
        Um percurso, algumas paisagens e boa disposição.
      </h1>
      <p class="tw-mt-3 tw-leading-[1.45]">
        Aqui, podes ver os meus passos, literalmente. Aproveita a jornada e aprecia a paisagem.
      </p>
      <p class="tw-mt-3 tw-leading-[1.45]">«Só a Natureza é divina, e ela não é divina...»</p>
      <p class="tw-mt-3 tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#5c675f] max-md:tw-hidden">
        WASD ou setas para andar. Shift para correr. Espaço para saltar. Arrasta o rato para olhar.
      </p>
      <p
        class="tw-mt-3 tw-hidden tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#5c675f] max-md:tw-block"
      >
        Joystick para andar. Segura em Correr. Botão para saltar. Arrasta para olhar.
      </p>
    </article>

    <article
      v-else-if="passage && passage.kind !== 'project'"
      class="journey-card tw-absolute tw-right-[18px] tw-top-[9.6rem] tw-z-[2] tw-max-h-[min(62vh,560px)] tw-w-[min(380px,calc(100vw-36px))] tw-overflow-auto tw-rounded-[22px] tw-bg-[#f7f3eaf0] tw-p-5 tw-shadow-[0_16px_40px_#17211c1f] max-md:tw-bottom-auto max-md:tw-left-auto max-md:tw-right-3 max-md:tw-top-[9.6rem] max-md:tw-max-h-[38vh] max-md:tw-w-[min(17.5rem,calc(100vw-6.5rem))] max-md:tw-rounded-2xl max-md:tw-p-3.5 max-md:tw-shadow-[0_10px_28px_#17211c33]"
    >
      <p class="tw-mb-2 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.12em] tw-text-[#8a4632]">
        {{ passage.kicker }}
        <span v-if="passage.ongoing">· atual</span>
      </p>
      <h1
        class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-text-[clamp(1.55rem,2vw,2rem)] tw-font-[560] tw-leading-[1.05] tw-tracking-[-0.03em]"
      >
        {{ passage.title }}
      </h1>
      <p class="tw-mt-3 tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#4e5a53]">
        {{ passage.organization }} · {{ passage.period }} · {{ passage.place }}
      </p>
      <p
        v-if="passage.relation"
        class="tw-mt-1 tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#0e3328]"
      >
        {{ passage.relation }}
      </p>
      <p
        v-if="passage.parentTitle"
        class="tw-mt-1 tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#0e3328]"
      >
        Parte de {{ passage.parentTitle }}
      </p>
      <p class="tw-mt-3 tw-leading-[1.45]">{{ passage.summary }}</p>
      <p v-if="passage.links?.length" class="tw-mb-0 tw-mt-3 tw-flex tw-flex-wrap tw-gap-4">
        <a
          v-for="link in passage.links"
          :key="link.href"
          class="tw-text-[#0e3328] tw-underline tw-underline-offset-[0.18em] hover:tw-text-[#17211c] focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ link.label }}
        </a>
      </p>
      <p
        v-if="passage.sceneNote"
        class="tw-mt-3 tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#5c675f]"
      >
        {{ passage.sceneNote }}
      </p>
      <ul
        v-if="passage.stack.length"
        class="tw-m-0 tw-mt-4 tw-flex tw-list-none tw-flex-wrap tw-gap-1.5 tw-p-0"
      >
        <li
          v-for="item in passage.stack"
          :key="item"
          class="tw-rounded-full tw-bg-[#0e332814] tw-px-2 tw-py-1 tw-text-[0.78rem]"
        >
          {{ item }}
        </li>
      </ul>
    </article>

    <div
      v-if="projectPrompt"
      class="tw-absolute tw-bottom-24 tw-left-1/2 tw-z-[4] tw-flex tw--translate-x-1/2 tw-flex-col tw-items-center tw-gap-3"
    >
      <p
        class="tw-m-0 tw-whitespace-nowrap tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-text-[0.95rem] tw-text-[#17211c] tw-shadow-[0_8px_20px_#17211c24]"
      >
        <span class="tw-mr-2 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.12em] tw-text-[#8a4632]">
          {{ passage?.short }}
        </span>
        <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden">Carrega em E para ver</span>
        <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline">Toca para ver</span>
      </p>
      <button
        type="button"
        class="tw-hidden tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea] max-md:tw-inline-block [@media(pointer:coarse)]:tw-inline-block"
        @click="openProject"
      >
        Ver
      </button>
    </div>

    <div
      v-if="readingId && passage"
      class="tw-absolute tw-bottom-6 tw-left-1/2 tw-z-[4] tw-flex tw-w-[min(640px,calc(100%-2rem))] tw--translate-x-1/2 tw-flex-col tw-items-center tw-gap-3"
    >
      <p v-if="passage.links?.length" class="tw-m-0 tw-flex tw-flex-wrap tw-justify-center tw-gap-4">
        <a
          v-for="link in passage.links"
          :key="link.href"
          class="tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-3 tw-py-2 tw-text-[0.92rem] tw-text-[#0e3328] tw-underline tw-underline-offset-[0.18em]"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ link.label }}
        </a>
      </p>
      <button
        type="button"
        class="tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#17211c]"
        @click="readingId = null"
      >
        <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden">E para voltar</span>
        <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline">Voltar ao trilho</span>
      </button>
    </div>

    <div
      class="tw-pointer-events-none tw-absolute tw-inset-0 tw-z-[3] tw-hidden max-md:tw-block [@media(pointer:coarse)]:tw-block"
      :class="{ 'tw-invisible': readingId }"
      aria-hidden="true"
    >
      <div
        ref="stickBase"
        class="tw-pointer-events-auto tw-absolute tw-bottom-[max(0.35rem,env(safe-area-inset-bottom,0px))] tw-right-[max(1rem,env(safe-area-inset-right,0px))] tw-h-32 tw-w-32 tw-touch-none tw-select-none"
        @pointerdown.prevent="onStickDown"
        @pointermove="onStickMove"
        @pointerup="onStickUp"
        @pointercancel="onStickUp"
        @contextmenu.prevent
      >
        <div
          class="tw-absolute tw-inset-0 tw-rounded-full tw-border-2 tw-border-[#17211c33] tw-bg-[#f7f3ea99] tw-shadow-[inset_0_0_0_18px_#17211c0f]"
        />
        <div
          class="tw-absolute tw-left-1/2 tw-top-1/2 tw-h-14 tw-w-14 tw-rounded-full tw-bg-[#f7f3eaf5] tw-shadow-[0_6px_16px_#17211c33]"
          :style="knobStyle"
        />
      </div>
      <button
        type="button"
        class="tw-pointer-events-auto tw-absolute tw-bottom-[max(7.4rem,calc(env(safe-area-inset-bottom,0px)+7rem))] tw-left-[max(1.35rem,env(safe-area-inset-left,0px))] tw-h-16 tw-w-16 tw-cursor-pointer tw-select-none tw-rounded-full tw-border-0 tw-font-[inherit] tw-text-[0.82rem] tw-text-[#17211c] tw-touch-none tw-shadow-[0_8px_20px_#17211c24]"
        :class="runHeld ? 'tw-bg-white' : 'tw-bg-[#f7f3eaf0]'"
        @pointerdown.prevent="onRunDown"
        @pointerup="hold('Shift', false)"
        @pointercancel="hold('Shift', false)"
        @contextmenu.prevent
      >
        Correr
      </button>
      <button
        type="button"
        class="tw-pointer-events-auto tw-absolute tw-bottom-[max(0.35rem,env(safe-area-inset-bottom,0px))] tw-left-[max(1rem,env(safe-area-inset-left,0px))] tw-h-24 tw-w-24 tw-cursor-pointer tw-select-none tw-rounded-full tw-border-0 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#17211c] tw-touch-none tw-shadow-[0_8px_20px_#17211c24]"
        :class="jumpHeld ? 'tw-bg-white' : 'tw-bg-[#f7f3eaf0]'"
        @pointerdown.prevent="onJumpDown"
        @pointerup="hold(' ', false)"
        @pointercancel="hold(' ', false)"
        @contextmenu.prevent
      >
        Saltar
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="showRotatePrompt"
        class="tw-fixed tw-inset-0 tw-z-[10000] tw-flex tw-items-center tw-justify-center tw-bg-[#17211ce6] tw-p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rotate-title"
      >
        <div
          class="tw-w-[min(360px,100%)] tw-rounded-[22px] tw-bg-[#f7f3eaf0] tw-p-6 tw-text-center tw-shadow-[0_16px_40px_#17211c1f]"
        >
          <div class="phone-hint" aria-hidden="true">
            <span class="phone-hint__body" />
          </div>
          <p class="tw-mb-2 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.12em] tw-text-[#8a4632]">
            Orientação
          </p>
          <h2
            id="rotate-title"
            class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-text-[clamp(1.55rem,2vw,2rem)] tw-font-[560] tw-leading-[1.05] tw-tracking-[-0.03em]"
          >
            Roda o telemóvel
          </h2>
          <p class="tw-mt-3 tw-leading-[1.45]">
            O trilho vê-se melhor na horizontal. Se o ecrã não rodar, a jornada vira sozinha.
          </p>
          <button
            type="button"
            class="tw-mt-5 tw-w-full tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-3 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea] hover:tw-bg-[#17211c] focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
            @click="continueInLandscape"
          >
            Continuar
          </button>
          <RouterLink
            class="tw-mt-4 tw-inline-block tw-text-[0.92rem] tw-text-[#0e3328] tw-underline tw-underline-offset-[0.18em]"
            to="/"
          >
            Voltar ao portefólio
          </RouterLink>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { TresCanvas } from '@tresjs/core'
import { passageById, steps } from '@/data/journey'
import { releaseHikeKeys, setHikeKey, setHikeStick, type HikeKey } from '@/game/controls'
import { journeyTurned, toStageDelta } from '@/game/orientation'
import JourneyMap from './JourneyMap.vue'
import Montanha from './Montanha.vue'
import Montanhista from './Montanhista.vue'

const menuOpen = ref(false)
const activeId = ref<string | null>(null)
const readingId = ref<string | null>(null)
const started = ref(false)
const seen = ref<string[]>([])
const hiker = ref<{ reset: () => void } | null>(null)

const passage = computed(() => (activeId.value ? passageById[activeId.value] : null))
const projectPrompt = computed(
  () => started.value && passage.value?.kind === 'project' && !readingId.value,
)

function isCurrent(id: string) {
  const current = passage.value?.parentId ?? passage.value?.id
  return current === id
}

function openProject() {
  if (passage.value?.kind !== 'project') return
  readingId.value = passage.value.id
}

function onInspectKey(event: KeyboardEvent) {
  if (event.repeat) return
  const key = event.key.toLowerCase()
  if (key === 'escape') {
    readingId.value = null
    return
  }
  if (key !== 'e') return
  if (readingId.value) {
    readingId.value = null
    return
  }
  openProject()
}

function onArrive(id: string | null) {
  activeId.value = id
  if (readingId.value && readingId.value !== id) readingId.value = null
  if (!id) return
  const stepId = passageById[id].parentId ?? id
  if (!seen.value.includes(stepId)) seen.value = [...seen.value, stepId]
}

function railClass(id: string) {
  if (isCurrent(id)) return 'tw-font-semibold tw-text-[#0e3328]'
  if (seen.value.includes(id)) return 'tw-text-[#17211c]'
  return ''
}

function backToStart() {
  readingId.value = null
  hiker.value?.reset()
}

function chooseStart() {
  menuOpen.value = false
  backToStart()
}

const stickBase = ref<HTMLElement | null>(null)
const stickOffset = ref({ x: 0, y: 0 })
const jumpHeld = ref(false)
const runHeld = ref(false)
let stickPointer: number | null = null

const STICK_RADIUS = 40
const STICK_DEADZONE = 0.18

const knobStyle = computed(() => ({
  transform: `translate(calc(-50% + ${stickOffset.value.x}px), calc(-50% + ${stickOffset.value.y}px))`,
}))

function hold(key: HikeKey, down: boolean) {
  if (key === ' ') jumpHeld.value = down
  if (key === 'Shift') runHeld.value = down
  setHikeKey(key, down)
}

function onJumpDown(event: PointerEvent) {
  const button = event.currentTarget as HTMLElement
  button.setPointerCapture(event.pointerId)
  hold(' ', true)
}

function onRunDown(event: PointerEvent) {
  const button = event.currentTarget as HTMLElement
  button.setPointerCapture(event.pointerId)
  hold('Shift', true)
}

function onStickDown(event: PointerEvent) {
  const base = event.currentTarget as HTMLElement
  base.setPointerCapture(event.pointerId)
  stickPointer = event.pointerId
  moveStick(event)
}

function onStickMove(event: PointerEvent) {
  if (event.pointerId !== stickPointer) return
  moveStick(event)
}

function onStickUp(event: PointerEvent) {
  if (event.pointerId !== stickPointer) return
  stickPointer = null
  stickOffset.value = { x: 0, y: 0 }
  setHikeStick(0, 0)
}

function moveStick(event: PointerEvent) {
  const base = stickBase.value
  if (!base) return
  const rect = base.getBoundingClientRect()
  const local = toStageDelta(
    event.clientX - (rect.left + rect.width / 2),
    event.clientY - (rect.top + rect.height / 2),
  )
  let dx = local.x
  let dy = local.y
  const len = Math.hypot(dx, dy)
  if (len > STICK_RADIUS) {
    dx = (dx / len) * STICK_RADIUS
    dy = (dy / len) * STICK_RADIUS
  }
  stickOffset.value = { x: dx, y: dy }

  let nx = dx / STICK_RADIUS
  let ny = -dy / STICK_RADIUS
  const mag = Math.hypot(nx, ny)
  if (mag < STICK_DEADZONE) {
    setHikeStick(0, 0)
    return
  }
  const scaled = (mag - STICK_DEADZONE) / (1 - STICK_DEADZONE)
  setHikeStick((nx / mag) * scaled, (ny / mag) * scaled)
}

function onBlur() {
  stickPointer = null
  stickOffset.value = { x: 0, y: 0 }
  jumpHeld.value = false
  runHeld.value = false
  releaseHikeKeys()
}

const coarseQuery = window.matchMedia('(pointer: coarse)')
const hoverNoneQuery = window.matchMedia('(hover: none)')
const narrowQuery = window.matchMedia('(max-width: 900px)')
const portraitQuery = window.matchMedia('(orientation: portrait)')
const handheld = ref(false)
const portrait = ref(false)
const promptDismissed = ref(false)
let lockAttempted = false
let weRequestedFullscreen = false
let orientationLocked = false

const showRotatePrompt = computed(
  () => handheld.value && portrait.value && !promptDismissed.value,
)

function readPortrait() {
  if (window.innerHeight !== window.innerWidth) return window.innerHeight > window.innerWidth
  const type = screen.orientation?.type
  if (type) return type.startsWith('portrait')
  return portraitQuery.matches
}

function readHandheld() {
  const ua = navigator.userAgent
  const iPadOs = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1
  const mobileUa = /Android|iPhone|iPod|Mobile/i.test(ua) || iPadOs
  const touch = navigator.maxTouchPoints > 0 || coarseQuery.matches || hoverNoneQuery.matches
  const narrow = narrowQuery.matches || window.innerWidth <= 900
  return mobileUa || (touch && narrow)
}

function onMediaChange() {
  handheld.value = readHandheld()
  portrait.value = readPortrait()
  if (!portrait.value) {
    journeyTurned.value = false
    promptDismissed.value = false
    lockAttempted = false
  }
}

onMediaChange()

function tryLockLandscape() {
  const root = document.documentElement
  let pending: Promise<unknown> = Promise.resolve()
  if (!document.fullscreenElement && typeof root.requestFullscreen === 'function') {
    weRequestedFullscreen = true
    pending = root.requestFullscreen()
  }
  const attempt = pending
    .then(() => {
      if (!screen.orientation?.lock) return
      return screen.orientation.lock('landscape').then(() => {
        orientationLocked = true
      })
    })
    .then(() => {
      portrait.value = readPortrait()
    })
    .catch(() => {})

  return new Promise<void>((resolve) => {
    const timer = window.setTimeout(() => resolve(), 700)
    void attempt.finally(() => {
      window.clearTimeout(timer)
      resolve()
    })
  })
}

function continueInLandscape() {
  lockAttempted = true
  promptDismissed.value = true
  void tryLockLandscape().then(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        portrait.value = readPortrait()
        if (portrait.value) journeyTurned.value = true
      })
    })
  })
}

function onLandscapeGesture(event: PointerEvent) {
  if (!handheld.value || portrait.value || lockAttempted) return
  const target = event.target
  if (target instanceof Element && target.closest('a')) return
  lockAttempted = true
  void tryLockLandscape()
}

function releaseOrientation() {
  journeyTurned.value = false
  if (orientationLocked) {
    try {
      screen.orientation.unlock()
    } catch {
      // Unlock throws when the browser already dropped the lock.
    }
    orientationLocked = false
  }
  if (weRequestedFullscreen && document.fullscreenElement) {
    void document.exitFullscreen().catch(() => {})
  }
  weRequestedFullscreen = false
}

watch(journeyTurned, async () => {
  await nextTick()
  window.dispatchEvent(new Event('resize'))
})

onMounted(() => {
  document.body.style.overflow = 'hidden'
  onMediaChange()
  window.addEventListener('blur', onBlur)
  window.addEventListener('resize', onMediaChange)
  window.addEventListener('orientationchange', onMediaChange)
  window.addEventListener('keydown', onInspectKey)
  coarseQuery.addEventListener('change', onMediaChange)
  hoverNoneQuery.addEventListener('change', onMediaChange)
  narrowQuery.addEventListener('change', onMediaChange)
  portraitQuery.addEventListener('change', onMediaChange)
  screen.orientation?.addEventListener('change', onMediaChange)
  window.visualViewport?.addEventListener('resize', onMediaChange)
  window.addEventListener('pointerdown', onLandscapeGesture, true)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('blur', onBlur)
  window.removeEventListener('resize', onMediaChange)
  window.removeEventListener('orientationchange', onMediaChange)
  window.removeEventListener('keydown', onInspectKey)
  coarseQuery.removeEventListener('change', onMediaChange)
  hoverNoneQuery.removeEventListener('change', onMediaChange)
  narrowQuery.removeEventListener('change', onMediaChange)
  portraitQuery.removeEventListener('change', onMediaChange)
  screen.orientation?.removeEventListener('change', onMediaChange)
  window.visualViewport?.removeEventListener('resize', onMediaChange)
  window.removeEventListener('pointerdown', onLandscapeGesture, true)
  onBlur()
  releaseOrientation()
})
</script>

<style scoped>
.journey-turned {
  top: 0;
  left: 100vw;
  left: 100dvw;
  right: auto;
  bottom: auto;
  width: 100vh;
  width: 100dvh;
  height: 100vw;
  height: 100dvw;
  transform: rotate(90deg);
  transform-origin: top left;
}

.journey-turned .journey-card {
  top: 9.6rem !important;
  right: 18px !important;
  bottom: auto !important;
  left: auto !important;
  width: min(380px, calc(100% - 36px)) !important;
  max-height: min(62%, 560px) !important;
}

.phone-hint {
  display: grid;
  width: 72px;
  height: 72px;
  margin: 0 auto 8px;
  place-items: center;
  animation: phone-turn 2.6s ease-in-out infinite;
}

.phone-hint__body {
  position: relative;
  width: 38px;
  height: 64px;
  border: 2.5px solid #8a4632;
  border-radius: 8px;
}

.phone-hint__body::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #8a4632;
  transform: translateX(-50%);
}

@keyframes phone-turn {
  0%,
  18% {
    transform: rotate(0deg);
  }
  48%,
  78% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .phone-hint {
    animation: none;
    transform: rotate(-90deg);
  }
}
</style>
