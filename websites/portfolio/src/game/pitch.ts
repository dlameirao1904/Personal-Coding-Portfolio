import { reactive, ref } from 'vue'
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

/** Campo a sul do Cávado, alinhado com a saída da ponte. */
export const PITCH_X = 69
export const PITCH_Z = 202
export const PITCH_HALF_X = 17
export const PITCH_HALF_Z = 26
export const PITCH_TOP = -7.92

export const GOAL_HALF = 3.66
export const GOAL_HEIGHT = 2.44
export const GOAL_Z = PITCH_Z + PITCH_HALF_Z
export const SPOT = { x: PITCH_X, z: GOAL_Z - 11 }
export const BALL_R = 0.16

export type PenaltyCall = '' | 'golo' | 'defesa' | 'fora' | 'trave'

export const penalty = reactive({
  near: false,
  call: '' as PenaltyCall,
  goals: 0,
  saves: 0,
})

/** Sobe quando se carrega para chutar. O campo é que dispara o remate. */
export const penaltyKick = ref(0)

export function askPenalty() {
  penaltyKick.value += 1
}

/** Folga para as árvores não nascerem no relvado nem na entrada. */
export function pitchBlocksTree(x: number, z: number) {
  return Math.abs(x - PITCH_X) < PITCH_HALF_X + 5 && Math.abs(z - PITCH_Z) < PITCH_HALF_Z + 8
}

function boardTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D indisponível')
  ctx.fillStyle = '#f7f3ea'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#1c6b32'
  ctx.fillRect(0, 0, canvas.width, 18)
  ctx.fillRect(0, canvas.height - 18, canvas.width, 18)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#1c6b32'
  ctx.font = '600 84px Outfit, sans-serif'
  ctx.fillText('O Rolo', 256, 128)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export function addPitch(walkable: Group, scenery: Group) {
  const dark = new MeshStandardMaterial({ color: '#246b38', flatShading: true, roughness: 1 })
  const light = new MeshStandardMaterial({ color: '#318445', flatShading: true, roughness: 1 })
  const white = new MeshStandardMaterial({ color: '#f4f7f2', flatShading: true, roughness: 0.85 })
  const wood = new MeshStandardMaterial({ color: '#5c4032', flatShading: true, roughness: 1 })
  const net = new MeshStandardMaterial({ color: '#e7eee8', flatShading: true, roughness: 1 })

  const pad = new Mesh(new BoxGeometry(PITCH_HALF_X * 2, 0.16, PITCH_HALF_Z * 2), dark)
  pad.position.set(PITCH_X, PITCH_TOP - 0.08, PITCH_Z)
  pad.receiveShadow = true
  walkable.add(pad)

  const stripeDepth = (PITCH_HALF_Z * 2) / 8
  for (let i = 0; i < 8; i++) {
    const stripe = new Mesh(
      new BoxGeometry(PITCH_HALF_X * 2 - 0.3, 0.02, stripeDepth - 0.08),
      i % 2 ? light : dark,
    )
    stripe.position.set(PITCH_X, PITCH_TOP + 0.01, PITCH_Z - PITCH_HALF_Z + stripeDepth * (i + 0.5))
    stripe.receiveShadow = true
    scenery.add(stripe)
  }

  const line = (width: number, depth: number, x: number, z: number) => {
    const mesh = new Mesh(new BoxGeometry(width, 0.025, depth), white)
    mesh.position.set(x, PITCH_TOP + 0.03, z)
    mesh.receiveShadow = true
    scenery.add(mesh)
  }

  const touch = 0.12
  line(PITCH_HALF_X * 2, touch, PITCH_X, PITCH_Z - PITCH_HALF_Z)
  line(PITCH_HALF_X * 2, touch, PITCH_X, PITCH_Z + PITCH_HALF_Z)
  line(touch, PITCH_HALF_Z * 2, PITCH_X - PITCH_HALF_X, PITCH_Z)
  line(touch, PITCH_HALF_Z * 2, PITCH_X + PITCH_HALF_X, PITCH_Z)
  line(PITCH_HALF_X * 2, touch, PITCH_X, PITCH_Z)

  const ring = new Mesh(new TorusGeometry(4.2, 0.06, 6, 36), white)
  ring.rotation.x = Math.PI / 2
  ring.position.set(PITCH_X, PITCH_TOP + 0.03, PITCH_Z)
  scenery.add(ring)

  const boxW = 16.4
  const boxD = 9.2
  const boxZ = GOAL_Z - boxD / 2
  line(boxW, touch, PITCH_X, GOAL_Z - boxD)
  line(touch, boxD, PITCH_X - boxW / 2, boxZ)
  line(touch, boxD, PITCH_X + boxW / 2, boxZ)

  const spot = new Mesh(new CylinderGeometry(0.12, 0.12, 0.03, 12), white)
  spot.position.set(SPOT.x, PITCH_TOP + 0.02, SPOT.z)
  scenery.add(spot)

  const post = (x: number) => {
    const mesh = new Mesh(new CylinderGeometry(0.06, 0.06, GOAL_HEIGHT, 8), white)
    mesh.position.set(x, PITCH_TOP + GOAL_HEIGHT / 2, GOAL_Z)
    mesh.castShadow = true
    scenery.add(mesh)
  }
  post(PITCH_X - GOAL_HALF)
  post(PITCH_X + GOAL_HALF)
  const bar = new Mesh(new BoxGeometry(GOAL_HALF * 2 + 0.12, 0.12, 0.12), white)
  bar.position.set(PITCH_X, PITCH_TOP + GOAL_HEIGHT, GOAL_Z)
  bar.castShadow = true
  scenery.add(bar)

  const backZ = GOAL_Z + 1.15
  for (let i = 0; i <= 6; i++) {
    const x = PITCH_X - GOAL_HALF + (GOAL_HALF * 2 * i) / 6
    const cord = new Mesh(new BoxGeometry(0.03, GOAL_HEIGHT, 0.03), net)
    cord.position.set(x, PITCH_TOP + GOAL_HEIGHT / 2, backZ)
    scenery.add(cord)
  }
  for (let i = 0; i <= 3; i++) {
    const y = PITCH_TOP + (GOAL_HEIGHT * i) / 3
    const cord = new Mesh(new BoxGeometry(GOAL_HALF * 2, 0.03, 0.03), net)
    cord.position.set(PITCH_X, y, backZ)
    scenery.add(cord)
  }
  for (const side of [-1, 1]) {
    const x = PITCH_X + side * GOAL_HALF
    const wall = new Mesh(new BoxGeometry(0.03, GOAL_HEIGHT, 1.15), net)
    wall.position.set(x, PITCH_TOP + GOAL_HEIGHT / 2, GOAL_Z + 0.58)
    scenery.add(wall)
  }

  const texture = boardTexture()
  const signMat = new MeshStandardMaterial({ map: texture, roughness: 1 })
  const sign = new Mesh(new BoxGeometry(1.7, 0.85, 0.06), signMat)
  sign.position.set(PITCH_X - 6, PITCH_TOP + 1.45, PITCH_Z - PITCH_HALF_Z - 1.6)
  sign.rotation.y = Math.PI
  sign.castShadow = true
  scenery.add(sign)
  for (const x of [-0.7, 0.7]) {
    const pole = new Mesh(new CylinderGeometry(0.05, 0.06, 1.5, 6), wood)
    pole.position.set(PITCH_X - 6 + x, PITCH_TOP + 0.75, PITCH_Z - PITCH_HALF_Z - 1.65)
    pole.castShadow = true
    scenery.add(pole)
  }

  const solids = walkable.userData.solids as { x: number; z: number; r: number }[]
  solids.push(
    { x: PITCH_X - GOAL_HALF, z: GOAL_Z, r: 0.34 },
    { x: PITCH_X + GOAL_HALF, z: GOAL_Z, r: 0.34 },
  )
}
