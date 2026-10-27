import { ref } from 'vue'
import { cakePlace } from '@/game/ambience'
import { atelierLocal, ATELIER } from '@/game/atelier'
import { releaseHikeKeys } from '@/game/controls'

export const CAKE_STEPS = [
  { id: 'sponge', name: 'Pão de ló', put: 'Põe o pão de ló', wait: 'A seguir é o pão de ló.' },
  { id: 'cream', name: 'Creme', put: 'Põe o creme', wait: 'A seguir é o creme.' },
  {
    id: 'sponge-2',
    name: 'Pão de ló',
    put: 'Põe outro pão de ló',
    wait: 'A seguir é outro pão de ló.',
  },
  { id: 'icing', name: 'Cobertura', put: 'Põe a cobertura', wait: 'A seguir é a cobertura.' },
  {
    id: 'flower',
    name: 'Decoração',
    put: 'Põe uma decoração',
    wait: 'A seguir é a decoração.',
  },
  { id: 'candle', name: 'Vela', put: 'Põe a vela', wait: 'A seguir é a vela.' },
] as const

/** Na sala ou à porta, de frente para a mesa. */
export const atelierNear = ref(false)
/** Primeira pessoa, a montar o bolo. */
export const baking = ref(false)
/** Camadas já postas, da base para a vela. */
export const cakePlaced = ref(0)
export const cakeHint = ref('')

let hintTimer = 0

export function updateAtelierNear(x: number, y: number, z: number, ready: boolean) {
  if (!ready || baking.value) {
    atelierNear.value = false
    return
  }
  const local = atelierLocal(x, z)
  atelierNear.value =
    Math.abs(y - ATELIER.y) < 1.8 && Math.abs(local.x) < 2.2 && local.z > -2.1 && local.z < 2.5
}

export function enterAtelier() {
  if (!atelierNear.value || baking.value) return
  releaseHikeKeys()
  cakePlaced.value = 0
  cakeHint.value = ''
  window.clearTimeout(hintTimer)
  baking.value = true
  atelierNear.value = false
}

export function leaveAtelier() {
  if (!baking.value) return
  baking.value = false
  cakeHint.value = ''
  window.clearTimeout(hintTimer)
  releaseHikeKeys()
}

export function placeCakeLayer(index: number) {
  if (!baking.value || cakePlaced.value >= CAKE_STEPS.length) return false
  if (index !== cakePlaced.value) {
    cakeHint.value = CAKE_STEPS[cakePlaced.value].wait
    window.clearTimeout(hintTimer)
    hintTimer = window.setTimeout(() => {
      cakeHint.value = ''
    }, 2400)
    return false
  }
  cakePlaced.value += 1
  cakeHint.value = ''
  window.clearTimeout(hintTimer)
  cakePlace(cakePlaced.value === CAKE_STEPS.length)
  return true
}
