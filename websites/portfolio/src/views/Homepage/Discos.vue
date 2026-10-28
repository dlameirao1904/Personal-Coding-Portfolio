<template>
  <TresGroup :position="[VINYL_TABLE.x, VINYL_TABLE.y, VINYL_TABLE.z]">
    <TresMesh receive-shadow>
      <TresCylinderGeometry :args="[0.42, 0.44, 0.06, 16]" />
      <TresMeshStandardMaterial color="#1c1c1c" :roughness="0.55" />
    </TresMesh>
    <TresMesh :position="[0, 0.045, 0]">
      <TresCylinderGeometry :args="[0.34, 0.34, 0.012, 20]" />
      <TresMeshStandardMaterial color="#8d8a84" metalness="0.45" :roughness="0.35" />
    </TresMesh>
    <TresGroup ref="discRef" :position="[0, 0.058, 0]">
      <TresMesh :rotation="[Math.PI / 2, 0, 0]">
        <TresCircleGeometry :args="[0.32, 24]" />
        <TresMeshStandardMaterial :map="label" color="#ffffff" :roughness="0.45" />
      </TresMesh>
    </TresGroup>
    <TresGroup ref="armRef" :position="[0.3, 0.07, -0.16]">
      <TresMesh :position="[0.12, 0.02, 0.08]" :rotation="[0.2, 0.4, -0.5]">
        <TresBoxGeometry :args="[0.28, 0.02, 0.02]" />
        <TresMeshStandardMaterial color="#c4b49a" metalness="0.4" :roughness="0.4" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import { CanvasTexture, SRGBColorSpace, type Group, type Texture } from 'three'
import { albumById } from '@/data/records'
import { hikerPose } from '@/game/spot'
import { playing, selectedId, updateVinylNear, VINYL_TABLE } from '@/game/vinyl'

const discRef = shallowRef<Group | null>(null)
const armRef = shallowRef<Group | null>(null)
const label = shallowRef<Texture | null>(null)
let speed = 0

function approach(current: number, target: number, rate: number, dt: number) {
  const max = rate * dt
  const delta = target - current
  if (Math.abs(delta) <= max) return target
  return current + Math.sign(delta) * max
}

function paint(title: string, color: string, ink: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.fillStyle = '#141414'
  ctx.fillRect(0, 0, 256, 256)
  ctx.beginPath()
  ctx.arc(128, 128, 118, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#2a2a2a'
  ctx.lineWidth = 2
  for (const radius of [100, 86, 72]) {
    ctx.beginPath()
    ctx.arc(128, 128, radius, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(128, 128, 58, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = ink
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '600 15px Outfit, sans-serif'
  const words = title.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > 12 && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  const shown = lines.slice(0, 3)
  shown.forEach((text, index) => {
    ctx.fillText(text, 128, 128 + (index - (shown.length - 1) / 2) * 15)
  })
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

watch(
  selectedId,
  (id) => {
    const album = albumById(id)
    label.value?.dispose()
    label.value = album
      ? paint(album.title, album.color, album.ink)
      : paint('', '#e6d3b0', '#3a2412')
  },
  { immediate: true },
)

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  const dt = Math.min(delta, 0.05)
  updateVinylNear(hikerPose.x, hikerPose.y, hikerPose.z, hikerPose.ready)
  const disc = discRef.value
  const arm = armRef.value
  const target = playing.value ? -0.55 : -0.12
  const armSettled = !arm || Math.abs(arm.rotation.z - target) < 0.001
  if (!playing.value && speed === 0 && armSettled) return
  speed = approach(speed, playing.value ? 3.2 : 0, 2.2, dt)
  if (disc && speed > 0) disc.rotation.y += speed * dt
  if (arm) arm.rotation.z = approach(arm.rotation.z, target, 1.4, dt)
})
</script>
