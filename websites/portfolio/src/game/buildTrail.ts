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
  InstancedMesh,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
  TorusGeometry,
  Vector2,
  DoubleSide,
} from 'three'
import { pathNodes, steps, type Vec3 } from '@/data/journey'
import { CAVADO_HALF, CAVADO_SIGN, cavado, distToCavado, WADE_SINK, WATER_EDGE } from '@/game/cavado'

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

const FOOT_Z = -96
const CLIMB_Z = -120
const CREST_Z = -176
const BACK_Z = -228
const HALF_W = 140
const PLATEAU_Y = 18

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0 || 1)))
  return t * t * (3 - 2 * t)
}

/** Altura do chão da montanha, em coordenadas do mundo. O sopé a sul encontra o patamar do trilho. */
function mountainY(x: number, z: number) {
  const flank = smoothstep(36, HALF_W, Math.abs(x))
  const back = smoothstep(CREST_Z - 8, BACK_Z, z)
  const edge = Math.max(flank, back)
  const shelf = FOOT_Z - CLIMB_Z
  let profile = 0
  if (z >= CREST_Z) {
    const climbed = Math.max(0, FOOT_Z - z - shelf)
    const span = CLIMB_Z - CREST_Z
    const t = climbed / span
    profile = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI * 0.5) ** 1.08
  } else {
    const t = (CREST_Z - z) / (CREST_Z - BACK_Z)
    profile = Math.cos(Math.min(1, Math.max(0, t)) * Math.PI * 0.5) ** 1.15
  }
  const base = PLATEAU_Y + (VALLEY_Y - PLATEAU_Y) * flank
  const peak = Math.max(base, crestAt(x) * (1 - flank * 0.45))
  const grit =
    (Math.sin(x * 0.41 + z * 0.16) * 1.5 + Math.sin(x * 0.17) * Math.cos(z * 0.29) * 1.05) *
    profile *
    (1 - flank)
  const raised = base + (peak - base) * profile + grit
  return VALLEY_Y + (raised - VALLEY_Y) * (1 - edge)
}

function onMountain(x: number, z: number) {
  return z <= FOOT_Z && z >= BACK_Z && Math.abs(x) <= HALF_W
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

const TREE_SPACING = 11

const rampNodes: Vec3[] = [
  [8.4, 0.02, 42],
  [16, -2.4, 50],
  [26, -4.8, 58],
  [34, -6.6, 66],
  [40, -8, 72],
]

function cellHash(ix: number, iz: number) {
  let h = Math.imul(ix, 0x27d4eb2d) ^ Math.imul(iz, 0x165667b1)
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b)
  h ^= h >>> 13
  return (h >>> 0) / 4294967296
}

export type ForestTree = {
  x: number
  z: number
  perch: number
  climb: number
  radius: number
  oak: boolean
  scale: number
  rot: number
  broad: boolean
}

/** Árvore desta célula, ou null se o sítio está livre. Um quarto das células fica sem árvore. */
export function forestTree(ix: number, iz: number): ForestTree | null {
  if (cellHash(ix + 41, iz - 9) < 0.25) return null
  const x = ix * TREE_SPACING + (cellHash(ix, iz) - 0.5) * TREE_SPACING * 0.8
  const z = iz * TREE_SPACING + (cellHash(ix + 101, iz - 17) - 0.5) * TREE_SPACING * 0.8
  if (onMountain(x, z) || clearance(x, z) < 4.4 || distToCavado(x, z) < CAVADO_HALF + 7) return null
  for (let segment = 0; segment < rampNodes.length - 1; segment++) {
    if (distToSegment(x, z, rampNodes[segment], rampNodes[segment + 1]) < 6) return null
  }
  const oak = cellHash(ix + 19, iz + 23) > 0.62
  const scale = oak
    ? (1.9 + cellHash(iz + 7, ix - 11) * 1.15) * 2
    : (0.72 + cellHash(iz, ix) * 1.15) * 2
  return {
    x,
    z,
    perch: VALLEY_Y + (oak ? 1.15 : 2.05) * scale,
    climb: VALLEY_Y + (oak ? 1.05 : 1.55) * scale,
    radius: (oak ? 0.48 : 0.34) * scale,
    oak,
    scale,
    rot: cellHash(ix - 3, iz + 8) * Math.PI * 2,
    broad: cellHash(ix + 4, iz + 4) > 0.5,
  }
}

export function treesAround(x: number, z: number, radius: number) {
  const reach = Math.ceil(radius / TREE_SPACING) + 1
  const cx = Math.floor(x / TREE_SPACING)
  const cz = Math.floor(z / TREE_SPACING)
  const found: ForestTree[] = []
  for (let iz = cz - reach; iz <= cz + reach; iz++) {
    for (let ix = cx - reach; ix <= cx + reach; ix++) {
      const tree = forestTree(ix, iz)
      if (!tree) continue
      if (Math.hypot(tree.x - x, tree.z - z) <= radius) found.push(tree)
    }
  }
  return found
}

