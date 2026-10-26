<template>
  <TresGroup ref="dogRef" :position="[0.72, 0.45, 49.25]" @click="onGreet">
    <TresGroup ref="bodyRef" :position="[0, 0.5, 0]">
      <TresMesh cast-shadow>
        <TresBoxGeometry :args="[0.42, 0.36, 0.78]" />
        <TresMeshStandardMaterial color="#f4f1ea" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, 0.04, -0.04]" cast-shadow>
        <TresBoxGeometry :args="[0.46, 0.32, 0.36]" />
        <TresMeshStandardMaterial color="#8d8fa0" :flatShading="true" :roughness="0.9" />
      </TresMesh>

      <TresGroup ref="headRef" :position="[0, 0.16, 0.5]">
        <TresMesh cast-shadow>
          <TresBoxGeometry :args="[0.36, 0.32, 0.34]" />
          <TresMeshStandardMaterial color="#f4f1ea" :flatShading="true" :roughness="0.9" />
        </TresMesh>
        <TresMesh :position="[0.13, 0.22, -0.02]" cast-shadow>
          <TresBoxGeometry :args="[0.1, 0.16, 0.12]" />
          <TresMeshStandardMaterial color="#8d8fa0" :flatShading="true" :roughness="0.9" />
        </TresMesh>
        <TresMesh :position="[-0.13, 0.22, -0.02]" cast-shadow>
          <TresBoxGeometry :args="[0.1, 0.16, 0.12]" />
          <TresMeshStandardMaterial color="#f4f1ea" :flatShading="true" :roughness="0.9" />
        </TresMesh>
        <TresMesh :position="[0, -0.08, 0.24]" cast-shadow>
          <TresBoxGeometry :args="[0.24, 0.16, 0.22]" />
          <TresMeshStandardMaterial color="#f4f1ea" :flatShading="true" :roughness="0.9" />
        </TresMesh>
        <TresMesh :position="[0, -0.02, 0.36]">
          <TresBoxGeometry :args="[0.1, 0.08, 0.08]" />
          <TresMeshStandardMaterial color="#1a1a1a" :flatShading="true" :roughness="0.7" />
        </TresMesh>
        <TresMesh :visible="atlasGreeting" :position="[0, -0.12, 0.46]" :rotation="[0.4, 0, 0]">
          <TresBoxGeometry :args="[0.08, 0.035, 0.14]" />
          <TresMeshStandardMaterial color="#e07a86" :flatShading="true" :roughness="0.45" />
        </TresMesh>
        <TresMesh :position="[0.1, 0.04, 0.17]">
          <TresBoxGeometry :args="[0.07, 0.07, 0.04]" />
          <TresMeshStandardMaterial color="#3aa0ee" :flatShading="true" />
        </TresMesh>
        <TresMesh :position="[-0.1, 0.04, 0.17]">
          <TresBoxGeometry :args="[0.07, 0.07, 0.04]" />
          <TresMeshStandardMaterial color="#3aa0ee" :flatShading="true" />
        </TresMesh>
      </TresGroup>

      <TresGroup ref="tailRef" :position="[0, 0.08, -0.4]">
        <TresMesh :position="[0, 0.02, -0.16]" cast-shadow>
          <TresBoxGeometry :args="[0.12, 0.12, 0.32]" />
          <TresMeshStandardMaterial color="#8d8fa0" :flatShading="true" :roughness="0.9" />
        </TresMesh>
      </TresGroup>
    </TresGroup>

    <TresGroup ref="frontLeft" :position="[0.13, 0.42, 0.24]">
      <TresMesh :position="[0, -0.16, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.12, 0.32, 0.12]" />
        <TresMeshStandardMaterial color="#f4f1ea" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, -0.32, 0.03]" cast-shadow>
        <TresBoxGeometry :args="[0.13, 0.08, 0.16]" />
        <TresMeshStandardMaterial color="#f4f1ea" :flatShading="true" :roughness="0.9" />
      </TresMesh>
    </TresGroup>
    <TresGroup ref="frontRight" :position="[-0.13, 0.42, 0.24]">
      <TresMesh :position="[0, -0.16, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.12, 0.32, 0.12]" />
        <TresMeshStandardMaterial color="#f4f1ea" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, -0.32, 0.03]" cast-shadow>
        <TresBoxGeometry :args="[0.13, 0.08, 0.16]" />
        <TresMeshStandardMaterial color="#f4f1ea" :flatShading="true" :roughness="0.9" />
      </TresMesh>
    </TresGroup>
    <TresGroup ref="backLeft" :position="[0.13, 0.42, -0.26]">
      <TresMesh :position="[0, -0.15, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.13, 0.3, 0.14]" />
        <TresMeshStandardMaterial color="#f4f1ea" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, -0.3, -0.02]" cast-shadow>
        <TresBoxGeometry :args="[0.14, 0.08, 0.16]" />
        <TresMeshStandardMaterial color="#f4f1ea" :flatShading="true" :roughness="0.9" />
      </TresMesh>
    </TresGroup>
    <TresGroup ref="backRight" :position="[-0.13, 0.42, -0.26]">
      <TresMesh :position="[0, -0.15, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.13, 0.3, 0.14]" />
        <TresMeshStandardMaterial color="#8d8fa0" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, -0.3, -0.02]" cast-shadow>
        <TresBoxGeometry :args="[0.14, 0.08, 0.16]" />
        <TresMeshStandardMaterial color="#8d8fa0" :flatShading="true" :roughness="0.9" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import { Group, Raycaster, Vector3 } from 'three'
