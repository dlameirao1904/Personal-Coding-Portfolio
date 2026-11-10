<script lang="ts" setup>
import { computed, useId } from 'vue'

/**
 * Desenho no lugar da fotografia. Cada nome da montra tem uma forma.
 * Quando houver foto, troca-se o desenho pelo ficheiro.
 */
const props = defineProps<{
  name: string
}>()

const uid = `p${useId().replace(/[^a-zA-Z0-9]/g, '')}`

type Tone = 'wheat' | 'rustic' | 'rye' | 'mix' | 'brioche' | 'puff' | 'custard'
type Topping = 'chocolate' | 'almond' | 'mixed' | 'walnut' | 'apple' | 'peach' | 'strawberry' | 'raisin' | 'seeds' | 'meat'
type Family =
  | 'rolls'
  | 'loaf'
  | 'baguette'
  | 'broa'
  | 'disc'
  | 'empanada'
  | 'folar'
  | 'flower'
  | 'milk'
  | 'braid'
  | 'ring'
  | 'sponge'
  | 'tart'
  | 'rice'
  | 'nata'
  | 'berlin'
  | 'cupcake'
  | 'cone'
  | 'puff'
  | 'snack'
  | 'snail'
  | 'chaves'
  | 'croissant'
  | 'turnover'
  | 'minis'
  | 'jesuita'
  | 'russian'
  | 'eclair'
  | 'hungaro'
  | 'palmier'

type Visual = {
  family: Family
  tone: Tone
  slim?: boolean
  small?: boolean
  puff?: boolean
  topping?: Topping
}

const tones: Record<Tone, { light: string; mid: string; dark: string; backdrop: string }> = {
  wheat: { light: '#f6e2bc', mid: '#e0a15a', dark: '#b56a32', backdrop: '#efe0cc' },
  rustic: { light: '#e7c48a', mid: '#c4843a', dark: '#7a401c', backdrop: '#ead4b8' },
  rye: { light: '#e7a15a', mid: '#c4622d', dark: '#6d3418', backdrop: '#e7d3bb' },
  mix: { light: '#e8c07a', mid: '#b86a34', dark: '#6e381c', backdrop: '#ead8c2' },
  brioche: { light: '#f8e2b8', mid: '#e8b86a', dark: '#c4843c', backdrop: '#f6e7d2' },
  puff: { light: '#fbf0d8', mid: '#e7c98a', dark: '#c4a06a', backdrop: '#f4e6cf' },
  custard: { light: '#ffe7a8', mid: '#f0c14a', dark: '#d4a017', backdrop: '#f8edd6' },
}