export function openValley(x: number, z: number) {
  if (onMountain(x, z) || clearance(x, z) < 5.5 || distToCavado(x, z) < CAVADO_HALF + 4) return false
  for (let segment = 0; segment < rampNodes.length - 1; segment++) {
    if (distToSegment(x, z, rampNodes[segment], rampNodes[segment + 1]) < 5) return false
  }
  return true
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
  const riverSegments = cavado.length - 1
  valleyMat.customProgramCacheKey = () => 'valley-river'
  valleyMat.onBeforeCompile = (shader) => {
    shader.uniforms.uCavadoA = { value: cavado.slice(0, -1).map(([x, z]) => new Vector2(x, z)) }
    shader.uniforms.uCavadoB = { value: cavado.slice(1).map(([x, z]) => new Vector2(x, z)) }
    shader.uniforms.uCavadoHalf = { value: CAVADO_HALF }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWadeWorld;')
      .replace(
        '#include <project_vertex>',
        'vWadeWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#include <project_vertex>',
      )
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vWadeWorld;
        uniform vec2 uCavadoA[${riverSegments}];
        uniform vec2 uCavadoB[${riverSegments}];
        uniform float uCavadoHalf;`,
      )
      .replace(
        '#include <dithering_fragment>',
        `{
          float best = 1000.0;
          for (int i = 0; i < ${riverSegments}; i++) {
            vec2 ab = uCavadoB[i] - uCavadoA[i];
            float len2 = max(dot(ab, ab), 0.0001);
            float t = clamp(dot(vWadeWorld.xz - uCavadoA[i], ab) / len2, 0.0, 1.0);
            best = min(best, distance(vWadeWorld.xz, uCavadoA[i] + ab * t));
          }
          if (best < uCavadoHalf) discard;
        }
        #include <dithering_fragment>`,
      )
  }
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
      stump.userData.projectMarker = project.id
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
        stoneMesh.userData.projectMarker = project.id
        scenery.add(stoneMesh)
        crown += scale * 0.85
      })
    }
  }

  const valley = new Mesh(track(new PlaneGeometry(1800, 1800)), valleyMat)
  valley.rotation.x = -Math.PI / 2
  valley.position.y = VALLEY_Y
  valley.receiveShadow = true
  walkable.add(valley)

  const bankMat = paint('#c6b596', false)
  bankMat.side = DoubleSide
  const waterMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uEdge: { value: WATER_EDGE },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uEdge;
      varying vec2 vUv;
      varying float vViewZ;
      void main() {
        vUv = uv;
        vec3 p = position;
        p.y += uEdge;
        p.y += sin(uv.x * 0.42 - uTime * 1.7) * 0.045;
        p.y += sin(uv.x * 0.17 + uv.y * 3.0 - uTime * 0.8) * 0.025;
        vec4 view = modelViewMatrix * vec4(p, 1.0);
        vViewZ = -view.z;
        gl_Position = projectionMatrix * view;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vViewZ;
      void main() {
        float across = 1.0 - abs(vUv.y * 2.0 - 1.0);
        float streak = 0.5 + 0.5 * sin(vUv.x * 0.55 - uTime * 2.2);
        float rip = 0.5 + 0.5 * sin(vUv.x * 1.35 - uTime * 3.1 + vUv.y * 6.0);
        float foam = smoothstep(0.22, 0.0, across);
        vec3 deep = vec3(0.08, 0.32, 0.42);
        vec3 mid = vec3(0.22, 0.58, 0.68);
        vec3 crest = vec3(0.82, 0.93, 0.94);
        vec3 color = mix(deep, mid, across * 0.35 + rip * 0.4);
        color = mix(color, crest, foam * 0.72 + streak * across * 0.22);
        float alpha = mix(0.34, 0.58, across);
        alpha = mix(alpha, 0.3, foam);
        float fog = smoothstep(70.0, 340.0, vViewZ);
        color = mix(color, vec3(0.718, 0.769, 0.737), fog);
        gl_FragColor = vec4(color, mix(alpha, 0.0, fog));
      }
    `,
  })
  materials.push(waterMat)

  const addRibbon = (points: Array<[number, number]>, half: number, y: number, material: Material) => {
    const positions: number[] = []
    const uvs: number[] = []
    const indices: number[] = []
    let travelled = 0
    for (let i = 0; i < points.length; i++) {
      const prev = points[Math.max(0, i - 1)]
      const next = points[Math.min(points.length - 1, i + 1)]
      let dx = next[0] - prev[0]
      let dz = next[1] - prev[1]
      const len = Math.hypot(dx, dz) || 1
      dx /= len
      dz /= len
      if (i > 0) travelled += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
      const [x, z] = points[i]
      positions.push(x - dz * half, y, z + dx * half, x + dz * half, y, z - dx * half)
      uvs.push(travelled, 0, travelled, 1)
    }
    for (let i = 0; i < points.length - 1; i++) {
      const a = i * 2
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
    const geo = track(new BufferGeometry())
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    const mesh = new Mesh(geo, material)
    mesh.receiveShadow = true
    scenery.add(mesh)
    return mesh
  }

  const bedMat = paint('#1d4e56', false)
  bedMat.roughness = 0.92
  bedMat.onBeforeCompile = (shader) => {
    shader.uniforms.uSink = { value: WADE_SINK }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uSink;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float across = 1.0 - abs(uv.y * 2.0 - 1.0);
        transformed.y -= across * uSink;`,
      )
  }
  addRibbon(cavado, CAVADO_HALF + 8, VALLEY_Y + 0.04, bankMat)
  const bed = addRibbon(cavado, CAVADO_HALF, VALLEY_Y - 0.02, bedMat)
  bed.renderOrder = 1
  const water = addRibbon(cavado, CAVADO_HALF, VALLEY_Y, waterMat)
  water.renderOrder = 2
  water.castShadow = false
  walkable.userData.tickWater = (time: number) => {
    waterMat.uniforms.uTime.value = time
  }

  const post = new Mesh(unitCyl, trunkMat)
  post.scale.set(0.12, 3.3, 0.12)
  post.position.set(CAVADO_SIGN.x, VALLEY_Y + 1.65, CAVADO_SIGN.z)
  post.castShadow = true
  scenery.add(post)

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

  const cols = 110
  const rows = 72
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  const rock = new Color('#918c86')
  const shade = new Color('#6d726e')
  const moss = new Color('#546448')
  const tint = new Color()

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const x = -HALF_W + (col / cols) * HALF_W * 2
      const z = BACK_Z + (row / rows) * (FOOT_Z - BACK_Z)
      const height = mountainY(x, z)
      positions.push(x, height, z)
      const blend = Math.min(1, Math.max(0, (height - VALLEY_Y) / 48))
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

  const floorY = VALLEY_Y - 2
  const grass = new Color('#3e5a3b')
  const grassLight = new Color('#6e8f52')
  const grassAt = (x: number, z: number) => {
    const mix = Math.sin(x * 0.11 + z * 0.07) * 0.5 + 0.5
    return tint.copy(grass).lerp(grassLight, mix * 0.65)
  }
  const addSkirt = (topIndices: number[]) => {
    for (let i = 0; i < topIndices.length - 1; i++) {
      const i0 = topIndices[i]
      const i1 = topIndices[i + 1]
      const x0 = positions[i0 * 3]
      const y0 = positions[i0 * 3 + 1]
      const z0 = positions[i0 * 3 + 2]
      const x1 = positions[i1 * 3]
      const y1 = positions[i1 * 3 + 1]
      const z1 = positions[i1 * 3 + 2]
      const base = positions.length / 3
      positions.push(x0, y0, z0, x1, y1, z1, x0, floorY, z0, x1, floorY, z1)
      for (const [x, z] of [
        [x0, z0],
        [x1, z1],
        [x0, z0 + 2],
        [x1, z1 + 2],
      ] as const) {
        const color = grassAt(x, z)
        colors.push(color.r, color.g, color.b)
      }
      indices.push(base, base + 1, base + 3, base, base + 3, base + 2)
    }
  }

  const south: number[] = []
  const north: number[] = []
  const west: number[] = []
  const east: number[] = []
  for (let col = 0; col <= cols; col++) {
    south.push(rows * (cols + 1) + col)
    north.push(col)
  }
  for (let row = 0; row <= rows; row++) {
    west.push(row * (cols + 1))
    east.push(row * (cols + 1) + cols)
  }
  addSkirt(south)
  addSkirt([...north].reverse())
  addSkirt([...west].reverse())
  addSkirt(east)

  const floorBase = positions.length / 3
  positions.push(
    -HALF_W, floorY, BACK_Z,
    HALF_W, floorY, BACK_Z,
    HALF_W, floorY, FOOT_Z,
    -HALF_W, floorY, FOOT_Z,
  )
  for (const [x, z] of [
    [-HALF_W, BACK_Z],
    [HALF_W, BACK_Z],
    [HALF_W, FOOT_Z],
    [-HALF_W, FOOT_Z],
  ] as const) {
    const color = grassAt(x, z)
    colors.push(color.r, color.g, color.b)
  }
  indices.push(floorBase, floorBase + 1, floorBase + 2, floorBase, floorBase + 2, floorBase + 3)

  const rangeGeo = track(new BufferGeometry())
  rangeGeo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  rangeGeo.setAttribute('color', new Float32BufferAttribute(colors, 3))
  rangeGeo.setIndex(indices)
  rangeGeo.computeVertexNormals()
  const rangeMat = paint('#918c86')
  rangeMat.vertexColors = true
  rangeMat.side = DoubleSide
  const range = new Mesh(rangeGeo, rangeMat)
  range.name = 'mountain'
  range.receiveShadow = true
  walkable.add(range)

  const treeCone = track(new ConeGeometry(1.15, 2.8, 5))
  const oakCrown = track(new DodecahedronGeometry(1.05, 0))
  const leafOakA = paint('#3f6a34')
  const leafOakB = paint('#547a3c')
  const TREE_REACH = 32
  const TREE_CAPACITY = (TREE_REACH * 2 + 1) * (TREE_REACH * 2 + 1)
  const blockers: Array<{ x: number; z: number; r: number }> = []
  const dummy = new Object3D()
  const trunks = new InstancedMesh(unitCyl, trunkMat, TREE_CAPACITY)
  const crownsA = new InstancedMesh(treeCone, leafA, TREE_CAPACITY)
  const crownsB = new InstancedMesh(treeCone, leafB, TREE_CAPACITY)
  const oaksA = new InstancedMesh(oakCrown, leafOakA, TREE_CAPACITY)
  const oaksB = new InstancedMesh(oakCrown, leafOakB, TREE_CAPACITY)
  for (const mesh of [trunks, crownsA, crownsB, oaksA, oaksB]) {
    mesh.frustumCulled = false
    mesh.count = 0
    scenery.add(mesh)
  }

  const writeTree = (
    mesh: InstancedMesh,
    index: number,
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
    rot: number,
  ) => {
    dummy.position.set(x, y, z)
    dummy.rotation.set(0, rot, 0)
    dummy.scale.set(sx, sy, sz)
    dummy.updateMatrix()
    mesh.setMatrixAt(index, dummy.matrix)
  }

  let forestCellX = Number.NaN
  let forestCellZ = Number.NaN

  const refreshForest = (x: number, z: number) => {
    const cellX = Math.floor(x / TREE_SPACING)
    const cellZ = Math.floor(z / TREE_SPACING)
    if (cellX === forestCellX && cellZ === forestCellZ) return
    forestCellX = cellX
    forestCellZ = cellZ
    blockers.length = 0
    let trunkCount = 0
    let countA = 0
    let countB = 0
    let countOakA = 0
    let countOakB = 0
    for (let iz = cellZ - TREE_REACH; iz <= cellZ + TREE_REACH; iz++) {
      for (let ix = cellX - TREE_REACH; ix <= cellX + TREE_REACH; ix++) {
        const tree = forestTree(ix, iz)
        if (!tree || trunkCount >= TREE_CAPACITY) continue
        const { x: tx, z: tz, scale, rot, broad, oak } = tree
        if (oak) {
          writeTree(trunks, trunkCount, tx, VALLEY_Y + 0.42 * scale, tz, 0.34 * scale, 0.84 * scale, 0.34 * scale, rot)
          const crown = broad ? oaksB : oaksA
          const crownIndex = broad ? countOakB : countOakA
          writeTree(crown, crownIndex, tx, VALLEY_Y + 1.32 * scale, tz, 1.28 * scale, 0.95 * scale, 1.28 * scale, rot)
          if (broad) countOakB++
          else countOakA++
        } else {
          writeTree(trunks, trunkCount, tx, VALLEY_Y + 0.7 * scale, tz, 0.22 * scale, 1.4 * scale, 0.22 * scale, rot)
          if (broad) {
            writeTree(crownsB, countB, tx, VALLEY_Y + 2.35 * scale, tz, scale, scale, scale, rot)
            countB++
          } else {
            writeTree(crownsA, countA, tx, VALLEY_Y + 2.35 * scale, tz, scale, scale, scale, rot)
            countA++
          }
        }
        blockers.push({ x: tx, z: tz, r: tree.radius })
        trunkCount++
      }
    }
    trunks.count = trunkCount
    crownsA.count = countA
    crownsB.count = countB
    oaksA.count = countOakA
    oaksB.count = countOakB
    trunks.instanceMatrix.needsUpdate = true
    crownsA.instanceMatrix.needsUpdate = true
    crownsB.instanceMatrix.needsUpdate = true
    oaksA.instanceMatrix.needsUpdate = true
    oaksB.instanceMatrix.needsUpdate = true
  }

  const follow = (x: number, z: number) => {
    valley.position.x = x
    valley.position.z = z
    walkable.updateMatrixWorld(true)
    refreshForest(x, z)
  }
  walkable.userData.trees = blockers
  walkable.userData.solids = [] as { x: number; z: number; r: number }[]
  walkable.userData.follow = follow
  follow(0, 48)

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
