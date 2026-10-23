import {
  CanvasTexture,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
} from 'three'

function fitFont(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, start: number) {
  let size = start
  ctx.font = `600 ${size}px Outfit, sans-serif`
  while (size > 28 && ctx.measureText(text).width > maxWidth) {
    size -= 2
    ctx.font = `600 ${size}px Outfit, sans-serif`
  }
  return size
}

export function makeSign(title: string, kicker: string, accent: string, wide: boolean) {
  const canvas = document.createElement('canvas')
  canvas.width = 768
  canvas.height = 280
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D indisponível')

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(247, 243, 234, 0.94)'
  ctx.beginPath()
  ctx.roundRect(16, 24, 736, 232, 28)
  ctx.fill()
  ctx.fillStyle = accent
  ctx.fillRect(16, 24, 12, 232)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = accent
  ctx.font = '500 40px Outfit, sans-serif'
  ctx.fillText(kicker, 396, 98)

  ctx.fillStyle = '#17211c'
  fitFont(ctx, title, 640, 72)
  ctx.fillText(title, 396, 178)

  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true
  const material = new SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  })
  const sprite = new Sprite(material)
  sprite.center.set(0.5, 0)
  const scale: [number, number] = wide ? [3.15, 1.15] : [2.15, 0.78]
  sprite.scale.set(scale[0], scale[1], 1)
  sprite.userData.base = scale
  return sprite
}

export function makeNotice(kicker: string, lines: string[]) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 576
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D indisponível')

  ctx.fillStyle = '#f7f3ea'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#8a4632'
  ctx.fillRect(0, 0, canvas.width, 28)
  ctx.fillRect(0, canvas.height - 28, canvas.width, 28)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#8a4632'
  ctx.font = '600 78px Outfit, sans-serif'
  ctx.fillText(kicker, 512, 150)

  ctx.fillStyle = '#17211c'
  ctx.font = '500 58px Outfit, sans-serif'
  lines.forEach((line, index) => {
    ctx.fillText(line, 512, 280 + index * 86)
  })

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true

  const group = new Group()
  const wood = new MeshStandardMaterial({ color: '#5c4032', roughness: 1, flatShading: true })
  const postGeo = new CylinderGeometry(0.07, 0.08, 1.7, 6)
  for (const x of [-1.2, 1.2]) {
    const post = new Mesh(postGeo, wood)
    post.position.set(x, 0.85, -0.05)
    post.castShadow = true
    group.add(post)
  }
  const board = new Mesh(
    new PlaneGeometry(2.8, 1.55),
    new MeshStandardMaterial({ map: texture, roughness: 1, metalness: 0 }),
  )
  board.position.y = 1.65
  board.castShadow = true
  board.receiveShadow = true
  group.add(board)
  group.userData.texture = texture
  return group
}
