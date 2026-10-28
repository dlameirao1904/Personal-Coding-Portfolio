<template>
  <TresGroup>
    <TresGroup ref="swingRef" :position="[RING_X, BAG_PIVOT_Y, RING_Z]">
      <TresMesh :position="[0, -chainCenter, 0]" cast-shadow>
        <TresCylinderGeometry :args="[0.025, 0.025, chainLen, 6]" />
        <TresMeshStandardMaterial
          color="#3a3532"
          :flatShading="true"
          :roughness="0.55"
          :metalness="0.35"
        />
      </TresMesh>
      <TresGroup ref="bagRef" :position="[0, -BAG_DROP, 0]">
        <TresMesh cast-shadow>
          <TresCylinderGeometry :args="[BAG_R, BAG_R * 0.92, BAG_H, 8]" />
          <TresMeshStandardMaterial color="#7a3a2c" :flatShading="true" :roughness="0.86" />
        </TresMesh>
        <TresMesh :position="[0, 0.22, 0]" cast-shadow>
          <TresCylinderGeometry :args="[BAG_R + 0.012, BAG_R + 0.012, 0.07, 8]" />
          <TresMeshStandardMaterial color="#e6d3b0" :flatShading="true" :roughness="0.7" />
        </TresMesh>
        <TresMesh :position="[0, -0.22, 0]" cast-shadow>
          <TresCylinderGeometry :args="[BAG_R + 0.01, BAG_R + 0.01, 0.07, 8]" />
          <TresMeshStandardMaterial color="#e6d3b0" :flatShading="true" :roughness="0.7" />
        </TresMesh>
        <TresMesh :position="[0, BAG_H / 2 - 0.05, 0]">
          <TresCylinderGeometry :args="[0.07, 0.07, 0.1, 6]" />
          <TresMeshStandardMaterial color="#2c2826" :roughness="0.45" :metalness="0.4" />
        </TresMesh>
      </TresGroup>
    </TresGroup>

    <TresGroup ref="leftFist" :visible="false">
      <TresMesh>
        <TresBoxGeometry :args="[0.15, 0.11, 0.16]" />
        <TresMeshStandardMaterial color="#c4312c" :flatShading="true" :roughness="0.72" />
      </TresMesh>
      <TresMesh :position="[0, 0, 0.078]">
        <TresBoxGeometry :args="[0.158, 0.038, 0.02]" />
        <TresMeshStandardMaterial color="#e6d3b0" :flatShading="true" :roughness="0.7" />
      </TresMesh>
      <TresMesh :position="[0, -0.01, 0.045]">
        <TresBoxGeometry :args="[0.07, 0.045, 0.03]" />
        <TresMeshStandardMaterial color="#ffdbac" :flatShading="true" :roughness="1" />
      </TresMesh>
      <TresMesh :position="[0, 0.02, -0.08]">
        <TresBoxGeometry :args="[0.13, 0.045, 0.04]" />
        <TresMeshStandardMaterial color="#9c241c" :flatShading="true" :roughness="0.7" />
      </TresMesh>
    </TresGroup>

    <TresGroup ref="rightFist" :visible="false">
      <TresMesh>
        <TresBoxGeometry :args="[0.15, 0.11, 0.16]" />
        <TresMeshStandardMaterial color="#c4312c" :flatShading="true" :roughness="0.72" />
      </TresMesh>
      <TresMesh :position="[0, 0, 0.078]">
        <TresBoxGeometry :args="[0.158, 0.038, 0.02]" />
        <TresMeshStandardMaterial color="#e6d3b0" :flatShading="true" :roughness="0.7" />
      </TresMesh>
      <TresMesh :position="[0, -0.01, 0.045]">
        <TresBoxGeometry :args="[0.07, 0.045, 0.03]" />
        <TresMeshStandardMaterial color="#ffdbac" :flatShading="true" :roughness="1" />
      </TresMesh>
      <TresMesh :position="[0, 0.02, -0.08]">
        <TresBoxGeometry :args="[0.13, 0.045, 0.04]" />
        <TresMeshStandardMaterial color="#9c241c" :flatShading="true" :roughness="0.7" />
      </TresMesh>
    </TresGroup>

    <TresMesh ref="leftUpper" :visible="false">
      <TresCylinderGeometry :args="[0.058, 0.072, 1, 6]" />
      <TresMeshStandardMaterial color="#d97706" :flatShading="true" :roughness="0.9" />
    </TresMesh>
    <TresMesh ref="leftFore" :visible="false">
      <TresCylinderGeometry :args="[0.046, 0.058, 1, 6]" />
      <TresMeshStandardMaterial color="#ffdbac" :flatShading="true" :roughness="1" />
    </TresMesh>
    <TresMesh ref="rightUpper" :visible="false">
      <TresCylinderGeometry :args="[0.058, 0.072, 1, 6]" />
      <TresMeshStandardMaterial color="#d97706" :flatShading="true" :roughness="0.9" />
    </TresMesh>
    <TresMesh ref="rightFore" :visible="false">
      <TresCylinderGeometry :args="[0.046, 0.058, 1, 6]" />
      <TresMeshStandardMaterial color="#ffdbac" :flatShading="true" :roughness="1" />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import { Vector3, type Group, type Mesh } from 'three'
