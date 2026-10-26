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
      <TresMesh receive-shadow>
        <TresCylinderGeometry :args="[0.34, 0.34, 0.03, 10]" />
        <TresMeshStandardMaterial color="#f7f3ea" :roughness="0.4" />
      </TresMesh>
      <TresMesh :position="[0, 0.08, 0]" cast-shadow>
        <TresCylinderGeometry :args="[0.28, 0.3, 0.14, 8]" />
        <TresMeshStandardMaterial color="#c48a62" :flatShading="true" :roughness="0.85" />
      </TresMesh>
      <TresMesh :position="[0, 0.18, 0]" cast-shadow>
        <TresCylinderGeometry :args="[0.3, 0.28, 0.1, 8]" />
        <TresMeshStandardMaterial color="#f7f3ea" :flatShading="true" :roughness="0.7" />
      </TresMesh>
      <TresMesh :position="[0, 0.26, 0]" cast-shadow>
        <TresCylinderGeometry :args="[0.22, 0.26, 0.08, 8]" />
        <TresMeshStandardMaterial color="#e7a0b4" :flatShading="true" :roughness="0.65" />
      </TresMesh>
      <TresMesh :position="[-0.08, 0.36, 0.04]">
        <TresBoxGeometry :args="[0.03, 0.14, 0.03]" />
        <TresMeshStandardMaterial color="#f4e7c3" />
      </TresMesh>
      <TresMesh :position="[0.08, 0.38, -0.02]">
        <TresBoxGeometry :args="[0.03, 0.14, 0.03]" />
        <TresMeshStandardMaterial color="#f4e7c3" />
      </TresMesh>
      <TresMesh :position="[0, 0.4, 0.08]">
        <TresBoxGeometry :args="[0.03, 0.16, 0.03]" />
        <TresMeshStandardMaterial color="#f4e7c3" />
      </TresMesh>
      <TresMesh :position="[0, 0.5, 0.08]">
        <TresBoxGeometry :args="[0.045, 0.06, 0.045]" />
        <TresMeshStandardMaterial color="#e36b2c" emissive="#e36b2c" :emissiveIntensity="0.6" />
      </TresMesh>
      </TresGroup>
    </TresGroup>

    <Marina />
    <TresPointLight :position="[0, 2.2, -3]" :intensity="3.2" :distance="11" color="#ffd2a8" />
  </TresGroup>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import type { Group } from 'three'
import { ATELIER, atelierWalls } from '@/game/atelier'
import Marina from './Marina.vue'

const cakeRef = shallowRef<Group | null>(null)
let cakeTime = 0
const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  cakeTime += Math.min(delta, 0.05)
  const cake = cakeRef.value
  if (cake) cake.rotation.y = cakeTime * 0.35
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
