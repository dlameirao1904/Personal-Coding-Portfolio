<template>
  <div
    class="vinyl-dock tw-absolute tw-bottom-[max(0.6rem,env(safe-area-inset-bottom,0px))] tw-left-1/2 tw-z-[5] tw-flex tw-max-h-[min(52vh,440px)] tw-w-[min(40rem,calc(100%-1.4rem))] tw--translate-x-1/2 tw-flex-col tw-rounded-[22px] tw-bg-[#f7f3eaf2] tw-p-4 tw-shadow-[0_16px_40px_#17211c33]"
  >
    <div class="tw-flex tw-items-start tw-justify-between tw-gap-3">
      <div class="tw-min-w-0">
        <p class="tw-m-0 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.14em] tw-text-[#8a4632]">
          Discos
        </p>
        <p
          class="tw-m-0 tw-mt-1 tw-font-[Fraunces,Georgia,serif] tw-text-[1.25rem] tw-font-[560] tw-leading-tight"
        >
          {{ current ? `${current.artist} — ${current.title}` : 'Escolhe um disco.' }}
        </p>
        <p v-if="vinylNote" class="tw-m-0 tw-mt-1 tw-text-[0.88rem] tw-text-[#8a4632]">
          {{ vinylNote }}
        </p>
        <p v-else-if="track" class="tw-m-0 tw-mt-1 tw-text-[0.88rem] tw-text-[#5c675f]">
          {{ track }} · excerto
        </p>
      </div>
      <button
        type="button"
        class="tw-shrink-0 tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea]"
        @click="leaveVinyl"
      >
        Sair
      </button>
    </div>

    <div
      v-if="previews.length"
      class="tw-mt-2 tw-flex tw-gap-2 tw-overflow-x-auto tw-pb-1"
      role="group"
      aria-label="Faixas"
    >
      <button
        v-for="(item, index) in previews"
        :key="item.url"
        type="button"
        class="tw-shrink-0 tw-cursor-pointer tw-rounded-full tw-border tw-border-[#0e332822] tw-px-3 tw-py-1.5 tw-font-[inherit] tw-text-[0.82rem]"
        :class="
          index === previewIndex && playing
            ? 'tw-border-[#0e3328] tw-bg-[#0e3328] tw-text-[#f7f3ea]'
            : 'tw-bg-transparent tw-text-[#17211c]'
        "
        @click="playPreview(index)"
      >
        {{ item.name }}
      </button>
    </div>

    <div class="tw-mt-3 tw-min-h-0 tw-flex-1 tw-overflow-auto tw-pr-1">
      <section v-for="[artist, albums] in groups" :key="artist" class="tw-mb-3">
        <h2 class="tw-m-0 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.12em] tw-text-[#8a4632]">
          {{ artist }}
        </h2>
        <div class="tw-mt-1 tw-flex tw-flex-col tw-gap-1">
          <button
            v-for="album in albums"
            :key="album.id"
            type="button"
            class="tw-flex tw-cursor-pointer tw-items-center tw-gap-2 tw-rounded-xl tw-border-0 tw-bg-transparent tw-px-2 tw-py-1.5 tw-text-left tw-font-[inherit] tw-text-[0.95rem] tw-text-[#17211c] hover:tw-bg-[#0e332814]"
            :class="album.id === selectedId ? 'tw-bg-[#0e332814]' : ''"
            @click="chooseAlbum(album)"
          >
            <span
              class="tw-h-8 tw-w-8 tw-shrink-0 tw-rounded-md"
              :style="{ background: album.color }"
            />
            <span class="tw-min-w-0 tw-truncate">{{ album.title }}</span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ALBUMS, albumById, type Album } from '@/data/records'
import {
  chooseAlbum,
  leaveVinyl,
  playPreview,
  playing,
  previewIndex,
  previews,
  selectedId,
  vinylNote,
} from '@/game/vinyl'

const current = computed(() => albumById(selectedId.value))
const track = computed(() => previews.value[previewIndex.value]?.name ?? '')

const groups = computed(() => {
  const map = new Map<string, Album[]>()
  for (const album of ALBUMS) {
    const list = map.get(album.artist) ?? []
    list.push(album)
    map.set(album.artist, list)
  }
  return [...map]
})
</script>
