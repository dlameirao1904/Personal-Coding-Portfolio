<template>
  <TresGroup ref="playerRef">
    <TresMesh :position="[0, 1.2, 0]" cast-shadow>
      <TresBoxGeometry :args="[0.5, 0.7, 0.3]" />
      <TresMeshStandardMaterial color="#d97706" :flatShading="true" />
    </TresMesh>

    <TresGroup :position="[0, 1.75, 0]">
      <TresMesh cast-shadow>
        <TresIcosahedronGeometry :args="[0.2, 1]" />
        <TresMeshStandardMaterial color="#ffdbac" :flatShading="true" />
      </TresMesh>

      <TresMesh :position="[-0.08, 0.05, 0.17]">
        <TresBoxGeometry :args="[0.04, 0.04, 0.02]" />
        <TresMeshStandardMaterial color="#111827" />
      </TresMesh>

      <TresMesh :position="[0.08, 0.05, 0.17]">
        <TresBoxGeometry :args="[0.04, 0.04, 0.02]" />
        <TresMeshStandardMaterial color="#111827" />
      </TresMesh>

      <TresMesh :position="[0, -0.02, 0.19]">
        <TresBoxGeometry :args="[0.05, 0.08, 0.05]" />
        <TresMeshStandardMaterial color="#ffdbac" />
      </TresMesh>

      <TresMesh :position="[0, 0.15, 0]" cast-shadow>
        <TresCylinderGeometry :args="[0.17, 0.21, 0.15, 8]" />
        <TresMeshStandardMaterial color="#b91c1c" :flatShading="true" />
      </TresMesh>

      <TresMesh :position="[0, 0.12, 0.16]" :rotation="[-0.1, 0, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.35, 0.02, 0.25]" />
        <TresMeshStandardMaterial color="#b91c1c" />
      </TresMesh>
    </TresGroup>

    <TresMesh :position="[0, 0.8, 0]" cast-shadow>
      <TresBoxGeometry :args="[0.48, 0.22, 0.32]" />
      <TresMeshStandardMaterial color="#1e3a8a" :flatShading="true" />
    </TresMesh>
    <TresMesh :position="[0, 0.9, 0]" cast-shadow>
      <TresBoxGeometry :args="[0.54, 0.1, 0.36]" />
      <TresMeshStandardMaterial color="#78350f" :flatShading="true" />
    </TresMesh>
    <TresMesh :position="[0, 0.9, 0.16]">
      <TresBoxGeometry :args="[0.08, 0.08, 0.04]" />
      <TresMeshStandardMaterial color="#e7c7a4" :flatShading="true" />
    </TresMesh>

    <TresGroup ref="leftArm" :position="[-0.35, 1.45, 0]">
      <TresMesh :position="[0, -0.2, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.15, 0.4, 0.15]" />
        <TresMeshStandardMaterial color="#d97706" :flatShading="true" />
      </TresMesh>
      <TresMesh :position="[0, -0.44, 0.02]" cast-shadow>
        <TresBoxGeometry :args="[0.16, 0.12, 0.14]" />
        <TresMeshStandardMaterial color="#ffdbac" :flatShading="true" />
      </TresMesh>
    </TresGroup>

    <TresGroup ref="rightArm" :position="[0.35, 1.45, 0]">
      <TresMesh :position="[0, -0.2, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.15, 0.4, 0.15]" />
        <TresMeshStandardMaterial color="#d97706" :flatShading="true" />
      </TresMesh>
      <TresMesh :position="[0, -0.42, 0.06]" cast-shadow>
        <TresBoxGeometry :args="[0.16, 0.12, 0.16]" />
        <TresMeshStandardMaterial color="#ffdbac" :flatShading="true" />
      </TresMesh>
      <TresGroup :position="[0, -0.42, 0.12]" :rotation="[1.5, 0, 0]">
        <TresMesh cast-shadow>
          <TresBoxGeometry :args="[0.04, 0.7, 0.04]" />
          <TresMeshStandardMaterial color="#4b5563" :flatShading="true" />
        </TresMesh>
      </TresGroup>
    </TresGroup>

    <TresGroup ref="leftLeg" :position="[-0.15, 0.85, 0]">
      <TresMesh :position="[0, -0.3, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.2, 0.5, 0.25]" />
        <TresMeshStandardMaterial color="#1e3a8a" :flatShading="true" />
      </TresMesh>
      <TresMesh :position="[0, -0.56, 0.08]" cast-shadow>
        <TresBoxGeometry :args="[0.22, 0.12, 0.36]" />
        <TresMeshStandardMaterial color="#3f2e24" :flatShading="true" />
      </TresMesh>
    </TresGroup>

    <TresGroup ref="rightLeg" :position="[0.15, 0.85, 0]">
      <TresMesh :position="[0, -0.3, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.2, 0.5, 0.25]" />
        <TresMeshStandardMaterial color="#1e3a8a" :flatShading="true" />
      </TresMesh>
      <TresMesh :position="[0, -0.56, 0.08]" cast-shadow>
        <TresBoxGeometry :args="[0.22, 0.12, 0.36]" />
        <TresMeshStandardMaterial color="#3f2e24" :flatShading="true" />
      </TresMesh>
    </TresGroup>

    <TresGroup :position="[0, 1.25, -0.25]">
      <!-- Corpo da Mochila -->
      <TresMesh cast-shadow>
        <TresBoxGeometry :args="[0.45, 0.6, 0.25]" />
        <TresMeshStandardMaterial color="#365314" :roughness="0.9" />
      </TresMesh>
      <!-- Saco de Cama (Rolo) -->
      <TresMesh :position="[0, 0.38, 0]" :rotation="[0, 0, Math.PI / 2]" cast-shadow>
        <TresCylinderGeometry :args="[0.12, 0.12, 0.45, 8]" />
        <TresMeshStandardMaterial color="#fbbf24" :flatShading="true" :roughness="1" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import {
  Group,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  SphereGeometry,
  Vector3,
  type Object3D,
} from 'three'
import { SPAWN, passageById, passages } from '@/data/journey'
import { onBridge } from '@/game/bridge'
import { WADE_SINK, cavadoSample, waterSurfaceY } from '@/game/cavado'
import { disposeComputer, makeComputer, paintComputer } from '@/game/computer'
import { hikeKeys, hikeStick, releaseHikeKeys, setHikeKeyFromEvent } from '@/game/controls'
import { toStageDelta } from '@/game/orientation'
import {
  hikerPose,
  hikerSpot,
  ridingScooter,
  scooter,
  scooterNear,
  terminalOpen,
} from '@/game/spot'

