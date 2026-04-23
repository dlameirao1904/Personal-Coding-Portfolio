<template>
  <TresGroup name="terreno">
    <TresGroup name="Cordilheira">
      <TresMesh :position="[0, 25, -90]" receive-shadow cast-shadow>
        <TresCylinderGeometry :args="[20, 70, 50, 7]" />
        <TresMeshStandardMaterial color="#166534" :flatShading="true" />
      </TresMesh>
      <TresMesh :position="[0, 57.5, -90]" receive-shadow cast-shadow>
        <TresConeGeometry :args="[20, 15, 7]" />
        <TresMeshStandardMaterial color="#f8fafc" :flatShading="true" />
      </TresMesh>

      <TresMesh :position="[-40, 15, -75]" receive-shadow cast-shadow :rotation="[0, 0.5, 0]">
        <TresCylinderGeometry :args="[12, 35, 30, 6]" />
        <TresMeshStandardMaterial color="#166534" :flatShading="true" />
      </TresMesh>
      <TresMesh :position="[-40, 36, -75]" receive-shadow cast-shadow :rotation="[0, 0.5, 0]">
        <TresConeGeometry :args="[12, 12, 6]" />
        <TresMeshStandardMaterial color="#e2e8f0" :flatShading="true" />
      </TresMesh>

      <TresMesh :position="[45, 20, -100]" receive-shadow cast-shadow :rotation="[0, -0.3, 0]">
        <TresCylinderGeometry :args="[15, 40, 40, 8]" />
        <TresMeshStandardMaterial color="#166534" :flatShading="true" />
      </TresMesh>
      <TresMesh :position="[45, 47, -100]" receive-shadow cast-shadow :rotation="[0, -0.3, 0]">
        <TresConeGeometry :args="[15, 14, 8]" />
        <TresMeshStandardMaterial color="#f8fafc" :flatShading="true" />
      </TresMesh>
    </TresGroup>

    <TresMesh name="AboutMe" :position="[0, 24, -46]" receive-shadow cast-shadow>
      <TresCylinderGeometry :args="[9, 10.5, 3, 6]" />
      <TresMeshStandardMaterial color="#808080" :flatShading="true" />
    </TresMesh>

    <TresMesh name="Experience" :position="[54, 10, -72]" receive-shadow cast-shadow>
      <TresCylinderGeometry :args="[9, 10.5, 3, 6]" />
      <TresMeshStandardMaterial color="#808080" :flatShading="true" />
    </TresMesh>

    <TresMesh :position="[54, 13, -70]" cast-shadow>
      <TresCylinderGeometry :args="[0.3, 0.3, 4]" />
      <TresMeshStandardMaterial color="#4e342e" :flatShading="true" />
    </TresMesh>

    <TresMesh name="ZiplineStart" :position="[54, 11.6, -70]" receive-shadow cast-shadow>
      <TresBoxGeometry :args="[3, 0.2, 3]" />
      <TresMeshStandardMaterial color="#ea580c" :flatShading="true" />
    </TresMesh>

    <TresMesh :position="[87, 12, -41]" :rotation="[1.55, 1, 0]" cast-shadow>
      <TresCylinderGeometry :args="[0.05, 0.05, 91, 4]" />
      <TresMeshStandardMaterial color="#111827" />
    </TresMesh>

    <TresGroup name="TreehouseGroup" :position="[120, 0, -10]">
      <TresMesh :position="[0, 5, 0]" cast-shadow>
        <TresCylinderGeometry :args="[3, 4, 10, 8]" />
        <TresMeshStandardMaterial color="#4e342e" :flatShading="true" />
      </TresMesh>

      <TresMesh name="TreehouseFloor" :position="[0, 10, 0]" cast-shadow>
        <TresBoxGeometry :args="[14, 1, 14]" />
        <TresMeshStandardMaterial color="#8d6e63" />
      </TresMesh>

      <TresMesh :position="[0, 14, 0]" cast-shadow>
        <TresConeGeometry :args="[10, 8, 4]" />
        <TresMeshStandardMaterial color="#5d4037" :flatShading="true" />
      </TresMesh>
    </TresGroup>

    <TresMesh name="Projects" :position="[-54, 16, -72]" receive-shadow cast-shadow>
      <TresCylinderGeometry :args="[9, 10.5, 3, 6]" />
      <TresMeshStandardMaterial color="#808080" :flatShading="true" />
    </TresMesh>

    <TresGroup
      v-for="(tree, index) in trees"
      :key="'tree-' + index"
      :position="tree.position"
      :scale="[tree.scale, tree.scale, tree.scale]"
      :rotation="[0, tree.rotationY, 0]"
    >
      <TresMesh :position="[0, 0.75, 0]" cast-shadow receive-shadow>
        <TresCylinderGeometry :args="[0.2, 0.3, 1.5, 5]" />
        <TresMeshStandardMaterial color="#5D4037" :flatShading="true" />
      </TresMesh>
      <TresMesh :position="[0, 2.5, 0]" cast-shadow receive-shadow>
        <TresConeGeometry :args="[1.2, 3, 4]" />
        <TresMeshStandardMaterial color="#2E7D32" :flatShading="true" />
      </TresMesh>
    </TresGroup>

    <TresMesh
      v-for="(rock, index) in rocks"
      :key="'rock-' + index"
      :position="rock.position"
      :scale="rock.scale"
      :rotation="rock.rotation"
      cast-shadow
      receive-shadow
    >
      <TresDodecahedronGeometry :args="[1]" />
      <TresMeshStandardMaterial color="#64748b" :flatShading="true" />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
