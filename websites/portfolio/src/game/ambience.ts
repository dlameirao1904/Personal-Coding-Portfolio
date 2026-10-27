/** Rio, pássaros, o ladrar do Atlas e a voz da Marina. O browser só deixa som depois de um gesto. */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let started = false
let era = 0
let birdTimer = 0
let musicTimer = 0
let birdClips: AudioBuffer[] = []
let wingClips: AudioBuffer[] = []
const noiseBanks = new WeakMap<BaseAudioContext, Map<number, AudioBuffer>>()

function speakers() {
  return master ?? ctx?.destination ?? null
}

function audio() {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function noiseBuffer(context: BaseAudioContext, seconds: number) {
  let bank = noiseBanks.get(context)
  if (!bank) noiseBanks.set(context, (bank = new Map()))
  const cached = bank.get(seconds)
  if (cached) return cached
  const rate = context.sampleRate
  const buffer = context.createBuffer(1, Math.floor(rate * seconds), rate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  bank.set(seconds, buffer)
  return buffer
}

function loopNoise(context: AudioContext, seconds: number, color: 'brown' | 'white') {
  const rate = context.sampleRate
  const buffer = context.createBuffer(1, Math.floor(rate * seconds), rate)
  const data = buffer.getChannelData(0)
  let brown = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    if (color === 'white') {
      data[i] = white
    } else {
      brown = (brown + 0.02 * white) / 1.02
      data[i] = brown * 3.4
    }
  }
  const source = context.createBufferSource()
  source.buffer = buffer
  source.loop = true
  return source
}

function chirp(context: BaseAudioContext, dest: AudioNode, when: number, count: number) {
  for (let i = 0; i < count; i++) {
    const t = when + i * (0.07 + Math.random() * 0.05)
    const osc = context.createOscillator()
    osc.type = 'sine'
    const base = 1700 + Math.random() * 1600
    osc.frequency.setValueAtTime(base, t)
    osc.frequency.exponentialRampToValueAtTime(base * (0.62 + Math.random() * 0.55), t + 0.11)
    const gain = context.createGain()
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.062, t + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.13)
    osc.connect(gain).connect(dest)
    osc.start(t)
    osc.stop(t + 0.15)
  }
}

function wing(context: BaseAudioContext, dest: AudioNode, when: number) {
  const source = context.createBufferSource()
  source.buffer = noiseBuffer(context, 0.22)
  const filter = context.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(500, when)
  filter.frequency.exponentialRampToValueAtTime(2200, when + 0.18)
  filter.Q.value = 0.7
  const gain = context.createGain()
  gain.gain.setValueAtTime(0.0001, when)
  gain.gain.exponentialRampToValueAtTime(0.03, when + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.22)
  source.connect(filter).connect(gain).connect(dest)
  source.start(when)
  source.stop(when + 0.24)
}

function playClip(context: AudioContext, buffer: AudioBuffer, when: number) {
  const dest = speakers()
  if (!dest) return
  const source = context.createBufferSource()
  source.buffer = buffer
  source.connect(dest)
  source.start(when)
}

function scheduleBirds(context: AudioContext) {
  if (ctx !== context) return
  const when = context.currentTime + 0.05
  const roll = Math.random()
  const dest = speakers()
  if (!dest) return
  if (birdClips.length && wingClips.length) {
    if (roll < 0.22)
      playClip(context, wingClips[Math.floor(Math.random() * wingClips.length)], when)
    playClip(context, birdClips[Math.floor(Math.random() * birdClips.length)], when)
    if (roll > 0.74)
      playClip(context, birdClips[Math.floor(Math.random() * birdClips.length)], when + 0.42)
  } else {
    if (roll < 0.22) wing(context, dest, when)
    chirp(context, dest, when, roll > 0.58 ? 3 : roll > 0.22 ? 2 : 1)
    if (roll > 0.74) chirp(context, dest, when + 0.42, 2)
  }
  birdTimer = window.setTimeout(() => scheduleBirds(context), 380 + Math.random() * 1280)
}