const props = defineProps<{ readingId: string | null }>()
const emit = defineEmits(['arrive', 'started'])

const { scene, camera, sizes } = useTresContext()
const playerRef = shallowRef<Group | null>(null)
const leftLeg = shallowRef<Group | null>(null)
const rightLeg = shallowRef<Group | null>(null)
const leftArm = shallowRef<Group | null>(null)
const rightArm = shallowRef<Group | null>(null)

const raycaster = new Raycaster()
const rayOrigin = new Vector3()
const down = new Vector3(0, -1, 0)
const forward = new Vector3()
const right = new Vector3()
const up = new Vector3(0, 1, 0)
const velocity = new Vector3()
const desiredCam = new Vector3()
const look = new Vector3(SPAWN[0], 1.4, SPAWN[2] - 6)
const lookTarget = new Vector3()
const deskCam = new Vector3()
const deskLook = new Vector3()
const camGoal = new Vector3()
const lookGoal = new Vector3()
const computer = makeComputer()
const splashMat = new MeshBasicMaterial({ color: '#e7f6f8', transparent: true, opacity: 0.82 })
const splashGeo = new SphereGeometry(0.07, 6, 4)
const splash = new Group()
const drops = Array.from({ length: 8 }, () => {
  const drop = new Mesh(splashGeo, splashMat)
  splash.add(drop)
  return drop
})
splash.visible = false
let deskWeight = 0
let waterTime = 0

