import {
  BoxGeometry,
  BufferGeometry,
  ConeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
} from 'three'
import { CAVADO_HALF, cavado } from '@/game/cavado'

/** A rampa do vale acaba aqui. A ponte segue em frente e atravessa o Cávado. */
const START = { x: 40, z: 72 }
const RAMP = 9
const DECK_HIGH = -4.7
const DECK_LOW = -7.96
const DECK_WIDTH = 4.6
const SLAB = 0.38

function centerline(x: number, z: number) {
  let best = Infinity
  let px = 0
  let pz = 0
  let fx = -1
  let fz = 0
  for (let i = 0; i < cavado.length - 1; i++) {
    const a = cavado[i]
    const b = cavado[i + 1]
    const abx = b[0] - a[0]
    const abz = b[1] - a[1]
    const len2 = abx * abx + abz * abz || 1
    const t = Math.min(1, Math.max(0, ((x - a[0]) * abx + (z - a[1]) * abz) / len2))
    const cx = a[0] + abx * t
    const cz = a[1] + abz * t
    const dist = Math.hypot(x - cx, z - cz)
    if (dist < best) {
      best = dist
      px = cx
      pz = cz
      const len = Math.sqrt(len2)
      fx = abx / len
      fz = abz / len
    }
  }
  return { dist: best, x: px, z: pz, fx, fz }
}

const river = centerline(START.x, START.z)
const DIR_X = (river.x - START.x) / river.dist
const DIR_Z = (river.z - START.z) / river.dist
const LENGTH = river.dist + CAVADO_HALF + 16
const YAW = Math.atan2(DIR_X, DIR_Z)

function deckTop(s: number) {
  if (s < RAMP) return DECK_LOW + (DECK_HIGH - DECK_LOW) * (s / RAMP)
  if (s > LENGTH - RAMP) return DECK_LOW + (DECK_HIGH - DECK_LOW) * ((LENGTH - s) / RAMP)
  return DECK_HIGH
}

function toWorld(lx: number, lz: number) {
  return {
    x: START.x + Math.sin(YAW) * lz + Math.cos(YAW) * lx,
    z: START.z + Math.cos(YAW) * lz - Math.sin(YAW) * lx,
  }
}

/** O montanhista está no tabuleiro, fora da água. */
export function onBridge(x: number, z: number) {
  const along = (x - START.x) * DIR_X + (z - START.z) * DIR_Z
  if (along < -0.4 || along > LENGTH + 0.4) return false
  const side = Math.hypot(x - (START.x + DIR_X * along), z - (START.z + DIR_Z * along))
  return side < DECK_WIDTH / 2 - 0.15
}

/** Folga para as árvores não nascerem em cima da ponte nem das rampas. */
export function bridgeBlocksTree(x: number, z: number) {
  const along = (x - START.x) * DIR_X + (z - START.z) * DIR_Z
  if (along < -2 || along > LENGTH + 2) return false
  const side = Math.hypot(x - (START.x + DIR_X * along), z - (START.z + DIR_Z * along))
  return side < DECK_WIDTH / 2 + 3.5
}

export function addRomanBridge(walkable: Group, scenery: Group) {
  const stone = new MeshStandardMaterial({ color: '#c4b49a', flatShading: true, roughness: 1 })
  const dark = new MeshStandardMaterial({ color: '#8d7b66', flatShading: true, roughness: 1 })
  const wet = new MeshStandardMaterial({ color: '#6f6256', flatShading: true, roughness: 0.92 })
  const geos: BufferGeometry[] = []
  const box = (w: number, h: number, d: number) => {
    const geometry = new BoxGeometry(w, h, d)
    geos.push(geometry)
    return geometry
  }

  const place = (
    mesh: Mesh,
    lx: number,
    ly: number,
    lz: number,
    parent: Group,
    tiltX = 0,
    tiltZ = 0,
  ) => {
    const world = toWorld(lx, lz)
    mesh.position.set(world.x, ly, world.z)
    mesh.rotation.order = 'YXZ'
    mesh.rotation.set(tiltX, YAW, tiltZ)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
  }

  const step = 2.15
  for (let s = step / 2; s < LENGTH; s += step) {
    const top = deckTop(s)
    const slab = new Mesh(box(DECK_WIDTH, SLAB, step + 0.12), stone)
    slab.userData.bridge = true
    place(slab, 0, top - SLAB / 2, s, walkable)
  }

  const parapet = (lx: number, s0: number, s1: number) => {
    const samples = 8
    for (let i = 0; i < samples; i++) {
      const a = s0 + ((s1 - s0) * i) / samples
      const b = s0 + ((s1 - s0) * (i + 1)) / samples
      const mid = (a + b) / 2
      const y0 = deckTop(a)
      const y1 = deckTop(b)
      const rise = y1 - y0
      const run = b - a
      const length = Math.hypot(run, rise)
      const rail = new Mesh(box(0.28, 0.82, length), stone)
      place(rail, lx, (y0 + y1) / 2 + 0.38, mid, scenery, -Math.atan2(rise, run))
    }
  }
  parapet(DECK_WIDTH / 2 - 0.08, 0.4, LENGTH - 0.4)
  parapet(-DECK_WIDTH / 2 + 0.08, 0.4, LENGTH - 0.4)

  const spanStart = RAMP + 1
  const spanEnd = LENGTH - RAMP - 1
  const arches = 5
  const bay = (spanEnd - spanStart) / arches
  for (let i = 0; i <= arches; i++) {
    const s = spanStart + bay * i
    const pier = new Mesh(box(DECK_WIDTH + 0.7, 3.5, 2.15), wet)
    place(pier, 0, -6.85, s, scenery)
    const nose = new Mesh(new ConeGeometry(1.05, 3.2, 4), wet)
    geos.push(nose.geometry)
    const withFlow = river.fx * DIR_Z - river.fz * DIR_X
    place(nose, -Math.sign(withFlow || 1) * (DECK_WIDTH / 2 + 1.05), -7.15, s, scenery, 0, -Math.PI / 2)
  }

  const opening = bay - 2.15
  const rise = 2.35
  const radius = (opening * opening) / 4 / (2 * rise) + rise / 2
  const pieces = 7
  for (let arch = 0; arch < arches; arch++) {
    const center = spanStart + bay * (arch + 0.5)
    for (let i = 0; i < pieces; i++) {
      const t0 = -opening / 2 + (opening * i) / pieces
      const t1 = -opening / 2 + (opening * (i + 1)) / pieces
      const crown = (t: number) => Math.sqrt(Math.max(0, radius * radius - t * t)) - (radius - rise)
      const y0 = crown(t0)
      const y1 = crown(t1)
      const run = t1 - t0
      const mid = (t0 + t1) / 2
      const length = Math.hypot(run, y1 - y0)
      const voussoir = new Mesh(box(DECK_WIDTH - 0.35, 0.55, length), dark)
      const soffit = DECK_HIGH - 0.42
      place(
        voussoir,
        0,
        soffit - rise + (y0 + y1) / 2,
        center + mid,
        scenery,
        -Math.atan2(y1 - y0, run),
      )
    }
  }

  const solids = walkable.userData.solids as { x: number; z: number; r: number }[]
  for (let s = 1.2; s < LENGTH; s += 1.7) {
    for (const side of [-1, 1]) {
      const world = toWorld(side * (DECK_WIDTH / 2 - 0.05), s)
      solids.push({ x: world.x, z: world.z, r: 0.42 })
    }
  }

  return geos
}
