<script lang="ts" setup>
import type { BreadKind } from '@/data/site'
import { useId } from 'vue'

const props = defineProps<{
  kind: BreadKind
}>()

const uid = `b${useId().replace(/[^a-zA-Z0-9]/g, '')}`
</script>

<template>
  <svg class="tw-h-full tw-w-full" viewBox="0 0 200 180" role="img" :aria-label="props.kind">
    <defs>
      <radialGradient :id="`${uid}-broa`" cx="42%" cy="38%" r="70%">
        <stop offset="0%" stop-color="#e7a15a" />
        <stop offset="55%" stop-color="#c4622d" />
        <stop offset="100%" stop-color="#6d3418" />
      </radialGradient>
      <linearGradient :id="`${uid}-cacete`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d9894a" />
        <stop offset="45%" stop-color="#a65224" />
        <stop offset="100%" stop-color="#5c2c14" />
      </linearGradient>
      <radialGradient :id="`${uid}-rosca`" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#f3d7a4" />
        <stop offset="70%" stop-color="#e0a15a" />
        <stop offset="100%" stop-color="#b56a32" />
      </radialGradient>
    </defs>

    <g v-if="props.kind === 'broa'">
      <ellipse cx="100" cy="148" rx="62" ry="12" fill="#1a1410" opacity="0.12" />
      <path
        :fill="`url(#${uid}-broa)`"
        d="M38 112c0-38 28-66 62-66s62 28 62 66c0 18-12 28-28 32-8 8-22 12-34 12s-26-4-34-12c-16-4-28-14-28-32z" />
      <path d="M100 62v62M72 96h56" fill="none" stroke="#4a2614" stroke-width="3" stroke-linecap="round" />
      <circle cx="78" cy="88" r="1.4" fill="#f4efe6" opacity="0.7" />
      <circle cx="124" cy="80" r="1.2" fill="#f4efe6" opacity="0.55" />
      <circle cx="112" cy="108" r="1.3" fill="#f4efe6" opacity="0.45" />
    </g>

    <g v-else-if="props.kind === 'cacete'">
      <ellipse cx="100" cy="128" rx="74" ry="10" fill="#1a1410" opacity="0.12" />
      <path
        :fill="`url(#${uid}-cacete)`"
        d="M28 96c0-22 18-34 36-34 10 0 16 4 24 4s16-6 28-6c22 0 40 16 40 36 0 20-16 32-40 34-12 4-22 2-32 2s-22 2-34-2c-20-4-22-16-22-34z" />
      <path
        d="M58 78c8 16 8 28 0 40M82 74c8 18 8 32 0 48M108 74c8 18 8 32 0 48M134 78c8 16 8 28 0 40"
        fill="none"
        stroke="#4a2614"
        stroke-width="2.4"
        stroke-linecap="round" />
    </g>

    <g v-else>
      <ellipse cx="100" cy="146" rx="58" ry="11" fill="#1a1410" opacity="0.1" />
      <g :fill="`url(#${uid}-rosca)`" transform="translate(100 92)">
        <ellipse v-for="petal in 6" :key="petal" :transform="`rotate(${petal * 60})`" cy="-34" rx="20" ry="28" />
        <circle r="30" />
        <circle r="11" fill="#f4efe6" />
      </g>
      <g fill="#fffaf3" opacity="0.85">
        <circle cx="86" cy="78" r="1.5" />
        <circle cx="118" cy="86" r="1.3" />
        <circle cx="104" cy="70" r="1.2" />
        <circle cx="92" cy="108" r="1.4" />
      </g>
    </g>
  </svg>
</template>
