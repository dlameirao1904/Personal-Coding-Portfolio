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
const PLAY: MarinaPlay[] = ['run', 'pet', 'bite']
let time = 0
let modeTime = 0
let runAngle = 0

function onGreet() {
  greetMarina()
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
    mode = PLAY[Math.floor(modeTime / 6.5) % PLAY.length]
  } else {
    modeTime = 0
  }

  let tx = 0
  let tz = -3.25
  let tyaw = 0
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
  } else if (mode === 'run') {
    runAngle += dt * 1.35
    tx = Math.sin(runAngle) * 2.2
    tz = 2.3 + Math.cos(runAngle) * 1.5
    tyaw = runAngle + Math.PI / 2
  } else if (mode === 'pet' || mode === 'bite') {
    tx = 0.15
    tz = 1.7
    tyaw = 0.2
  }

  root.position.x = approach(root.position.x, tx, 2.4, dt)
  root.position.z = approach(root.position.z, tz, 2.4, dt)
  root.rotation.y = easeAngle(root.rotation.y, tyaw, dt)
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

  const sweep = (Math.sin(time * 2.2) + 1) * 0.5
  const stride = mode === 'run' ? Math.sin(time * 11) : 0
  const standing = mode === 'bake' && !waving ? 0 : 1
  const leg = footBitten.value
  if (leg) {
    const lift = mode === 'bite' ? 0.7 + Math.sin(time * 7) * 0.2 : 0
    leg.rotation.x = (1 - standing) * 1.25 + standing * (stride * 0.85 - lift)
  }
  if (legLeft.value) legLeft.value.rotation.x = (1 - standing) * 1.25 + standing * -stride * 0.85
  if (shinRight.value) shinRight.value.rotation.x = (1 - standing) * -1.35
  if (shinLeft.value) shinLeft.value.rotation.x = (1 - standing) * -1.35

  const arm = armRight.value
  if (arm) {
    if (waving) {
      arm.rotation.x = 0.35
      arm.rotation.y = 0
      arm.rotation.z = 0.15
    } else if (mode === 'bake') {
      arm.rotation.x = 0.85 + sweep * 0.7
      arm.rotation.y = 0.15 + Math.sin(time * 2.2) * 0.45
      arm.rotation.z = 0.35 + (1 - sweep) * 0.25
    } else if (mode === 'run') {
      arm.rotation.x = -stride * 0.7
      arm.rotation.y = 0
      arm.rotation.z = 0.15
    } else {
      arm.rotation.x = 0.4
      arm.rotation.y = 0.1
      arm.rotation.z = 0.2
    }
  }
  const pet = armLeft.value
  if (pet) {
    if (waving) {
      pet.rotation.x = -1.15
      pet.rotation.y = 0
      pet.rotation.z = Math.sin(time * 9) * 0.55
    } else if (mode === 'pet') {
      pet.rotation.x = 1.55 + Math.sin(time * 6) * 0.18
      pet.rotation.z = -0.15
    } else if (mode === 'run') {
      pet.rotation.x = stride * 0.7
      pet.rotation.z = -0.2
    } else if (mode === 'bake') {
      pet.rotation.x = 1.05
      pet.rotation.z = -0.4
    } else {
      pet.rotation.x = 0.35
      pet.rotation.z = -0.2
    }
  }
  const head = headRef.value
  if (head) {
    head.rotation.y = greeting ? Math.sin(time * 2) * 0.12 : 0
    head.rotation.x = waving
      ? -0.12
      : greeting
        ? -0.42
        : mode === 'pet'
          ? 0.7
          : mode === 'bite'
            ? 0.45
            : mode === 'run'
              ? 0.05
              : 0.28 + Math.sin(time * 2.2) * 0.06
  }
})
</script>
