import { ref } from 'vue'
import { SPAWN } from '@/data/journey'

/** Posição do montanhista no chão, para o mapa. */
export const hikerSpot = ref({ x: SPAWN[0], z: SPAWN[2] })

/** Pose do montanhista em cada frame. O Atlas lê isto diretamente. */
export const hikerPose = {
  x: SPAWN[0],
  y: SPAWN[1],
  z: SPAWN[2],
  yaw: Math.PI,
  visible: true,
  ready: false,
}
