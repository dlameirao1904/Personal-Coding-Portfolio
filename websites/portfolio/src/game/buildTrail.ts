import { markRaw } from 'vue'
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  TorusGeometry,
  DoubleSide,
} from 'three'
import { pathNodes, steps, type Vec3 } from '@/data/journey'
import { CAVADO_HALF, CAVADO_SIGN, cavado, distToCavado } from '@/game/cavado'

const PATH_WIDTH = 6.6
const PATH_HALF = PATH_WIDTH / 2
const SLAB = 1.15
const VALLEY_Y = -8

const crest: Array<[number, number]> = [
  [-120, 8],
  [-96, 20],
  [-78, 30],
  [-66, 50],
  [-56, 22],
  [-42, 36],
  [-28, 58],
  [-14, 74],
  [-2, 62],
  [12, 72],
  [24, 46],
  [36, 40],
  [48, 56],
  [60, 34],
  [74, 52],
  [88, 40],
  [104, 22],
  [120, 8],
]

function crestAt(x: number) {
  if (x <= crest[0][0]) return crest[0][1]
  const last = crest[crest.length - 1]
  if (x >= last[0]) return last[1]
  for (let i = 0; i < crest.length - 1; i++) {
    const [x0, y0] = crest[i]
    const [x1, y1] = crest[i + 1]
    if (x < x0 || x > x1) continue
    const t = (x - x0) / (x1 - x0 || 1)
    return y0 + (y1 - y0) * t
  }
  return 0
}

