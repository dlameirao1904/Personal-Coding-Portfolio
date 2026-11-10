import * as THREE from 'three'

export type BakeryHandle = {
  setProgress: (value: number) => void
  setPointer: (x: number, y: number) => void
  start: () => void
  stop: () => void
  dispose: () => void
}

const DOUGH = new THREE.Color('#e7c98a')

export function mountBakery(canvas: HTMLCanvasElement): BakeryHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
  renderer.setClearColor(0xf4efe6)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xf4efe6, 14, 32)
  scene.add(new THREE.AmbientLight(0xfffaf3, 0.85))
  scene.add(new THREE.HemisphereLight(0xfff7ee, 0xe7d7c4, 0.7))
  const key = new THREE.DirectionalLight(0xfff3e4, 1.65)
  key.position.set(6, 12, 8)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.near = 0.5
  key.shadow.camera.far = 40
  key.shadow.camera.left = -12
  key.shadow.camera.right = 12
  key.shadow.camera.top = 12
  key.shadow.camera.bottom = -12
  scene.add(key)

  const camera = new THREE.PerspectiveCamera(36, 1, 0.08, 80)
  const mixerPoint = new THREE.Vector3(-4.4, 0.92, 0.4)
  const tablePoint = new THREE.Vector3(0, 1.36, 0)
  const cartHome = new THREE.Vector3(4.35, 0, 0)
  const cartDock = new THREE.Vector3(2.55, 0, -5.05)
  const ovenFront = new THREE.Vector3(-0.1, 1.38, -4.75)
  const ovenDeck = new THREE.Vector3(-0.1, 1.28, -5.4)

  buildRoom(scene)
  const loaf = buildLoaf()
  const cart = buildCart()
  const tela = buildTela()
  const bakerA = buildBaker(0xf4efe6, 0x2c3338, 0xd9a578)
  const bakerB = buildBaker(0xf7f3ec, 0x3e5344, 0xc98460)
  scene.add(loaf.group, cart.group, tela.group, bakerA.group, bakerB.group)

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const fine = window.matchMedia('(pointer: fine)').matches
  const clock = new THREE.Clock()
  const pointer = new THREE.Vector2()
  const pointerTarget = new THREE.Vector2()
  const loafPos = new THREE.Vector3()
  const cartPos = new THREE.Vector3()
  const telaPos = new THREE.Vector3()
  const lookTarget = new THREE.Vector3()
  let progress = 0
  let progressTarget = 0
  let time = 0
  let looping = false
  let viewWidth = 0
  let viewHeight = 0

  function resize() {
    const nextWidth = canvas.clientWidth
    const nextHeight = canvas.clientHeight
    if (!nextWidth || !nextHeight || (nextWidth === viewWidth && nextHeight === viewHeight)) return
    viewWidth = nextWidth
    viewHeight = nextHeight
    renderer.setSize(nextWidth, nextHeight, false)
    camera.aspect = nextWidth / Math.max(nextHeight, 1)
    camera.fov = camera.aspect < 0.9 ? 52 : 44
    camera.updateProjectionMatrix()
  }

  function pose() {
    const t = THREE.MathUtils.clamp(progress, 0, 1)
    const toTable = range(t, 0.02, 0.24)
    const form = range(t, 0.22, 0.48)
    const toCart = range(t, 0.48, 0.66)
    const ride = range(t, 0.68, 0.8)
    const grab = range(t, 0.78, 0.86)
    const toFront = range(t, 0.86, 0.94)
    const slide = range(t, 0.93, 1)
    const scaleY = THREE.MathUtils.lerp(0.68, 0.38, form)
    tablePoint.y = 1.01 + 0.22 * scaleY

    cartPos.lerpVectors(cartHome, cartDock, ride)
    cart.group.position.copy(cartPos)
    cart.group.rotation.y = ride * 0.35
    cart.group.visible = true

    const bed = new THREE.Vector3(cartPos.x, 1.3 + 0.04 * scaleY, cartPos.z)
    loafPos.copy(mixerPoint).lerp(tablePoint, toTable).lerp(bed, toCart)
    telaPos.set(cartPos.x, 1.22, cartPos.z).lerp(ovenFront, toFront).lerp(ovenDeck, slide)
    loafPos.lerp(new THREE.Vector3(telaPos.x, telaPos.y + 0.08, telaPos.z), Math.max(toFront, slide))
    loaf.group.position.copy(loafPos)
    loaf.blob.scale.set(THREE.MathUtils.lerp(0.78, 1.16, form), scaleY, THREE.MathUtils.lerp(0.78, 1.05, form))
    loaf.material.color.copy(DOUGH)
    loaf.scores.visible = form > 0.35
    loaf.scores.scale.setScalar(Math.max(form, 0.001))
    loaf.scores.position.y = 0.1 * scaleY

    tela.group.position.copy(telaPos)
    tela.group.rotation.y = 0
    tela.group.visible = true

    const push = new THREE.Vector3(cartPos.x, 0, cartPos.z + 1.05)
    bakerA.group.position.set(-1.75, 0, 1.05)
    bakerB.group.position.set(1.75, 0, 1.05)
    bakerA.group.position.lerp(new THREE.Vector3(push.x - 0.55, 0, push.z), ride)
    bakerB.group.position.lerp(new THREE.Vector3(push.x + 0.55, 0, push.z), ride)
    const hold = Math.max(grab, toFront)
    const endX = slide > 0.05 ? -0.1 : telaPos.x
    const endZ = slide > 0.05 ? -4.55 : telaPos.z + 0.42
    bakerA.group.position.lerp(new THREE.Vector3(endX - 0.7, 0, endZ), hold)
    bakerB.group.position.lerp(new THREE.Vector3(endX + 0.7, 0, endZ), hold)
    const focus = hold > 0.15 ? ovenDeck : loafPos
    faceUpright(bakerA.group, focus)
    faceUpright(bakerB.group, focus)
    const knead = Math.sin(time * 5) * (1 - form) * (1 - ride) * 0.28
    const reach = 1.2 + hold * 0.15
    bakerA.armL.rotation.x = reach + knead
    bakerA.armR.rotation.x = reach - knead
    bakerB.armL.rotation.x = reach - knead
    bakerB.armR.rotation.x = reach + knead

    const swayX = reduce ? 0 : Math.sin(time * 0.35) * (fine ? 0.03 : 0.1)
    const swayY = reduce ? 0 : Math.cos(time * 0.28) * 0.02
    const aimX = reduce ? 0 : pointer.x * 0.35 + swayX
    const aimY = reduce ? 0 : pointer.y * 0.2 + swayY
    const along = Math.max(ride, grab, toFront)
    const back = camera.aspect < 0.9 ? 6.2 : 4.8
    camera.fov = camera.aspect < 0.9 ? 52 : THREE.MathUtils.lerp(42, 48, along)
    camera.updateProjectionMatrix()
    lookTarget.copy(loafPos).lerp(new THREE.Vector3(0.9, 1.35, -5.1), along)
    camera.position.set(
      THREE.MathUtils.lerp(loafPos.x - 0.15, -0.2, along) + aimX,
      THREE.MathUtils.lerp(2.15, 2.7, along) - aimY * 0.25,
      THREE.MathUtils.lerp(loafPos.z + back, -1.2, along),
    )
    camera.lookAt(lookTarget)
  }

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05)
    time += dt
    progress = reduce ? progressTarget : progress + (progressTarget - progress) * 0.08
    if (!fine && !reduce) {
      pointerTarget.x = Math.sin(time * 0.4) * 0.35
      pointerTarget.y = Math.cos(time * 0.28) * 0.15
    }
    pointer.x += (pointerTarget.x - pointer.x) * 0.07
    pointer.y += (pointerTarget.y - pointer.y) * 0.07
    resize()
    pose()
    renderer.render(scene, camera)
  }

  resize()
  pose()
  renderer.render(scene, camera)

  return {
    setProgress(value) {
      progressTarget = THREE.MathUtils.clamp(value, 0, 1)
      if (!looping) {
        progress = progressTarget
        resize()
        pose()
        renderer.render(scene, camera)
      }
    },
    setPointer(x, y) {
      if (!fine || reduce) return
      pointerTarget.set(x, y)
    },
    start() {
      if (looping) return
      looping = true
      clock.getDelta()
      renderer.setAnimationLoop(frame)
    },
    stop() {
      looping = false
      renderer.setAnimationLoop(null)
    },
    dispose() {
      looping = false
      renderer.setAnimationLoop(null)
      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return
        child.geometry.dispose()
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        materials.forEach((material) => {
          material.map?.dispose()
          material.dispose()
        })
      })
      renderer.dispose()
    },
  }
}