function bake(
  rate: number,
  seconds: number,
  fill: (context: OfflineAudioContext, dest: AudioNode) => void,
) {
  const offline = new OfflineAudioContext(1, Math.ceil(rate * seconds), rate)
  const dest = offline.createGain()
  dest.connect(offline.destination)
  fill(offline, dest)
  return offline.startRendering()
}

function prepareBirds(rate: number) {
  const wings = [0, 1, 2].map(() => bake(rate, 0.32, (context, dest) => wing(context, dest, 0.02)))
  const chirps = [1, 2, 3, 2, 1, 3].map((count) =>
    bake(rate, 0.62, (context, dest) => chirp(context, dest, 0.02, count)),
  )
  return Promise.all([Promise.all(wings), Promise.all(chirps)]).then(([wingSet, chirpSet]) => ({
    wings: wingSet,
    chirps: chirpSet,
  }))
}

/** Começa o fundo de rio e pássaros. Pode chamar-se em cada gesto: só arranca uma vez. */
export function ensureAmbience() {
  const context = audio()
  if (context.state === 'suspended') void context.resume()
  if (started) return
  started = true

  master = context.createGain()
  master.gain.setValueAtTime(0.0001, context.currentTime)
  master.gain.exponentialRampToValueAtTime(1, context.currentTime + 1.8)
  master.connect(context.destination)

  const bed = loopNoise(context, 4, 'brown')
  const low = context.createBiquadFilter()
  low.type = 'lowpass'
  low.frequency.value = 280
  const riverGain = context.createGain()
  riverGain.gain.value = 0.16
  const swell = context.createOscillator()
  swell.frequency.value = 0.13
  const swellGain = context.createGain()
  swellGain.gain.value = 0.035
  swell.connect(swellGain).connect(riverGain.gain)
  swell.start()
  bed.connect(low).connect(riverGain).connect(master)
  bed.start()

  const splash = loopNoise(context, 3, 'white')
  const babble = context.createBiquadFilter()
  babble.type = 'bandpass'
  babble.frequency.value = 740
  babble.Q.value = 0.6
  const splashGain = context.createGain()
  splashGain.gain.value = 0.018
  splash.connect(babble).connect(splashGain).connect(master)
  splash.start()

  const token = era
  void prepareBirds(context.sampleRate)
    .then((clips) => {
      if (token !== era || ctx !== context) return
      birdClips = clips.chirps
      wingClips = clips.wings
      scheduleBirds(context)
    })
    .catch(() => {
      if (token !== era || ctx !== context) return
      scheduleBirds(context)
    })
  void renderMusic(context.sampleRate)
    .then((buffer) => {
      if (token !== era || ctx !== context || !master) return
      const source = context.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.connect(master)
      source.start()
    })
    .catch(() => {
      if (token !== era || ctx !== context) return
      startMusicLive(context)
    })
}

function woof(context: AudioContext, when: number, pitch: number) {
  const osc = context.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(pitch, when)
  osc.frequency.exponentialRampToValueAtTime(pitch * 0.45, when + 0.13)
  const filter = context.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(pitch * 3.2, when)
  filter.frequency.exponentialRampToValueAtTime(pitch * 1.3, when + 0.14)
  filter.Q.value = 1.4
  const gain = context.createGain()
  gain.gain.setValueAtTime(0.0001, when)
  gain.gain.exponentialRampToValueAtTime(0.28, when + 0.018)
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.16)
  osc.connect(filter).connect(gain).connect(context.destination)
  osc.start(when)
  osc.stop(when + 0.18)

  const noise = context.createBufferSource()
  noise.buffer = noiseBuffer(context, 0.12)
  const noiseFilter = context.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.value = 900
  noiseFilter.Q.value = 0.8
  const noiseGain = context.createGain()
  noiseGain.gain.setValueAtTime(0.16, when)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.11)
  noise.connect(noiseFilter).connect(noiseGain).connect(context.destination)
  noise.start(when)
  noise.stop(when + 0.13)
}

function whenReady(run: (context: AudioContext) => void) {
  ensureAmbience()
  const context = audio()
  if (context.state === 'suspended') void context.resume().then(() => run(context))
  else run(context)
}

