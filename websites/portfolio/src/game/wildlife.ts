import {
  BoxGeometry,
  DodecahedronGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  type Object3D,
} from 'three'
import { cavado, waterSurfaceY } from '@/game/cavado'
import { treesAround, openValley, type ForestTree } from '@/game/buildTrail'

const GROUND = -8
const ROCK_MAX = 1.4

type Cover = { x: number; z: number; r: number; climb: number | null }

type Walker = {
  root: Group
  bob: Object3D
  x: number
  z: number
  y: number
  yaw: number
  hop: number
  alert: boolean
  calm: number
  cover: Cover | null
  homeX: number
  homeZ: number
  goalX: number
  goalZ: number
  climb: boolean
}

type Bird = {
  root: Group
  left: Object3D
  right: Object3D
  eagle: boolean
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  yaw: number
  mode: 'fly' | 'land' | 'sit' | 'takeoff'
  timer: number
  phase: number
  tx: number
  ty: number
  tz: number
}

type Fish = {
  root: Group
  tail: Object3D
  along: number
  dir: number
  speed: number
  phase: number
  sway: number
  depth: number
  /** 0 debaixo de água, 1 à superfície. */
  rise: number
  mode: 'deep' | 'up' | 'top' | 'down'
  timer: number
}

const materials = new Map<string, MeshStandardMaterial>()

function paint(color: string) {
  let material = materials.get(color)
  if (!material) {
    material = new MeshStandardMaterial({ color, flatShading: true, roughness: 0.86, metalness: 0 })
    materials.set(color, material)
  }
  return material
}