const SPEED = 6.6
const RUN = 1.75
const ACCEL = 28
const AIR_ACCEL = 9
const FRICTION = 22
const GRAVITY = 24
const JUMP = 7.2
const MAX_STEP = 0.95
const MAX_DROP = 1.05

let grounded = false
let wasRiding = false
let hasLanded = false
let coyote = 0
let jumpBuffer = 0
let spaceWasDown = false
let jumpHeld = false
let walkPhase = 0
let announcedStart = false
let currentPassage: string | null = null
let lastEmitted: string | null | undefined
let cameraReady = false
let orbitYaw = Math.PI
let orbitPitch = 0.42
let draggingLook = false
let lookX = 0
let lookY = 0

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function placeDesk(id: string) {
  const passage = passageById[id]
  const player = playerRef.value
  if (!passage || !player) return
  let dx = player.position.x - passage.position[0]
  let dz = player.position.z - passage.position[2]
  const len = Math.hypot(dx, dz)
  if (len < 0.2) {
    dx = 0
    dz = 1
  } else {
    dx /= len
    dz /= len
  }
  computer.position.set(passage.position[0], passage.position[1], passage.position[2])
  computer.rotation.y = Math.atan2(dx, dz)
  computer.visible = true
  paintComputer(computer, passage)
  const screenY = 1.18 * computer.scale.y
  const screenForward = 0.08 * computer.scale.z
  deskLook.set(
    passage.position[0] + dx * screenForward,
    passage.position[1] + screenY,
    passage.position[2] + dz * screenForward,
  )
  deskCam.set(
    passage.position[0] + dx * (screenForward + 1.65),
    passage.position[1] + screenY,
    passage.position[2] + dz * (screenForward + 1.65),
  )
  setMarkerVisible(id, false)
}

function setMarkerVisible(id: string, visible: boolean) {
  const root = scene.value
  if (!root) return
  root.traverse((object: Object3D) => {
    const marker = object.userData.projectMarker as string | undefined
    const sign = object.userData.id as string | undefined
    if (marker === id || (sign === id && object.type === 'Sprite')) object.visible = visible
  })
}

function onLookDown(event: PointerEvent) {
  if (props.readingId) return
  if (event.button !== 0) return
  const target = event.target as HTMLElement | null
  if (target?.tagName !== 'CANVAS') return
  draggingLook = true
  lookX = event.clientX
  lookY = event.clientY
  const canvas = target?.closest('canvas') as HTMLElement | null
  canvas?.style.setProperty('cursor', 'grabbing')
}

function onLookMove(event: PointerEvent) {
  if (!draggingLook) return
  const { x: dx, y: dy } = toStageDelta(event.clientX - lookX, event.clientY - lookY)
  lookX = event.clientX
  lookY = event.clientY
  orbitYaw -= dx * 0.0045
  orbitPitch = clamp(orbitPitch + dy * 0.0032, 0.08, 1.05)
}

function onLookUp() {
  if (!draggingLook) return
  draggingLook = false
  document.querySelector('canvas')?.style.removeProperty('cursor')
}

watch(playerRef, (player) => {
  if (!player || player.userData.placed) return
  player.position.set(SPAWN[0], SPAWN[1], SPAWN[2])
  player.rotation.y = Math.PI
  player.userData.placed = true
})

const onKeyDown = (event: KeyboardEvent) => {
  if (terminalOpen.value) return
  const target = event.target
  if (target instanceof HTMLElement && target.closest('input, textarea')) return
  if (setHikeKeyFromEvent(event, true)) event.preventDefault()
}
const onKeyUp = (event: KeyboardEvent) => {
  if (terminalOpen.value) return
  setHikeKeyFromEvent(event, false)
}

