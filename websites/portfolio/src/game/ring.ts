import { ref } from 'vue'
import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  TorusGeometry,
} from 'three'
import { ensureAmbience } from '@/game/ambience'
import { releaseHikeKeys } from '@/game/controls'

/** Cota do vale, a mesma de VALLEY_Y. O ringue assenta no chão plano, já fora da encosta. */
const VALLEY_Y = -8

/** A oeste da montanha, um pouco afastado do sopé. O flanco acaba em x = -140. */
export const RING_X = -176
export const RING_Z = -146
export const RING_TOP = VALLEY_Y + 0.28
export const RING_HALF = 3.4

/** Onde os pés ficam, de frente para o saco. */
export const RING_STANCE = { x: RING_X, z: RING_Z + 0.95 }
export const RING_EYE = 1.58

export const BAG_R = 0.24
export const BAG_H = 1
export const BAG_DROP = 1.42
export const BAG_PIVOT_Y = RING_TOP + 2.62

export const ringNear = ref(false)
/** Primeira pessoa, de frente para o saco. */
export const sparring = ref(false)
/** Sobe quando se pede um soco. O ringue é que o executa. */
export const ringPunch = ref(0)
/** Lado do ecrã onde o toque caiu. */
export const ringPunchSide = ref<'left' | 'right'>('right')

export function updateRingNear(x: number, y: number, z: number, ready: boolean) {
  if (!ready || sparring.value) {
    ringNear.value = false
    return
  }
  const dx = Math.abs(x - RING_X)
  const dz = Math.abs(z - RING_Z)
  ringNear.value = dx < RING_HALF + 1.8 && dz < RING_HALF + 2.4 && Math.abs(y - RING_TOP) < 2.2
}

export function enterRing() {
  if (!ringNear.value || sparring.value) return
  ensureAmbience()
  releaseHikeKeys()
  sparring.value = true
  ringNear.value = false
}

export function leaveRing() {
  if (!sparring.value) return
  sparring.value = false
  releaseHikeKeys()
}

export function askPunch(side: 'left' | 'right' = 'right') {
  if (!sparring.value) return
  ensureAmbience()
  ringPunchSide.value = side
  ringPunch.value += 1
}

/** Folga para as árvores não nascerem no ringue nem no corredor a sul. */
export function ringBlocksTree(x: number, z: number) {
  const dx = x - RING_X
  const dz = z - RING_Z
  if (dx * dx + dz * dz < 13 * 13) return true
  return Math.abs(dx) < 8 && dz > 0 && dz < 28
}

function signTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D indisponível')
  ctx.fillStyle = '#f7f3ea'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#8a3030'
  ctx.fillRect(0, 0, canvas.width, 18)
  ctx.fillRect(0, canvas.height - 18, canvas.width, 18)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#8a3030'
  ctx.font = '600 92px Outfit, sans-serif'
  ctx.fillText('Ringue', 256, 132)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export function addRing(walkable: Group, scenery: Group) {
  const canvasMat = new MeshStandardMaterial({ color: '#1d4e7a', flatShading: true, roughness: 1 })
  const skirtMat = new MeshStandardMaterial({ color: '#16324f', flatShading: true, roughness: 1 })
  const ropeMat = new MeshStandardMaterial({ color: '#f4efe4', flatShading: true, roughness: 0.85 })
  const postMat = new MeshStandardMaterial({ color: '#f7f3ea', flatShading: true, roughness: 0.9 })
  const capMat = new MeshStandardMaterial({ color: '#b42318', flatShading: true, roughness: 0.85 })
  const metal = new MeshStandardMaterial({
    color: '#3c4652',
    flatShading: true,
    roughness: 0.45,
    metalness: 0.35,
  })
  const cream = new MeshStandardMaterial({ color: '#f4efe4', flatShading: true, roughness: 0.9 })
  const wood = new MeshStandardMaterial({ color: '#5c4032', flatShading: true, roughness: 1 })

  const skirt = new Mesh(new BoxGeometry(RING_HALF * 2 + 0.7, 0.26, RING_HALF * 2 + 0.7), skirtMat)
  skirt.position.set(RING_X, RING_TOP - 0.2, RING_Z)
  skirt.receiveShadow = true
  scenery.add(skirt)

  const floor = new Mesh(new BoxGeometry(RING_HALF * 2, 0.1, RING_HALF * 2), canvasMat)
  floor.position.set(RING_X, RING_TOP - 0.05, RING_Z)
  floor.receiveShadow = true
  walkable.add(floor)

  const apron = new Mesh(new BoxGeometry(2.2, 0.1, 1.25), canvasMat)
  apron.position.set(RING_X, RING_TOP - 0.05, RING_Z + RING_HALF + 0.52)
  apron.receiveShadow = true
  walkable.add(apron)

  const mark = new Mesh(new CylinderGeometry(0.9, 0.9, 0.02, 10), cream)
  mark.position.set(RING_X, RING_TOP + 0.012, RING_Z)
  mark.receiveShadow = true
  scenery.add(mark)

  const ropeY = [0.48, 0.94, 1.34]
  const edge = RING_HALF
  const gap = 0.85

  const ropeX = (x: number, z: number, length: number, y: number) => {
    const mesh = new Mesh(new BoxGeometry(length, 0.045, 0.045), ropeMat)
    mesh.position.set(RING_X + x, RING_TOP + y, RING_Z + z)
    mesh.castShadow = true
    scenery.add(mesh)
  }
  const ropeZ = (x: number, z: number, length: number, y: number) => {
    const mesh = new Mesh(new BoxGeometry(0.045, 0.045, length), ropeMat)
    mesh.position.set(RING_X + x, RING_TOP + y, RING_Z + z)
    mesh.castShadow = true
    scenery.add(mesh)
  }

  for (const y of ropeY) {
    ropeX(0, -edge, edge * 2, y)
    ropeZ(-edge, 0, edge * 2, y)
    ropeZ(edge, 0, edge * 2, y)
    const span = edge - gap
    ropeX(-(edge + gap) / 2, edge, span, y)
    ropeX((edge + gap) / 2, edge, span, y)
  }

  const post = (x: number, z: number) => {
    const mesh = new Mesh(new CylinderGeometry(0.065, 0.075, 1.52, 6), postMat)
    mesh.position.set(RING_X + x, RING_TOP + 0.76, RING_Z + z)
    mesh.castShadow = true
    scenery.add(mesh)
    const cap = new Mesh(new BoxGeometry(0.18, 0.08, 0.18), capMat)
    cap.position.set(RING_X + x, RING_TOP + 1.54, RING_Z + z)
    cap.castShadow = true
    scenery.add(cap)
  }
  post(-edge, -edge)
  post(edge, -edge)
  post(-edge, edge)
  post(edge, edge)

  const gantryH = BAG_PIVOT_Y - RING_TOP
  for (const side of [-1, 1]) {
    const upright = new Mesh(new CylinderGeometry(0.045, 0.05, gantryH, 6), metal)
    upright.position.set(RING_X + side * 2.2, RING_TOP + gantryH / 2, RING_Z)
    upright.castShadow = true
    scenery.add(upright)
  }
  const bar = new Mesh(new BoxGeometry(4.7, 0.08, 0.08), metal)
  bar.position.set(RING_X, BAG_PIVOT_Y, RING_Z)
  bar.castShadow = true
  scenery.add(bar)
  const hook = new Mesh(new TorusGeometry(0.08, 0.018, 5, 8), metal)
  hook.position.set(RING_X, BAG_PIVOT_Y - 0.08, RING_Z)
  scenery.add(hook)

  const texture = signTexture()
  const sign = new Mesh(
    new BoxGeometry(1.45, 0.72, 0.06),
    new MeshStandardMaterial({ map: texture, roughness: 1 }),
  )
  sign.position.set(RING_X, RING_TOP + 1.15, RING_Z + RING_HALF + 1.85)
  sign.castShadow = true
  scenery.add(sign)
  for (const x of [-0.55, 0.55]) {
    const pole = new Mesh(new CylinderGeometry(0.045, 0.055, 1.15, 6), wood)
    pole.position.set(RING_X + x, RING_TOP + 0.58, RING_Z + RING_HALF + 1.9)
    pole.castShadow = true
    scenery.add(pole)
  }

  const solids = walkable.userData.solids as { x: number; z: number; r: number }[]
  const corner = RING_HALF
  solids.push(
    { x: RING_X - corner, z: RING_Z - corner, r: 0.32 },
    { x: RING_X + corner, z: RING_Z - corner, r: 0.32 },
    { x: RING_X - corner, z: RING_Z + corner, r: 0.32 },
    { x: RING_X + corner, z: RING_Z + corner, r: 0.32 },
    { x: RING_X - 2.2, z: RING_Z, r: 0.28 },
    { x: RING_X + 2.2, z: RING_Z, r: 0.28 },
    { x: RING_X, z: RING_Z, r: 0.34 },
    { x: RING_X, z: RING_Z + RING_HALF + 1.85, r: 0.55 },
  )
}