import { bagHit } from '@/game/ambience'
import {
  BAG_DROP,
  BAG_H,
  BAG_PIVOT_Y,
  BAG_R,
  RING_EYE,
  RING_STANCE,
  RING_TOP,
  RING_X,
  RING_Z,
  ringPunch,
  ringPunchSide,
  sparring,
  updateRingNear,
} from '@/game/ring'
import { hikerPose } from '@/game/spot'

const swingRef = shallowRef<Group | null>(null)
const bagRef = shallowRef<Group | null>(null)
const leftFist = shallowRef<Group | null>(null)
const rightFist = shallowRef<Group | null>(null)
const leftUpper = shallowRef<Mesh | null>(null)
const leftFore = shallowRef<Mesh | null>(null)
const rightUpper = shallowRef<Mesh | null>(null)
const rightFore = shallowRef<Mesh | null>(null)

const chainLen = BAG_DROP - BAG_H / 2
const chainCenter = chainLen / 2

const lean = { x: 0, z: 0, vx: 0, vz: 0 }
const fist = { side: -1, t: 1, live: false, hit: false }
let squash = 0
let gloveTime = 0
let pending = false
let pendingSide: 'left' | 'right' = 'right'
let parked = false

const { camera } = useTresContext()
const eye = new Vector3()
const offset = new Vector3()
const bagWorld = new Vector3()
const guardL = new Vector3(-0.2, -0.2, -0.58)
const guardR = new Vector3(0.22, -0.2, -0.55)
const jabL = new Vector3(-0.05, -0.03, -1.08)
const jabR = new Vector3(0.05, -0.03, -1.08)
const shoulderL = new Vector3(-0.4, -0.46, -0.28)
const shoulderR = new Vector3(0.42, -0.46, -0.26)
const localL = new Vector3()
const localR = new Vector3()
const elbow = new Vector3()
const wrist = new Vector3()
const worldA = new Vector3()
const worldB = new Vector3()
const limbDir = new Vector3()
const yAxis = new Vector3(0, 1, 0)

function approach(current: number, target: number, rate: number, dt: number) {
  const max = rate * dt
  const delta = target - current
  if (Math.abs(delta) <= max) return target
  return current + Math.sign(delta) * max
}

function extendOf(t: number) {
  const u = Math.min(1, Math.max(0, t))
  if (u < 0.34) return Math.sin((u / 0.34) * Math.PI * 0.5)
  return Math.cos(((u - 0.34) / 0.66) * Math.PI * 0.5)
}

function fistLocal(side: number, extend: number, target: Vector3) {
  const from = side < 0 ? guardL : guardR
  const to = side < 0 ? jabL : jabR
  target.copy(from).lerp(to, extend)
  target.y += Math.sin(gloveTime * 2.4 + side) * 0.012 * (1 - extend)
}

function placeFist(glove: Group, side: number, extend: number, closeness: number, local: Vector3) {
  const cam = camera.activeCamera.value
  if (!cam) return
  fistLocal(side, extend, local)
  offset.copy(local).applyQuaternion(cam.quaternion)
  glove.position.copy(cam.position).add(offset)
  glove.quaternion.copy(cam.quaternion)
  if (extend > 0.001) glove.rotateX(extend * 0.42)
  const shown = closeness > 0.2
  glove.visible = shown
  glove.scale.setScalar(shown ? 0.88 + closeness * 0.12 : 0.001)
}

function toWorld(local: Vector3, out: Vector3) {
  const cam = camera.activeCamera.value
  if (!cam) return out.set(0, 0, 0)
  return out.copy(local).applyQuaternion(cam.quaternion).add(cam.position)
}

function placeLimb(mesh: Mesh | null, from: Vector3, to: Vector3, shown: boolean) {
  if (!mesh) return
  limbDir.copy(to).sub(from)
  const len = limbDir.length()
  if (!shown || len < 0.02) {
    mesh.visible = false
    return
  }
  limbDir.multiplyScalar(1 / len)
  if (limbDir.y < -0.98) limbDir.set(0.02, -0.98, 0.02).normalize()
  mesh.visible = true
  mesh.position.copy(from).add(to).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(yAxis, limbDir)
  mesh.scale.set(1, len, 1)
}

function placeArm(
  side: number,
  local: Vector3,
  extend: number,
  shown: boolean,
  upper: Mesh | null,
  fore: Mesh | null,
) {
  const shoulder = side < 0 ? shoulderL : shoulderR
  elbow.copy(shoulder).lerp(local, 0.48)
  elbow.y -= 0.16 * (1 - extend)
  elbow.x += side * 0.04 * (1 - extend)
  wrist.copy(local)
  wrist.z += 0.07
  toWorld(shoulder, worldA)
  toWorld(elbow, worldB)
  placeLimb(upper, worldA, worldB, shown)
  toWorld(elbow, worldA)
  toWorld(wrist, worldB)
  placeLimb(fore, worldA, worldB, shown)
}