watch(
  () => props.readingId,
  (id, previous) => {
    if (previous) setMarkerVisible(previous, true)
    if (id) placeDesk(id)
  },
)

watch(
  scene,
  (value) => {
    if (value && computer.parent !== value) value.add(computer)
    if (value && splash.parent !== value) value.add(splash)
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', releaseHikeKeys)
  window.addEventListener('pointerdown', onLookDown)
  window.addEventListener('pointermove', onLookMove)
  window.addEventListener('pointerup', onLookUp)
  window.addEventListener('pointercancel', onLookUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('blur', releaseHikeKeys)
  window.removeEventListener('pointerdown', onLookDown)
  window.removeEventListener('pointermove', onLookMove)
  window.removeEventListener('pointerup', onLookUp)
  window.removeEventListener('pointercancel', onLookUp)
  releaseHikeKeys()
  scene.value?.remove(computer)
  scene.value?.remove(splash)
  splashGeo.dispose()
  splashMat.dispose()
  disposeComputer(computer)
})

function approach(current: number, target: number, rate: number, dt: number) {
  const max = rate * dt
  const delta = target - current
  if (Math.abs(delta) <= max) return target
  return current + Math.sign(delta) * max
}

function treeBlocks(x: number, z: number) {
  const data = scene.value?.getObjectByName('walkable')?.userData
  const lists = [data?.trees, data?.solids] as ({ x: number; z: number; r: number }[] | undefined)[]
  for (const list of lists) {
    if (!list) continue
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const dx = x - item.x
      const dz = z - item.z
      if (dx * dx + dz * dz < item.r * item.r) return true
    }
  }
  return false
}

function sample(x: number, z: number) {
  const root = scene.value?.getObjectByName('walkable')
  if (!root) return null
  const follow = root.userData.follow as ((px: number, pz: number) => void) | undefined
  follow?.(x, z)
  rayOrigin.set(x, 160, z)
  raycaster.set(rayOrigin, down)
  raycaster.far = 220
  const hits = raycaster.intersectObject(root, true)
  return hits.length ? hits[0].point.y : null
}

function floorAt(x: number, z: number) {
  const ground = sample(x, z)
  if (ground === null) return null
  if (onBridge(x, z)) return ground
  return ground - cavadoSample(x, z).depth * WADE_SINK
}

function canStand(x: number, z: number, feetY: number) {
  if (treeBlocks(x, z)) return false
  const floor = floorAt(x, z)
  if (floor === null) return false
  const rise = floor - feetY
  const drop = feetY - floor
  if (rise > MAX_STEP) return false
  if (grounded && drop > MAX_DROP) return false
  return true
}

function easeAngle(current: number, target: number, dt: number) {
  let delta = target - current
  while (delta > Math.PI) delta -= Math.PI * 2
  while (delta < -Math.PI) delta += Math.PI * 2
  return current + delta * (1 - Math.exp(-dt * 12))
}

function nearestPassage(x: number, z: number) {
  let project: string | null = null
  let projectDistance = Infinity
  for (const passage of passages) {
    if (passage.kind !== 'project') continue
    const distance = Math.hypot(x - passage.position[0], z - passage.position[2])
    if (distance <= passage.radius && distance < projectDistance) {
      project = passage.id
      projectDistance = distance
    }
  }
  if (project) return project

  let step: string | null = null
  let stepDistance = Infinity
  for (const passage of passages) {
    if (passage.kind === 'project') continue
    const distance = Math.hypot(x - passage.position[0], z - passage.position[2])
    if (distance <= passage.radius && distance < stepDistance) {
      step = passage.id
      stepDistance = distance
    }
  }
  return step
}

