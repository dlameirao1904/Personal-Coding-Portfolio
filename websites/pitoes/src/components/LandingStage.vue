<script lang="ts" setup>
import BreadMark from '@/components/BreadMark.vue'
import { featuredProducts } from '@/data/site'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const rotX = ref(0)
const rotY = ref(0)
let frame = 0
let smoothX = 0
let smoothY = 0
let targetX = 0
let targetY = 0
let reduce = false

const pose = computed(() => ({ transform: `rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)` }))

function onPointer(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
}

function onLeave() {
  targetX = 0
  targetY = 0
}

function tick(now: number) {
  const swayX = reduce ? 0 : Math.sin(now / 1800) * 0.08
  const swayY = reduce ? 0 : Math.cos(now / 2200) * 0.05
  smoothX += (targetX + swayX - smoothX) * 0.08
  smoothY += (targetY + swayY - smoothY) * 0.08
  rotX.value = smoothY * 6
  rotY.value = -smoothX * 8
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduce) frame = requestAnimationFrame(tick)
})

onUnmounted(() => cancelAnimationFrame(frame))
</script>

<template>
  <!-- 1. Adicionamos tw-relative e overflow-hidden para conter o background -->
  <section class="tw-relative tw-mx-auto tw-grid tw-min-h-[100svh] tw-w-full tw-max-w-6xl tw-items-center tw-gap-12 tw-overflow-hidden tw-px-5 tw-pb-16 tw-pt-28 md:tw-grid-cols-2 md:tw-px-8">

    <!-- INTEGRAÇÃO FOTOGRÁFICA DESVANECIDA -->
    <div class="tw-absolute tw-inset-0 tw--z-10">
      <!-- Imagem de fundo (ajusta o path conforme a tua estrutura, ex: montanhas.jpg ou foto do forno) -->
      <img
        src="/photos/pitoes-panoramica.jpg"
        alt="Paisagem de Pitões das Júnias"
        class="tw-h-full tw-w-full tw-object-cover tw-object-right opacity-90"
      />
      <!-- Gradiente Horizontal (Desktop): Assume a cor principal do teu fundo (ex: substitui tw-from-white por tw-from-[#f4f1eb] ou tw-from-paper) -->
      <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-r tw-from-white tw-via-white/80 tw-to-transparent md:tw-w-2/3"></div>
      
      <!-- Gradiente Vertical (Mobile): Garante legibilidade quando as colunas colapsam em ecrãs pequenos -->
      <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-b tw-from-white tw-via-white/60 tw-to-transparent md:tw-hidden"></div>
    </div>

    <!-- TEXTURA RÚSTICA (GRAIN/NOISE) -->
    <!-- pointer-events-none garante que o utilizador consegue clicar nos botões por baixo do overlay -->
    <svg class="tw-pointer-events-none tw-absolute tw-inset-0 tw-z-0 tw-h-full tw-w-full tw-opacity-[0.04] tw-mix-blend-multiply" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <!-- baseFrequency controla o tamanho do grão. Ajusta entre 0.6 e 0.9 -->
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>

    <!-- CONTEÚDO ORIGINAL ESQUERDO (Requer tw-relative e z-index para ficar acima do fundo) -->
    <div class="tw-relative tw-z-10">
      <p class="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.28em] tw-text-crust">Pitões das Júnias · 1100 m</p>
      <h1 class="tw-mt-4 tw-font-serif tw-text-5xl tw-leading-[0.95] tw-text-ink sm:tw-text-6xl lg:tw-text-7xl">
        O sabor,<br />
        <span class="tw-italic tw-text-rye">das nossas raízes.</span>
      </h1>
      <p class="tw-mt-6 tw-max-w-md tw-text-lg tw-font-light tw-leading-relaxed tw-text-ink/75">
        Há um saber antigo que mora nas ruas de granito desta aldeia e que nos recusamos a deixar perder. Rodeados pela imponência do Gerês, preservamos a essência transmontana nas nossas receitas, fazendo do nosso balcão um lugar onde a memória viva do Barroso se prova a cada dentada.
      </p>
      <div class="tw-mt-8 tw-flex tw-flex-wrap tw-items-center tw-gap-3">
        <a href="#forno" class="tw-inline-flex tw-rounded-full tw-bg-ink tw-px-5 tw-py-3 tw-text-sm tw-text-flour hover:tw-bg-rye">Acompanhar o pão</a>
        <a href="#paes" class="tw-inline-flex tw-rounded-full tw-border tw-border-ink/20 tw-px-5 tw-py-3 tw-text-sm hover:tw-border-ink">Ver o balcão</a>
      </div>
    </div>

    <!-- CONTEÚDO ORIGINAL DIREITO (Cartas 3D) -->
    <div class="tilt-perspective tw-relative tw-z-10" @pointermove="onPointer" @pointerleave="onLeave">
      <div class="tilt-preserve tw-grid tw-grid-cols-3 tw-gap-3" :style="pose">
        <article
          v-for="(product, index) in featuredProducts"
          :key="product.slug"
          class="tw-rounded-3xl tw-bg-paper tw-p-3 tw-shadow-xl tw-shadow-ink/5" 
          :style="{ transform: `translateZ(${index === 1 ? 36 : 8}px)` }">
          <div class="tw-h-24 md:tw-h-32">
            <BreadMark :kind="product.kind" />
          </div>
          <p class="tw-mt-2 tw-font-serif tw-text-lg tw-leading-none">{{ product.name }}</p>
        </article>
      </div>
    </div>
  </section>
</template>