function rangeHeight(x: number, z: number) {
  const spine = -6
  const towardCamera = z > spine
  const reach = towardCamera ? 46 : 26
  const t = Math.min(1, Math.abs(z - spine) / reach)
  const shape = Math.cos(t * Math.PI * 0.5) ** 1.2
  const grit = Math.sin(x * 0.47 + z * 0.18) * 2.2 + Math.sin(x * 0.19) * Math.cos(z * 0.35) * 1.4
  return Math.max(0, crestAt(x) * shape + grit * shape)
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function distToSegment(px: number, pz: number, a: Vec3, b: Vec3) {
  const abx = b[0] - a[0]
  const abz = b[2] - a[2]
  const len2 = abx * abx + abz * abz || 1
  const t = Math.min(1, Math.max(0, ((px - a[0]) * abx + (pz - a[2]) * abz) / len2))
  return Math.hypot(px - (a[0] + abx * t), pz - (a[2] + abz * t))
}

function clearance(x: number, z: number) {
  let best = Infinity
  for (let i = 0; i < pathNodes.length - 1; i++) {
    best = Math.min(best, distToSegment(x, z, pathNodes[i], pathNodes[i + 1]))
  }
  for (const step of steps) {
    const dx = x - step.position[0]
    const dz = z - step.position[2]
    best = Math.min(best, Math.hypot(dx, dz) - step.landingRadius)
  }
  best = Math.min(best, Math.hypot(x, z - 47) - 12)
  return best
}

export function buildTrail() {
  const walkable = markRaw(new Group())
  walkable.name = 'walkable'
  const scenery = markRaw(new Group())
  scenery.name = 'scenery'

  const geometries: BufferGeometry[] = []
  const materials: Material[] = []

  const track = <T extends BufferGeometry>(geometry: T) => {
    geometries.push(geometry)
    return geometry
  }
  const paint = (color: string, flat = true) => {
    const material = new MeshStandardMaterial({
      color: new Color(color),
      flatShading: flat,
      roughness: 1,
      metalness: 0,
    })
    materials.push(material)
    return material
  }

  const stone = paint('#b7a892')
  const valleyMat = paint('#3e5a3b')
  const trunkMat = paint('#5c4032')
  const leafA = paint('#2d5a34')
  const leafB = paint('#3e6e40')
  const cairnMat = paint('#8d8474')
  const ringMat = paint('#b8893f')

  const unitBox = track(new BoxGeometry(1, 1, 1))
  const unitCyl = track(new CylinderGeometry(1, 1, 1, 10))
  const capCyl = track(new CylinderGeometry(1, 1, 1, 18))

  const addSlab = (ax: number, az: number, bx: number, bz: number, top: number) => {
    const dx = bx - ax
    const dz = bz - az
    const length = Math.hypot(dx, dz) + 0.5
    const mesh = new Mesh(unitBox, stone)
    mesh.scale.set(PATH_WIDTH, SLAB, length)
    mesh.position.set((ax + bx) / 2, top - SLAB / 2, (az + bz) / 2)
    mesh.rotation.y = Math.atan2(dx, dz)
    mesh.castShadow = true
    mesh.receiveShadow = true
    walkable.add(mesh)
  }

  const addDisc = (
    x: number,
    z: number,
    top: number,
    radius: number,
    material: MeshStandardMaterial,
    segments = 18,
  ) => {
    const geometry = segments === 18 ? capCyl : unitCyl
    const mesh = new Mesh(geometry, material)
    const height = 1.2
    mesh.scale.set(radius, height, radius)
    mesh.position.set(x, top - height / 2, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    walkable.add(mesh)
  }

  for (let i = 0; i < pathNodes.length - 1; i++) {
    const a = pathNodes[i]
    const b = pathNodes[i + 1]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const dz = b[2] - a[2]
    const dist = Math.hypot(dx, dy, dz)
    const pieces = Math.max(1, Math.ceil(dist / 2))
    for (let piece = 0; piece < pieces; piece++) {
      const t0 = piece / pieces
      const t1 = (piece + 1) / pieces
      addSlab(a[0] + dx * t0, a[2] + dz * t0, a[0] + dx * t1, a[2] + dz * t1, a[1] + dy * t1)
    }
  }

  for (const node of pathNodes) {
    addDisc(node[0], node[2], node[1] - 0.01, PATH_HALF + 0.15, stone, 10)
  }

  addDisc(0, 47, 0.02, 12, stone)

  for (const step of steps) {
    const top = step.position[1] + 0.04
    const material = paint(step.landingColor)
    addDisc(step.position[0], step.position[2], top, step.landingRadius, material)

    if (step.ongoing) {
      const ring = new Mesh(
        track(new TorusGeometry(step.landingRadius - 0.2, 0.08, 6, 28)),
        ringMat,
      )
      ring.rotation.x = Math.PI / 2
      ring.position.set(step.position[0], top + 0.1, step.position[2])
      scenery.add(ring)
    }

    for (const project of step.projects ?? []) {
      const stump = new Mesh(unitCyl, cairnMat)
      const stumpHeight = 1.15
      stump.scale.set(0.72, stumpHeight, 0.72)
      stump.position.set(project.position[0], top + stumpHeight / 2, project.position[2])
      stump.castShadow = true
      stump.receiveShadow = true
      walkable.add(stump)

      const scales = [0.48, 0.34, 0.22]
      let crown = top + stumpHeight * 0.55
      scales.forEach((scale, index) => {
        const stoneMesh = new Mesh(track(new DodecahedronGeometry(scale, 0)), cairnMat)
        stoneMesh.position.set(
          project.position[0] + (index - 1) * 0.04,
          crown,
          project.position[2],
        )
        stoneMesh.rotation.set(index, index * 0.6, 0.2)
        stoneMesh.castShadow = true
        scenery.add(stoneMesh)
        crown += scale * 0.85
      })
    }
  }

  const valley = new Mesh(track(new PlaneGeometry(520, 520)), valleyMat)
  valley.rotation.x = -Math.PI / 2
  valley.position.y = VALLEY_Y
  valley.receiveShadow = true
  walkable.add(valley)

  const bankMat = paint('#c6b596', false)
  const waterMat = paint('#3e8494', false)
  waterMat.roughness = 0.28
  waterMat.metalness = 0.04
  waterMat.side = DoubleSide
  bankMat.side = DoubleSide

  const addRibbon = (points: Array<[number, number]>, half: number, y: number, material: MeshStandardMaterial) => {
    const positions: number[] = []
    const indices: number[] = []
    for (let i = 0; i < points.length; i++) {
      const prev = points[Math.max(0, i - 1)]
      const next = points[Math.min(points.length - 1, i + 1)]
      let dx = next[0] - prev[0]
      let dz = next[1] - prev[1]
      const len = Math.hypot(dx, dz) || 1
      dx /= len
      dz /= len
      const [x, z] = points[i]
      positions.push(x - dz * half, y, z + dx * half, x + dz * half, y, z - dx * half)
    }
    for (let i = 0; i < points.length - 1; i++) {
      const a = i * 2
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
    const geo = track(new BufferGeometry())
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    const mesh = new Mesh(geo, material)
    mesh.receiveShadow = true
    scenery.add(mesh)
  }

  addRibbon(cavado, CAVADO_HALF + 1.8, VALLEY_Y + 0.05, bankMat)
  addRibbon(cavado, CAVADO_HALF - 0.35, VALLEY_Y + 0.16, waterMat)

  const post = new Mesh(unitCyl, trunkMat)
  post.scale.set(0.12, 3.3, 0.12)
  post.position.set(CAVADO_SIGN.x, VALLEY_Y + 1.65, CAVADO_SIGN.z)
  post.castShadow = true
  scenery.add(post)

  const rampNodes: Vec3[] = [
    [8.4, 0.02, 42],
    [18, -1.8, 52],
    [30, -3.8, 64],
    [42, -5.8, 78],
    [52, -7.35, 90],
    [56, -7.98, 100],
  ]
  for (let i = 0; i < rampNodes.length - 1; i++) {
    const a = rampNodes[i]
    const b = rampNodes[i + 1]
    const dist = Math.hypot(b[0] - a[0], b[2] - a[2])
    const pieces = Math.max(1, Math.ceil(dist / 1.7))
    for (let piece = 0; piece < pieces; piece++) {
      const t0 = piece / pieces
      const t1 = (piece + 1) / pieces
      addSlab(
        a[0] + (b[0] - a[0]) * t0,
        a[2] + (b[2] - a[2]) * t0,
        a[0] + (b[0] - a[0]) * t1,
        a[2] + (b[2] - a[2]) * t1,
        a[1] + (b[1] - a[1]) * t1,
      )
    }
  }
  addDisc(6.2, 42, 0.02, 4.4, stone)

  const cols = 120
  const rows = 40
  const width = 250
  const depth = 86
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  const rock = new Color('#918c86')
  const shade = new Color('#6d726e')
  const moss = new Color('#546448')
  const tint = new Color()

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const x = -width / 2 + (col / cols) * width
      const z = -depth / 2 + (row / rows) * depth
      const height = rangeHeight(x, z)
      positions.push(x, height, z)
      const blend = Math.min(1, height / 48)
      tint.copy(moss).lerp(blend > 0.62 ? rock : shade, blend)
      colors.push(tint.r, tint.g, tint.b)
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const a = row * (cols + 1) + col
      const b = a + 1
      const c = a + cols + 1
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }

  const rangeGeo = track(new BufferGeometry())
  rangeGeo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  rangeGeo.setAttribute('color', new Float32BufferAttribute(colors, 3))
  rangeGeo.setIndex(indices)
  rangeGeo.computeVertexNormals()
  const rangeMat = paint('#918c86')
  rangeMat.vertexColors = true
  const range = new Mesh(rangeGeo, rangeMat)
  range.position.set(0, VALLEY_Y, -178)
  scenery.add(range)

  const treeCone = track(new ConeGeometry(1.15, 2.8, 5))
  const rand = mulberry32(1904)
  for (let i = 0; i < 200; i++) {
    const x = -110 + rand() * 220
    const z = -120 + rand() * 195
    if (clearance(x, z) < 14) continue
    if (distToCavado(x, z) < 12) continue
    let rampClear = Infinity
    for (let i = 0; i < rampNodes.length - 1; i++) {
      rampClear = Math.min(rampClear, distToSegment(x, z, rampNodes[i], rampNodes[i + 1]))
    }
    if (rampClear < 7) continue
    const scale = 0.8 + rand() * 0.9
    const group = new Group()
    group.position.set(x, VALLEY_Y, z)
    group.scale.setScalar(scale)
    const trunk = new Mesh(unitCyl, trunkMat)
    trunk.scale.set(0.22, 1.4, 0.22)
    trunk.position.y = 0.7
    group.add(trunk)
    const crown = new Mesh(treeCone, rand() > 0.5 ? leafA : leafB)
    crown.position.y = 2.35
    group.add(crown)
    scenery.add(group)
  }

  const dispose = () => {
    const geos = new Set<BufferGeometry>(geometries)
    const mats = new Set<Material>(materials)
    for (const root of [walkable, scenery]) {
      root.traverse((obj) => {
        const mesh = obj as Mesh
        if (mesh.geometry) geos.add(mesh.geometry)
        const material = mesh.material
        if (Array.isArray(material)) material.forEach((item) => mats.add(item))
        else if (material) mats.add(material)
      })
    }
    geos.forEach((geometry) => geometry.dispose())
    mats.forEach((material) => material.dispose())
  }

  return markRaw({ walkable, scenery, dispose })
}
