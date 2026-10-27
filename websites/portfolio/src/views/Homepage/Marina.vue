<template>
  <TresGroup ref="rootRef" :position="[0, 0, -3.25]" @click="onGreet">
    <TresGroup :position="[0, 0.46, 0]">
      <TresMesh cast-shadow>
        <TresCylinderGeometry :args="[0.16, 0.18, 0.46, 6]" />
        <TresMeshStandardMaterial color="#6d5138" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, 0.26, 0]" cast-shadow>
        <TresCylinderGeometry :args="[0.28, 0.28, 0.08, 8]" />
        <TresMeshStandardMaterial color="#8a6244" :flatShading="true" :roughness="0.85" />
      </TresMesh>
    </TresGroup>

    <TresGroup ref="footBitten" :position="[0.1, 0.72, 0.02]" :rotation="[1.25, 0.08, 0.05]">
      <TresMesh :position="[0, -0.2, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.16, 0.36, 0.16]" />
        <TresMeshStandardMaterial color="#1a1a1a" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresGroup ref="shinRight" :position="[0, -0.4, 0]" :rotation="[-1.35, 0, 0]">
        <TresMesh :position="[0, -0.18, 0]" cast-shadow>
          <TresBoxGeometry :args="[0.15, 0.34, 0.15]" />
          <TresMeshStandardMaterial color="#1a1a1a" :flatShading="true" :roughness="0.9" />
        </TresMesh>
        <TresMesh :position="[0, -0.36, 0.05]" cast-shadow>
          <TresBoxGeometry :args="[0.16, 0.08, 0.26]" />
          <TresMeshStandardMaterial color="#2a2422" :flatShading="true" :roughness="0.8" />
        </TresMesh>
      </TresGroup>
    </TresGroup>
    <TresGroup ref="legLeft" :position="[-0.1, 0.72, 0.02]" :rotation="[1.25, -0.08, -0.05]">
      <TresMesh :position="[0, -0.2, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.16, 0.36, 0.16]" />
        <TresMeshStandardMaterial color="#1a1a1a" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresGroup ref="shinLeft" :position="[0, -0.4, 0]" :rotation="[-1.35, 0, 0]">
        <TresMesh :position="[0, -0.18, 0]" cast-shadow>
          <TresBoxGeometry :args="[0.15, 0.34, 0.15]" />
          <TresMeshStandardMaterial color="#1a1a1a" :flatShading="true" :roughness="0.9" />
        </TresMesh>
        <TresMesh :position="[0, -0.36, 0.05]" cast-shadow>
          <TresBoxGeometry :args="[0.16, 0.08, 0.26]" />
          <TresMeshStandardMaterial color="#2a2422" :flatShading="true" :roughness="0.8" />
        </TresMesh>
      </TresGroup>
    </TresGroup>

    <TresMesh :position="[0, 0.78, -0.08]" cast-shadow>
      <TresBoxGeometry :args="[0.46, 0.16, 0.32]" />
      <TresMeshStandardMaterial color="#c4bfb6" :flatShading="true" :roughness="0.95" />
    </TresMesh>
    <TresMesh :position="[0, 0.7, -0.2]" cast-shadow>
      <TresBoxGeometry :args="[0.5, 0.28, 0.16]" />
      <TresMeshStandardMaterial color="#d5d0c6" :flatShading="true" :roughness="0.95" />
    </TresMesh>
    <TresMesh :position="[0.2, 0.66, 0.08]" cast-shadow>
      <TresBoxGeometry :args="[0.14, 0.1, 0.14]" />
      <TresMeshStandardMaterial color="#b7b2a8" :flatShading="true" :roughness="0.95" />
    </TresMesh>

    <TresMesh :position="[0, 1.08, 0]" cast-shadow>
      <TresBoxGeometry :args="[0.42, 0.48, 0.26]" />
      <TresMeshStandardMaterial color="#4a474c" :flatShading="true" :roughness="0.9" />
    </TresMesh>
    <TresMesh :position="[0, 1.12, 0.14]">
      <TresBoxGeometry :args="[0.16, 0.12, 0.02]" />
      <TresMeshStandardMaterial color="#8a4632" :flatShading="true" :roughness="0.8" />
    </TresMesh>

    <TresGroup ref="armRight" :position="[-0.28, 1.22, 0.04]" :rotation="[1.15, 0.15, 0.35]">
      <TresMesh :position="[0, -0.16, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.12, 0.28, 0.12]" />
        <TresMeshStandardMaterial color="#4a474c" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, -0.34, 0.02]" cast-shadow>
        <TresBoxGeometry :args="[0.1, 0.22, 0.1]" />
        <TresMeshStandardMaterial color="#e4b394" :flatShading="true" :roughness="0.85" />
      </TresMesh>
      <TresMesh :position="[0, -0.46, 0.04]" cast-shadow>
        <TresBoxGeometry :args="[0.08, 0.08, 0.1]" />
        <TresMeshStandardMaterial color="#e4b394" :flatShading="true" :roughness="0.85" />
      </TresMesh>
      <TresMesh :position="[0, -0.5, 0.1]" :rotation="[0.6, 0, 0]" cast-shadow>
        <TresConeGeometry :args="[0.04, 0.16, 5]" />
        <TresMeshStandardMaterial color="#f4f1ea" :flatShading="true" :roughness="0.7" />
      </TresMesh>
    </TresGroup>

    <TresGroup ref="armLeft" :position="[0.28, 1.22, 0.04]" :rotation="[1.05, -0.2, -0.4]">
      <TresMesh :position="[0, -0.16, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.12, 0.28, 0.12]" />
        <TresMeshStandardMaterial color="#4a474c" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, -0.34, 0.02]" cast-shadow>
        <TresBoxGeometry :args="[0.1, 0.22, 0.1]" />
        <TresMeshStandardMaterial color="#e4b394" :flatShading="true" :roughness="0.85" />
      </TresMesh>
      <TresMesh :position="[0, -0.24, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.13, 0.06, 0.13]" />
        <TresMeshStandardMaterial color="#1c1c1c" :flatShading="true" :roughness="0.5" />
      </TresMesh>
      <TresMesh :position="[0, -0.24, 0.06]">
        <TresBoxGeometry :args="[0.07, 0.04, 0.02]" />
        <TresMeshStandardMaterial color="#d7e4ec" :flatShading="true" :roughness="0.3" />
      </TresMesh>
      <TresMesh :position="[0, -0.46, 0.04]" cast-shadow>
        <TresBoxGeometry :args="[0.09, 0.08, 0.1]" />
        <TresMeshStandardMaterial color="#e4b394" :flatShading="true" :roughness="0.85" />
      </TresMesh>
    </TresGroup>

    <TresGroup ref="headRef" :position="[0, 1.5, 0.02]">
      <TresMesh cast-shadow>
        <TresBoxGeometry :args="[0.3, 0.32, 0.28]" />
        <TresMeshStandardMaterial color="#e4b394" :flatShading="true" :roughness="0.85" />
      </TresMesh>
      <TresMesh :position="[0, 0.12, -0.02]" cast-shadow>
        <TresBoxGeometry :args="[0.32, 0.14, 0.3]" />
        <TresMeshStandardMaterial color="#1a1210" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, 0.02, -0.12]" cast-shadow>
        <TresBoxGeometry :args="[0.32, 0.28, 0.12]" />
        <TresMeshStandardMaterial color="#1a1210" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0.04, -0.08, -0.22]" :rotation="[0.4, 0, 0.2]" cast-shadow>
        <TresBoxGeometry :args="[0.1, 0.28, 0.1]" />
        <TresMeshStandardMaterial color="#1a1210" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0.15, -0.02, 0.08]" cast-shadow>
        <TresBoxGeometry :args="[0.045, 0.2, 0.04]" />
        <TresMeshStandardMaterial color="#1a1210" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[-0.15, -0.02, 0.08]" cast-shadow>
        <TresBoxGeometry :args="[0.045, 0.2, 0.04]" />
        <TresMeshStandardMaterial color="#1a1210" :flatShading="true" :roughness="0.9" />
      </TresMesh>

      <TresMesh :position="[-0.07, 0.04, 0.145]">
        <TresBoxGeometry :args="[0.045, 0.04, 0.02]" />
        <TresMeshStandardMaterial color="#1a1210" />
      </TresMesh>
      <TresMesh :position="[0.07, 0.04, 0.145]">
        <TresBoxGeometry :args="[0.045, 0.04, 0.02]" />
        <TresMeshStandardMaterial color="#1a1210" />
      </TresMesh>
      <TresMesh :position="[0, -0.04, 0.15]">
        <TresBoxGeometry :args="[0.04, 0.06, 0.03]" />
        <TresMeshStandardMaterial color="#e4b394" />
      </TresMesh>
      <TresMesh :position="[0, -0.1, 0.15]" :rotation="[0, 0, 0]">
        <TresBoxGeometry :args="[0.1, 0.025, 0.02]" />
        <TresMeshStandardMaterial color="#8a4632" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { useLoop } from '@tresjs/core'