function updatePassage(x: number, z: number) {
  const detected = nearestPassage(x, z)
  if (currentPassage) {
    const current = passageById[currentPassage]
    const distance = Math.hypot(x - current.position[0], z - current.position[2])
    const stick = current.radius * (current.kind === 'project' ? 1.18 : 1.12)
    const enteredProject = detected && passageById[detected].kind === 'project'
    if (distance > stick || (enteredProject && detected !== currentPassage)) {
      currentPassage = detected
    }
  } else {
    currentPassage = detected
  }
  if (currentPassage !== lastEmitted) {
    lastEmitted = currentPassage
    emit('arrive', currentPassage)
  }
}

function publishPose(player: Group) {
  hikerPose.x = player.position.x
  hikerPose.y = player.position.y
  hikerPose.z = player.position.z
  hikerPose.yaw = player.rotation.y
  hikerPose.look = orbitPitch
  hikerPose.visible = player.visible
  hikerPose.ready = true
}

function swingLimb(limb: Group | null, target: number, dt: number) {
  if (!limb) return
  limb.rotation.x = approach(limb.rotation.x, target, 10, dt)
}

function reset() {
  const player = playerRef.value
  if (!player) return
  player.position.set(SPAWN[0], SPAWN[1], SPAWN[2])
  hikerSpot.value = { x: SPAWN[0], z: SPAWN[2] }
  player.rotation.y = Math.PI
  ridingScooter.value = false
  wasRiding = false
  publishPose(player)
  orbitYaw = Math.PI
  orbitPitch = 0.42
  velocity.set(0, 0, 0)
  grounded = false
  hasLanded = false
  coyote = 0
  jumpBuffer = 0
  jumpHeld = false
}

