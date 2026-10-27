<template>
  <TresGroup :position="[ATELIER.x, ATELIER.y, ATELIER.z]" :rotation="[0, ATELIER.yaw, 0]">
    <TresMesh :position="[0, 0.02, -3.1]" receive-shadow>
      <TresBoxGeometry :args="[6.6, 0.05, 6.4]" />
      <TresMeshStandardMaterial color="#efe6d6" :roughness="1" />
    </TresMesh>
    <TresMesh :position="[0, 0.05, -3.3]" receive-shadow>
      <TresBoxGeometry :args="[3.4, 0.02, 2.6]" />
      <TresMeshStandardMaterial color="#c46a62" :roughness="1" />
    </TresMesh>

    <TresMesh :position="[0, 1.4, -6.05]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[6.8, 2.8, 0.16]" />
      <TresMeshStandardMaterial color="#f4efe4" :flatShading="true" :roughness="1" />
    </TresMesh>
    <TresMesh :position="[-3.3, 1.4, -3.15]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.16, 2.8, 5.8]" />
      <TresMeshStandardMaterial color="#efe6d6" :flatShading="true" :roughness="1" />
    </TresMesh>
    <TresMesh :position="[3.3, 1.4, -3.15]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.16, 2.8, 5.8]" />
      <TresMeshStandardMaterial color="#efe6d6" :flatShading="true" :roughness="1" />
    </TresMesh>
    <TresMesh :position="[-2.2, 1.6, -5.96]">
      <TresBoxGeometry :args="[1.1, 0.9, 0.06]" />
      <TresMeshStandardMaterial color="#9ec4d4" :roughness="0.2" />
    </TresMesh>
    <TresMesh :position="[0, 2.85, -3.1]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[7.2, 0.12, 6.6]" />
      <TresMeshStandardMaterial color="#8d5a45" :flatShading="true" :roughness="0.9" />
    </TresMesh>

    <TresMesh :position="[-2.7, 1.25, -5.75]" cast-shadow>
      <TresBoxGeometry :args="[0.28, 1.7, 0.7]" />
      <TresMeshStandardMaterial color="#6d5138" :flatShading="true" :roughness="0.9" />
    </TresMesh>
    <TresMesh :position="[-2.7, 1.7, -5.35]" cast-shadow>
      <TresBoxGeometry :args="[0.22, 0.08, 0.16]" />
      <TresMeshStandardMaterial color="#f7f3ea" :flatShading="true" />
    </TresMesh>
    <TresMesh :position="[-2.7, 1.45, -5.35]" cast-shadow>
      <TresBoxGeometry :args="[0.18, 0.1, 0.14]" />
      <TresMeshStandardMaterial color="#e7a0b4" :flatShading="true" />
    </TresMesh>

    <TresGroup :position="[0.1, 0, -2.7]">
      <TresMesh :position="[-0.55, 0.38, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.08, 0.76, 0.08]" />
        <TresMeshStandardMaterial color="#6d5138" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0.55, 0.38, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.08, 0.76, 0.08]" />
        <TresMeshStandardMaterial color="#6d5138" :flatShading="true" :roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, 0.78, 0]" cast-shadow receive-shadow>
        <TresBoxGeometry :args="[1.35, 0.08, 0.78]" />
        <TresMeshStandardMaterial color="#a56b42" :flatShading="true" :roughness="0.85" />
      </TresMesh>

      <TresGroup ref="cakeRef" :position="[0, 0.84, 0]">
        <TresMesh :position="[0, 0.015, 0]" receive-shadow>
          <TresCylinderGeometry :args="[0.36, 0.36, 0.03, 10]" />
          <TresMeshStandardMaterial color="#f4efe6" :roughness="0.45" />
        </TresMesh>
        <TresMesh ref="layer0" :position="[0, 0.105, 0]" cast-shadow>
          <TresCylinderGeometry :args="[0.27, 0.28, 0.15, 8]" />
          <TresMeshStandardMaterial color="#c48a62" :flatShading="true" :roughness="0.85" />
        </TresMesh>
        <TresMesh ref="layer1" :position="[0, 0.205, 0]" cast-shadow>
          <TresCylinderGeometry :args="[0.29, 0.29, 0.05, 8]" />
          <TresMeshStandardMaterial color="#fff8ee" :flatShading="true" :roughness="0.4" />
        </TresMesh>
        <TresMesh ref="layer2" :position="[0, 0.3, 0]" cast-shadow>
          <TresCylinderGeometry :args="[0.25, 0.26, 0.14, 8]" />
          <TresMeshStandardMaterial color="#b87850" :flatShading="true" :roughness="0.85" />
        </TresMesh>
        <TresMesh ref="layer3" :position="[0, 0.41, 0]" cast-shadow>
          <TresCylinderGeometry :args="[0.3, 0.26, 0.08, 8]" />
          <TresMeshStandardMaterial color="#e7a0b4" :flatShading="true" :roughness="0.55" />
        </TresMesh>
        <TresGroup ref="layer4" :position="[0.11, 0.45, 0.04]">
          <TresMesh
            v-for="petal in petals"
            :key="petal.rotation[1]"
            :position="petal.position"
            :rotation="petal.rotation"
          >
            <TresBoxGeometry :args="[0.04, 0.016, 0.055]" />
            <TresMeshStandardMaterial color="#d4537a" :flatShading="true" :roughness="0.7" />
          </TresMesh>
          <TresMesh :position="[0, 0.02, 0]">
            <TresCylinderGeometry :args="[0.022, 0.022, 0.02, 6]" />
            <TresMeshStandardMaterial color="#e7c15a" :flatShading="true" />
          </TresMesh>
        </TresGroup>
        <TresGroup ref="layer5" :position="[0, 0.45, 0]">
          <TresMesh :position="[0, 0.08, 0]" cast-shadow>
            <TresCylinderGeometry :args="[0.018, 0.018, 0.16, 6]" />
            <TresMeshStandardMaterial color="#f4e7c3" :roughness="0.6" />
          </TresMesh>
          <TresMesh ref="flameRef" :position="[0, 0.2, 0]">
            <TresConeGeometry :args="[0.026, 0.07, 5]" />
            <TresMeshStandardMaterial
              color="#ffb347"
              emissive="#e36b2c"
              :emissiveIntensity="0.85"
            />
          </TresMesh>
        </TresGroup>
      </TresGroup>
    </TresGroup>

    <Marina />
    <TresPointLight :position="[0, 2.2, -3]" :intensity="3.2" :distance="11" color="#ffd2a8" />
  </TresGroup>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import type { Group, Mesh, Object3D } from 'three'