import { Vector3, type Group } from 'three'
import { marinaVoice } from '@/game/ambience'
import {
  atlasPlaying,
  greetMarina,
  hikerPose,
  marinaGreeting,
  marinaSpot,
  marinaWave,
  type MarinaPlay,
} from '@/game/spot'

const rootRef = shallowRef<Group | null>(null)
const armRight = shallowRef<Group | null>(null)
const armLeft = shallowRef<Group | null>(null)
const headRef = shallowRef<Group | null>(null)
const footBitten = shallowRef<Group | null>(null)
const legLeft = shallowRef<Group | null>(null)
const shinRight = shallowRef<Group | null>(null)
const shinLeft = shallowRef<Group | null>(null)
const world = new Vector3()
const BEATS: Array<{ mode: MarinaPlay; t: number }> = [
  { mode: 'run', t: 8 },
  { mode: 'pet', t: 5.5 },
  { mode: 'bite', t: 5 },
]
let time = 0
let modeTime = 0
let beat = 0
let runAngle = 0

function onGreet() {
  greetMarina()
  marinaVoice()
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
  return current + delta * (1 - Math.exp(-dt * 8))
}

function glide(current: number, target: number, dt: number, rate = 9) {
  return current + (target - current) * (1 - Math.exp(-dt * rate))
}

