import { reactive } from 'vue'

export const hikeKeys = reactive({
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
  ' ': false,
  Shift: false,
})

/** Analog move from the on-screen stick. x is strafe, y is forward, each in [-1, 1]. */
export const hikeStick = reactive({ x: 0, y: 0 })

export type HikeKey = keyof typeof hikeKeys

const named: Record<string, HikeKey> = {
  arrowup: 'ArrowUp',
  arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight',
  w: 'w',
  a: 'a',
  s: 's',
  d: 'd',
  ' ': ' ',
  shift: 'Shift',
}

export function setHikeKey(key: HikeKey, down: boolean) {
  hikeKeys[key] = down
}

export function setHikeStick(x: number, y: number) {
  hikeStick.x = x
  hikeStick.y = y
}

export function setHikeKeyFromEvent(event: KeyboardEvent, down: boolean) {
  const raw = event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase()
  const key = named[raw]
  if (!key) return false
  hikeKeys[key] = down
  return true
}

export function releaseHikeKeys() {
  for (const key of Object.keys(hikeKeys) as HikeKey[]) hikeKeys[key] = false
  hikeStick.x = 0
  hikeStick.y = 0
}
