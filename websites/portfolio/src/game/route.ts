import { computed, ref } from 'vue'
import { BRIDGE_MOUTHS } from '@/game/bridge'
import { CAVADO_HALF, distToCavado } from '@/game/cavado'
import { hikerSpot } from '@/game/spot'

/** Ponto marcado no mapa. As direções seguem daqui até lá. */
export const trailGoal = ref<{ x: number; z: number } | null>(null)

function wet(x: number, z: number) {
  return distToCavado(x, z) < CAVADO_HALF * 0.82
}

function crossesWater(ax: number, az: number, bx: number, bz: number) {
  const dist = Math.hypot(bx - ax, bz - az)
  const steps = Math.max(2, Math.ceil(dist / 8))
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    if (wet(ax + (bx - ax) * t, az + (bz - az) * t)) return true
  }
  return false
}

/** Marcos até ao destino. Se o rio estiver no meio, o caminho passa pela ponte. */
export function planTrail(
  from: { x: number; z: number },
  to: { x: number; z: number },
): Array<[number, number]> {
  const goal: [number, number] = [to.x, to.z]
  if (!crossesWater(from.x, from.z, to.x, to.z)) return [goal]
  const [north, south] = BRIDGE_MOUTHS
  const northFirst =
    Math.hypot(from.x - north[0], from.z - north[1]) <=
    Math.hypot(from.x - south[0], from.z - south[1])
  const first = northFirst ? north : south
  const second = northFirst ? south : north
  const points: Array<[number, number]> = []
  if (Math.hypot(from.x - first[0], from.z - first[1]) > 12) points.push(first)
  if (Math.hypot(from.x - second[0], from.z - second[1]) > 12) points.push(second)
  points.push(goal)
  return points
}

export const trailPoints = computed(() => {
  const goal = trailGoal.value
  if (!goal) return [] as Array<[number, number]>
  return planTrail(hikerSpot.value, goal)
})

const BEARINGS = ['norte', 'nordeste', 'este', 'sudeste', 'sul', 'sudoeste', 'oeste', 'noroeste']

function bearing(dx: number, dz: number) {
  const angle = Math.atan2(dx, -dz)
  const turn = (angle * 180) / Math.PI
  const index = Math.round((((turn % 360) + 360) % 360) / 45) % 8
  return BEARINGS[index]
}

/** Frase do próximo lance. Muda à medida que os marcos ficam para trás. */
export function trailCue(x: number, z: number, points: Array<[number, number]>) {
  if (!points.length) return ''
  const goal = points[points.length - 1]
  if (Math.hypot(goal[0] - x, goal[1] - z) < 8) return 'Chegaste.'
  let target = goal
  let viaBridge = false
  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    if (Math.hypot(point[0] - x, point[1] - z) > 16) {
      target = point
      viaBridge = i < points.length - 1
      break
    }
  }
  const dx = target[0] - x
  const dz = target[1] - z
  const dir = bearing(dx, dz)
  if (viaBridge && Math.hypot(dx, dz) < 48) return `Atravessa a ponte, para ${dir}.`
  const meters = Math.max(10, Math.round(Math.hypot(dx, dz) / 10) * 10)
  return `Segue para ${dir}, cerca de ${meters} m.`
}

export function setTrailGoal(x: number, z: number) {
  trailGoal.value = { x, z }
}

export function clearTrailGoal() {
  trailGoal.value = null
}
