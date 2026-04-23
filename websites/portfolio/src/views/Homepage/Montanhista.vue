<template>
  <TresGroup ref="playerRef" :position="[0, 0, 40]">
    <TresMesh :position="[0, 1.2, 0]" cast-shadow>
      <TresBoxGeometry :args="[0.5, 0.7, 0.3]" />
      <TresMeshStandardMaterial color="#d97706" :flatShading="true" />
    </TresMesh>

    <TresGroup :position="[0, 1.75, 0]">
      <TresMesh cast-shadow>
        <TresIcosahedronGeometry :args="[0.2, 1]" />
        <TresMeshStandardMaterial color="#ffdbac" :flatShading="true" />
      </TresMesh>

      <TresMesh :position="[-0.08, 0.05, 0.17]">
        <TresBoxGeometry :args="[0.04, 0.04, 0.02]" />
        <TresMeshStandardMaterial color="#111827" />
      </TresMesh>

      <TresMesh :position="[0.08, 0.05, 0.17]">
        <TresBoxGeometry :args="[0.04, 0.04, 0.02]" />
        <TresMeshStandardMaterial color="#111827" />
      </TresMesh>

      <TresMesh :position="[0, -0.02, 0.19]">
        <TresBoxGeometry :args="[0.05, 0.08, 0.05]" />
        <TresMeshStandardMaterial color="#ffdbac" />
      </TresMesh>

      <TresMesh :position="[0, 0.15, 0]" cast-shadow>
        <TresCylinderGeometry :args="[0.17, 0.21, 0.15, 8]" />
        <TresMeshStandardMaterial color="#b91c1c" :flatShading="true" />
      </TresMesh>

      <TresMesh :position="[0, 0.12, 0.16]" :rotation="[-0.1, 0, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.35, 0.02, 0.25]" />
        <TresMeshStandardMaterial color="#b91c1c" />
      </TresMesh>
    </TresGroup>

    <TresGroup ref="leftArm" :position="[-0.35, 1.45, 0]">
      <TresMesh :position="[0, -0.2, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.15, 0.4, 0.15]" />
        <TresMeshStandardMaterial color="#d97706" />
      </TresMesh>
    </TresGroup>

    <TresGroup ref="rightArm" :position="[0.35, 1.45, 0]">
      <TresMesh :position="[0, -0.2, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.15, 0.4, 0.15]" />
        <TresMeshStandardMaterial color="#d97706" />
      </TresMesh>
      <TresGroup :position="[0, -0.4, 0.1]" :rotation="[1.5, 0, 0]">
        <TresMesh>
          <TresBoxGeometry :args="[0.04, 0.6, 0.04]" />
          <TresMeshStandardMaterial color="#4b5563" />
        </TresMesh>
      </TresGroup>
    </TresGroup>

    <TresGroup ref="leftLeg" :position="[-0.15, 0.85, 0]">
      <TresMesh :position="[0, -0.3, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.2, 0.5, 0.25]" />
        <TresMeshStandardMaterial color="#1e3a8a" />
      </TresMesh>
    </TresGroup>

    <TresGroup ref="rightLeg" :position="[0.15, 0.85, 0]">
      <TresMesh :position="[0, -0.3, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.2, 0.5, 0.25]" />
        <TresMeshStandardMaterial color="#1e3a8a" />
      </TresMesh>
    </TresGroup>

    <TresMesh :position="[0, 1.25, -0.25]" cast-shadow>
      <TresBoxGeometry :args="[0.45, 0.6, 0.25]" />
      <TresMeshStandardMaterial color="#365314" />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import { Group, Raycaster, Vector3 } from 'three'

const { scene, camera, controls } = useTresContext()
const raycaster = new Raycaster()
const downVector = new Vector3(0, -1, 0)
const rayOrigin = new Vector3()

// Variáveis de referência para os membros do corpo
const playerRef = shallowRef<Group | null>(null)
const leftLeg = shallowRef<Group | null>(null)
const rightLeg = shallowRef<Group | null>(null)
const leftArm = shallowRef<Group | null>(null)
const rightArm = shallowRef<Group | null>(null)

// --- CONFIGURAÇÃO DA CÂMARA E ZIPLINE ---
const cameraLookTarget = new Vector3(0, 0, 40)
const cameraOffset = new Vector3(0, 12, 25)
let isAutoFollowing = true
let isZiplining = false
const ziplineEnd = new Vector3(120, 12, -10) // Ponto de chegada na Casa na Árvore

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  s: false,
  a: false,
  d: false,
  ' ': false,
}

const handleKey = (e: KeyboardEvent, value: boolean) => {
  if (e.key in keys) keys[e.key as keyof typeof keys] = value
}

const disableAutoFollow = () => {
  isAutoFollowing = false
}

onMounted(() => {
  window.addEventListener('keydown', (e) => handleKey(e, true))
  window.addEventListener('keyup', (e) => handleKey(e, false))
  window.addEventListener('mousedown', disableAutoFollow)
  window.addEventListener('wheel', disableAutoFollow)
  window.addEventListener('touchstart', disableAutoFollow)
})