/** Dois ladridos curtos. */
export function bark() {
  whenReady((context) => {
    const t = context.currentTime + 0.02
    woof(context, t, 210)
    woof(context, t + 0.2, 250)
  })
}

function syllable(
  context: AudioContext,
  when: number,
  f0: number,
  f1: number,
  f2: number,
  dur: number,
  level: number,
) {
  const tone = context.createOscillator()
  tone.type = 'sawtooth'
  tone.frequency.setValueAtTime(f0, when)
  tone.frequency.exponentialRampToValueAtTime(Math.max(80, f0 * 0.94), when + dur)
  const warm = context.createOscillator()
  warm.type = 'sine'
  warm.frequency.setValueAtTime(f0, when)
  warm.frequency.exponentialRampToValueAtTime(Math.max(80, f0 * 0.94), when + dur)

  const out = context.createGain()
  out.gain.setValueAtTime(0.0001, when)
  out.gain.exponentialRampToValueAtTime(level, when + 0.045)
  out.gain.exponentialRampToValueAtTime(0.0001, when + dur)
  const soften = context.createBiquadFilter()
  soften.type = 'lowpass'
  soften.frequency.value = 2400
  out.connect(soften).connect(context.destination)

  const formant = (freq: number, q: number, amount: number) => {
    const filter = context.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = freq
    filter.Q.value = q
    const gain = context.createGain()
    gain.gain.value = amount
    tone.connect(filter)
    warm.connect(filter)
    filter.connect(gain).connect(out)
  }
  formant(f1, 7, 0.55)
  formant(f2, 8, 0.42)
  formant(Math.min(3400, f2 * 1.55), 5, 0.16)

  tone.start(when)
  warm.start(when)
  tone.stop(when + dur + 0.02)
  warm.stop(when + dur + 0.02)
}

const MELODY = [440, 523.25, 659.25, 587.33, 523.25, 440, 392, 349.23]
const BASS = [110, 130.81, 98, 87.31]

function note(
  context: BaseAudioContext,
  dest: AudioNode,
  when: number,
  freq: number,
  dur: number,
  type: OscillatorType,
  level: number,
) {
  const osc = context.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(freq, when)
  const gain = context.createGain()
  gain.gain.setValueAtTime(0.0001, when)
  gain.gain.exponentialRampToValueAtTime(level, when + Math.min(0.08, dur * 0.22))
  gain.gain.exponentialRampToValueAtTime(0.0001, when + dur)
  osc.connect(gain).connect(dest)
  osc.start(when)
  osc.stop(when + dur + 0.02)
}

const MUSIC_BEAT = 0.68
const MUSIC_STEPS = 32

/** O loop fica num buffer. Nota a nota criava osciladores sem parar. */
async function renderMusic(rate: number) {
  const period = MUSIC_BEAT * MUSIC_STEPS
  const offline = new OfflineAudioContext(1, Math.ceil(rate * (period + 0.08)), rate)
  const bus = offline.createGain()
  bus.gain.value = 0.5
  const soften = offline.createBiquadFilter()
  soften.type = 'lowpass'
  soften.frequency.value = 1500
  bus.connect(soften).connect(offline.destination)
  for (let step = 0; step < MUSIC_STEPS; step++) {
    const when = step * MUSIC_BEAT
    const bar = Math.floor(step / 8) % BASS.length
    if (step % 8 === 0) {
      note(offline, bus, when, BASS[bar], MUSIC_BEAT * 7.2, 'sine', 0.08)
      note(offline, bus, when, BASS[bar] * 2, MUSIC_BEAT * 7.2, 'triangle', 0.04)
      note(offline, bus, when, BASS[bar] * 2.5, MUSIC_BEAT * 6, 'sine', 0.02)
    }
    const melody = MELODY[step % MELODY.length]
    note(offline, bus, when, melody, MUSIC_BEAT * 0.92, 'triangle', 0.055)
    if (step % 4 === 2) note(offline, bus, when, melody * 2, MUSIC_BEAT * 0.5, 'sine', 0.02)
  }
  const rendered = await offline.startRendering()
  const frames = Math.round(rate * period)
  const loop = offline.createBuffer(1, frames, rate)
  loop.copyToChannel(rendered.getChannelData(0).subarray(0, frames), 0)
  return loop
}

