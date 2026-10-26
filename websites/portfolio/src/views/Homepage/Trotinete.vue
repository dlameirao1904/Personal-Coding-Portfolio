<template>
  <TresGroup v-if="scooter.on" ref="rigRef">
    <TresMesh :position="[0, 0.2, 0.05]" cast-shadow>
      <TresBoxGeometry :args="[0.28, 0.06, 1.15]" />
      <TresMeshStandardMaterial color="#1f6b4a" :flatShading="true" :roughness="0.55" />
    </TresMesh>
    <TresMesh :position="[0, 0.16, -0.15]" cast-shadow>
      <TresBoxGeometry :args="[0.22, 0.1, 0.28]" />
      <TresMeshStandardMaterial color="#17211c" :flatShading="true" :roughness="0.6" />
    </TresMesh>
    <TresMesh :position="[0, 0.28, -0.15]">
      <TresBoxGeometry :args="[0.08, 0.04, 0.12]" />
      <TresMeshStandardMaterial color="#d7e4ec" emissive="#9ec4d4" :emissiveIntensity="0.35" />
    </TresMesh>

    <TresGroup ref="wheelFront" :position="[0, 0.16, 0.48]">
      <TresMesh :rotation="[0, 0, Math.PI / 2]" cast-shadow>
        <TresCylinderGeometry :args="[0.16, 0.16, 0.08, 8]" />
        <TresMeshStandardMaterial color="#17211c" :flatShading="true" :roughness="0.8" />
      </TresMesh>
    </TresGroup>
    <TresGroup ref="wheelBack" :position="[0, 0.16, -0.48]">
      <TresMesh :rotation="[0, 0, Math.PI / 2]" cast-shadow>
        <TresCylinderGeometry :args="[0.16, 0.16, 0.08, 8]" />
        <TresMeshStandardMaterial color="#17211c" :flatShading="true" :roughness="0.8" />
      </TresMesh>
    </TresGroup>

    <TresMesh :position="[0, 0.62, 0.42]" cast-shadow>
      <TresBoxGeometry :args="[0.05, 0.72, 0.05]" />
      <TresMeshStandardMaterial color="#d9d3c6" :flatShading="true" :roughness="0.45" />
    </TresMesh>
    <TresMesh :position="[0, 0.96, 0.42]" cast-shadow>
      <TresBoxGeometry :args="[0.46, 0.05, 0.06]" />
      <TresMeshStandardMaterial color="#17211c" :flatShading="true" :roughness="0.5" />
    </TresMesh>
    <TresMesh :position="[0, 0.9, 0.5]">
      <TresBoxGeometry :args="[0.08, 0.06, 0.04]" />
      <TresMeshStandardMaterial color="#f4e7c3" emissive="#f4e7c3" :emissiveIntensity="0.7" />
    </TresMesh>

    <TresMesh :position="[0.62, 0.34, -0.05]" cast-shadow>
      <TresBoxGeometry :args="[0.55, 0.08, 0.7]" />
      <TresMeshStandardMaterial color="#8a6244" :flatShading="true" :roughness="0.85" />
    </TresMesh>
    <TresMesh :position="[0.62, 0.42, -0.05]" cast-shadow>
      <TresBoxGeometry :args="[0.5, 0.08, 0.62]" />
      <TresMeshStandardMaterial color="#c46a62" :flatShading="true" :roughness="0.9" />
    </TresMesh>
    <TresMesh :position="[0.86, 0.48, -0.05]" cast-shadow>
      <TresBoxGeometry :args="[0.08, 0.22, 0.62]" />
      <TresMeshStandardMaterial color="#6d5138" :flatShading="true" :roughness="0.9" />
    </TresMesh>
    <TresMesh :position="[0.32, 0.28, -0.05]" cast-shadow>
      <TresBoxGeometry :args="[0.08, 0.16, 0.4]" />
      <TresMeshStandardMaterial color="#d9d3c6" :flatShading="true" :roughness="0.5" />
    </TresMesh>
    <TresGroup :position="[0.48, 0.1, 0.18]">
      <TresMesh :rotation="[0, 0, Math.PI / 2]" cast-shadow>
        <TresCylinderGeometry :args="[0.1, 0.1, 0.06, 6]" />
        <TresMeshStandardMaterial color="#17211c" :flatShading="true" :roughness="0.8" />
      </TresMesh>
    </TresGroup>
    <TresGroup :position="[0.78, 0.1, -0.22]">
      <TresMesh :rotation="[0, 0, Math.PI / 2]" cast-shadow>
        <TresCylinderGeometry :args="[0.1, 0.1, 0.06, 6]" />
        <TresMeshStandardMaterial color="#17211c" :flatShading="true" :roughness="0.8" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import type { Group } from 'three'
import { scooter } from '@/game/spot'

const rigRef = shallowRef<Group | null>(null)
const wheelFront = shallowRef<Group | null>(null)
const wheelBack = shallowRef<Group | null>(null)
let spin = 0
let lastX = 0
let lastZ = 0

watch(
  () => scooter.on,
  (on) => {
    if (!on) return
    lastX = scooter.x
    lastZ = scooter.z
  },
)

const { onBeforeRender } = useLoop()

onBeforeRender(() => {
  const rig = rigRef.value
  if (!rig || !scooter.on) return
  rig.position.set(scooter.x, scooter.y, scooter.z)
  rig.rotation.y = scooter.yaw
  const moved = Math.hypot(scooter.x - lastX, scooter.z - lastZ)
  lastX = scooter.x
  lastZ = scooter.z
  spin += moved / 0.16
  if (wheelFront.value) wheelFront.value.rotation.x = spin
  if (wheelBack.value) wheelBack.value.rotation.x = spin
})
</script>
