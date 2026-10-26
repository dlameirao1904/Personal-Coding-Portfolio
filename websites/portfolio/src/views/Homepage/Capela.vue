<template>
  <TresGroup :position="[summit.x, summit.y, summit.z]">
    <TresMesh :position="[0, plinthH / 2, 0]" receive-shadow>
      <TresBoxGeometry :args="[width, plinthH, depth]" />
      <TresMeshStandardMaterial color="#d9d3c6" :flatShading="true" :roughness="1" />
    </TresMesh>

    <TresMesh :position="[0, eave / 2, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[wallW, eave, wallL]" />
      <TresMeshStandardMaterial color="#eeeeee" :flatShading="true" :roughness="1" />
    </TresMesh>

    <TresMesh :geometry="gableGeo" :position="[0, eave, wallL / 2]" cast-shadow>
      <TresMeshStandardMaterial color="#eeeeee" :flatShading="true" :roughness="1" :side="DoubleSide" />
    </TresMesh>
    <TresMesh :geometry="gableGeo" :position="[0, eave, -wallL / 2]" cast-shadow>
      <TresMeshStandardMaterial color="#eeeeee" :flatShading="true" :roughness="1" :side="DoubleSide" />
    </TresMesh>

    <TresMesh :position="roofRight" :rotation="[0, 0, -pitch]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[roofLen, roofThick, roofDepth]" />
      <TresMeshStandardMaterial color="#d4d4d4" :flatShading="true" :roughness="1" />
    </TresMesh>
    <TresMesh :position="roofLeft" :rotation="[0, 0, pitch]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[roofLen, roofThick, roofDepth]" />
      <TresMeshStandardMaterial color="#d4d4d4" :flatShading="true" :roughness="1" />
    </TresMesh>

    <TresMesh :position="[0, plinthH + doorH / 2, wallL / 2 + 0.02]" cast-shadow>
      <TresBoxGeometry :args="[doorW, doorH, 0.04]" />
      <TresMeshStandardMaterial color="#1c2b22" :flatShading="true" :roughness="1" />
    </TresMesh>

    <TresMesh :position="[0, ridge - 0.1, wallL / 2 + 0.07]" cast-shadow>
      <TresBoxGeometry :args="[0.045, 0.2, 0.045]" />
      <TresMeshStandardMaterial color="#eeeeee" :flatShading="true" :roughness="1" />
    </TresMesh>
    <TresMesh :position="[0, ridge - 0.06, wallL / 2 + 0.07]" cast-shadow>
      <TresBoxGeometry :args="[0.16, 0.04, 0.04]" />
      <TresMeshStandardMaterial color="#eeeeee" :flatShading="true" :roughness="1" />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
import { markRaw, onMounted, onUnmounted } from 'vue'
import { useTresContext } from '@tresjs/core'
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from 'three'
import { chapelSize, summit } from '@/game/buildTrail'

const { scene } = useTresContext()
const { width, height, depth } = chapelSize

const plinthH = 0.06
const wallW = width - 0.1
const wallL = depth - 0.1
const pitch = 0.68
const halfSpan = wallW / 2
const rise = halfSpan * Math.tan(pitch)
const eave = height - rise
const ridge = height
const roofThick = 0.05
const roofLen = Math.hypot(halfSpan, rise) + roofThick
const roofDepth = wallL + 0.08
const doorW = 0.28
const doorH = 0.7

const roofLift = Math.cos(pitch) * (roofThick / 2)
const roofShift = Math.sin(pitch) * (roofThick / 2)
const roofRight: [number, number, number] = [halfSpan / 2 + roofShift, eave + rise / 2 + roofLift, 0]
const roofLeft: [number, number, number] = [-roofRight[0], roofRight[1], 0]

function gableGeometry(span: number, roofRise: number, thick: number) {
  const hw = span / 2
  const d = thick / 2
  const geo = new BufferGeometry()
  geo.setAttribute(
    'position',
    new Float32BufferAttribute(
      [-hw, 0, d, hw, 0, d, 0, roofRise, d, -hw, 0, -d, hw, 0, -d, 0, roofRise, -d],
      3,
    ),
  )
  geo.setIndex([0, 1, 2, 3, 5, 4, 0, 2, 5, 0, 5, 3, 1, 4, 5, 1, 5, 2, 0, 3, 4, 0, 4, 1])
  geo.computeVertexNormals()
  return markRaw(geo)
}

const gableGeo = gableGeometry(wallW, rise, 0.05)

const walls = wallSpots()
let tries = 0
let alive = true

function wallSpots() {
  const spots: { x: number; z: number; r: number }[] = []
  const r = 0.12
  const add = (lx: number, lz: number) => {
    spots.push({ x: summit.x + lx, z: summit.z + lz, r })
  }
  const hx = wallW / 2
  const hz = wallL / 2
  for (let x = -hx; x <= hx; x += r) add(x, -hz)
  for (let z = -hz; z <= hz; z += r) {
    add(-hx, z)
    add(hx, z)
  }
  for (let x = -hx; x <= -doorW / 2 - 0.06; x += r) add(x, hz)
  for (let x = doorW / 2 + 0.06; x <= hx; x += r) add(x, hz)
  return spots
}

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
  gableGeo.dispose()
})
</script>
