<template>
  <div
    class="tw-fixed tw-inset-0 tw-overflow-hidden tw-bg-[#b7c4bc] tw-font-[Outfit,Lato,sans-serif] tw-text-[#17211c] [&_canvas]:tw-block [&_canvas]:tw-h-full [&_canvas]:tw-w-full [&_canvas]:tw-cursor-grab"
  >
    <TresCanvas clear-color="#b7c4bc" shadows>
      <TresPerspectiveCamera :fov="46" :near="0.1" :far="420" />
      <TresFog :args="['#b7c4bc', 70, 340]" />
      <TresHemisphereLight :args="['#d7e4ec', '#5c7346', 0.92]" />
      <TresDirectionalLight :position="[32, 58, 22]" :intensity="1.75" cast-shadow />

      <Montanha :active-id="activeId" />
      <Montanhista ref="hiker" @arrive="onArrive" @started="started = true" />
    </TresCanvas>

    <header
      class="tw-pointer-events-none tw-absolute tw-left-[18px] tw-right-[18px] tw-top-[18px] tw-z-[2] tw-flex tw-items-center tw-gap-4"
    >
      <RouterLink
        class="tw-pointer-events-auto tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#f7f3eaeb] tw-px-[0.9rem] tw-py-[0.55rem] tw-text-[0.92rem] tw-text-[#17211c] tw-no-underline hover:tw-bg-white focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
        to="/"
      >
        Portefólio
      </RouterLink>
      <p
        class="tw-pointer-events-auto tw-m-0 tw-ml-1 tw-mr-auto tw-text-[0.72rem] tw-uppercase tw-tracking-[0.14em] tw-text-[#24312b]"
      >
        Jornada
      </p>
      <button
        type="button"
        class="tw-pointer-events-auto tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#f7f3eaeb] tw-px-[0.9rem] tw-py-[0.55rem] tw-font-[inherit] tw-text-[0.92rem] tw-text-[#17211c] hover:tw-bg-white focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
        @click="backToStart"
      >
        Início do trilho
      </button>
    </header>

    <article
      v-if="!started"
      class="tw-absolute tw-right-[18px] tw-top-[76px] tw-z-[2] tw-max-h-[min(62vh,560px)] tw-w-[min(380px,calc(100vw-36px))] tw-overflow-auto tw-rounded-[22px] tw-bg-[#f7f3eaf0] tw-p-5 tw-shadow-[0_16px_40px_#17211c1f] max-md:tw-bottom-4 max-md:tw-left-4 max-md:tw-right-4 max-md:tw-top-auto max-md:tw-max-h-[32vh] max-md:tw-w-auto"
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
        WASD ou setas para andar. Espaço para saltar. Arrasta o rato para olhar.
      </p>
      <p
        class="tw-mt-3 tw-hidden tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#5c675f] max-md:tw-block"
      >
        Joystick para andar. Botão para saltar. Arrasta para olhar.
      </p>
    </article>

    <article
      v-else-if="passage"
      class="tw-absolute tw-right-[18px] tw-top-[76px] tw-z-[2] tw-max-h-[min(62vh,560px)] tw-w-[min(380px,calc(100vw-36px))] tw-overflow-auto tw-rounded-[22px] tw-bg-[#f7f3eaf0] tw-p-5 tw-shadow-[0_16px_40px_#17211c1f] max-md:tw-bottom-4 max-md:tw-left-4 max-md:tw-right-4 max-md:tw-top-auto max-md:tw-max-h-[32vh] max-md:tw-w-auto"
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

    <p
      v-if="started"
      class="tw-absolute tw-bottom-[18px] tw-left-1/2 tw-z-[2] tw-m-0 tw--translate-x-1/2 tw-whitespace-nowrap tw-rounded-full tw-bg-[#f7f3eae0] tw-px-3 tw-py-2 tw-text-[0.82rem] tw-text-[#3d4943] max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden"
    >
      WASD ou setas para andar · Espaço para saltar · Arrasta para olhar
    </p>
    <div
      class="tw-pointer-events-none tw-absolute tw-inset-0 tw-z-[3] tw-hidden max-md:tw-block [@media(pointer:coarse)]:tw-block"
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { TresCanvas } from '@tresjs/core'
import { passageById, steps } from '@/data/journey'
import { releaseHikeKeys, setHikeKey, setHikeStick, type HikeKey } from '@/game/controls'
import Montanha from './Montanha.vue'
import Montanhista from './Montanhista.vue'

const activeId = ref<string | null>(null)
const started = ref(false)
const seen = ref<string[]>([])
const hiker = ref<{ reset: () => void } | null>(null)

const passage = computed(() => (activeId.value ? passageById[activeId.value] : null))

function isCurrent(id: string) {
  const current = passage.value?.parentId ?? passage.value?.id
  return current === id
}

function onArrive(id: string | null) {
  activeId.value = id
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
  hiker.value?.reset()
}

const stickBase = ref<HTMLElement | null>(null)
const stickOffset = ref({ x: 0, y: 0 })
const jumpHeld = ref(false)
let stickPointer: number | null = null

const STICK_RADIUS = 40
const STICK_DEADZONE = 0.18

const knobStyle = computed(() => ({
  transform: `translate(calc(-50% + ${stickOffset.value.x}px), calc(-50% + ${stickOffset.value.y}px))`,
}))

function hold(key: HikeKey, down: boolean) {
  if (key === ' ') jumpHeld.value = down
  setHikeKey(key, down)
}

function onJumpDown(event: PointerEvent) {
  const button = event.currentTarget as HTMLElement
  button.setPointerCapture(event.pointerId)
  hold(' ', true)
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
  let dx = event.clientX - (rect.left + rect.width / 2)
  let dy = event.clientY - (rect.top + rect.height / 2)
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
  releaseHikeKeys()
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('blur', onBlur)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('blur', onBlur)
  onBlur()
})
</script>