const visuals: Record<string, Visual> = {
  Bijous: { family: 'rolls', tone: 'wheat' },
  'Bijous da avó': { family: 'rolls', tone: 'rustic' },
  'Cacete da avó': { family: 'loaf', tone: 'rustic' },
  'Sêmeas de trigo': { family: 'broa', tone: 'wheat' },
  'Cacete de rabanada': { family: 'loaf', tone: 'wheat', slim: true },
  'Baguete de trigo': { family: 'baguette', tone: 'wheat' },
  'Cacete de centeio': { family: 'loaf', tone: 'rye' },
  'Broa de centeio': { family: 'broa', tone: 'rye' },
  'Panoche de centeio': { family: 'broa', tone: 'rye', small: true },
  'Bica batida de centeio': { family: 'disc', tone: 'rye' },
  'Cacete de mistura': { family: 'loaf', tone: 'mix' },
  'Baguete de mistura': { family: 'baguette', tone: 'mix' },
  'Broa de mistura': { family: 'broa', tone: 'mix' },
  'Bica de carne': { family: 'disc', tone: 'rye', topping: 'meat' },
  'Empanada de atum': { family: 'empanada', tone: 'wheat' },
  Folar: { family: 'folar', tone: 'brioche' },
  'Rosca flor': { family: 'flower', tone: 'brioche' },
  'Pães de leite': { family: 'milk', tone: 'brioche', topping: 'chocolate' },
  Tranças: { family: 'braid', tone: 'brioche', topping: 'mixed' },
  'Rosca de chila e noz': { family: 'ring', tone: 'brioche', topping: 'walnut' },
  'Pão-de-ló': { family: 'sponge', tone: 'custard' },
  Tartes: { family: 'tart', tone: 'puff', topping: 'mixed' },
  'Tarte folhada de maçã': { family: 'tart', tone: 'puff', topping: 'apple', puff: true },
  'Tarte folhada variada': { family: 'tart', tone: 'puff', topping: 'mixed', puff: true },
  'Tarte folhada de pêssego': { family: 'tart', tone: 'puff', topping: 'peach', puff: true },
  'Tarte de morango': { family: 'tart', tone: 'puff', topping: 'strawberry' },
  'Bolo de arroz': { family: 'rice', tone: 'custard' },
  'Pastéis de nata': { family: 'nata', tone: 'puff' },
  'Bolas de Berlim': { family: 'berlin', tone: 'brioche' },
  'Bolas de Berlim de chocolate': { family: 'berlin', tone: 'brioche', topping: 'chocolate' },
  Queques: { family: 'cupcake', tone: 'custard', topping: 'walnut' },
  'Cornetos de chocolate': { family: 'cone', tone: 'puff', topping: 'chocolate' },
  'Folhados mistos': { family: 'puff', tone: 'puff', topping: 'meat' },
  'Lanches mistos': { family: 'snack', tone: 'wheat', topping: 'meat' },
  'Caracóis de passas': { family: 'snail', tone: 'brioche', topping: 'raisin' },
  'Caracóis de chocolate': { family: 'snail', tone: 'brioche', topping: 'chocolate' },
  'Pastéis de Chaves': { family: 'chaves', tone: 'puff', topping: 'meat' },
  'Croissant brioche': { family: 'croissant', tone: 'brioche' },
  'Croissant brioche de chocolate': { family: 'croissant', tone: 'brioche', topping: 'chocolate' },
  'Croissant brioche de amêndoa': { family: 'croissant', tone: 'brioche', topping: 'almond' },
  'Croissant folhado': { family: 'croissant', tone: 'puff', puff: true },
  'Croissant folhado de chocolate': { family: 'croissant', tone: 'puff', topping: 'chocolate', puff: true },
  'Folhados de maçã': { family: 'turnover', tone: 'puff', topping: 'apple' },
  'Mini tartes de maçã': { family: 'minis', tone: 'puff', topping: 'apple' },
  Jesuítas: { family: 'jesuita', tone: 'puff' },
  'Bolo russo': { family: 'russian', tone: 'custard', topping: 'chocolate' },
  Éclairs: { family: 'eclair', tone: 'brioche', topping: 'chocolate' },
  Húngaros: { family: 'hungaro', tone: 'custard', topping: 'chocolate' },
  'Croissant de sementes': { family: 'croissant', tone: 'wheat', topping: 'seeds' },
  Palmiers: { family: 'palmier', tone: 'puff' },
}

const mark = computed(() => visuals[props.name] ?? { family: 'broa' as const, tone: 'rye' as const })
const palette = computed(() => tones[mark.value.tone])
const dough = computed(() => `url(#${uid}-dough)`)
const crust = computed(() => `url(#${uid}-linear)`)
const score = computed(() =>
  mark.value.tone === 'wheat' || mark.value.tone === 'brioche' || mark.value.tone === 'puff' ? '#8a4e28' : '#4a2614',
)
const filling = computed(() => {
  switch (mark.value.topping) {
    case 'chocolate':
      return '#4a2c22'
    case 'apple':
      return '#e7c56a'
    case 'peach':
      return '#f0b48a'
    case 'strawberry':
      return '#f6c3cc'
    case 'walnut':
      return '#c4a574'
    default:
      return '#f6d56a'
  }
})
</script>

