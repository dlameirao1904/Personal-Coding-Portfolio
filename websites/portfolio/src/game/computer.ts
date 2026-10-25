import {
  BoxGeometry,
  CanvasTexture,
  Group,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
} from 'three'
import type { Passage } from '@/data/journey'

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function paint(texture: CanvasTexture, passage: Passage) {
  const canvas = texture.image as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#10241c'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#8a4632'
  ctx.fillRect(0, 0, canvas.width, 28)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillStyle = '#e7c7a4'
  ctx.font = '600 52px Outfit, sans-serif'
  ctx.fillText(passage.kicker.toUpperCase(), 96, 72)

  ctx.fillStyle = '#f7f3ea'
  ctx.font = '600 92px Fraunces, Georgia, serif'
  const title = wrap(ctx, passage.title, 1860).slice(0, 2)
  title.forEach((line, index) => ctx.fillText(line, 96, 160 + index * 104))

  ctx.fillStyle = '#b7c4bc'
  ctx.font = '500 44px Outfit, sans-serif'
  const meta = `${passage.period} · ${passage.place}`
  ctx.fillText(meta, 96, 160 + title.length * 104 + 16)

  ctx.fillStyle = '#f7f3ea'
  ctx.font = '500 48px Outfit, sans-serif'
  const bodyTop = 300 + title.length * 104
  const body = wrap(ctx, passage.summary, 1860).slice(0, 8)
  body.forEach((line, index) => ctx.fillText(line, 96, bodyTop + index * 64))

  if (passage.stack.length) {
    ctx.fillStyle = '#e7c7a4'
    ctx.font = '500 40px Outfit, sans-serif'
    const stackTop = Math.min(1120, bodyTop + body.length * 64 + 36)
    const stack = wrap(ctx, passage.stack.join('  ·  '), 1860).slice(0, 2)
    stack.forEach((line, index) => ctx.fillText(line, 96, stackTop + index * 52))
  }

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
  canvas.width = 2048
  canvas.height = 1280
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
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
  const texture = group.userData.texture as CanvasTexture | undefined
  if (!texture) return
  paint(texture, passage)
}

export function disposeComputer(group: Group) {
  const texture = group.userData.texture as CanvasTexture | undefined
  texture?.dispose()
  group.traverse((child) => {
    const mesh = child as Mesh
    mesh.geometry?.dispose()
    const material = mesh.material
    if (Array.isArray(material)) material.forEach((item) => item.dispose())
    else material?.dispose()
  })
}
