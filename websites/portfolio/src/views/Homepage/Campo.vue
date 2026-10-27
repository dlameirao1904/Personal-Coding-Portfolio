<template>
  <TresGroup>
    <TresMesh ref="ballRef" :position="[SPOT.x, PITCH_TOP + BALL_R, SPOT.z]" cast-shadow>
      <TresSphereGeometry :args="[BALL_R, 12, 10]" />
      <TresMeshStandardMaterial color="#f7f7f4" :roughness="0.45" />
    </TresMesh>

    <TresGroup ref="keeperRef" :position="[PITCH_X, PITCH_TOP, GOAL_Z - 0.65]">
      <TresMesh :position="[0, 0.95, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.46, 0.62, 0.28]" />
        <TresMeshStandardMaterial color="#e2b15a" :flatShading="true" :roughness="1" />
      </TresMesh>
      <TresMesh :position="[0, 1.42, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.28, 0.28, 0.26]" />
        <TresMeshStandardMaterial color="#e7c7a4" :flatShading="true" :roughness="1" />
      </TresMesh>
      <TresMesh :position="[0, 0.52, 0]" cast-shadow>
        <TresBoxGeometry :args="[0.42, 0.28, 0.26]" />
        <TresMeshStandardMaterial color="#1c2b22" :flatShading="true" :roughness="1" />
      </TresMesh>
      <TresMesh :position="[-0.14, 0.22, 0.04]" cast-shadow>
        <TresBoxGeometry :args="[0.14, 0.4, 0.16]" />
        <TresMeshStandardMaterial color="#1c2b22" :flatShading="true" :roughness="1" />
      </TresMesh>
      <TresMesh :position="[0.14, 0.22, 0.04]" cast-shadow>
        <TresBoxGeometry :args="[0.14, 0.4, 0.16]" />
        <TresMeshStandardMaterial color="#1c2b22" :flatShading="true" :roughness="1" />
      </TresMesh>
      <TresMesh :position="[-0.34, 1.05, 0.04]" cast-shadow>
        <TresBoxGeometry :args="[0.14, 0.42, 0.14]" />
        <TresMeshStandardMaterial color="#e2b15a" :flatShading="true" :roughness="1" />
      </TresMesh>
      <TresMesh :position="[0.34, 1.05, 0.04]" cast-shadow>
        <TresBoxGeometry :args="[0.14, 0.42, 0.14]" />
        <TresMeshStandardMaterial color="#e2b15a" :flatShading="true" :roughness="1" />
      </TresMesh>
      <TresMesh :position="[-0.42, 1.22, 0.06]">
        <TresBoxGeometry :args="[0.12, 0.1, 0.12]" />
        <TresMeshStandardMaterial color="#f4efe4" :flatShading="true" :roughness="1" />
      </TresMesh>
      <TresMesh :position="[0.42, 1.22, 0.06]">
        <TresBoxGeometry :args="[0.12, 0.1, 0.12]" />
        <TresMeshStandardMaterial color="#f4efe4" :flatShading="true" :roughness="1" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import type { Group, Mesh } from 'three'
import {
  BALL_R,
  GOAL_HALF,
  GOAL_HEIGHT,
  GOAL_Z,
  PITCH_TOP,
  PITCH_X,
  SPOT,
  markPenalty,
  penalty,
  penaltyKick,
} from '@/game/pitch'
import { hikerPose } from '@/game/spot'

const ballRef = shallowRef<Mesh | null>(null)
const keeperRef = shallowRef<Group | null>(null)

const G = 15
const SHOT = 16.5
const KEEPER_HOME = GOAL_Z - 0.65

const ball = {
  x: SPOT.x,
  y: PITCH_TOP + BALL_R,
  z: SPOT.z,
  vx: 0,
  vy: 0,
  vz: 0,
}
const keeper = { x: PITCH_X, y: PITCH_TOP, lean: 0, jump: 0 }

let mode: 'ready' | 'flight' | 'done' = 'ready'
let aimed = false
let keeperDelay = 0
let diveTime = 0
let keeperTarget = PITCH_X
let keeperJump = 0
let hold = 0
let seenKick = 0

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function restBall() {
  ball.x = SPOT.x
  ball.y = PITCH_TOP + BALL_R
  ball.z = SPOT.z
  ball.vx = 0
  ball.vy = 0
  ball.vz = 0
  aimed = false
  mode = 'ready'
  penalty.call = ''
}

function shoot(yaw: number, look: number) {
  const dirX = Math.sin(yaw)
  const dirZ = Math.cos(yaw)
  ball.x = SPOT.x
  ball.y = PITCH_TOP + BALL_R
  ball.z = SPOT.z
  ball.vx = dirX * SHOT
  ball.vz = dirZ * SHOT
  aimed = dirZ > 0.35
  if (aimed) {
    const lookT = clamp((look - 0.08) / 0.97, 0, 1)
    const height = 0.28 + (1 - lookT) * 1.95
    const dist = (GOAL_Z - ball.z) / dirZ
    const time = Math.max(0.28, dist / SHOT)
    ball.vy = (height - BALL_R + 0.5 * G * time * time) / time
    const crossX = ball.x + dirX * dist
    const offset = crossX - PITCH_X
    let side = Math.abs(offset) < 0.85 ? 0 : Math.sign(offset)
    if (Math.random() < 0.38) {
      const options = [-1, 0, 1].filter((item) => item !== side)
      side = options[Math.floor(Math.random() * options.length)]
    }
    keeperTarget = PITCH_X + side * 1.7
    keeperJump = height > 1.45 ? 1 : 0.25
  } else {
    ball.vy = 5.5
    keeperTarget = PITCH_X
    keeperJump = 0
  }
  keeperDelay = 0.16
  diveTime = 0
  mode = 'flight'
  penalty.call = ''
  penalty.near = false
  penalty.engaged = true
}

