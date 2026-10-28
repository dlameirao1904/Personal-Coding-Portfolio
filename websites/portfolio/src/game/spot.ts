import { reactive, ref } from 'vue'
import { SPAWN } from '@/data/journey'

/** Posição do montanhista no chão, para o mapa. */
export const hikerSpot = ref({ x: SPAWN[0], z: SPAWN[2] })

/** Pose do montanhista em cada frame. O Atlas lê isto diretamente. */
export const hikerPose = {
  x: SPAWN[0],
  y: SPAWN[1],
  z: SPAWN[2],
  yaw: Math.PI,
  /** Inclinação da câmara. Em baixo mira rasteiro, em cima mira ao travessão. */
  look: 0.42,
  visible: true,
  ready: false,
}

/** Trotinete no chão. Só anda quando o montanhista sobe. */
export const scooter = reactive({ on: false, x: 0, y: 0, z: 0, yaw: 0 })
export const ridingScooter = ref(false)
export const scooterNear = ref(false)

/** O terminal do menu está aberto, por isso o trilho ignora o teclado. */
export const terminalOpen = ref(false)

export function callScooter() {
  if (ridingScooter.value) {
    ridingScooter.value = false
    return 'dismount' as const
  }
  if (scooter.on) return 'already' as const
  const yaw = hikerPose.yaw
  scooter.x = hikerPose.x + Math.sin(yaw) * 2.6
  scooter.z = hikerPose.z + Math.cos(yaw) * 2.6
  scooter.y = hikerPose.y
  scooter.yaw = yaw
  scooter.on = true
  return 'spawn' as const
}

export function mountScooter() {
  if (!scooter.on || ridingScooter.value) return
  ridingScooter.value = true
}

/** Tira a trotinete do mapa, esteja ela parada ou com o montanhista em cima. */
export function dismissScooter() {
  const present = scooter.on || ridingScooter.value
  ridingScooter.value = false
  scooter.on = false
  scooterNear.value = false
  return present ? ('removed' as const) : ('absent' as const)
}

/** O Atlas senta-se a olhar para o montanhista. */
export const atlasGreeting = ref(false)
export const atlasLine = ref<string | null>(null)
let atlasTimer = 0

let atlasStamp = 0

export function greetAtlas() {
  const now = performance.now()
  if (now - atlasStamp < 450) return false
  atlasStamp = now
  atlasGreeting.value = true
  atlasLine.value = 'Olá! Eu sou o Atlas, e adoro andar contigo 🐾💛'
  window.clearTimeout(atlasTimer)
  atlasTimer = window.setTimeout(() => {
    atlasGreeting.value = false
    atlasLine.value = null
  }, 4600)
  return true
}

/** A Marina olha para quem clicou. Com o Atlas, sai dos bolos para brincar. */
export const marinaGreeting = ref(false)
export const marinaLine = ref<string | null>(null)
/** A Marina estava a brincar com o Atlas, por isso para e acena. */
export const marinaWave = ref(false)
export const atlasPlaying = ref(false)
export type MarinaPlay = 'bake' | 'run' | 'pet' | 'bite'
export const marinaSpot = {
  x: -40,
  y: 17.8,
  z: -115,
  yaw: Math.PI / 2,
  mode: 'bake' as MarinaPlay,
  ready: true,
}
let marinaTimer = 0

let marinaStamp = 0

export function greetMarina() {
  const now = performance.now()
  if (now - marinaStamp < 450) return false
  marinaStamp = now
  const playing = atlasPlaying.value
  marinaWave.value = playing
  marinaGreeting.value = true
  marinaLine.value = playing
    ? 'Olá! Estava a brincar com o Atlas 🐾💛'
    : 'Olá! Eu sou a Marina, e fico tão feliz por te ver 💛'
  window.clearTimeout(marinaTimer)
  marinaTimer = window.setTimeout(() => {
    marinaGreeting.value = false
    marinaWave.value = false
    marinaLine.value = null
  }, 4600)
  return true
}
