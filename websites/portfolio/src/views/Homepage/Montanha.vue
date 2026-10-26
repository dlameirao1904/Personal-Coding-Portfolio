<template>
  <primitive :object="world.walkable" />
  <primitive :object="world.scenery" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useTresContext } from '@tresjs/core'
import {
  CanvasTexture,
  DirectionalLight,
  Group,
  OrthographicCamera,
  type Sprite,
  type SpriteMaterial,
} from 'three'
import { passages } from '@/data/journey'
import { buildTrail } from '@/game/buildTrail'
import { CAVADO_SIGN } from '@/game/cavado'
import { makeNotice, makeSign } from '@/game/labels'
import { disposeWildlife, mountWildlife } from '@/game/wildlife'

const props = defineProps<{ activeId: string | null }>()

const world = buildTrail()
mountWildlife(world.scenery, world.walkable)
const signs: Sprite[] = []
let notice: Group | null = null
const { scene } = useTresContext()
let alive = true

function tint(id: string | null) {
  for (const sign of signs) {
    const on = sign.userData.id === id
    const base = sign.userData.base as [number, number]
    const scale = on ? 1.1 : 1
    sign.scale.set(base[0] * scale, base[1] * scale, 1)
    ;(sign.material as SpriteMaterial).opacity = on ? 1 : 0.92
  }
}

function tuneSun() {
  const light = scene.value?.getObjectByProperty('isDirectionalLight', true) as
    | DirectionalLight
    | undefined
  if (!light) return false
  light.shadow.mapSize.set(2048, 2048)
  light.shadow.bias = -0.0006
  light.shadow.normalBias = 0.04
  const shadowCam = light.shadow.camera as OrthographicCamera
  shadowCam.left = -110
  shadowCam.right = 110
  shadowCam.top = 110
  shadowCam.bottom = -110
  shadowCam.near = 1
  shadowCam.far = 200
  shadowCam.updateProjectionMatrix()
  light.target.position.set(0, 8, -28)
  if (!light.target.parent) scene.value.add(light.target)
  return true
}

onMounted(() => {
  if (!tuneSun()) requestAnimationFrame(tuneSun)

  document.fonts
    .load('600 64px Outfit')
    .catch(() => undefined)
    .then(() => {
      if (!alive) return
      try {
        for (const passage of passages) {
          const sign = makeSign(
            passage.short,
            passage.kicker,
            passage.kind === 'work' ? '#8a4632' : passage.kind === 'project' ? '#8a6a32' : '#0e3328',
            passage.kind !== 'project',
          )
          sign.userData.id = passage.id
          const lift = passage.kind === 'project' ? 2.9 : 3.35
          sign.position.set(passage.position[0], passage.position[1] + lift, passage.position[2])
          world.scenery.add(sign)
          signs.push(sign)
        }
        const cavado = makeSign('Cávado', 'Rio', '#1d4e5f', false)
        cavado.position.set(CAVADO_SIGN.x, CAVADO_SIGN.y, CAVADO_SIGN.z)
        world.scenery.add(cavado)
        signs.push(cavado)
        notice = makeNotice('Em construção', ['Esta parte da jornada', 'ainda está a ser feita.'])
        notice.position.set(41.6, -8, 73.6)
        notice.rotation.y = Math.atan2(-1, -1)
        world.scenery.add(notice)
        const solids = world.walkable.userData.solids as { x: number; z: number; r: number }[]
        solids.push({ x: notice.position.x, z: notice.position.z, r: 1.45 })
        tint(props.activeId)
      } catch (error) {
        console.error(error)
      }
    })
})

watch(() => props.activeId, tint)

onUnmounted(() => {
  alive = false
  const texture = notice?.userData.texture as CanvasTexture | undefined
  texture?.dispose()
  for (const sign of signs) {
    sign.parent?.remove(sign)
    const material = sign.material as SpriteMaterial
    material.map?.dispose()
    material.dispose()
  }
  world.dispose()
  disposeWildlife()
})
</script>