function resolve(x: number, height: number) {
  const insideX = Math.abs(x - PITCH_X)
  const onPost = Math.abs(insideX - GOAL_HALF) < 0.2 && height < GOAL_HEIGHT + 0.12 && height > 0
  const onBar = Math.abs(height - GOAL_HEIGHT) < 0.16 && insideX < GOAL_HALF + 0.08
  if (onPost || onBar) {
    markPenalty('trave')
    ball.vz = -Math.abs(ball.vz) * 0.45
    ball.vy = Math.abs(ball.vy) * 0.35 + 2.2
    ball.vx *= 0.55
    return
  }
  const inGoal = insideX < GOAL_HALF - 0.1 && height > 0.05 && height < GOAL_HEIGHT - 0.06
  if (!inGoal) {
    markPenalty('fora')
    return
  }
  const reachX = 1
  const reachY = keeperJump > 0.6 ? 2.22 : 1.25
  const saved = Math.abs(x - keeper.x) < reachX && height < reachY
  if (saved) {
    markPenalty('defesa')
    ball.vz = -Math.abs(ball.vz) * 0.5
    ball.vx *= 0.35
    ball.vy = 3.2
    return
  }
  markPenalty('golo')
  ball.vz *= 0.45
  ball.vx *= 0.5
  ball.vy *= 0.4
}

watch(penaltyKick, (value) => {
  if (value === seenKick || mode !== 'ready' || !penalty.near) return
  seenKick = value
  shoot(hikerPose.yaw, hikerPose.look)
})

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  const dt = Math.min(delta, 0.05)
  const ballMesh = ballRef.value
  const keeperMesh = keeperRef.value
  if (!ballMesh || !keeperMesh) return

  if (mode === 'ready') {
    const dist = Math.hypot(hikerPose.x - SPOT.x, hikerPose.z - SPOT.z)
    penalty.near = dist < 1.85
    penalty.engaged = dist < 16
    keeper.x +=
      (PITCH_X + Math.sin(performance.now() * 0.0011) * 0.35 - keeper.x) * Math.min(1, dt * 3)
    keeper.lean += (0 - keeper.lean) * Math.min(1, dt * 4)
    keeper.jump += (0 - keeper.jump) * Math.min(1, dt * 4)
  } else {
    penalty.near = false
    diveTime += dt
    if (diveTime > keeperDelay) {
      const step = 8 * dt
      const deltaX = keeperTarget - keeper.x
      keeper.x += clamp(deltaX, -step, step)
      const air = diveTime - keeperDelay
      const lift = keeperJump * Math.sin(Math.min(air * 2.6, Math.PI))
      keeper.jump += (lift * 0.9 - keeper.jump) * Math.min(1, dt * 10)
    }
    const leanTarget = clamp((keeper.x - PITCH_X) * 0.42, -1.05, 1.05)
    keeper.lean += (leanTarget - keeper.lean) * Math.min(1, dt * 6)

    const prevX = ball.x
    const prevY = ball.y
    const prevZ = ball.z
    ball.vy -= G * dt
    ball.x += ball.vx * dt
    ball.y += ball.vy * dt
    const nextZ = prevZ + ball.vz * dt
    if (mode === 'flight' && aimed && prevZ < GOAL_Z && nextZ >= GOAL_Z) {
      const span = nextZ - prevZ || 1
      const t = (GOAL_Z - prevZ) / span
      resolve(prevX + (ball.x - prevX) * t, prevY + (ball.y - prevY) * t - PITCH_TOP)
      mode = 'done'
      hold = 2.4
    }
    ball.z = nextZ
    if (ball.y < PITCH_TOP + BALL_R) {
      ball.y = PITCH_TOP + BALL_R
      ball.vy = Math.abs(ball.vy) * 0.42
      ball.vx *= 0.84
      ball.vz *= 0.84
      if (ball.vy < 1.2) ball.vy = 0
      const speed = Math.hypot(ball.vx, ball.vz)
      if (speed < 0.6) {
        ball.vx = 0
        ball.vz = 0
        if (mode === 'flight') {
          markPenalty('fora')
          mode = 'done'
          hold = 2.4
        }
      }
    }
    if (mode === 'done' && ball.z > GOAL_Z + 0.9) {
      ball.z = GOAL_Z + 0.9
      ball.vx = 0
      ball.vz = 0
      ball.vy = 0
    }
    if (mode === 'done') {
      hold -= dt
      if (hold <= 0) restBall()
    }
  }

  ballMesh.position.set(ball.x, ball.y, ball.z)
  keeperMesh.position.set(keeper.x, PITCH_TOP + Math.max(0, keeper.jump), KEEPER_HOME)
  keeperMesh.rotation.z = clamp(keeper.lean, -1.05, 1.05)
})
</script>