function range(value: number, start: number, end: number) {
  return THREE.MathUtils.smoothstep(value, start, end)
}

function faceUpright(group: THREE.Object3D, target: THREE.Vector3) {
  const dx = target.x - group.position.x
  const dz = target.z - group.position.z
  group.rotation.x = 0
  group.rotation.z = 0
  group.rotation.y = Math.atan2(-dx, -dz)
}

function buildRoom(scene: THREE.Scene) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(48, 48),
    new THREE.MeshStandardMaterial({ map: floorFade(), roughness: 0.92, metalness: 0.04 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, -2.5)
  floor.receiveShadow = true
  scene.add(floor)

  buildMixer(scene)
  buildTable(scene)
  buildOven(scene)

  const fill = new THREE.PointLight(0xfff6ea, 12, 18)
  fill.position.set(0, 4.5, -1)
  scene.add(fill)
}

function floorFade() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)
  ctx.fillStyle = '#f4efe6'
  ctx.fillRect(0, 0, 512, 512)
  const wash = ctx.createRadialGradient(256, 270, 20, 256, 270, 255)
  wash.addColorStop(0, '#e4d3b8')
  wash.addColorStop(0.45, '#d9c7aa')
  wash.addColorStop(0.78, '#efe6d8')
  wash.addColorStop(1, '#f4efe6')
  ctx.fillStyle = wash
  ctx.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 700; i++) {
    const x = 40 + Math.random() * 430
    const y = 40 + Math.random() * 430
    const fade = 1 - Math.min(1, Math.hypot(x - 256, y - 270) / 220)
    if (fade <= 0) continue
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(90,70,55,${0.35 * fade})` : `rgba(255,248,236,${0.28 * fade})`
    ctx.beginPath()
    ctx.arc(x, y, Math.random() * 2.2 + 0.4, 0, Math.PI * 2)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function shade(mesh: THREE.Mesh) {
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function buildMixer(scene: THREE.Scene) {
  const group = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, metalness: 0.2, roughness: 0.5 })
  const steel = new THREE.MeshStandardMaterial({ color: 0xb7bec6, metalness: 0.35, roughness: 0.4 })
  const base = shade(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 1.4), white))
  base.position.set(0, 0.15, 0)
  const pillar = shade(new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.8), white))
  pillar.position.set(0, 1.0, -0.3)
  const arm = shade(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 1.2), white))
  arm.position.set(0, 1.6, 0.1)
  const bowl = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.7, 20), steel))
  bowl.position.set(0, 0.7, 0.4)
  const beater = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.55, 8), steel))
  beater.position.set(0.12, 1.05, 0.4)
  beater.rotation.z = 0.35
  const guard = shade(new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.02, 6, 18, Math.PI), steel))
  guard.rotation.x = Math.PI / 2
  guard.position.set(0, 1.12, 0.4)
  const panel = shade(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.32), steel))
  panel.position.set(0.4, 1.0, -0.3)
  group.add(base, pillar, arm, bowl, beater, guard, panel)
  const colors = [0xd24a3a, 0xe0b03a, 0x3f8f55]
  colors.forEach((color, index) => {
    const button = shade(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.03, 10),
        new THREE.MeshStandardMaterial({ color, roughness: 0.4 }),
      ),
    )
    button.rotation.z = Math.PI / 2
    button.position.set(0.45, 1.12 - index * 0.12, -0.3)
    group.add(button)
  })
  group.position.set(-4.4, 0, 0)
  scene.add(group)
}

function buildTable(scene: THREE.Scene) {
  const steel = new THREE.MeshStandardMaterial({ color: 0xb7bec6, metalness: 0.35, roughness: 0.4 })
  const top = shade(new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 1.5), steel))
  top.position.y = 0.95
  const shelf = shade(new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.05, 1.3), steel))
  shelf.position.y = 0.32
  scene.add(top, shelf)
  const flour = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 1.15),
    new THREE.MeshStandardMaterial({ color: 0xf7f3ea, roughness: 1 }),
  )
  flour.rotation.x = -Math.PI / 2
  flour.position.set(0, 1.01, 0)
  flour.receiveShadow = true
  scene.add(flour)
  const legGeo = new THREE.BoxGeometry(0.1, 0.9, 0.1)
  for (const x of [-1.4, 1.4]) {
    for (const z of [-0.65, 0.65]) {
      const leg = shade(new THREE.Mesh(legGeo, steel))
      leg.position.set(x, 0.45, z)
      scene.add(leg)
    }
  }
}

function buildOven(scene: THREE.Scene) {
  const group = new THREE.Group()
  group.position.set(0, 0, -6.6)
  const steel = new THREE.MeshStandardMaterial({ color: 0xc5ccd4, metalness: 0.35, roughness: 0.38 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x3a342f, roughness: 0.85 })
  const white = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, metalness: 0.15, roughness: 0.5 })
  const body = shade(new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.6, 2.2), steel))
  body.position.set(0, 1.3, 0)
  const opening = shade(new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.6, 0.12), dark))
  opening.position.set(-0.1, 1.4, 1.08)
  group.add(body, opening)
  for (let y = 0.8; y <= 2.0; y += 0.4) {
    const shelf = shade(new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.035, 0.35), steel))
    shelf.position.set(-0.1, y, 1.12)
    group.add(shelf)
  }
  const hood = shade(new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.28, 1.4), steel))
  hood.position.set(0, 2.75, 0.1)
  const pipe = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.7, 10), steel))
  pipe.position.set(0, 3.2, 0.1)
  const panel = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.25, 0.08), white))
  panel.position.set(1.95, 1.45, 1.12)
  group.add(hood, pipe, panel)
  const lamps = [0xd24a3a, 0x3f8f55, 0xe0b03a, 0x2a2e32]
  lamps.forEach((color, index) => {
    const lamp = shade(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.02, 10),
        new THREE.MeshStandardMaterial({ color, roughness: 0.35 }),
      ),
    )
    lamp.rotation.x = Math.PI / 2
    lamp.position.set(1.95, 1.85 - index * 0.22, 1.17)
    group.add(lamp)
  })
  const glow = new THREE.PointLight(0xffc48a, 8, 6)
  glow.position.set(-0.1, 1.5, 1.3)
  group.add(glow)
  scene.add(group)
}

function buildLoaf() {
  const group = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color: DOUGH.clone(), roughness: 0.7 })
  const blob = new THREE.Mesh(new THREE.SphereGeometry(0.22, 28, 20), material)
  blob.castShadow = true
  const scores = new THREE.Group()
  const cut = new THREE.MeshStandardMaterial({ color: 0x4a2614, roughness: 0.5 })
  scores.add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.035), cut))
  scores.add(new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.02, 0.22), cut))
  group.add(blob, scores)
  return { group, blob, material, scores }
}

function buildCart() {
  const group = new THREE.Group()
  const steel = new THREE.MeshStandardMaterial({ color: 0xb7bec6, metalness: 0.35, roughness: 0.4 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.45, roughness: 0.5 })
  const width = 1.05
  const height = 2.15
  const depth = 0.8
  const poleGeo = new THREE.BoxGeometry(0.05, height, 0.05)
  const poles = [
    [-width / 2, height / 2, -depth / 2],
    [width / 2, height / 2, -depth / 2],
    [-width / 2, height / 2, depth / 2],
    [width / 2, height / 2, depth / 2],
  ]
  for (const [x, y, z] of poles) {
    const pole = shade(new THREE.Mesh(poleGeo, steel))
    pole.position.set(x, y, z)
    const wheel = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 10), dark))
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(x, 0.07, z)
    group.add(pole, wheel)
  }
  const runnerGeo = new THREE.BoxGeometry(0.04, 0.02, depth)
  for (let y = 0.28; y < height - 0.08; y += 0.28) {
    if (y > 1.05 && y < 1.42) continue
    const left = shade(new THREE.Mesh(runnerGeo, steel))
    left.position.set(-width / 2 + 0.06, y, 0)
    const right = shade(new THREE.Mesh(runnerGeo, steel))
    right.position.set(width / 2 - 0.06, y, 0)
    group.add(left, right)
    if (Math.abs(y - 1.22) < 0.2) continue
    const tray = shade(
      new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.16, 0.015, depth - 0.12),
        new THREE.MeshStandardMaterial({ color: 0x9aa3ab, metalness: 0.2, roughness: 0.45 }),
      ),
    )
    tray.position.set(0, y + 0.02, 0)
    group.add(tray)
  }
  const barGeo = new THREE.BoxGeometry(width, 0.045, 0.045)
  const front = shade(new THREE.Mesh(barGeo, steel))
  front.position.set(0, height - 0.03, depth / 2)
  const back = shade(new THREE.Mesh(barGeo, steel))
  back.position.set(0, height - 0.03, -depth / 2)
  group.add(front, back)
  return { group }
}

function buildTela() {
  const group = new THREE.Group()
  const sheet = shade(
    new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.02, 0.58),
      new THREE.MeshStandardMaterial({ color: 0x2c3034, metalness: 0.2, roughness: 0.5 }),
    ),
  )
  const cloth = new THREE.Mesh(
    new THREE.PlaneGeometry(0.78, 0.44),
    new THREE.MeshStandardMaterial({ color: 0xf7f3ea, roughness: 0.95, side: THREE.DoubleSide }),
  )
  cloth.rotation.x = -Math.PI / 2
  cloth.position.y = 0.02
  cloth.receiveShadow = true
  group.add(sheet, cloth)
  return { group }
}

function buildBaker(coatColor: number, trouserColor: number, skinColor: number) {
  const group = new THREE.Group()
  const coat = new THREE.MeshStandardMaterial({ color: coatColor, roughness: 0.65 })
  const trousers = new THREE.MeshStandardMaterial({ color: trouserColor, roughness: 0.8 })
  const skin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.55 })
  const shoe = new THREE.MeshStandardMaterial({ color: 0x2a241f, roughness: 0.7 })
  for (const side of [-1, 1]) {
    const foot = shade(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.22), shoe))
    foot.position.set(side * 0.1, 0.03, -0.02)
    const leg = shade(new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.42, 3, 8), trousers))
    leg.position.set(side * 0.1, 0.32, 0)
    group.add(foot, leg)
  }
  const hips = shade(new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.2), trousers))
  hips.position.y = 0.58
  const torso = shade(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.42, 0.22), coat))
  torso.position.set(0, 0.88, 0)
  const apron = shade(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.36, 0.04), coat))
  apron.position.set(0, 0.78, -0.12)
  const neck = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 8), skin))
  neck.position.y = 1.12
  const head = shade(new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), skin))
  head.position.y = 1.28
  const cap = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.14, 0.08, 12), coat))
  cap.position.y = 1.4
  const brim = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 12), coat))
  brim.position.y = 1.36
  group.add(hips, torso, apron, neck, head, cap, brim)
  const eye = new THREE.MeshStandardMaterial({ color: 0x2a211c, roughness: 0.4 })
  for (const side of [-1, 1]) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), eye)
    dot.position.set(side * 0.045, 1.29, -0.11)
    group.add(dot)
  }
  const armL = new THREE.Group()
  const armR = new THREE.Group()
  for (const [arm, side] of [
    [armL, -1],
    [armR, 1],
  ] as const) {
    arm.position.set(side * 0.24, 1.02, -0.02)
    const limb = shade(new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.28, 3, 6), coat))
    limb.position.y = -0.18
    const hand = shade(new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), skin))
    hand.position.y = -0.36
    arm.add(limb, hand)
    group.add(arm)
  }
  return { group, armL, armR }
}