const { onBeforeRender } = useLoop()
const speed = 12
let velocityY = 0
const gravity = 10
const jumpForce = 8
let isGrounded = false

const emit = defineEmits(['section-changed', 'enter-treehouse'])

onBeforeRender(({ delta, elapsed }) => {
  if (!playerRef.value) return

  if (isZiplining) {
    const currentPos = playerRef.value.position
    const dist = currentPos.distanceTo(ziplineEnd)

    if (dist < 1.5) {
      isZiplining = false
      emit('enter-treehouse')
    } else {
      const dir = new Vector3().subVectors(ziplineEnd, currentPos).normalize()
      playerRef.value.position.add(dir.multiplyScalar(40 * delta))
      playerRef.value.lookAt(ziplineEnd)
    }
  } else {
    let moveZ = (keys.ArrowUp || keys.w ? -1 : 0) + (keys.ArrowDown || keys.s ? 1 : 0)
    let moveX = (keys.ArrowLeft || keys.a ? -1 : 0) + (keys.ArrowRight || keys.d ? 1 : 0)

    if (moveX !== 0 || moveZ !== 0) {
      isAutoFollowing = true
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ)
      moveX /= length
      moveZ /= length

      const nextX = playerRef.value.position.x + moveX * speed * delta
      const nextZ = playerRef.value.position.z + moveZ * speed * delta

      rayOrigin.set(nextX, 100, nextZ)
      raycaster.set(rayOrigin, downVector)
      const nextIntersects = raycaster.intersectObjects(scene.value.children, true)

      let nextFloorY = 0
      const validHits = nextIntersects.filter((h) => {
        let o: any = h.object
        while (o) {
          if (o === playerRef.value) return false
          o = o.parent
        }
        return true
      })
      if (validHits.length > 0) nextFloorY = validHits[0].point.y

      if (nextFloorY - playerRef.value.position.y <= 1.2) {
        playerRef.value.position.x = nextX
        playerRef.value.position.z = nextZ
      }

      playerRef.value.rotation.y = Math.atan2(moveX, moveZ)

      const ws = 15,
        wa = 0.6
      if (leftLeg.value) leftLeg.value.rotation.x = Math.sin(elapsed * ws) * wa
      if (rightLeg.value) rightLeg.value.rotation.x = -Math.sin(elapsed * ws) * wa
      if (leftArm.value) leftArm.value.rotation.x = -Math.sin(elapsed * ws) * wa
      if (rightArm.value) rightArm.value.rotation.x = Math.sin(elapsed * ws) * wa
    } else {
      if (leftLeg.value) leftLeg.value.rotation.x = 0
      if (rightLeg.value) rightLeg.value.rotation.x = 0
    }

    if (keys[' '] && isGrounded) {
      velocityY = jumpForce
      isGrounded = false
    }
    velocityY -= gravity * delta
    playerRef.value.position.y += velocityY * delta

    rayOrigin.set(playerRef.value.position.x, 100, playerRef.value.position.z)
    raycaster.set(rayOrigin, downVector)
    const intersects = raycaster.intersectObjects(scene.value.children, true)
    const validIntersects = intersects.filter((h) => {
      let o: any = h.object
      while (o) {
        if (o === playerRef.value) return false
        o = o.parent
      }
      return true
    })

    let floorY = 0
    let currentSection = null
    if (validIntersects.length > 0) {
      floorY = validIntersects[0].point.y
      const objName = validIntersects[0].object.name
      if (['AboutMe', 'Projects', 'Experience'].includes(objName)) currentSection = objName
      if (objName === 'ZiplineStart') isZiplining = true
    }

    const bounce =
      (moveX !== 0 || moveZ !== 0) && isGrounded ? Math.abs(Math.sin(elapsed * 15)) * 0.2 : 0
    if (playerRef.value.position.y <= floorY) {
      playerRef.value.position.y = floorY + bounce
      velocityY = 0
      isGrounded = true
    } else {
      isGrounded = false
    }

    emit('section-changed', currentSection)
  }

  const activeCamera =
    (camera as any)?.value || (scene.value?.getObjectByProperty('isCamera', true) as any)
  const activeControls = (controls as any)?.value || (controls as any)

  if (activeCamera && playerRef.value) {
    if (isAutoFollowing || isZiplining) {
      if (activeControls) activeControls.enabled = false

      const targetCamPos = new Vector3(
        playerRef.value.position.x,
        playerRef.value.position.y + 12,
        playerRef.value.position.z + 25,
      )

      activeCamera.position.lerp(targetCamPos, 0.05)
      cameraLookTarget.lerp(playerRef.value.position, 0.08)
      activeCamera.lookAt(cameraLookTarget)
    } else {
      if (activeControls) {
        activeControls.enabled = true

        if (activeControls.target) {
          activeControls.target.copy(playerRef.value.position)
        }

        if (typeof activeControls.update === 'function') {
          activeControls.update()
        }
      }
    }
  }
})
</script>
