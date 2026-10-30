import { reactive } from 'vue'
import { BoxGeometry, CanvasTexture, Group, Mesh, MeshStandardMaterial, SRGBColorSpace } from 'three'
import type { Passage } from '@/data/journey'

export const screenFrame = reactive({
  visible: false,
  left: 0,
  top: 0,
  width: 0,
  height: 0,
})

const W = 1280
const H = 800

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, limit: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    if (!word) continue
    const next = line ? `${line} ${word}` : word
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line)
      line = word
      if (lines.length === limit) return lines
    } else {
      line = next
    }
  }
  if (line && lines.length < limit) lines.push(line)
  return lines
}

function paint(texture: CanvasTexture, passage: Passage) {
  const canvas = texture.image as HTMLCanvasElement
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) return
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.fillStyle = '#10241c'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#8a4632'
  ctx.fillRect(0, 0, W, 16)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillStyle = '#e7c7a4'
  ctx.font = '600 28px Outfit, sans-serif'
  ctx.fillText(passage.kicker.toUpperCase(), 64, 48)

  ctx.fillStyle = '#f7f3ea'
  ctx.font = '600 58px Fraunces, Georgia, serif'
  const title = wrap(ctx, passage.title, W - 128, 2)
  title.forEach((line, index) => ctx.fillText(line, 64, 104 + index * 68))

  ctx.fillStyle = '#b7c4bc'
  ctx.font = '500 28px Outfit, sans-serif'
  const metaTop = 112 + title.length * 68
  ctx.fillText(`${passage.period}  ·  ${passage.place}`, 64, metaTop)

  ctx.fillStyle = '#f7f3ea'
  ctx.font = '500 32px Outfit, sans-serif'
  const body = wrap(ctx, passage.summary, W - 128, 6)
  const bodyTop = metaTop + 64
  body.forEach((line, index) => ctx.fillText(line, 64, bodyTop + index * 46))

  ctx.fillStyle = '#e7c7a4'
  ctx.font = '500 26px Outfit, sans-serif'
  ctx.fillText('As notas abrem neste ecrã.', 64, H - 72)

  texture.needsUpdate = true
}

function box(width: number, height: number, depth: number, color: string) {
  const mesh = new Mesh(
    new BoxGeometry(width, height, depth),
    new MeshStandardMaterial({ color, roughness: 1, flatShading: true }),
  )
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

export function makeComputer() {
  const group = new Group()
  group.visible = false

  const top = box(1.15, 0.06, 0.62, '#8d6b4a')
  top.position.y = 0.72
  group.add(top)

  for (const [x, z] of [
    [-0.48, -0.22],
    [0.48, -0.22],
    [-0.48, 0.22],
    [0.48, 0.22],
  ] as const) {
    const leg = box(0.06, 0.72, 0.06, '#5c4032')
    leg.position.set(x, 0.36, z)
    group.add(leg)
  }

  const neck = box(0.08, 0.22, 0.08, '#2c3330')
  neck.position.set(0, 0.86, 0)
  group.add(neck)

  const bezel = box(0.92, 0.58, 0.06, '#2c3330')
  bezel.position.set(0, 1.18, 0.04)
  group.add(bezel)

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.generateMipmaps = false
  const screen = new Mesh(
    new BoxGeometry(0.8, 0.48, 0.02),
    new MeshStandardMaterial({
      map: texture,
      emissive: '#f7f3ea',
      emissiveMap: texture,
      emissiveIntensity: 0.35,
      roughness: 1,
    }),
  )
  screen.name = 'screen'
  screen.position.set(0, 1.18, 0.08)
  group.add(screen)

  const keyboard = box(0.72, 0.03, 0.22, '#1f2422')
  keyboard.position.set(0, 0.76, 0.28)
  group.add(keyboard)

  group.userData.texture = texture
  group.scale.setScalar(1.9)
  return group
}

export function paintComputer(group: Group, passage: Passage) {
  if (group.userData.pageId === passage.id) return
  const texture = group.userData.texture as CanvasTexture | undefined
  if (!texture) return
  group.userData.pageId = passage.id
  paint(texture, passage)
}

export function disposeComputer(group: Group) {
  const texture = group.userData.texture as CanvasTexture | undefined
  const canvas = texture?.image as HTMLCanvasElement | undefined
  if (canvas) {
    canvas.width = 0
    canvas.height = 0
  }
  texture?.dispose()
  group.traverse((child) => {
    const mesh = child as Mesh
    mesh.geometry?.dispose()
    const material = mesh.material
    if (Array.isArray(material)) material.forEach((item) => item.dispose())
    else material?.dispose()
  })
}