function holdBag(reach: number) {
  if (reach <= 1.15) return
  const scale = 1.15 / reach
  lean.x *= scale
  lean.z *= scale
  const nx = lean.x / 1.15
  const nz = lean.z / 1.15
  const outward = lean.vx * nx + lean.vz * nz
  if (outward > 0) {
    lean.vx -= outward * nx * 1.4
    lean.vz -= outward * nz * 1.4
  }
}

function uncover(glove: Group | null) {
  if (!glove) return
  glove.frustumCulled = false
  glove.traverse((child) => {
    child.frustumCulled = false
  })
}

watch([leftFist, rightFist], () => {
  uncover(leftFist.value)
  uncover(rightFist.value)
})

watch([leftUpper, leftFore, rightUpper, rightFore], () => {
  for (const limb of [leftUpper.value, leftFore.value, rightUpper.value, rightFore.value]) {
    if (limb) limb.frustumCulled = false
  }
})

watch(ringPunch, () => {
  if (!sparring.value) return
  pending = true
  pendingSide = ringPunchSide.value
})

function parkLimbs() {
  if (leftFist.value) leftFist.value.visible = false
  if (rightFist.value) rightFist.value.visible = false
  for (const limb of [leftUpper.value, leftFore.value, rightUpper.value, rightFore.value]) {
    if (limb) limb.visible = false
  }
}

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  const dt = Math.min(delta, 0.05)
  updateRingNear(hikerPose.x, hikerPose.y, hikerPose.z, hikerPose.ready)
  const calm =
    !sparring.value &&
    !pending &&
    !fist.live &&
    squash === 0 &&
    lean.x === 0 &&
    lean.z === 0 &&
    Math.abs(lean.vx) < 0.0001 &&
    Math.abs(lean.vz) < 0.0001
  if (calm) {
    if (!parked) {
      parkLimbs()
      parked = true
    }
    return
  }
  parked = false

  const swing = swingRef.value
  const bag = bagRef.value
  const left = leftFist.value
  const right = rightFist.value
  if (!swing || !bag || !left || !right) return

  gloveTime += dt
  lean.vx += (-26 * lean.x - 4.2 * lean.vx) * dt
  lean.vz += (-26 * lean.z - 4.2 * lean.vz) * dt
  lean.x += lean.vx * dt
  lean.z += lean.vz * dt
  holdBag(Math.hypot(lean.x, lean.z))
  swing.rotation.x = -lean.z / BAG_DROP
  swing.rotation.z = lean.x / BAG_DROP
  squash = approach(squash, 0, 3.4, dt)
  bag.scale.set(1 + squash * 0.1, 1 - squash * 0.14, 1 + squash * 0.1)

  const cam = camera.activeCamera.value
  if (fist.live) {
    fist.t += dt / 0.36
    if (fist.t >= 1) fist.live = false
  }
  eye.set(RING_STANCE.x, RING_TOP + RING_EYE, RING_STANCE.z)
  const dist = cam ? cam.position.distanceTo(eye) : 8
  const closeness = sparring.value ? 1 - Math.min(1, Math.max(0, dist - 0.35) / 4) : 0
  if (!sparring.value) pending = false
  if (pending && closeness > 0.72 && !(fist.live && fist.t < 0.2)) {
    pending = false
    fist.side = pendingSide === 'left' ? -1 : 1
    fist.t = 0
    fist.live = true
    fist.hit = false
  }
  const extend = extendOf(fist.t)
  const leftExtend = fist.live && fist.side < 0 ? extend : 0
  const rightExtend = fist.live && fist.side > 0 ? extend : 0
  const shown = closeness > 0.2
  placeFist(left, -1, leftExtend, closeness, localL)
  placeFist(right, 1, rightExtend, closeness, localR)
  placeArm(-1, localL, leftExtend, shown, leftUpper.value, leftFore.value)
  placeArm(1, localR, rightExtend, shown, rightUpper.value, rightFore.value)

  if (!fist.live || fist.hit || !cam || closeness < 0.72 || fist.t < 0.34 || fist.t > 0.58) return
  fist.hit = true
  const glove = fist.side < 0 ? left : right
  bag.getWorldPosition(bagWorld)
  const reached = glove.position.distanceTo(bagWorld) < 0.55
  if (!reached) {
    bagHit(false)
    return
  }
  cam.getWorldDirection(offset)
  offset.y = 0
  if (offset.lengthSq() < 1e-4) offset.set(0, 0, -1)
  else offset.normalize()
  lean.vx += offset.x * 5.2
  lean.vz += offset.z * 5.2
  squash = 1
  bagHit(true)
})
</script>
