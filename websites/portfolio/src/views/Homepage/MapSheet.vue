<template>
  <svg
    :viewBox="`0 0 ${viewW} ${viewH}`"
    class="tw-block tw-h-full tw-w-full"
    preserveAspectRatio="xMidYMid meet"
    overflow="hidden"
    role="img"
    :aria-label="wide ? 'Mapa do vale. Toca para marcar um ponto.' : 'Minimapa'"
    :class="wide ? 'tw-cursor-crosshair' : ''"
    @click="onPick"
  >
    <rect :width="viewW" :height="viewH" fill="#d7e3cf" rx="12" />
    <polygon :points="mountain" fill="#8b7d62" />
    <polygon :points="slope" fill="#6e8f52" />
    <polyline
      :points="ridge"
      fill="none"
      stroke="#5c5344"
      :stroke-width="wide ? 4 : 3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <polyline
      :points="river"
      fill="none"
      stroke="#6d8f78"
      :stroke-width="bankWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <polyline
      :points="river"
      fill="none"
      stroke="#3d7f9a"
      :stroke-width="waterWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <polyline
      :points="trail"
      fill="none"
      stroke="#0e3328"
      :stroke-width="trailWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <g v-for="place in places" :key="place.id">
      <circle :cx="place.x" :cy="place.y" :r="wide ? 3.4 : 4.2" :fill="place.color" />
    </g>
    <circle :cx="atelier.x" :cy="atelier.y" :r="wide ? 3.6 : 4.4" fill="#8d5a45" />
    <rect
      :x="pitch.x"
      :y="pitch.y"
      :width="pitch.w"
      :height="pitch.h"
      fill="#2f7a3e"
      stroke="#f4efe4"
      :stroke-width="wide ? 0.7 : 1.1"
    />
    <rect
      :x="ring.x"
      :y="ring.y"
      :width="ring.w"
      :height="ring.h"
      fill="#1e4b73"
      stroke="#f4efe4"
      :stroke-width="wide ? 0.6 : 1"
    />
    <circle
      :cx="chapel.x"
      :cy="chapel.y"
      :r="wide ? 3.2 : 4"
      fill="#f4efe4"
      stroke="#8d7b66"
      stroke-width="0.6"
    />
    <polyline
      v-if="routeLine"
      :points="routeLine"
      fill="none"
      stroke="#b45309"
      stroke-dasharray="5 3.5"
      :stroke-width="wide ? 2.6 : 3.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle
      :cx="vinyl.x"
      :cy="vinyl.y"
      :r="wide ? 4.2 : 5.2"
      fill="#6b2430"
      stroke="#f4efe4"
      :stroke-width="wide ? 0.7 : 1.1"
    />
    <circle :cx="you.x" :cy="you.y" r="4.5" fill="#b91c1c" stroke="#f7f3ea" stroke-width="1.4" />
    <circle
      v-if="pin"
      :cx="pin.x"
      :cy="pin.y"
      :r="wide ? 4.2 : 5"
      fill="#b45309"
      stroke="#f7f3ea"
      stroke-width="1.3"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { pathNodes, steps } from '@/data/journey'
import { ATELIER } from '@/game/atelier'
import { summit } from '@/game/buildTrail'
import { PITCH_HALF_X, PITCH_HALF_Z, PITCH_X, PITCH_Z } from '@/game/pitch'
import { RING_HALF, RING_X, RING_Z } from '@/game/ring'
import { VINYL_X, VINYL_Z } from '@/game/vinyl'
import { trailGoal, trailPoints } from '@/game/route'
import { CAVADO_HALF, cavado } from '@/game/cavado'
import { hikerSpot } from '@/game/spot'

const props = defineProps<{ wide: boolean }>()
const emit = defineEmits<{ pick: [point: { x: number; z: number }] }>()

/** Janela do minimapa, em metros, centrada no montanhista. */
const MINI_SPAN = 108
/** O minimapa só recentra ao fim destes metros, para não redesenhar o vale a cada passo. */
const RECENTER = 8
const anchor = ref({ x: hikerSpot.value.x, z: hikerSpot.value.z })
watch(hikerSpot, (spot) => {
  const dx = spot.x - anchor.value.x
  const dz = spot.z - anchor.value.z
  if (dx * dx + dz * dz < RECENTER * RECENTER) return
  anchor.value = { x: spot.x, z: spot.z }
})
const viewW = 260
const pad = 12

const mountainWorld: Array<[number, number]> = [
  [-118, -96],
  [-140, -132],
  [-134, -176],
  [-120, -228],
  [120, -228],
  [134, -176],
  [140, -132],
  [118, -96],
]

const slopeWorld: Array<[number, number]> = [
  [-72, -96],
  [-96, -128],
  [-88, -176],
  [-70, -214],
  [70, -214],
  [88, -176],
  [96, -128],
  [72, -96],
]

const ridgeWorld: Array<[number, number]> = [
  [-96, -168],
  [-48, -180],
  [0, -176],
  [48, -184],
  [96, -168],
]

