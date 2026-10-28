import { ref } from 'vue'
import {
  BoxGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
} from 'three'
import { ALBUMS, albumById, plain, type Album } from '@/data/records'
import { ensureAmbience } from '@/game/ambience'
import { releaseHikeKeys } from '@/game/controls'

const VALLEY_Y = -8

/** A leste da montanha, mais afastado do que o sopé. O flanco acaba em x = 140. */
export const VINYL_X = 196
export const VINYL_Z = -142
export const VINYL_TOP = VALLEY_Y + 0.28
export const VINYL_HALF_X = 3.2
export const VINYL_HALF_Z = 2.6

/** Onde os pés ficam, de frente para o gira-discos. */
export const VINYL_STANCE = { x: VINYL_X, z: VINYL_Z + 1.15 }
export const VINYL_EYE = 1.52
/** Centro do prato, em cima do balcão. */
export const VINYL_TABLE = { x: VINYL_X, y: VINYL_TOP + 0.98, z: VINYL_Z - 0.85 }

export const vinylNear = ref(false)
/** Primeira pessoa, à frente do gira-discos. */
export const listening = ref(false)
export const selectedId = ref<string | null>(null)
export const playing = ref(false)
export const vinylNote = ref('')
export const previewIndex = ref(0)

export type Preview = { name: string; url: string; art: string }

export const previews = ref<Preview[]>([])

const cache = new Map<string, Preview[]>()
let clip: HTMLAudioElement | null = null

function player() {
  if (clip) return clip
  clip = new Audio()
  clip.preload = 'none'
  clip.addEventListener('ended', () => {
    playing.value = false
    vinylNote.value = 'O excerto acabou.'
  })
  return clip
}

export function updateVinylNear(x: number, y: number, z: number, ready: boolean) {
  if (!ready || listening.value) {
    vinylNear.value = false
    return
  }
  const dx = Math.abs(x - VINYL_X)
  const dz = z - VINYL_Z
  vinylNear.value = dx < 3.8 && dz > -1.4 && dz < 4.4 && Math.abs(y - VINYL_TOP) < 2.2
}

export function enterVinyl() {
  if (!vinylNear.value || listening.value) return
  ensureAmbience()
  releaseHikeKeys()
  listening.value = true
  vinylNear.value = false
}

export function leaveVinyl() {
  if (!listening.value && !playing.value && !selectedId.value) return
  listening.value = false
  pauseVinyl()
  releaseHikeKeys()
}

export function vinylBlocksTree(x: number, z: number) {
  const dx = x - VINYL_X
  const dz = z - VINYL_Z
  if (dx * dx + dz * dz < 22 * 22) return true
  return Math.abs(dx) < 10 && dz > -6 && dz < 36
}

function stopClip() {
  if (!clip) return
  clip.pause()
  clip.removeAttribute('src')
  clip.load()
}

export function pauseVinyl() {
  playing.value = false
  if (clip) clip.pause()
}

function startPreview(index: number) {
  const track = previews.value[index]
  if (!track) {
    playing.value = false
    vinylNote.value = 'Este disco fica na mesa, sem excerto.'
    stopClip()
    return
  }
  previewIndex.value = index
  const audio = player()
  audio.src = track.url
  playing.value = true
  vinylNote.value = ''
  void audio.play().catch(() => {
    playing.value = false
    vinylNote.value = 'Toca outra vez para ouvir o excerto.'
  })
}

async function lookup(album: Album) {
  const url = new URL('https://itunes.apple.com/search')
  url.searchParams.set('term', album.query)
  url.searchParams.set('entity', 'song')
  url.searchParams.set('limit', '24')
  url.searchParams.set('country', album.country)
  const response = await fetch(url)
  if (!response.ok) return [] as Preview[]
  const body = (await response.json()) as {
    results?: Array<{
      artistName?: string
      collectionName?: string
      trackName?: string
      previewUrl?: string
      artworkUrl100?: string
    }>
  }
  const want = plain(album.collection)
  const avoid = album.avoid ? plain(album.avoid) : ''
  const artist = plain(album.artist)
  const found: Preview[] = []
  for (const row of body.results ?? []) {
    if (!row.previewUrl || !row.trackName) continue
    const collection = plain(row.collectionName ?? '')
    const who = plain(row.artistName ?? '')
    const song = plain(row.trackName)
    const sameBand = who.includes(artist) || artist.includes(who)
    const sameDisc =
      (collection.includes(want) || song.includes(want)) && (!avoid || !collection.includes(avoid))
    if (!sameBand || !sameDisc) continue
    found.push({
      name: row.trackName,
      url: row.previewUrl,
      art: row.artworkUrl100 ?? '',
    })
    if (found.length >= 8) break
  }
  return found
}

/** Põe o disco no prato e toca um excerto de trinta segundos. */
export function chooseAlbum(album: Album) {
  ensureAmbience()
  selectedId.value = album.id
  vinylNote.value = 'A pousar a agulha…'
  const cached = cache.get(album.id)
  if (cached) {
    previews.value = cached
    startPreview(0)
    return
  }
  previews.value = []
  void lookup(album)
    .then((tracks) => {
      if (selectedId.value !== album.id) return
      cache.set(album.id, tracks)
      previews.value = tracks
      startPreview(0)
    })
    .catch(() => {
      if (selectedId.value !== album.id) return
      playing.value = false
      vinylNote.value = 'O excerto não chegou. O disco fica na mesa.'
    })
}

export function playPreview(index: number) {
  if (!previews.value.length) {
    const album = albumById(selectedId.value)
    if (album) chooseAlbum(album)
    return
  }
  startPreview(index)
}

export function spineAlbums() {
  return ALBUMS.slice(0, 10)
}

function signTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D indisponível')
  ctx.fillStyle = '#f7f3ea'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#6b2430'
  ctx.fillRect(0, 0, canvas.width, 18)
  ctx.fillRect(0, canvas.height - 18, canvas.width, 18)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '600 92px Outfit, sans-serif'
  ctx.fillText('Discos', 256, 132)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export function addVinyl(walkable: Group, scenery: Group) {
  const wood = new MeshStandardMaterial({ color: '#6b4632', flatShading: true, roughness: 1 })
  const dark = new MeshStandardMaterial({ color: '#3a2a22', flatShading: true, roughness: 1 })
  const plaster = new MeshStandardMaterial({ color: '#e4d5c4', flatShading: true, roughness: 1 })
  const lamp = new MeshStandardMaterial({
    color: '#f3d48a',
    emissive: '#e2b15a',
    emissiveIntensity: 0.45,
    roughness: 0.6,
  })

  const floor = new Mesh(new BoxGeometry(VINYL_HALF_X * 2, 0.1, VINYL_HALF_Z * 2), dark)
  floor.position.set(VINYL_X, VINYL_TOP - 0.05, VINYL_Z)
  floor.receiveShadow = true
  walkable.add(floor)
  const step = new Mesh(new BoxGeometry(2.4, 0.1, 1.1), dark)
  step.position.set(VINYL_X, VINYL_TOP - 0.05, VINYL_Z + VINYL_HALF_Z + 0.45)
  step.receiveShadow = true
  walkable.add(step)

  const wall = (width: number, depth: number, x: number, z: number) => {
    const mesh = new Mesh(new BoxGeometry(width, 2.35, depth), plaster)
    mesh.position.set(x, VINYL_TOP + 1.18, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    scenery.add(mesh)
  }
  wall(VINYL_HALF_X * 2 + 0.2, 0.16, VINYL_X, VINYL_Z - VINYL_HALF_Z)
  wall(0.16, VINYL_HALF_Z * 2, VINYL_X - VINYL_HALF_X, VINYL_Z)
  wall(0.16, VINYL_HALF_Z * 2, VINYL_X + VINYL_HALF_X, VINYL_Z)

  const roof = new Mesh(new BoxGeometry(VINYL_HALF_X * 2 + 0.7, 0.12, VINYL_HALF_Z * 2 + 0.5), wood)
  roof.position.set(VINYL_X, VINYL_TOP + 2.42, VINYL_Z - 0.1)
  roof.castShadow = true
  scenery.add(roof)

  const counter = new Mesh(new BoxGeometry(1.7, 0.86, 0.72), wood)
  counter.position.set(VINYL_X, VINYL_TOP + 0.43, VINYL_TABLE.z)
  counter.castShadow = true
  counter.receiveShadow = true
  scenery.add(counter)

  const crate = new Mesh(new BoxGeometry(0.7, 0.42, 0.42), dark)
  crate.position.set(VINYL_X - 1.55, VINYL_TOP + 0.21, VINYL_Z + 0.15)
  crate.castShadow = true
  scenery.add(crate)
  const albums = spineAlbums()
  const stack = new InstancedMesh(
    new BoxGeometry(0.035, 0.34, 0.34),
    new MeshStandardMaterial({ color: '#ffffff', roughness: 0.8 }),
    albums.length,
  )
  const dummy = new Object3D()
  const tint = new Color()
  albums.forEach((album, index) => {
    dummy.position.set(VINYL_X - 1.82 + index * 0.055, VINYL_TOP + 0.5, VINYL_Z + 0.15)
    dummy.scale.set(1, 1, 1)
    dummy.rotation.set(0, 0, 0)
    dummy.updateMatrix()
    stack.setMatrixAt(index, dummy.matrix)
    stack.setColorAt(index, tint.set(album.color))
  })
  stack.instanceMatrix.needsUpdate = true
  if (stack.instanceColor) stack.instanceColor.needsUpdate = true
  scenery.add(stack)

  const shade = new Mesh(new ConeGeometry(0.16, 0.22, 6), lamp)
  shade.position.set(VINYL_X + 1.7, VINYL_TOP + 2.05, VINYL_Z - 1.4)
  scenery.add(shade)

  const texture = signTexture()
  const sign = new Mesh(
    new BoxGeometry(1.45, 0.72, 0.06),
    new MeshStandardMaterial({ map: texture, roughness: 1 }),
  )
  sign.position.set(VINYL_X, VINYL_TOP + 1.2, VINYL_Z + VINYL_HALF_Z + 1.15)
  sign.castShadow = true
  scenery.add(sign)
  for (const x of [-0.55, 0.55]) {
    const pole = new Mesh(new CylinderGeometry(0.045, 0.055, 1.15, 6), wood)
    pole.position.set(VINYL_X + x, VINYL_TOP + 0.58, VINYL_Z + VINYL_HALF_Z + 1.2)
    pole.castShadow = true
    scenery.add(pole)
  }

  const solids = walkable.userData.solids as { x: number; z: number; r: number }[]
  for (const x of [-2.1, 0, 2.1]) {
    solids.push({ x: VINYL_X + x, z: VINYL_Z - VINYL_HALF_Z, r: 0.85 })
  }
  for (const z of [-1.5, 0.2, 1.6]) {
    solids.push({ x: VINYL_X - VINYL_HALF_X, z: VINYL_Z + z, r: 0.7 })
    solids.push({ x: VINYL_X + VINYL_HALF_X, z: VINYL_Z + z, r: 0.7 })
  }
  solids.push(
    { x: VINYL_TABLE.x, z: VINYL_TABLE.z, r: 0.75 },
    { x: VINYL_X, z: VINYL_Z + VINYL_HALF_Z + 1.15, r: 0.5 },
  )
}
