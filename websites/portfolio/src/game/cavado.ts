/** Leito do Cávado no vale, a sul do trilho. A linha segue a corrente, de nascente para foz. */
export const cavado: Array<[number, number]> = [
  [466, 104],
  [250, 98],
  [170, 112],
  [110, 128],
  [55, 114],
  [0, 130],
  [-55, 116],
  [-110, 132],
  [-170, 118],
  [-250, 128],
  [-466, 112],
]

/** Meia-largura da água, em metros. O rio atravessa o vale de lado a lado. */
export const CAVADO_HALF = 42

/** Cota da margem. A água fica nesta linha; o corpo é que desce e sobe. */
export const WATER_BED_Y = -8
export const WATER_EDGE = 0.1
/** Quanto o corpo desce no meio do rio, em metros. Nas duas margens volta a zero. */
export const WADE_SINK = 1.35

export const CAVADO_SIGN = { x: 16, z: 78, y: -4.7 }

function distToSegment(px: number, pz: number, a: [number, number], b: [number, number]) {
  const abx = b[0] - a[0]
  const abz = b[1] - a[1]
  const len2 = abx * abx + abz * abz || 1
  const t = Math.min(1, Math.max(0, ((px - a[0]) * abx + (pz - a[1]) * abz) / len2))
  return Math.hypot(px - (a[0] + abx * t), pz - (a[1] + abz * t))
}

export function distToCavado(x: number, z: number) {
  return cavadoSample(x, z).dist
}

/** Distância à corrente, profundidade de 0 na margem a 1 no meio, e o sentido da água. */
export function cavadoSample(x: number, z: number) {
  let best = Infinity
  let flowX = -1
  let flowZ = 0
  for (let i = 0; i < cavado.length - 1; i++) {
    const a = cavado[i]
    const b = cavado[i + 1]
    const abx = b[0] - a[0]
    const abz = b[1] - a[1]
    const len2 = abx * abx + abz * abz || 1
    const t = Math.min(1, Math.max(0, ((x - a[0]) * abx + (z - a[1]) * abz) / len2))
    const dist = Math.hypot(x - (a[0] + abx * t), z - (a[1] + abz * t))
    if (dist < best) {
      best = dist
      const len = Math.sqrt(len2)
      flowX = abx / len
      flowZ = abz / len
    }
  }
  const depth = Math.max(0, 1 - best / CAVADO_HALF)
  return { dist: best, depth, flowX, flowZ }
}

export function waterSurfaceY() {
  return WATER_BED_Y + WATER_EDGE
}