function mulberry(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function riverSamples() {
  const samples: Array<{ x: number; z: number; tx: number; tz: number }> = []
  for (let i = 0; i < cavado.length - 1; i++) {
    const a = cavado[i]
    const b = cavado[i + 1]
    const dx = b[0] - a[0]
    const dz = b[1] - a[1]
    const len = Math.hypot(dx, dz) || 1
    const steps = Math.max(1, Math.ceil(len / 2))
    for (let step = i === 0 ? 0 : 1; step <= steps; step++) {
      const t = step / steps
      samples.push({ x: a[0] + dx * t, z: a[1] + dz * t, tx: dx / len, tz: dz / len })
    }
  }
  return samples
}

function sees(x: number, z: number, yaw: number, px: number, pz: number, range: number) {
  const dx = px - x
  const dz = pz - z
  const dist = Math.hypot(dx, dz)
  if (dist > range || dist < 0.2) return false
  return (Math.sin(yaw) * dx + Math.cos(yaw) * dz) / dist > 0.28
}

function farSide(x: number, z: number, radius: number, px: number, pz: number) {
  const dx = x - px
  const dz = z - pz
  const len = Math.hypot(dx, dz) || 1
  return { x: x + (dx / len) * (radius + 0.6), z: z + (dz / len) * (radius + 0.6) }
}

let updateWildlife: ((dt: number, px: number, py: number, pz: number) => void) | null = null

export function mountWildlife(scenery: Group, walkable: Group) {
  const rnd = mulberry(0x51f1e)
  const samples = riverSamples()
  const solids = walkable.userData.solids as { x: number; z: number; r: number }[]
  const rockGeo = new DodecahedronGeometry(0.5, 0)
  const rocks: Array<{ x: number; z: number; r: number }> = []

  for (let n = 0; n < 24; n++) {
    let x = 0
    let z = 0
    let clear = false
    for (let attempt = 0; attempt < 24; attempt++) {
      x = -170 + rnd() * 340
      z = -10 + rnd() * 150
      clear = openValley(x, z) && treesAround(x, z, 2.2).length === 0
      if (clear) break
    }
    if (!clear) continue
    const height = 0.5 + rnd() * (ROCK_MAX - 0.5)
    const rock = new Mesh(rockGeo, paint(rnd() > 0.5 ? '#8a847c' : '#6f6a64'))
    rock.scale.set(height * 0.85, height, height * 0.75)
    rock.position.set(x, GROUND + height * 0.46, z)
    rock.rotation.y = rnd() * Math.PI
    rock.castShadow = true
    rock.receiveShadow = true
    scenery.add(rock)
    const radius = height * 0.42
    rocks.push({ x, z, r: radius })
    solids.push({ x, z, r: radius })
  }

  const bodyGeo = new SphereGeometry(0.16, 6, 4)
  const earGeo = new BoxGeometry(0.05, 0.16, 0.02)
  const tailGeo = new SphereGeometry(0.1, 5, 4)

  function makeRabbit() {
    const bob = new Group()
    const body = new Mesh(bodyGeo, paint('#c4aa90'))
    body.scale.set(1.35, 0.8, 1.05)
    body.position.y = 0.16
    const head = new Mesh(bodyGeo, paint('#d2bba4'))
    head.scale.set(0.7, 0.65, 0.7)
    head.position.set(0, 0.28, 0.12)
    const earL = new Mesh(earGeo, paint('#c4aa90'))
    const earR = new Mesh(earGeo, paint('#c4aa90'))
    earL.position.set(-0.05, 0.44, 0.1)
    earR.position.set(0.05, 0.44, 0.1)
    const tail = new Mesh(tailGeo, paint('#f4efe6'))
    tail.position.set(0, 0.16, -0.16)
    bob.add(body, head, earL, earR, tail)
    const root = new Group()
    root.add(bob)
    scenery.add(root)
    return { root, bob }
  }

  function makeSquirrel() {
    const bob = new Group()
    const body = new Mesh(bodyGeo, paint('#a35b2a'))
    body.scale.set(1.15, 0.7, 1.35)
    body.position.y = 0.12
    const head = new Mesh(bodyGeo, paint('#b86b34'))
    head.scale.set(0.55, 0.5, 0.55)
    head.position.set(0, 0.22, 0.14)
    const tail = new Mesh(tailGeo, paint('#8a4b22'))
    tail.scale.set(0.7, 1.5, 0.7)
    tail.position.set(0, 0.24, -0.16)
    bob.add(body, head, tail)
    const root = new Group()
    root.add(bob)
    scenery.add(root)
    return { root, bob }
  }

  function spawnWalker(climb: boolean, count: number): Walker[] {
    const list: Walker[] = []
    for (let n = 0; n < count; n++) {
      let x = 0
      let z = 0
      let placed = false
      for (let attempt = 0; attempt < 80; attempt++) {
        x = -280 + rnd() * 560
        z = -40 + rnd() * 320
        if (openValley(x, z) && treesAround(x, z, climb ? 8 : 3).length > 0) {
          placed = true
          break
        }
      }
      if (!placed) continue
      const parts = climb ? makeSquirrel() : makeRabbit()
      const animal: Walker = {
        ...parts,
        x,
        z,
        y: GROUND,
        yaw: rnd() * Math.PI * 2,
        hop: rnd() * Math.PI,
        alert: false,
        calm: 0,
        cover: null,
        homeX: x,
        homeZ: z,
        goalX: x,
        goalZ: z,
        climb,
      }
      list.push(animal)
      parts.root.position.set(x, GROUND, z)
      parts.root.rotation.y = animal.yaw
    }
    return list
  }

  const rabbits = spawnWalker(false, 84)
  const squirrels = spawnWalker(true, 90)

  const wingGeo = new BoxGeometry(0.4, 0.035, 0.16)
  const beakGeo = new BoxGeometry(0.06, 0.04, 0.08)

  function makeBird(eagle: boolean): Bird {
    const root = new Group()
    const body = new Mesh(bodyGeo, paint(eagle ? '#6b4423' : '#b7c0c8'))
    body.scale.set(eagle ? 1.7 : 0.85, eagle ? 0.85 : 0.5, eagle ? 2.2 : 1.15)
    const left = new Mesh(wingGeo, paint(eagle ? '#4a3018' : '#8d97a1'))
    const right = new Mesh(wingGeo, paint(eagle ? '#4a3018' : '#8d97a1'))
    const span = eagle ? 1.15 : 0.55
    left.scale.set(span, 1, eagle ? 1.4 : 1)
    right.scale.set(span, 1, eagle ? 1.4 : 1)
    left.position.x = -span * 0.28
    right.position.x = span * 0.28
    const head = new Mesh(bodyGeo, paint(eagle ? '#e6d3b3' : '#d5dde4'))
    head.scale.set(eagle ? 0.55 : 0.32, eagle ? 0.5 : 0.3, eagle ? 0.55 : 0.32)
    head.position.set(0, eagle ? 0.12 : 0.06, eagle ? 0.28 : 0.14)
    const beak = new Mesh(beakGeo, paint(eagle ? '#e2b15a' : '#d9893b'))
    beak.position.set(0, eagle ? 0.08 : 0.04, eagle ? 0.4 : 0.2)
    root.add(body, left, right, head, beak)
    scenery.add(root)
    const x = -280 + rnd() * 560
    const z = -80 + rnd() * 360
    const y = GROUND + (eagle ? 8 + rnd() * 5 : 3.2 + rnd() * 2.4)
    const yaw = rnd() * Math.PI * 2
    const speed = eagle ? 7.5 : 5
    root.position.set(x, y, z)
    root.rotation.y = yaw
    return {
      root,
      left,
      right,
      eagle,
      x,
      y,
      z,
      vx: Math.sin(yaw) * speed,
      vy: 0,
      vz: Math.cos(yaw) * speed,
      yaw,
      mode: 'fly',
      timer: 3 + rnd() * 8,
      phase: rnd() * Math.PI * 2,
      tx: x,
      ty: y,
      tz: z,
    }
  }

  const birds: Bird[] = []
  for (let n = 0; n < 60; n++) birds.push(makeBird(false))
  for (let n = 0; n < 45; n++) birds.push(makeBird(true))

  const fishGeo = new SphereGeometry(0.28, 7, 5)
  const fishTail = new BoxGeometry(0.06, 0.28, 0.32)
  const fishColors = ['#1a3330', '#243044', '#3a3428', '#163e42']
  const fishMin = 0
  const fishMax = Math.max(1, samples.length - 2)
  const fishCount = 150
  const fish: Fish[] = []
  for (let n = 0; n < fishCount; n++) {
    const color = fishColors[n % fishColors.length]
    const skin = new MeshStandardMaterial({
      color,
      roughness: 0.95,
      metalness: 0,
      flatShading: true,
    })
    const root = new Group()
    const body = new Mesh(fishGeo, skin)
    body.scale.set(1.05, 0.85, 2.8)
    const tail = new Mesh(fishTail, skin)
    tail.position.z = -0.72
    root.add(body, tail)
    root.renderOrder = 4
    root.traverse((child) => {
      child.frustumCulled = false
    })
    scenery.add(root)
    fish.push({
      root,
      tail,
      along: fishMin + ((fishMax - fishMin) * n) / fishCount,
      dir: n % 2 ? 1 : -1,
      speed: 0.42 + rnd() * 0.38,
      phase: rnd() * Math.PI * 2,
      sway: 10 + rnd() * 12,
      depth: 0.16 + rnd() * 0.22,
      rise: 0,
      mode: 'deep',
      timer: 4 + rnd() * 12,
    })
  }

  const place = (root: Object3D, x: number, y: number, z: number, yaw: number) => {
    root.position.set(x, y, z)
    root.rotation.y = yaw
  }

  const moveToward = (animal: Walker, tx: number, tz: number, speed: number, dt: number) => {
    const dx = tx - animal.x
    const dz = tz - animal.z
    const dist = Math.hypot(dx, dz)
    if (dist < 0.04) return 0
    const step = Math.min(dist, speed * dt)
    animal.x += (dx / dist) * step
    animal.z += (dz / dist) * step
    animal.yaw = Math.atan2(dx, dz)
    animal.hop += dt * (speed > 2 ? 16 : 8)
    return dist - step
  }

  const chooseCover = (animal: Walker, px: number, pz: number) => {
    let best: Cover | null = null
    let score = -Infinity
    const consider = (x: number, z: number, radius: number, climb: number | null, near: number) => {
      if (near > 18) return
      const spot = climb === null ? farSide(x, z, radius, px, pz) : { x, z }
      const away = Math.hypot(spot.x - px, spot.z - pz)
      const next = away - near * 0.4 + (animal.climb && climb !== null ? 6 : 0)
      if (next > score) {
        score = next
        best = { x, z, r: radius, climb }
      }
    }
    if (!animal.climb) {
      for (const rock of rocks)
        consider(rock.x, rock.z, rock.r, null, Math.hypot(rock.x - animal.x, rock.z - animal.z))
    }
    for (const tree of treesAround(animal.x, animal.z, 16)) {
      consider(
        tree.x,
        tree.z,
        0.9,
        animal.climb ? tree.climb : null,
        Math.hypot(tree.x - animal.x, tree.z - animal.z),
      )
    }
    animal.cover = best
  }

  const stepWalker = (animal: Walker, dt: number, px: number, pz: number) => {
    const dist = Math.hypot(px - animal.x, pz - animal.z)
    const spotted = sees(animal.x, animal.z, animal.yaw, px, pz, animal.climb ? 10 : 12)
    if (!animal.alert && spotted) {
      animal.alert = true
      animal.calm = 0
      chooseCover(animal, px, pz)
    }
    if (animal.alert && dist > (animal.climb ? 16 : 18)) {
      animal.calm += dt
      if (animal.calm > 1) {
        animal.alert = false
        animal.cover = null
      }
    } else if (animal.alert) animal.calm = 0

    let moving = false
    if (animal.alert && animal.cover) {
      if (animal.climb && animal.cover.climb !== null) {
        const left = moveToward(animal, animal.cover.x, animal.cover.z, 3.6, dt)
        moving = left > 0.2
        if (left < 0.4) animal.y = Math.min(animal.cover.climb, animal.y + dt * 2.1)
      } else {
        const spot = farSide(animal.cover.x, animal.cover.z, animal.cover.r, px, pz)
        moving = moveToward(animal, spot.x, spot.z, 4.4, dt) > 0.15
        animal.y = GROUND
      }
    } else if (animal.alert) {
      const dx = animal.x - px
      const dz = animal.z - pz
      const len = Math.hypot(dx, dz) || 1
      moving = moveToward(animal, animal.x + (dx / len) * 4, animal.z + (dz / len) * 4, 4.4, dt) > 0
      animal.y = GROUND
    } else {
      if (animal.y > GROUND + 0.05) animal.y = Math.max(GROUND, animal.y - dt * 1.6)
      else animal.y = GROUND
      if (Math.hypot(animal.goalX - animal.x, animal.goalZ - animal.z) < 0.4) {
        for (let attempt = 0; attempt < 6; attempt++) {
          const turn = rnd() * Math.PI * 2
          const nextX = animal.homeX + Math.sin(turn) * (2 + rnd() * 5)
          const nextZ = animal.homeZ + Math.cos(turn) * (2 + rnd() * 5)
          if (!openValley(nextX, nextZ)) continue
          animal.goalX = nextX
          animal.goalZ = nextZ
          break
        }
      }
      moving = moveToward(animal, animal.goalX, animal.goalZ, 2.4, dt) > 0.05
    }

    const hop = Math.abs(Math.sin(animal.hop)) * (moving ? 0.42 : 0.05)
    if (!moving) animal.hop += dt * 3
    const crouch = animal.alert && !moving && !animal.climb
    animal.bob.position.y = hop
    animal.bob.scale.y = crouch ? 0.62 : 1
    place(animal.root, animal.x, animal.y, animal.z, animal.yaw)
  }

  const pickBranch = (bird: Bird) => {
    const trees = treesAround(bird.x, bird.z, bird.eagle ? 90 : 48)
    if (!trees.length) return false
    const tree = trees[Math.floor(rnd() * trees.length)] as ForestTree
    bird.tx = tree.x
    bird.tz = tree.z
    bird.ty = tree.perch + (bird.eagle ? 0.4 : 0)
    return true
  }

  const stepBird = (bird: Bird, dt: number) => {
    bird.timer -= dt
    if (bird.mode === 'fly' && bird.timer <= 0) {
      if (pickBranch(bird)) bird.mode = 'land'
      else bird.timer = 4
    }
    if (bird.mode === 'sit' && bird.timer <= 0) bird.mode = 'takeoff'
    if (bird.mode === 'takeoff' && bird.y > bird.ty + (bird.eagle ? 6 : 3.5)) {
      bird.mode = 'fly'
      bird.timer = bird.eagle ? 10 + rnd() * 10 : 6 + rnd() * 8
    }

    const alt = GROUND + (bird.eagle ? 9 : 4.2)
    if (bird.mode === 'fly') {
      bird.yaw += Math.sin(bird.timer * 0.35 + bird.x * 0.01) * dt * 0.35
      const speed = bird.eagle ? 7.5 : 5
      bird.vx += (Math.sin(bird.yaw) * speed - bird.vx) * Math.min(1, dt * 1.4)
      bird.vz += (Math.cos(bird.yaw) * speed - bird.vz) * Math.min(1, dt * 1.4)
      bird.vy += (alt - bird.y) * dt * 1.6
      bird.vy *= Math.exp(-dt * 1.2)
    } else if (bird.mode === 'land') {
      const dx = bird.tx - bird.x
      const dy = bird.ty - bird.y
      const dz = bird.tz - bird.z
      bird.vx += dx * dt * 1.7
      bird.vy += dy * dt * 2.4
      bird.vz += dz * dt * 1.7
      bird.vx *= Math.exp(-dt * 0.7)
      bird.vy *= Math.exp(-dt * 0.7)
      bird.vz *= Math.exp(-dt * 0.7)
      if (dx * dx + dy * dy + dz * dz < 0.35) {
        bird.mode = 'sit'
        bird.timer = bird.eagle ? 7 + rnd() * 8 : 4 + rnd() * 6
        bird.vx = bird.vy = bird.vz = 0
        bird.x = bird.tx
        bird.y = bird.ty
        bird.z = bird.tz
      } else bird.yaw = Math.atan2(dx, dz)
    } else if (bird.mode === 'takeoff') {
      bird.vy += dt * (bird.eagle ? 14 : 18)
      bird.vx += Math.sin(bird.yaw) * dt * 8
      bird.vz += Math.cos(bird.yaw) * dt * 8
    }

    if (bird.mode !== 'sit') {
      bird.x += bird.vx * dt
      bird.y += bird.vy * dt
      bird.z += bird.vz * dt
    }
    const flap =
      bird.mode === 'sit'
        ? 1.15
        : 0.25 + Math.sin(performance.now() * (bird.eagle ? 0.01 : 0.024) + bird.phase) * 0.9
    bird.left.rotation.z = flap
    bird.right.rotation.z = -flap
    bird.root.position.set(bird.x, bird.y, bird.z)
    bird.root.rotation.y = bird.yaw
    bird.root.rotation.z = Math.max(-0.4, Math.min(0.4, -bird.vx * 0.04))
  }

  updateWildlife = (dt, px, _py, pz) => {
    for (const animal of rabbits) stepWalker(animal, dt, px, pz)
    for (const animal of squirrels) stepWalker(animal, dt, px, pz)
    for (const bird of birds) stepBird(bird, dt)
    const time = performance.now() * 0.001
    for (const swimmer of fish) {
      swimmer.along += swimmer.dir * swimmer.speed * dt
      if (swimmer.along >= fishMax) {
        swimmer.along = fishMax
        swimmer.dir = -1
      } else if (swimmer.along <= fishMin) {
        swimmer.along = fishMin
        swimmer.dir = 1
      }
      const i = Math.max(0, Math.min(samples.length - 2, Math.floor(swimmer.along)))
      const blend = swimmer.along - i
      const a = samples[i]
      const b = samples[Math.min(samples.length - 1, i + 1)]
      swimmer.timer -= dt
      if (swimmer.mode === 'deep' && swimmer.timer <= 0) swimmer.mode = 'up'
      if (swimmer.mode === 'up') {
        swimmer.rise = Math.min(1, swimmer.rise + dt * 1.5)
        if (swimmer.rise >= 1) {
          swimmer.mode = 'top'
          swimmer.timer = 1
        }
      } else if (swimmer.mode === 'top' && swimmer.timer <= 0) swimmer.mode = 'down'
      else if (swimmer.mode === 'down') {
        swimmer.rise = Math.max(0, swimmer.rise - dt * 1.3)
        if (swimmer.rise <= 0) {
          swimmer.mode = 'deep'
          swimmer.timer = 8 + Math.random() * 14
        }
      }
      const side = Math.sin(time * 0.35 + swimmer.phase) * swimmer.sway
      const tx = a.tx * swimmer.dir
      const tz = a.tz * swimmer.dir
      const submerged = waterSurfaceY() - swimmer.depth
      const surfaced = waterSurfaceY() + 0.05
      swimmer.root.position.set(
        a.x + (b.x - a.x) * blend - tz * side,
        submerged + (surfaced - submerged) * swimmer.rise,
        a.z + (b.z - a.z) * blend + tx * side,
      )
      swimmer.root.rotation.y = Math.atan2(tx, tz)
      swimmer.tail.rotation.y = Math.sin(time * 3.2 + swimmer.phase) * 0.45
    }
  }

  walkable.userData.tickWildlife = updateWildlife
}

export function tickWildlife(dt: number, x: number, y: number, z: number) {
  updateWildlife?.(dt, x, y, z)
}

export function disposeWildlife() {
  updateWildlife = null
}
