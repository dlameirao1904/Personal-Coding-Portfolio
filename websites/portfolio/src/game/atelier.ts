/** Sala na encosta, a oeste do largo. A frente aberta olha para o trilho. */
export const ATELIER = {
  x: -40,
  z: -112,
  y: 17.8,
  yaw: Math.PI / 2,
}

export function atelierPoint(x: number, z: number) {
  const { yaw } = ATELIER
  return {
    x: ATELIER.x + Math.sin(yaw) * z + Math.cos(yaw) * x,
    z: ATELIER.z + Math.cos(yaw) * z - Math.sin(yaw) * x,
  }
}

function wallLine(x0: number, z0: number, x1: number, z1: number) {
  const steps = 6
  const spots: { x: number; z: number; r: number }[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const point = atelierPoint(x0 + (x1 - x0) * t, z0 + (z1 - z0) * t)
    spots.push({ x: point.x, z: point.z, r: 0.46 })
  }
  return spots
}

/** Paredes do atelier, como círculos no chão para o montanhista não as atravessar. */
export function atelierWalls() {
  return [
    ...wallLine(-3.3, -6.05, 3.3, -6.05),
    ...wallLine(-3.3, -6.05, -3.3, -0.35),
    ...wallLine(3.3, -6.05, 3.3, -0.35),
  ]
}

/** Chão da sala, encostado ao largo sem cobrir o trilho. */
export function atelierPad() {
  return { ...atelierPoint(0, -3.1), radius: 5 }
}

/** Ponto do mundo passado para o referencial da sala. */
export function atelierLocal(x: number, z: number) {
  const dx = x - ATELIER.x
  const dz = z - ATELIER.z
  const { yaw } = ATELIER
  return {
    x: Math.cos(yaw) * dx - Math.sin(yaw) * dz,
    z: Math.sin(yaw) * dx + Math.cos(yaw) * dz,
  }
}

/** Olhos dentro da sala, a olhar para o bolo na mesa. */
export function atelierGaze() {
  const eye = atelierPoint(0.12, -1.45)
  const cake = atelierPoint(0.1, -2.7)
  return {
    x: eye.x,
    y: ATELIER.y + 1.5,
    z: eye.z,
    lookX: cake.x,
    lookY: ATELIER.y + 0.9,
    lookZ: cake.z,
  }
}