import { WADE_SINK, cavadoSample } from '@/game/cavado'
import { atlasGreeting, atlasPlaying, greetAtlas, hikerPose, marinaSpot, ridingScooter } from '@/game/spot'

const { scene, camera } = useTresContext()
const dogRef = shallowRef<Group | null>(null)
const bodyRef = shallowRef<Group | null>(null)
const headRef = shallowRef<Group | null>(null)
const tailRef = shallowRef<Group | null>(null)
const frontLeft = shallowRef<Group | null>(null)
const frontRight = shallowRef<Group | null>(null)
const backLeft = shallowRef<Group | null>(null)
const backRight = shallowRef<Group | null>(null)

const raycaster = new Raycaster()
const rayOrigin = new Vector3()
const down = new Vector3(0, -1, 0)

const BEHIND = 1.25
const SIDE = 0.72
const CATCH = 12.5

let rest = 0
let sit = 0
let bite = 0
let idle = 0
let phase = 0
let wag = 0
let steer = 1
let placed = false

function mix(from: number, to: number, t: number) {
  return from + (to - from) * t
}

function approach(current: number, target: number, rate: number, dt: number) {
  const max = rate * dt
  const delta = target - current
  if (Math.abs(delta) <= max) return target
  return current + Math.sign(delta) * max
}

function easeAngle(current: number, target: number, dt: number) {
  let delta = target - current
  while (delta > Math.PI) delta -= Math.PI * 2
  while (delta < -Math.PI) delta += Math.PI * 2
  return current + delta * (1 - Math.exp(-dt * 10))
}

function blocked(x: number, z: number) {
  const data = scene.value?.getObjectByName('walkable')?.userData
  const lists = [data?.trees, data?.solids] as ({ x: number; z: number; r: number }[] | undefined)[]
  for (const list of lists) {
    if (!list) continue
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const dx = x - item.x
      const dz = z - item.z
      const reach = Math.max(0.35, item.r - 0.35)
      if (dx * dx + dz * dz < reach * reach) return true
    }
  }
  return false
}

function floorAt(x: number, z: number) {
  const root = scene.value?.getObjectByName('walkable')
  if (!root) return null
  rayOrigin.set(x, 160, z)
  raycaster.set(rayOrigin, down)
  raycaster.far = 220
  const hits = raycaster.intersectObject(root, true)
  if (!hits.length) return null
  return hits[0].point.y - cavadoSample(x, z).depth * WADE_SINK
}