/** Tudo o que o mapa grande tem de mostrar. Novos sítios entram nesta caixa. */
const world = computed(() => {
  const xs: number[] = []
  const zs: number[] = []
  const mark = (x: number, z: number) => {
    xs.push(x)
    zs.push(z)
  }
  for (const [x, z] of [...mountainWorld, ...slopeWorld, ...ridgeWorld, ...cavado]) mark(x, z)
  for (const node of pathNodes) mark(node[0], node[2])
  for (const step of steps) mark(step.position[0], step.position[2])
  mark(ATELIER.x, ATELIER.z)
  mark(summit.x, summit.z)
  mark(PITCH_X - PITCH_HALF_X, PITCH_Z - PITCH_HALF_Z)
  mark(PITCH_X + PITCH_HALF_X, PITCH_Z + PITCH_HALF_Z)
  mark(RING_X - RING_HALF, RING_Z - RING_HALF)
  mark(RING_X + RING_HALF, RING_Z + RING_HALF)
  mark(VINYL_X - 4, VINYL_Z - 4)
  mark(VINYL_X + 4, VINYL_Z + 4)
  mark(0, -340)
  mark(0, 240)
  const margin = 20
  return {
    minX: Math.min(...xs) - margin,
    maxX: Math.max(...xs) + margin,
    minZ: Math.min(...zs) - margin,
    maxZ: Math.max(...zs) + margin,
  }
})

const frame = computed(() => {
  if (props.wide) return world.value
  const half = MINI_SPAN / 2
  return {
    minX: anchor.value.x - half,
    maxX: anchor.value.x + half,
    minZ: anchor.value.z - half,
    maxZ: anchor.value.z + half,
  }
})

const spanX = computed(() => frame.value.maxX - frame.value.minX)
const spanZ = computed(() => frame.value.maxZ - frame.value.minZ)
const viewH = computed(() => (props.wide ? Math.round(viewW * (spanZ.value / spanX.value)) : viewW))
const scale = computed(() => (viewW - pad * 2) / spanX.value)
const waterWidth = computed(() => Math.max(2, CAVADO_HALF * 2 * scale.value))
const bankWidth = computed(() => waterWidth.value + 10 * scale.value)
const trailWidth = computed(() => Math.max(2.2, 6.6 * scale.value))

function X(x: number) {
  return pad + ((x - frame.value.minX) / spanX.value) * (viewW - pad * 2)
}

function Y(z: number) {
  return pad + ((z - frame.value.minZ) / spanZ.value) * (viewH.value - pad * 2)
}

function line(points: Array<[number, number]>) {
  return points.map(([x, z]) => `${X(x)},${Y(z)}`).join(' ')
}

const mountain = computed(() => line(mountainWorld))
const slope = computed(() => line(slopeWorld))
const ridge = computed(() => line(ridgeWorld))
const river = computed(() => line(cavado))
const trail = computed(() => pathNodes.map((node) => `${X(node[0])},${Y(node[2])}`).join(' '))

const places = computed(() =>
  steps.map((step) => ({
    id: step.id,
    x: X(step.position[0]),
    y: Y(step.position[2]),
    color: step.kind === 'work' ? '#8a4632' : step.kind === 'personal' ? '#8a6a32' : '#0e3328',
  })),
)

const atelier = computed(() => ({ x: X(ATELIER.x), y: Y(ATELIER.z) }))
const chapel = computed(() => ({ x: X(summit.x), y: Y(summit.z) }))
const pitch = computed(() => {
  const x0 = X(PITCH_X - PITCH_HALF_X)
  const x1 = X(PITCH_X + PITCH_HALF_X)
  const y0 = Y(PITCH_Z - PITCH_HALF_Z)
  const y1 = Y(PITCH_Z + PITCH_HALF_Z)
  return {
    x: Math.min(x0, x1),
    y: Math.min(y0, y1),
    w: Math.abs(x1 - x0),
    h: Math.abs(y1 - y0),
  }
})

const ring = computed(() => {
  const x0 = X(RING_X - RING_HALF)
  const x1 = X(RING_X + RING_HALF)
  const y0 = Y(RING_Z - RING_HALF)
  const y1 = Y(RING_Z + RING_HALF)
  const w = Math.max(Math.abs(x1 - x0), props.wide ? 5 : 6)
  const h = Math.max(Math.abs(y1 - y0), props.wide ? 5 : 6)
  return {
    x: (x0 + x1) / 2 - w / 2,
    y: (y0 + y1) / 2 - h / 2,
    w,
    h,
  }
})

function worldX(svgX: number) {
  return frame.value.minX + ((svgX - pad) / (viewW - pad * 2)) * spanX.value
}

function worldZ(svgY: number) {
  return frame.value.minZ + ((svgY - pad) / (viewH.value - pad * 2)) * spanZ.value
}

function onPick(event: MouseEvent) {
  if (!props.wide) return
  const svg = event.currentTarget
  if (!(svg instanceof SVGSVGElement)) return
  const point = svg.createSVGPoint()
  point.x = event.clientX
  point.y = event.clientY
  const ctm = svg.getScreenCTM()
  if (!ctm) return
  const local = point.matrixTransform(ctm.inverse())
  emit('pick', { x: worldX(local.x), z: worldZ(local.y) })
}

const routeLine = computed(() => {
  const points = trailPoints.value
  if (!points.length) return ''
  const from: [number, number] = [hikerSpot.value.x, hikerSpot.value.z]
  return [from, ...points].map(([x, z]) => `${X(x)},${Y(z)}`).join(' ')
})

const pin = computed(() => {
  const goal = trailGoal.value
  if (!goal) return null
  return { x: X(goal.x), y: Y(goal.z) }
})

const vinyl = computed(() => ({ x: X(VINYL_X), y: Y(VINYL_Z) }))

const you = computed(() => {
  const x = X(hikerSpot.value.x)
  const y = Y(hikerSpot.value.z)
  if (!props.wide) return { x, y }
  return {
    x: Math.min(viewW - 8, Math.max(8, x)),
    y: Math.min(viewH.value - 8, Math.max(8, y)),
  }
})
</script>