import TresGroup from '@tresjs/core'
import TresMesh from '@tresjs/core'

const random = (min: number, max: number) => Math.random() * (max - min) + min

const trees = []
const numTrees = 400

for (let i = 0; i < numTrees; i++) {
  let x = random(-340, 340)
  let z = random(-340, 340)

  const isNearPath = x > -15 && x < 15 && z > -20 && z < 20
  const isNearMountain = x > -90 && x < 90 && z > -150 && z < -30

  if (isNearPath || isNearMountain) {
    x += x > 0 ? 90 : -90
  }

  trees.push({
    position: [x, 0, z],
    scale: random(0.8, 2.5),
    rotationY: random(0, Math.PI * 2),
  })
}

const rocks = []
const numRocksEspalhadas = 150

for (let i = 0; i < numRocksEspalhadas; i++) {
  let x = random(-340, 340)
  let z = random(-340, 340)

  const isNearPath = x > -15 && x < 15 && z > -20 && z < 20
  const isNearMountain = x > -90 && x < 90 && z > -150 && z < -30

  if (isNearPath || isNearMountain) {
    x += x > 0 ? 80 : -80
  }

  const scaleX = random(0.5, 2.5)
  const scaleY = random(0.3, 1.8)
  const scaleZ = random(0.5, 2.5)

  rocks.push({
    position: [x, scaleY * 0.4, z],
    scale: [scaleX, scaleY, scaleZ],
    rotation: [random(0, Math.PI), random(0, Math.PI), random(0, Math.PI)],
  })
}

const numRochasMontanha = 60
for (let i = 0; i < numRochasMontanha; i++) {
  const angle = random(0, Math.PI * 2)
  const radius = random(60, 85)

  const x = Math.cos(angle) * radius
  const z = -90 + Math.sin(angle) * radius

  const scaleX = random(3, 8)
  const scaleY = random(2, 6)
  const scaleZ = random(3, 8)

  rocks.push({
    position: [x, scaleY * 0.4, z],
    scale: [scaleX, scaleY, scaleZ],
    rotation: [random(0, Math.PI), random(0, Math.PI), random(0, Math.PI)],
  })
}
</script>