/** Se a gravação falhar, volta ao relógio de notas. */
function startMusicLive(context: AudioContext) {
  if (!master) return
  const bus = context.createGain()
  bus.gain.value = 0.5
  const soften = context.createBiquadFilter()
  soften.type = 'lowpass'
  soften.frequency.value = 1500
  bus.connect(soften).connect(master)
  let step = 0
  const beat = 0.68
  const play = () => {
    if (ctx !== context) return
    const when = context.currentTime + 0.03
    const bar = Math.floor(step / 8) % BASS.length
    if (step % 8 === 0) {
      note(context, bus, when, BASS[bar], beat * 7.2, 'sine', 0.08)
      note(context, bus, when, BASS[bar] * 2, beat * 7.2, 'triangle', 0.04)
      note(context, bus, when, BASS[bar] * 2.5, beat * 6, 'sine', 0.02)
    }
    const melody = MELODY[step % MELODY.length]
    note(context, bus, when, melody, beat * 0.92, 'triangle', 0.055)
    if (step % 4 === 2) note(context, bus, when, melody * 2, beat * 0.5, 'sine', 0.02)
    step += 1
    musicTimer = window.setTimeout(play, beat * 1000)
  }
  play()
}

/** Um "olá" curto, na zona de uma voz feminina. */
export function marinaVoice() {
  whenReady((context) => {
    const t = context.currentTime + 0.02
    syllable(context, t, 230, 480, 860, 0.16, 0.2)
    syllable(context, t + 0.15, 290, 820, 1680, 0.28, 0.24)
  })
}

/** Passo no chão. O ruído reutiliza um buffer, em vez de o criar em cada passada. */
export function footstep(running: boolean, wet: boolean) {
  const context = ctx
  if (!context || !started) return
  const t = context.currentTime
  const osc = context.createOscillator()
  osc.type = 'sine'
  const thud = wet ? 160 : running ? 95 : 72
  osc.frequency.setValueAtTime(thud, t)
  osc.frequency.exponentialRampToValueAtTime(38, t + 0.07)
  const body = context.createGain()
  body.gain.setValueAtTime(running ? 0.14 : 0.055, t)
  body.gain.exponentialRampToValueAtTime(0.0001, t + (running ? 0.07 : 0.1))
  osc.connect(body).connect(context.destination)
  osc.start(t)
  osc.stop(t + 0.11)

  const noise = context.createBufferSource()
  noise.buffer = noiseBuffer(context, 0.06)
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = wet ? 1100 : running ? 1600 : 780
  const grit = context.createGain()
  grit.gain.setValueAtTime(wet ? 0.1 : running ? 0.07 : 0.032, t)
  grit.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
  noise.connect(filter).connect(grit).connect(context.destination)
  noise.start(t)
  noise.stop(t + 0.06)
}

/** Camada a assentar no prato. No fim, um toque mais alto. */
export function cakePlace(done = false) {
  const context = ctx
  const out = speakers()
  if (!context || !started || !out) return
  const t = context.currentTime
  const osc = context.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(done ? 520 : 340, t)
  osc.frequency.exponentialRampToValueAtTime(done ? 880 : 170, t + (done ? 0.18 : 0.08))
  const gain = context.createGain()
  gain.gain.setValueAtTime(0.04, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + (done ? 0.24 : 0.1))
  osc.connect(gain).connect(out)
  osc.start(t)
  osc.stop(t + 0.26)
}

export function stopAmbience() {
  era += 1
  window.clearTimeout(birdTimer)
  window.clearTimeout(musicTimer)
  birdTimer = 0
  musicTimer = 0
  birdClips = []
  wingClips = []
  master = null
  started = false
  if (!ctx) return
  const closing = ctx
  ctx = null
  void closing.close()
}
