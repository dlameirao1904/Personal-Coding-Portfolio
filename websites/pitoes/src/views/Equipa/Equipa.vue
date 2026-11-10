<script lang="ts" setup>
import PageHeading from '@/components/PageHeading.vue'
import { initials, team } from '@/data/site'
</script>

<template>
  <div class="tw-pb-24">
    <PageHeading
      eyebrow="A casa"
      lede="Quem está na casa, no forno e nas voltas. Os retratos entram quando os tivermos.">
      A equipa <span class="tw-italic tw-text-rye">da casa.</span>
    </PageHeading>

    <div class="tw-mx-auto tw-mt-12 tw-grid tw-max-w-6xl tw-gap-8 tw-px-5 md:tw-grid-cols-3 md:tw-px-8">
      <article v-for="person in team" :key="person.name" class="tw-overflow-hidden tw-rounded-[1.75rem] tw-bg-paper">
        <div class="tw-flex tw-aspect-[4/5] tw-items-center tw-justify-center tw-bg-[#e7d7c4]">
          <img v-if="person.photo" :src="person.photo" :alt="person.name" class="tw-h-full tw-w-full tw-object-cover" />
          <span v-else class="tw-font-serif tw-text-5xl tw-text-rye">{{ initials(person.name) }}</span>
        </div>
        <div class="tw-p-6">
          <h2 class="tw-font-serif tw-text-2xl">{{ person.name }}</h2>
          <p v-if="person.role" class="tw-mt-1 tw-text-xs tw-uppercase tw-tracking-[0.16em] tw-text-crust">{{ person.role }}</p>
          <p v-if="person.text" class="tw-mt-4 tw-text-sm tw-leading-relaxed tw-text-ink/70">{{ person.text }}</p>
        </div>
      </article>
    </div>
  </div>
</template>