<template>
  <div class="tw-aspect-[4/3] tw-w-full" :style="{ backgroundColor: palette.backdrop }">
    <svg class="tw-h-full tw-w-full" viewBox="0 0 200 150" role="img" :aria-label="props.name">
      <defs>
        <radialGradient :id="`${uid}-dough`" cx="40%" cy="35%" r="68%">
          <stop offset="0%" :stop-color="palette.light" />
          <stop offset="58%" :stop-color="palette.mid" />
          <stop offset="100%" :stop-color="palette.dark" />
        </radialGradient>
        <linearGradient :id="`${uid}-linear`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="palette.light" />
          <stop offset="48%" :stop-color="palette.mid" />
          <stop offset="100%" :stop-color="palette.dark" />
        </linearGradient>
      </defs>

      <g v-if="mark.family === 'rolls'">
        <ellipse cx="100" cy="128" rx="56" ry="8" fill="#1a1410" opacity="0.1" />
        <template v-if="mark.tone === 'rustic'">
          <ellipse cx="70" cy="96" rx="24" ry="20" :fill="dough" />
          <ellipse cx="108" cy="86" rx="27" ry="22" :fill="dough" />
          <ellipse cx="140" cy="104" rx="20" ry="16" :fill="dough" />
        </template>
        <template v-else>
          <circle cx="68" cy="96" r="22" :fill="dough" />
          <circle cx="106" cy="84" r="26" :fill="dough" />
          <circle cx="140" cy="100" r="18" :fill="dough" />
        </template>
        <g fill="#f4efe6">
          <circle cx="78" cy="78" r="1.4" opacity="0.75" />
          <circle cx="118" cy="74" r="1.2" opacity="0.6" />
          <circle cx="132" cy="96" r="1.3" opacity="0.5" />
          <circle cx="92" cy="100" r="1.1" opacity="0.45" />
        </g>
      </g>

      <g v-else-if="mark.family === 'loaf'" :transform="mark.slim ? 'translate(100 96) scale(1.04 0.72) translate(-100 -96)' : undefined">
        <ellipse cx="100" cy="124" rx="70" ry="8" fill="#1a1410" opacity="0.1" />
        <path
          :fill="crust"
          d="M26 96c0-20 18-32 36-32 12 0 16 6 26 6s18-8 32-8c24 0 44 16 44 34 0 18-16 30-42 32-14 2-24 0-34 0s-22 2-36-2c-22-4-26-14-26-30z" />
        <path
          d="M58 74c6 14 6 26 0 38M84 70c7 16 7 30 0 44M112 70c7 16 7 30 0 44M138 74c6 14 6 26 0 38"
          fill="none"
          :stroke="score"
          stroke-width="2.2"
          stroke-linecap="round" />
        <g v-if="mark.tone !== 'wheat'" fill="#f4efe6">
          <circle cx="70" cy="88" r="1.3" opacity="0.65" />
          <circle cx="102" cy="80" r="1.2" opacity="0.5" />
          <circle cx="128" cy="96" r="1.4" opacity="0.45" />
        </g>
      </g>

      <g v-else-if="mark.family === 'baguette'">
        <ellipse cx="100" cy="122" rx="74" ry="7" fill="#1a1410" opacity="0.1" />
        <path :fill="crust" d="M16 96c2-16 16-26 34-26l112-2c16 0 28 10 28 24s-12 24-30 24l-112 2c-18 0-34-8-32-22z" />
        <path
          d="M52 78l16 28M78 74l16 32M104 74l16 32M130 76l16 28"
          fill="none"
          :stroke="score"
          stroke-width="2.2"
          stroke-linecap="round" />
      </g>

      <g v-else-if="mark.family === 'broa'" :transform="mark.small ? 'translate(100 96) scale(0.78) translate(-100 -96)' : undefined">
        <ellipse cx="100" cy="132" rx="54" ry="8" fill="#1a1410" opacity="0.1" />
        <path
          :fill="dough"
          d="M50 104c0-32 22-56 50-56s50 24 50 56c0 14-10 24-24 28-8 6-18 8-26 8s-18-2-26-8c-14-4-24-14-24-28z" />
        <path d="M100 58v52M74 96h52" fill="none" :stroke="score" stroke-width="2.6" stroke-linecap="round" />
        <g fill="#f4efe6">
          <circle cx="80" cy="82" r="1.4" opacity="0.7" />
          <circle cx="122" cy="76" r="1.2" opacity="0.55" />
          <circle cx="114" cy="108" r="1.3" opacity="0.45" />
        </g>
      </g>

      <g v-else-if="mark.family === 'disc'">
        <ellipse cx="100" cy="118" rx="66" ry="8" fill="#1a1410" opacity="0.1" />
        <ellipse cx="100" cy="96" rx="64" ry="24" :fill="dough" />
        <ellipse cx="100" cy="90" rx="46" ry="12" :fill="palette.light" opacity="0.28" />
        <template v-if="mark.topping === 'meat'">
          <ellipse cx="78" cy="92" rx="14" ry="6" fill="#e7c9a4" transform="rotate(-18 78 92)" />
          <ellipse cx="118" cy="88" rx="16" ry="6" fill="#c46a58" transform="rotate(12 118 88)" />
          <circle cx="96" cy="100" r="7" fill="#7a2a22" />
          <circle cx="128" cy="102" r="5" fill="#7a2a22" />
          <ellipse cx="108" cy="78" rx="8" ry="3.5" fill="none" stroke="#f4efe6" stroke-width="1.4" />
        </template>
        <ellipse v-else cx="100" cy="96" rx="10" ry="4" fill="#4a2614" opacity="0.35" />
      </g>

      <g v-else-if="mark.family === 'empanada'">
        <ellipse cx="100" cy="118" rx="58" ry="8" fill="#1a1410" opacity="0.1" />
        <circle cx="100" cy="84" r="46" :fill="dough" />
        <circle cx="100" cy="84" r="34" :fill="palette.light" />
        <path d="M100 52v64M68 84h64" fill="none" :stroke="score" stroke-width="1.6" />
        <ellipse
          v-for="n in 14"
          :key="n"
          cx="100"
          cy="42"
          rx="4"
          ry="2.4"
          :fill="palette.dark"
          :transform="`rotate(${n * (360 / 14)} 100 84)`" />
        <circle cx="100" cy="84" r="6" fill="#e7b7a2" />
      </g>

      <g v-else-if="mark.family === 'folar'">
        <ellipse cx="100" cy="128" rx="52" ry="8" fill="#1a1410" opacity="0.1" />
        <path :fill="dough" d="M54 100c0-30 20-50 46-50s46 20 46 50c0 16-12 28-24 32-8 6-16 8-22 8s-14-2-22-8c-12-4-24-16-24-32z" />
        <ellipse cx="72" cy="72" rx="11" ry="9" fill="#f7f1e6" />
        <ellipse cx="72" cy="72" rx="6.5" ry="5" fill="#e6c24a" />
        <ellipse cx="112" cy="62" rx="10" ry="8" fill="#f7f1e6" />
        <ellipse cx="112" cy="62" rx="6" ry="4.5" fill="#e6c24a" />
        <ellipse cx="128" cy="108" rx="24" ry="7" fill="#7a2a22" transform="rotate(-32 128 108)" />
      </g>

      <g v-else-if="mark.family === 'flower'">
        <ellipse cx="100" cy="132" rx="50" ry="8" fill="#1a1410" opacity="0.1" />
        <g :fill="dough" transform="translate(100 82)">
          <ellipse v-for="petal in 6" :key="petal" :transform="`rotate(${petal * 60})`" cy="-30" rx="18" ry="26" />
          <circle r="28" />
          <circle r="10" fill="#f4efe6" />
        </g>
        <g fill="#fffaf3" opacity="0.85">
          <circle cx="86" cy="70" r="1.5" />
          <circle cx="118" cy="78" r="1.3" />
          <circle cx="104" cy="60" r="1.2" />
          <circle cx="92" cy="98" r="1.4" />
        </g>
      </g>

      <g v-else-if="mark.family === 'milk'">
        <ellipse cx="100" cy="126" rx="62" ry="8" fill="#1a1410" opacity="0.1" />
        <ellipse cx="72" cy="96" rx="28" ry="22" :fill="dough" />
        <ellipse cx="124" cy="92" rx="32" ry="24" :fill="dough" />
        <ellipse cx="64" cy="88" rx="10" ry="6" fill="#fff" opacity="0.2" />
        <g v-if="mark.topping === 'chocolate'" fill="#3d2418">
          <circle cx="112" cy="82" r="2.4" />
          <circle cx="126" cy="90" r="2" />
          <circle cx="136" cy="78" r="1.8" />
          <circle cx="118" cy="98" r="2.1" />
        </g>
      </g>

      <g v-else-if="mark.family === 'braid'">
        <ellipse cx="100" cy="128" rx="64" ry="7" fill="#1a1410" opacity="0.1" />
        <path
          d="M36 108C58 48 78 132 100 78c14-34 28 28 42 8 10-14 16-8 26 6"
          fill="none"
          :stroke="palette.dark"
          stroke-width="16"
          stroke-linecap="round" />
        <path
          d="M36 92C60 128 74 52 102 96c16 26 24-20 40-4 12 12 16 8 24-6"
          fill="none"
          :stroke="palette.mid"
          stroke-width="14"
          stroke-linecap="round" />
        <path d="M40 100C70 70 90 118 160 86" fill="none" :stroke="palette.light" stroke-width="8" stroke-linecap="round" />
        <g v-if="mark.topping === 'mixed'">
          <circle cx="78" cy="86" r="2.2" fill="#3d2418" />
          <circle cx="118" cy="78" r="2" fill="#3d2418" />
          <ellipse cx="96" cy="100" rx="4" ry="2.2" fill="#e6d2a4" transform="rotate(-20 96 100)" />
          <ellipse cx="132" cy="96" rx="4" ry="2.2" fill="#e6d2a4" transform="rotate(16 132 96)" />
          <path d="M64 96l6-2M108 70l5 2M146 90l6-1" stroke="#fffaf3" stroke-width="1.4" stroke-linecap="round" />
        </g>
      </g>

      <g v-else-if="mark.family === 'ring'">
        <ellipse cx="100" cy="126" rx="48" ry="8" fill="#1a1410" opacity="0.1" />
        <circle cx="100" cy="80" r="42" :fill="dough" />
        <circle cx="100" cy="80" r="26" fill="#c56a32" />
        <circle cx="100" cy="80" r="14" :fill="palette.backdrop" />
        <ellipse cx="86" cy="62" rx="5" ry="3.2" fill="#6b4226" transform="rotate(-24 86 62)" />
        <ellipse cx="118" cy="70" rx="4.5" ry="3" fill="#6b4226" transform="rotate(18 118 70)" />
        <ellipse cx="108" cy="98" rx="4" ry="2.6" fill="#5c3418" transform="rotate(-10 108 98)" />
      </g>

      <g v-else-if="mark.family === 'sponge'">
        <ellipse cx="100" cy="128" rx="48" ry="7" fill="#1a1410" opacity="0.1" />
        <path :fill="dough" d="M58 120V78Q100 32 142 78v42z" />
        <path d="M100 48v26" fill="none" :stroke="score" stroke-width="2" stroke-linecap="round" />
        <g fill="#fffaf3" opacity="0.8">
          <circle cx="84" cy="70" r="1.3" />
          <circle cx="116" cy="66" r="1.2" />
          <circle cx="108" cy="88" r="1.2" />
        </g>
      </g>

      <g v-else-if="mark.family === 'tart'">
        <ellipse cx="100" cy="122" rx="62" ry="8" fill="#1a1410" opacity="0.1" />
        <path :fill="palette.dark" d="M42 96q0 22 58 26 58-4 58-26-2 12-58 16-56-4-58-16z" />
        <ellipse cx="100" cy="94" rx="58" ry="20" :fill="crust" />
        <ellipse cx="100" cy="92" rx="44" ry="13" :fill="filling" />
        <path
          v-if="mark.puff"
          d="M46 92l7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 6-4"
          fill="none"
          :stroke="palette.light"
          stroke-width="1.6" />
        <g v-if="mark.topping === 'apple' || mark.topping === 'mixed'">
          <ellipse cx="86" cy="90" rx="7" ry="10" fill="#f4e7b0" transform="rotate(-16 86 90)" />
          <ellipse cx="108" cy="88" rx="7" ry="10" fill="#d6e09a" transform="rotate(12 108 88)" />
          <path d="M86 82v14M108 80v14" stroke="#c45a4a" stroke-width="1" opacity="0.7" />
        </g>
        <g v-if="mark.topping === 'peach' || mark.topping === 'mixed'">
          <ellipse cx="122" cy="94" rx="9" ry="6" fill="#f3b183" />
          <ellipse cx="78" cy="96" rx="8" ry="5" fill="#e8946a" />
        </g>
        <g v-if="mark.topping === 'strawberry'">
          <circle cx="82" cy="92" r="6" fill="#d64550" />
          <circle cx="100" cy="86" r="7" fill="#e25560" />
          <circle cx="118" cy="94" r="5.5" fill="#c43848" />
          <path d="M96 76l4-6 4 6" fill="#6f8f45" />
        </g>
        <g v-if="mark.topping === 'mixed'">
          <circle cx="100" cy="98" r="4" fill="#4a2c22" />
        </g>
      </g>

      <g v-else-if="mark.family === 'rice'">
        <ellipse cx="100" cy="126" rx="40" ry="7" fill="#1a1410" opacity="0.1" />
        <path d="M64 114 76 74h48l12 40q-36 12-72 0z" fill="#f7f1e6" />
        <path d="M76 82h48M72 96h56M68 108h64" stroke="#eadfce" stroke-width="1.2" />
        <ellipse cx="100" cy="84" rx="26" ry="15" :fill="dough" />
        <path d="M100 72v12" fill="none" :stroke="score" stroke-width="1.6" stroke-linecap="round" />
      </g>

      <g v-else-if="mark.family === 'nata'">
        <ellipse cx="78" cy="112" rx="28" ry="6" fill="#1a1410" opacity="0.1" />
        <ellipse cx="128" cy="118" rx="24" ry="5" fill="#1a1410" opacity="0.1" />
        <g transform="translate(78 86)">
          <ellipse cy="8" rx="28" ry="16" :fill="crust" />
          <ellipse cx="-20" cy="8" rx="3.2" ry="2" :fill="palette.dark" opacity="0.45" />
          <ellipse cx="20" cy="8" rx="3.2" ry="2" :fill="palette.dark" opacity="0.45" />
          <ellipse cx="0" cy="-2" rx="3" ry="2" :fill="palette.dark" opacity="0.4" />
          <ellipse cx="0" cy="18" rx="3" ry="2" :fill="palette.dark" opacity="0.4" />
          <ellipse cy="6" rx="16" ry="8" fill="#f6d56a" />
          <circle cx="-4" cy="4" r="1.5" fill="#6b3a18" opacity="0.6" />
          <circle cx="5" cy="7" r="1.2" fill="#6b3a18" opacity="0.45" />
        </g>
        <g transform="translate(128 96) scale(0.86)">
          <ellipse cy="8" rx="28" ry="16" :fill="crust" />
          <ellipse cy="6" rx="16" ry="8" fill="#f0c14a" />
          <circle cx="3" cy="5" r="1.4" fill="#6b3a18" opacity="0.55" />
          <circle cx="-5" cy="8" r="1.1" fill="#6b3a18" opacity="0.4" />
        </g>
      </g>

      <g v-else-if="mark.family === 'berlin'">
        <ellipse cx="100" cy="124" rx="40" ry="8" fill="#1a1410" opacity="0.1" />
        <circle cx="100" cy="84" r="38" :fill="dough" />
        <ellipse cx="86" cy="70" rx="12" ry="7" fill="#fff" opacity="0.2" />
        <g fill="#fffaf3">
          <circle cx="78" cy="64" r="1.5" />
          <circle cx="96" cy="56" r="1.3" />
          <circle cx="118" cy="66" r="1.4" />
          <circle cx="124" cy="86" r="1.2" />
          <circle cx="74" cy="90" r="1.3" />
          <circle cx="108" cy="108" r="1.2" />
        </g>
        <path v-if="mark.topping === 'chocolate'" d="M64 78Q100 48 136 78q-36 12-72 0z" fill="#3d2418" />
        <path v-else d="M76 86h48" stroke="#c43b3b" stroke-width="3" stroke-linecap="round" />
      </g>

      <g v-else-if="mark.family === 'cupcake'">
        <g transform="translate(64 108)">
          <path d="M-22 0h44l-6 16H-16z" fill="#f7f1e6" />
          <path d="M-16 2v6M-4 2v8M8 2v8M18 2v6" stroke="#e4d0b6" stroke-width="1.4" />
          <path d="M-18 2C-18 -26 18 -26 18 2z" fill="#4a2c22" />
        </g>
        <g transform="translate(128 112) scale(0.92)">
          <path d="M-22 0h44l-6 16H-16z" fill="#f6e0c8" />
          <path d="M-16 2v6M-4 2v8M8 2v8M18 2v6" stroke="#e4d0b6" stroke-width="1.4" />
          <path d="M-18 2C-18 -26 18 -26 18 2z" :fill="dough" />
          <ellipse cx="-3" cy="-10" rx="5" ry="2.6" fill="#6b4226" transform="rotate(-28 -3 -10)" />
          <ellipse cx="7" cy="-6" rx="3.2" ry="2" fill="#5c3418" transform="rotate(16 7 -6)" />
        </g>
      </g>

      <g v-else-if="mark.family === 'cone'">
        <ellipse cx="100" cy="124" rx="26" ry="6" fill="#1a1410" opacity="0.1" />
        <path :fill="crust" d="M70 62Q100 42 130 62l-16 56q-14 8-28 0z" />
        <path d="M82 74 96 112M100 68v52M118 74 106 112" fill="none" :stroke="palette.light" stroke-width="1.3" opacity="0.75" />
        <path d="M68 62Q100 36 132 62 100 76 68 62z" fill="#3d2418" />
        <path d="M110 58c4 14-6 18 2 30" fill="none" stroke="#3d2418" stroke-width="3.5" stroke-linecap="round" />
        <ellipse cx="100" cy="64" rx="12" ry="5" fill="#f8e2b8" />
      </g>

      <g v-else-if="mark.family === 'puff'">
        <ellipse cx="100" cy="126" rx="52" ry="7" fill="#1a1410" opacity="0.1" />
        <rect x="50" y="58" width="100" height="60" rx="4" :fill="palette.dark" />
        <rect x="56" y="64" width="88" height="48" rx="2" :fill="palette.light" />
        <rect x="62" y="76" width="76" height="8" rx="1" fill="#e07a7a" />
        <rect x="62" y="90" width="76" height="8" rx="1" fill="#f0c14a" />
      </g>

      <g v-else-if="mark.family === 'snack'">
        <ellipse cx="100" cy="122" rx="58" ry="8" fill="#1a1410" opacity="0.1" />
        <path :fill="crust" d="M36 96c0-16 18-26 36-24 10 1 16 6 28 6s20-8 36-6c16 2 28 14 28 28 0 12-12 22-30 22H64c-18 0-28-10-28-26z" />
        <path d="M48 96h104" :stroke="score" stroke-width="1.4" />
        <path d="M58 92h84" stroke="#e07a7a" stroke-width="5" stroke-linecap="round" />
        <path d="M62 100h76" stroke="#f0c14a" stroke-width="4" stroke-linecap="round" />
      </g>

      <g v-else-if="mark.family === 'snail'">
        <ellipse cx="100" cy="126" rx="46" ry="7" fill="#1a1410" opacity="0.1" />
        <path
          d="M108 112C70 112 52 84 74 68c24-16 52 2 46 28-4 18-28 22-34 8-4-10 8-16 16-12"
          fill="none"
          :stroke="palette.mid"
          stroke-width="18"
          stroke-linecap="round" />
        <path
          d="M104 104C78 102 66 84 80 74c14-10 32 0 28 16"
          fill="none"
          :stroke="palette.light"
          stroke-width="4"
          stroke-linecap="round"
          opacity="0.7" />
        <g v-if="mark.topping === 'chocolate'" fill="#3d2418">
          <circle cx="86" cy="78" r="2.4" />
          <circle cx="108" cy="70" r="2.2" />
          <circle cx="120" cy="90" r="2" />
          <circle cx="96" cy="100" r="2.3" />
        </g>
        <g v-else fill="#5c3318">
          <circle cx="84" cy="80" r="2.6" />
          <circle cx="112" cy="72" r="2.2" />
          <circle cx="118" cy="94" r="2.4" />
          <circle cx="92" cy="102" r="2" />
        </g>
      </g>

      <g v-else-if="mark.family === 'chaves'">
        <ellipse cx="100" cy="126" rx="48" ry="7" fill="#1a1410" opacity="0.1" />
        <rect x="52" y="50" width="96" height="70" rx="4" :fill="crust" />
        <rect x="62" y="60" width="76" height="50" fill="#f6e7c8" />
        <ellipse cx="100" cy="86" rx="22" ry="14" fill="#d4897c" />
        <rect x="58" y="56" width="84" height="58" rx="3" fill="none" stroke="#c4a06a" stroke-width="2" stroke-dasharray="3 3" />
      </g>

      <g v-else-if="mark.family === 'croissant'">
        <ellipse cx="104" cy="124" rx="58" ry="7" fill="#1a1410" opacity="0.1" />
        <path :fill="dough" d="M34 108C40 62 78 40 122 48c28 6 46 28 46 46-22-14-40 2-48-6-12-28-40-26-52 4-8 16-20 12-34 16z" />
        <path d="M56 98C80 70 112 66 148 82" fill="none" :stroke="palette.light" stroke-width="2" opacity="0.8" />
        <path v-if="mark.puff" d="M50 106C78 82 114 80 156 96" fill="none" :stroke="score" stroke-width="1.4" opacity="0.55" />
        <g v-if="mark.topping === 'chocolate'" fill="#3d2418">
          <rect x="46" y="96" width="18" height="5" rx="1" transform="rotate(-16 55 98)" />
          <rect x="132" y="74" width="18" height="5" rx="1" transform="rotate(18 141 76)" />
        </g>
        <g v-else-if="mark.topping === 'almond'">
          <path d="M72 78q32-10 62 12" fill="none" stroke="#fffaf3" stroke-width="3" stroke-linecap="round" />
          <ellipse cx="90" cy="74" rx="5" ry="2.4" fill="#e6d2a4" transform="rotate(-24 90 74)" />
          <ellipse cx="112" cy="70" rx="5" ry="2.4" fill="#e6d2a4" transform="rotate(8 112 70)" />
          <ellipse cx="128" cy="82" rx="4.5" ry="2.2" fill="#d8c090" transform="rotate(20 128 82)" />
        </g>
        <g v-else-if="mark.topping === 'seeds'">
          <ellipse cx="78" cy="86" rx="3" ry="1.6" fill="#c4a574" transform="rotate(-20 78 86)" />
          <ellipse cx="96" cy="74" rx="3" ry="1.6" fill="#6b4a2a" />
          <ellipse cx="114" cy="70" rx="2.6" ry="1.4" fill="#c4a574" transform="rotate(16 114 70)" />
          <ellipse cx="132" cy="82" rx="3" ry="1.5" fill="#6b4a2a" transform="rotate(-10 132 82)" />
          <ellipse cx="88" cy="98" rx="2.4" ry="1.3" fill="#8a7048" />
        </g>
      </g>

      <g v-else-if="mark.family === 'turnover'">
        <ellipse cx="100" cy="126" rx="48" ry="7" fill="#1a1410" opacity="0.1" />
        <path :fill="crust" d="M42 116 104 40l62 76z" />
        <path d="M60 110 104 56l44 54z" :fill="palette.light" />
        <ellipse cx="104" cy="86" rx="10" ry="16" fill="#d6e09a" />
        <path d="M104 74v22" stroke="#c45a4a" stroke-width="1.4" />
        <path d="M70 108h68" :stroke="palette.dark" stroke-width="1.2" stroke-dasharray="3 3" />
      </g>

      <g v-else-if="mark.family === 'minis'">
        <g v-for="(spot, index) in [{ x: 48, y: 96 }, { x: 100, y: 86 }, { x: 150, y: 100 }]" :key="index" :transform="`translate(${spot.x} ${spot.y})`">
          <ellipse cy="22" rx="22" ry="5" fill="#1a1410" opacity="0.1" />
          <ellipse cy="6" rx="20" ry="10" :fill="crust" />
          <ellipse cy="4" rx="13" ry="6" fill="#e7c56a" />
          <ellipse cx="-2" cy="3" rx="3" ry="4" fill="#f4e7b0" transform="rotate(-12 -2 3)" />
        </g>
      </g>

      <g v-else-if="mark.family === 'jesuita'">
        <ellipse cx="100" cy="126" rx="50" ry="7" fill="#1a1410" opacity="0.1" />
        <path :fill="crust" d="M38 116 100 36l62 80z" />
        <path d="M56 108 100 52l44 56z" fill="#f7f1e4" />
        <path d="M68 96h64" stroke="#fff" stroke-width="7" stroke-linecap="round" />
        <g fill="#fffaf3">
          <circle cx="84" cy="80" r="1.3" />
          <circle cx="100" cy="70" r="1.2" />
          <circle cx="116" cy="82" r="1.4" />
          <circle cx="96" cy="104" r="1.2" />
        </g>
      </g>

      <g v-else-if="mark.family === 'russian'">
        <ellipse cx="100" cy="124" rx="54" ry="7" fill="#1a1410" opacity="0.1" />
        <rect x="46" y="64" width="108" height="54" rx="4" fill="#f6e2b0" />
        <rect x="46" y="64" width="108" height="12" fill="#5a3828" />
        <rect x="46" y="84" width="108" height="8" fill="#3d2418" />
        <rect x="46" y="100" width="108" height="8" fill="#3d2418" />
      </g>

      <g v-else-if="mark.family === 'eclair'">
        <ellipse cx="100" cy="112" rx="62" ry="8" fill="#1a1410" opacity="0.1" />
        <ellipse cx="100" cy="96" rx="60" ry="16" :fill="dough" />
        <path d="M44 90Q100 70 156 90q-56 12-112 0z" fill="#3d2418" />
        <circle cx="78" cy="102" r="1.6" fill="#f4efe6" />
        <circle cx="100" cy="106" r="1.4" fill="#f4efe6" />
        <circle cx="124" cy="102" r="1.5" fill="#f4efe6" />
      </g>

      <g v-else-if="mark.family === 'hungaro'">
        <ellipse cx="100" cy="118" rx="64" ry="7" fill="#1a1410" opacity="0.1" />
        <rect x="32" y="74" width="136" height="34" rx="17" :fill="dough" />
        <path d="M32 86c0-12 20-20 68-20s68 8 68 20v8H32z" fill="#3d2418" />
        <path d="M56 74v18M84 74v18M112 74v18M140 74v18" stroke="#f7f1e6" stroke-width="5" />
      </g>

      <g v-else>
        <ellipse cx="100" cy="124" rx="40" ry="7" fill="#1a1410" opacity="0.1" />
        <path
          :fill="dough"
          d="M100 116C100 90 64 96 58 74 52 52 76 44 92 60c6 8 8 16 8 24 0-8 2-16 8-24 16-16 40-8 34 14-6 22-42 16-42 42z" />
        <path d="M78 78c10-8 16 2 22 12M122 78c-10-8-16 2-22 12" fill="none" :stroke="palette.dark" stroke-width="1.6" />
      </g>
    </svg>
  </div>
</template>
