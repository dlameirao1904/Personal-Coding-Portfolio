/** Leito do Cávado no vale, a sul do trilho. x, z. */
export const cavado: Array<[number, number]> = [
  [170, 104],
  [120, 118],
  [75, 108],
  [35, 122],
  [0, 112],
  [-40, 126],
  [-85, 114],
  [-130, 124],
  [-175, 110],
]

export const CAVADO_HALF = 4

export const CAVADO_SIGN = { x: 0, z: 104, y: -4.7 }

function distToSegment(px: number, pz: number, a: [number, number], b: [number, number]) {
  const abx = b[0] - a[0]
  const abz = b[1] - a[1]
  const len2 = abx * abx + abz * abz || 1
  const t = Math.min(1, Math.max(0, ((px - a[0]) * abx + (pz - a[1]) * abz) / len2))
  return Math.hypot(px - (a[0] + abx * t), pz - (a[1] + abz * t))
}

export function distToCavado(x: number, z: number) {
  let best = Infinity
  for (let i = 0; i < cavado.length - 1; i++) {
    best = Math.min(best, distToSegment(x, z, cavado[i], cavado[i + 1]))
  }
  return best
}
