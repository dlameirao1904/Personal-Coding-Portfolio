import { ref } from 'vue'
import { SPAWN } from '@/data/journey'

/** Posição do montanhista no chão, para o mapa. */
export const hikerSpot = ref({ x: SPAWN[0], z: SPAWN[2] })