function easeRot(group: Group | null, x: number, y: number, z: number, dt: number, rate = 8) {
  if (!group) return
  group.rotation.x = glide(group.rotation.x, x, dt, rate)
  group.rotation.y = glide(group.rotation.y, y, dt, rate)
  group.rotation.z = glide(group.rotation.z, z, dt, rate)
}

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  const dt = Math.min(delta, 0.05)
  time += dt
  const root = rootRef.value
  if (!root) return
  const greeting = marinaGreeting.value
  const waving = greeting && marinaWave.value
  const playing = atlasPlaying.value && !greeting
  let mode: MarinaPlay = 'bake'
  if (playing) {
    modeTime += dt
    if (modeTime > BEATS[beat].t) {
      modeTime = 0
      beat = (beat + 1) % BEATS.length
    }
    mode = BEATS[beat].mode
  } else {
    modeTime = 0
    beat = 0
  }

  const stride = Math.sin(time * 10.5)
  const kick = Math.sin(time * 6.2)
  let tx = 0
  let ty = 0
  let tz = -3.25
  let tyaw = 0
  let rightX = 1.15
  let rightY = 0.15
  let rightZ = 0.35
  let leftX = 1.05
  let leftY = -0.2
  let leftZ = -0.4
  let thighR = 1.25
  let thighL = 1.25
  let shinR = -1.35
  let shinL = -1.35
  let headX = 0.28 + Math.sin(time * 2.2) * 0.06
  let headY = 0
  let lean = 0

  if (waving) {
    root.getWorldPosition(world)
    let parentYaw = 0
    let parent = root.parent
    while (parent) {
      parentYaw += parent.rotation.y
      parent = parent.parent
      if (!parent) break
    }
    tyaw = Math.atan2(hikerPose.x - world.x, hikerPose.z - world.z) - parentYaw
    tx = root.position.x
    tz = root.position.z
    rightX = 0.35
    rightY = 0
    rightZ = 0.15
    leftX = -1.15
    leftY = 0
    leftZ = Math.sin(time * 9) * 0.55
    thighR = 0.08
    thighL = 0.08
    shinR = -0.12
    shinL = -0.12
    headX = -0.12
    headY = Math.sin(time * 2) * 0.12
  } else if (mode === 'run') {
    runAngle += dt * 1.2
    const radius = 2.15 + Math.sin(runAngle * 2) * 0.35
    tx = Math.sin(runAngle) * radius
    tz = 2.05 + Math.cos(runAngle) * (radius * 0.72)
    ty = Math.abs(stride) * 0.055
    tyaw = runAngle + Math.PI / 2
    lean = Math.cos(runAngle) * 0.12
    const knee = (step: number) => Math.max(0, -step) * 1.05
    thighR = stride * 0.95
    thighL = -stride * 0.95
    shinR = -knee(stride)
    shinL = -knee(-stride)
    rightX = -stride * 0.85
    rightY = 0
    rightZ = 0.12
    leftX = stride * 0.85
    leftY = 0
    leftZ = -0.12
    headX = 0.06
  } else if (mode === 'pet') {
    tx = 0.15
    ty = -0.18
    tz = 1.7
    tyaw = 0.15
    thighR = 1.05
    thighL = 1.05
    shinR = -1.25
    shinL = -1.25
    rightX = 0.15
    rightY = 0.25
    rightZ = 0.55
    leftX = 1.82 + Math.sin(time * 5.2) * 0.28
    leftY = 0.2
    leftZ = -0.06
    headX = 0.78
    headY = Math.sin(time * 1.6) * 0.08
  } else if (mode === 'bite') {
    tx = 0.15
    ty = Math.max(0, kick) * 0.045
    tz = 1.7
    tyaw = 0.15
    thighR = -0.35 - kick * 0.28
    thighL = 0.18
    shinR = -0.95 - kick * 0.2
    shinL = -0.22
    rightX = -0.35
    rightY = 0.1
    rightZ = 0.85
    leftX = 0.25
    leftY = -0.15
    leftZ = -0.85
    headX = 0.58 + kick * 0.06
    headY = Math.sin(time * 3) * 0.16
  } else {
    const sweep = (Math.sin(time * 2.2) + 1) * 0.5
    rightX = 0.85 + sweep * 0.7
    rightY = 0.15 + Math.sin(time * 2.2) * 0.45
    rightZ = 0.35 + (1 - sweep) * 0.25
    if (greeting) {
      headX = -0.42
      headY = Math.sin(time * 2) * 0.14
    }
  }

  root.position.x = approach(root.position.x, tx, mode === 'run' ? 3.1 : 2.4, dt)
  root.position.y = glide(root.position.y, ty, dt, 6)
  root.position.z = approach(root.position.z, tz, mode === 'run' ? 3.1 : 2.4, dt)
  root.rotation.y = easeAngle(root.rotation.y, tyaw, dt)
  root.rotation.z = glide(root.rotation.z, lean, dt, 4)
  root.getWorldPosition(world)
  let yaw = root.rotation.y
  let parent = root.parent
  while (parent) {
    yaw += parent.rotation.y
    parent = parent.parent
  }
  marinaSpot.x = world.x
  marinaSpot.y = world.y
  marinaSpot.z = world.z
  marinaSpot.yaw = yaw
  marinaSpot.mode = mode
  marinaSpot.ready = true

  const lively = mode === 'run' || mode === 'bite' || waving ? 16 : 7
  easeRot(footBitten.value, thighR, footBitten.value?.rotation.y ?? 0.08, 0.05, dt, lively)
  easeRot(legLeft.value, thighL, legLeft.value?.rotation.y ?? -0.08, -0.05, dt, lively)
  easeRot(shinRight.value, shinR, 0, 0, dt, lively)
  easeRot(shinLeft.value, shinL, 0, 0, dt, lively)
  easeRot(armRight.value, rightX, rightY, rightZ, dt, waving ? 14 : lively)
  easeRot(armLeft.value, leftX, leftY, leftZ, dt, waving ? 14 : lively)
  easeRot(headRef.value, headX, headY, 0, dt, 10)
})
</script>