import { ATELIER, atelierWalls } from '@/game/atelier'
import { baking, cakePlaced, updateAtelierNear } from '@/game/cake'
import { hikerPose } from '@/game/spot'
import Marina from './Marina.vue'

const cakeRef = shallowRef<Group | null>(null)
const layer0 = shallowRef<Object3D | null>(null)
const layer1 = shallowRef<Object3D | null>(null)
const layer2 = shallowRef<Object3D | null>(null)
const layer3 = shallowRef<Object3D | null>(null)
const layer4 = shallowRef<Object3D | null>(null)
const layer5 = shallowRef<Object3D | null>(null)
const flameRef = shallowRef<Mesh | null>(null)
const layers = [layer0, layer1, layer2, layer3, layer4, layer5]
const restY = [0.105, 0.205, 0.3, 0.41, 0.45, 0.45]
const born = [-10, -10, -10, -10, -10, -10]
const petals = [0, 1, 2, 3, 4].map((i) => {
  const angle = (i / 5) * Math.PI * 2
  return {
    position: [Math.cos(angle) * 0.055, 0.012, Math.sin(angle) * 0.055] as [number, number, number],
    rotation: [0.35, angle, 0] as [number, number, number],
  }
})
let cakeTime = 0
const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  const dt = Math.min(delta, 0.05)
  cakeTime += dt
  updateAtelierNear(hikerPose.x, hikerPose.y, hikerPose.z, hikerPose.ready)
  const cake = cakeRef.value
  if (cake) {
    if (baking.value) {
      let spin = -cake.rotation.y
      while (spin > Math.PI) spin -= Math.PI * 2
      while (spin < -Math.PI) spin += Math.PI * 2
      cake.rotation.y += spin * (1 - Math.exp(-dt * 6))
    } else {
      cake.rotation.y += dt * 0.35
    }
  }
  const count = baking.value ? cakePlaced.value : layers.length
  layers.forEach((layer, index) => {
    const piece = layer.value
    if (!piece) return
    const on = index < count
    if (on && !piece.visible) born[index] = cakeTime
    piece.visible = on
    if (!on) return
    if (!baking.value) {
      piece.position.y = restY[index]
      born[index] = -10
      return
    }
    const age = cakeTime - born[index]
    piece.position.y = restY[index] + Math.exp(-age * 9) * 0.36
  })
  const flame = flameRef.value
  if (flame) {
    const flicker = 0.82 + Math.sin(cakeTime * 17) * 0.14 + Math.sin(cakeTime * 29) * 0.06
    flame.scale.set(1, Math.max(0.45, flicker), 1)
  }
})

const { scene } = useTresContext()
const walls = atelierWalls()
let tries = 0
let alive = true

function addWalls() {
  if (!alive) return
  const solids = scene.value?.getObjectByName('walkable')?.userData.solids as
    | { x: number; z: number; r: number }[]
    | undefined
  if (!solids) {
    if (tries++ < 40) requestAnimationFrame(addWalls)
    return
  }
  if (!solids.includes(walls[0])) solids.push(...walls)
}

onMounted(addWalls)

onUnmounted(() => {
  alive = false
  const solids = scene.value?.getObjectByName('walkable')?.userData.solids as
    | { x: number; z: number; r: number }[]
    | undefined
  if (!solids) return
  for (const wall of walls) {
    const index = solids.indexOf(wall)
    if (index >= 0) solids.splice(index, 1)
  }
})
</script>