function onGreet() {
  greetAtlas()
}

function open(x: number, z: number, fromY: number) {
  if (blocked(x, z)) return false
  const floor = floorAt(x, z)
  if (floor === null) return false
  if (floor - fromY > 1.35) return false
  return true
}

function poseLimb(
  limb: Group | null,
  standY: number,
  lieY: number,
  sitY: number,
  standZ: number,
  lieZ: number,
  sitZ: number,
  standSwing: number,
  lieSwing: number,
  sitSwing: number,
) {
  if (!limb) return
  const groundedPose = mix(standY, lieY, rest)
  limb.position.y = mix(groundedPose, sitY, sit)
  limb.position.z = mix(mix(standZ, lieZ, rest), sitZ, sit)
  limb.rotation.x = mix(mix(standSwing, lieSwing, rest), sitSwing, sit)
}

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  const dog = dogRef.value
  if (!dog || !hikerPose.ready) return
  const dt = Math.min(delta, 0.05)
  dog.visible = hikerPose.visible
  if (!dog.visible) return

  const yaw = hikerPose.yaw
  const fx = Math.sin(yaw)
  const fz = Math.cos(yaw)
  const greeting = atlasGreeting.value
  const riding = ridingScooter.value
  const rightX = Math.cos(yaw)
  const rightZ = -Math.sin(yaw)
  const feetDist = Math.hypot(marinaSpot.x - dog.position.x, marinaSpot.z - dog.position.z)
  const playing = !riding && !greeting && marinaSpot.ready && feetDist < 14
  atlasPlaying.value = playing
  const play = playing ? marinaSpot.mode : 'bake'
  const fxM = Math.sin(marinaSpot.yaw)
  const fzM = Math.cos(marinaSpot.yaw)
  const goalX = riding
    ? hikerPose.x + rightX * 0.62
    : play === 'run'
      ? marinaSpot.x - fxM * 0.85
      : play === 'pet'
        ? marinaSpot.x + fxM * 0.75
        : play === 'bite'
          ? marinaSpot.x + fxM * 0.4
          : greeting
            ? dog.position.x
            : hikerPose.x - fx * BEHIND - fz * SIDE
  const goalZ = riding
    ? hikerPose.z + rightZ * 0.62
    : play === 'run'
      ? marinaSpot.z - fzM * 0.85
      : play === 'pet'
        ? marinaSpot.z + fzM * 0.75
        : play === 'bite'
          ? marinaSpot.z + fzM * 0.4
          : greeting
            ? dog.position.z
            : hikerPose.z - fz * BEHIND + fx * SIDE

  if (!placed) {
    const floor = floorAt(dog.position.x, dog.position.z)
    if (floor === null) return
    dog.position.y = floor
    placed = true
  }

  const dx = goalX - dog.position.x
  const dz = goalZ - dog.position.z
  let dist = Math.hypot(dx, dz)
  if (!riding && dist > 8) {
    dog.position.x = goalX
    dog.position.z = goalZ
    const landed = floorAt(goalX, goalZ)
    if (landed !== null) dog.position.y = landed
    dist = 0
  }

  let moved = 0
  if (riding && dist > 0.02) {
    dog.position.x = goalX
    dog.position.z = goalZ
    moved = dist
    dist = 0
  } else if (!greeting && dist > (playing ? 0.22 : 0.12)) {
    const step = Math.min(dist, (dist > 2.4 ? CATCH : 7.2) * dt)
    const dirX = dx / dist
    const dirZ = dz / dist
    const tries: Array<[number, number]> = [
      [dog.position.x + dirX * step, dog.position.z + dirZ * step],
      [dog.position.x + -dirZ * step * steer, dog.position.z + dirX * step * steer],
      [dog.position.x + dirZ * step * steer, dog.position.z + -dirX * step * steer],
      [dog.position.x + dirX * step, dog.position.z],
      [dog.position.x, dog.position.z + dirZ * step],
    ]
    for (const [nx, nz] of tries) {
      if (!open(nx, nz, dog.position.y)) continue
      moved = Math.hypot(nx - dog.position.x, nz - dog.position.z)
      dog.position.x = nx
      dog.position.z = nz
      break
    }
    if (moved === 0) steer = -steer
  }

  if (riding) {
    const seat = hikerPose.y + 0.28
    dog.position.y += (seat - dog.position.y) * (1 - Math.exp(-dt * 14))
  } else {
    const floor = floorAt(dog.position.x, dog.position.z)
    if (floor !== null) {
      dog.position.y += (floor - dog.position.y) * (1 - Math.exp(-dt * 12))
    }
  }

  const catching = !greeting && !riding && !playing && (dist > 0.55 || moved > 0.004)
  idle = catching ? 0 : idle + dt
  const biting = play === 'bite' && dist < 0.9
  const petting = play === 'pet' && dist < 1.3
  bite = approach(bite, biting ? 1 : 0, biting ? 3.2 : 3.6, dt)
  const sitTarget = greeting || riding || biting || petting ? 1 : 0
  sit = approach(sit, sitTarget, sitTarget ? 2.8 : 3.4, dt)
  const restTarget = sitTarget === 0 && idle > 0.65 ? 1 : 0
  rest = approach(rest, restTarget, restTarget ? 1.5 : 3.2, dt)

  const traveling = moved > 0.004
  if (traveling || playing) phase += dt * (playing ? 14 : dist > 2 ? 13 : 9)
  wag += dt * (greeting || biting ? 12 : traveling ? 8 : 3.2)

  const cam = camera.value
  const face =
    greeting && cam
      ? Math.atan2(cam.position.x - dog.position.x, cam.position.z - dog.position.z)
      : playing
        ? Math.atan2(marinaSpot.x - dog.position.x, marinaSpot.z - dog.position.z)
        : riding
          ? yaw
          : traveling
            ? Math.atan2(dx, dz)
            : Math.atan2(hikerPose.x - dog.position.x, hikerPose.z - dog.position.z)
  dog.rotation.y = easeAngle(dog.rotation.y, face, dt)

  const swing = traveling ? Math.sin(phase) * mix(0.65, 0, rest) : 0
  const body = bodyRef.value
  if (body) {
    const bob = traveling ? Math.abs(Math.sin(phase * 2)) * 0.035 : 0
    body.position.y = mix(mix(mix(0.5, 0.2, rest), 0.4, sit), 0.16, bite) + bob * (1 - sit)
  }
  const head = headRef.value
  if (head) {
    const chomp = bite * (0.95 + Math.sin(wag * 5) * 0.42)
    const look = petting ? -0.45 : greeting ? -0.38 : 0.08
    head.rotation.x = mix(mix(mix(0, 0.42, rest), look, sit), chomp, bite)
    head.position.z = mix(mix(mix(0.5, 0.58, rest), 0.52, sit), 0.7, bite)
  }
  const tail = tailRef.value
  if (tail) {
    tail.rotation.x = mix(mix(-0.35, 0.2, rest), greeting ? -0.9 : -0.45, sit)
    tail.rotation.y = Math.sin(wag) * mix(mix(0.5, 0.15, rest), greeting ? 0.7 : 0.25, sit)
  }

  poseLimb(frontLeft.value, 0.42, 0.16, 0.34, 0.24, 0.58, 0.3, swing, -1.15, 0.25)
  poseLimb(frontRight.value, 0.42, 0.16, 0.34, 0.24, 0.58, 0.3, -swing, -1.15, 0.25)
  poseLimb(backLeft.value, 0.42, 0.15, 0.3, -0.26, -0.46, -0.12, -swing, 0.95, 1.15)
  poseLimb(backRight.value, 0.42, 0.15, 0.3, -0.26, -0.46, -0.12, swing, 0.95, 1.15)
})
</script>