defineExpose({ reset })

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  const player = playerRef.value
  if (!player || !player.userData.placed) return
  const dt = Math.min(delta, 0.05)
  const reading = Boolean(props.readingId)
  deskWeight = approach(deskWeight, reading ? 1 : 0, 2.4, dt)
  if (!reading && deskWeight < 0.01) {
    deskWeight = 0
    computer.visible = false
  }
  player.visible = deskWeight < 0.25

  const activeCamera = camera.activeCamera.value
  if (activeCamera) {
    activeCamera.getWorldDirection(forward)
    forward.y = 0
    if (forward.lengthSq() < 1e-4) forward.set(0, 0, -1)
    else forward.normalize()
    right.crossVectors(forward, up).normalize()
  } else {
    forward.set(0, 0, -1)
    right.set(1, 0, 0)
  }

  const stickMag = Math.hypot(hikeStick.x, hikeStick.y)
  const along =
    stickMag > 0.01
      ? hikeStick.y
      : (hikeKeys.w || hikeKeys.ArrowUp ? 1 : 0) - (hikeKeys.s || hikeKeys.ArrowDown ? 1 : 0)
  const strafe =
    stickMag > 0.01
      ? hikeStick.x
      : (hikeKeys.d || hikeKeys.ArrowRight ? 1 : 0) - (hikeKeys.a || hikeKeys.ArrowLeft ? 1 : 0)
  let wishX = forward.x * along + right.x * strafe
  let wishZ = forward.z * along + right.z * strafe
  const wishLen = Math.hypot(wishX, wishZ)
  if (wishLen > 1) {
    wishX /= wishLen
    wishZ /= wishLen
  }

  const wadeNow = onBridge(player.position.x, player.position.z)
    ? { depth: 0, flowX: 0, flowZ: 0 }
    : cavadoSample(player.position.x, player.position.z)
  waterTime += dt
  const tickWater = scene.value?.getObjectByName('walkable')?.userData.tickWater as
    | ((time: number) => void)
    | undefined
  tickWater?.(waterTime)
  const live = scene.value?.getObjectByName('walkable')?.userData.tickWildlife as
    | ((step: number, x: number, y: number, z: number) => void)
    | undefined
  live?.(dt, player.position.x, player.position.y, player.position.z)

  const riding = ridingScooter.value
  if (riding && !wasRiding) {
    player.position.x = scooter.x
    player.position.z = scooter.z
    player.rotation.y = scooter.yaw
    velocity.set(0, 0, 0)
  }
  const pushing = !reading && wishLen > 0.01 && hasLanded
  const running = pushing && hikeKeys.Shift
  const rate = pushing
    ? grounded
      ? running || riding
        ? ACCEL * 1.35
        : ACCEL
      : AIR_ACCEL
    : riding
      ? 16
      : FRICTION
  const pace = (riding ? SPEED * RUN * 2 : SPEED * (running ? RUN : 1)) * (1 - wadeNow.depth * 0.62)
  const drift = 1.7 * wadeNow.depth
  velocity.x = approach(velocity.x, (pushing ? wishX * pace : 0) + wadeNow.flowX * drift, rate, dt)
  velocity.z = approach(velocity.z, (pushing ? wishZ * pace : 0) + wadeNow.flowZ * drift, rate, dt)

  if (!reading && hasLanded && (Math.abs(velocity.x) > 0.001 || Math.abs(velocity.z) > 0.001)) {
    const nextX = player.position.x + velocity.x * dt
    const nextZ = player.position.z + velocity.z * dt
    if (canStand(nextX, nextZ, player.position.y)) {
      player.position.x = nextX
      player.position.z = nextZ
    } else if (canStand(nextX, player.position.z, player.position.y)) {
      player.position.x = nextX
      velocity.z = 0
    } else if (canStand(player.position.x, nextZ, player.position.y)) {
      player.position.z = nextZ
      velocity.x = 0
    }
  }

  if (!reading && wishLen > 0.2 && hasLanded) {
    player.rotation.y = easeAngle(player.rotation.y, Math.atan2(wishX, wishZ), dt)
  }

  if (!reading && hikeKeys[' '] && !spaceWasDown) jumpBuffer = 0.12
  spaceWasDown = hikeKeys[' ']
  if (!hikeKeys[' ']) jumpBuffer = Math.max(0, jumpBuffer - dt)
  if (grounded) coyote = 0.14
  else coyote = Math.max(0, coyote - dt)

  if (reading) velocity.set(0, 0, 0)

  if (!reading && jumpBuffer > 0 && coyote > 0 && hasLanded) {
    velocity.y = JUMP
    jumpBuffer = 0
    coyote = 0
    grounded = false
    jumpHeld = true
  }
  if (jumpHeld && !hikeKeys[' ']) {
    if (velocity.y > 0) velocity.y *= 0.45
    jumpHeld = false
  }

  if (!reading) velocity.y -= GRAVITY * dt
  const nextY = reading ? player.position.y : player.position.y + velocity.y * dt
  const wade = onBridge(player.position.x, player.position.z)
    ? { depth: 0, flowX: 0, flowZ: 0 }
    : cavadoSample(player.position.x, player.position.z)
  const ground = floorAt(player.position.x, player.position.z)
  const bob = Math.sin(waterTime * 2.5) * 0.04 * wade.depth
  const bed = ground === null ? null : ground + bob

  if (bed !== null && nextY <= bed) {
    const fellFar = ground !== null && player.position.y - ground > 2.5
    player.position.y = bed
    velocity.y = 0
    grounded = true
    hasLanded = true
    if (fellFar) reset()
  } else if (bed !== null && grounded && velocity.y <= 0 && player.position.y - bed <= MAX_DROP) {
    player.position.y = bed
    velocity.y = 0
  } else {
    player.position.y = nextY
    grounded = false
  }

  if (player.position.y < -20) reset()

  publishPose(player)

  const movedX = player.position.x - hikerSpot.value.x
  const movedZ = player.position.z - hikerSpot.value.z
  if (movedX * movedX + movedZ * movedZ > 0.04) {
    hikerSpot.value = { x: player.position.x, z: player.position.z }
  }

  const speed = Math.hypot(velocity.x, velocity.z)
  if (!announcedStart && hasLanded && speed > 0.4) {
    announcedStart = true
    emit('started')
  }

  const moving = grounded && speed > 0.35
  if (riding) {
    scooter.x = player.position.x
    scooter.y = player.position.y
    scooter.z = player.position.z
    scooter.yaw = player.rotation.y
    scooterNear.value = false
  } else if (scooter.on) {
    const parked = floorAt(scooter.x, scooter.z)
    if (parked !== null) scooter.y = parked
    const near = Math.hypot(player.position.x - scooter.x, player.position.z - scooter.z)
    scooterNear.value = near < 1.7
  } else {
    scooterNear.value = false
  }
  wasRiding = riding

  const stride = riding ? 0.06 : running && moving ? 0.78 : wade.depth > 0.2 ? 0.28 : 0.55
  if (moving) walkPhase += dt * (running ? 11 + speed : 8 + speed) * (wade.depth > 0.2 ? 0.72 : 1)
  const swing = moving ? Math.sin(walkPhase) * stride : 0
  const wet = grounded && wade.depth > 0.05
  splash.visible = wet
  if (wet) {
    const surface = waterSurfaceY()
    const kick = Math.min(1, speed * 0.4)
    for (let i = 0; i < drops.length; i++) {
      const cycle = (waterTime * (0.65 + kick) + i * 0.37) % 1
      const ang = i * 0.78 + waterTime * 0.4
      const radius = 0.22 + cycle * (0.5 + kick * 0.8)
      const drop = drops[i]
      drop.visible = cycle < 0.9
      drop.position.set(
        player.position.x + Math.cos(ang) * radius + wade.flowX * cycle * 0.35,
        surface + Math.sin(cycle * Math.PI) * 0.18,
        player.position.z + Math.sin(ang) * radius + wade.flowZ * cycle * 0.35,
      )
      drop.scale.setScalar(Math.max(0.25, (1 - cycle) * (0.8 + kick)))
    }
  }
  swingLimb(leftLeg.value, swing, dt)
  swingLimb(rightLeg.value, -swing, dt)
  swingLimb(leftArm.value, -swing * 0.75, dt)
  swingLimb(rightArm.value, swing * 0.75, dt)

  updatePassage(player.position.x, player.position.z)

  if (!draggingLook && deskWeight < 0.05 && wishLen > 0.2) {
    orbitYaw = easeAngle(orbitYaw, player.rotation.y, dt)
    if (orbitPitch < 0.5) orbitPitch = approach(orbitPitch, 0.5, 0.55, dt)
  }

  if (!activeCamera) return
  const narrow = sizes.width.value < 800
  const distance = narrow ? 10.5 : 12.8
  const gazeX = Math.sin(orbitYaw)
  const gazeZ = Math.cos(orbitYaw)
  const horizontal = Math.cos(orbitPitch) * distance
  desiredCam.set(
    player.position.x - gazeX * horizontal,
    player.position.y + 1.15 + Math.sin(orbitPitch) * distance,
    player.position.z - gazeZ * horizontal,
  )
  lookTarget.set(
    player.position.x + gazeX * 7,
    player.position.y + 1.35 + (0.48 - orbitPitch) * 9,
    player.position.z + gazeZ * 7,
  )
  camGoal.copy(desiredCam).lerp(deskCam, deskWeight)
  lookGoal.copy(lookTarget).lerp(deskLook, deskWeight)
  const follow = 1 - Math.exp(-dt * (draggingLook ? 16 : deskWeight > 0.05 ? 3.2 : 5.5))
  if (!cameraReady) {
    activeCamera.position.copy(camGoal)
    look.copy(lookGoal)
    cameraReady = true
  } else {
    activeCamera.position.lerp(camGoal, follow)
    look.lerp(lookGoal, 1 - Math.exp(-dt * (deskWeight > 0.05 ? 4 : 8)))
  }
  activeCamera.lookAt(look)
})
</script>
