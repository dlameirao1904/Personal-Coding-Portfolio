<script lang="ts" setup>
import PageHeading from '@/components/PageHeading.vue'
import ProductMark from '@/components/ProductMark.vue'
import { padaria, pastelaria, type CatalogProduct } from '@/data/catalog'

const shelves: { id: string; title: string; lede: string; items: CatalogProduct[] }[] = [
  {
    id: 'padaria',
    title: 'Padaria',
    lede: 'O pão do forno, do mais pequeno ao de quilo, e o que leva recheio.',
    items: padaria,
  },
  {
    id: 'pastelaria',
    title: 'Pastelaria',
    lede: 'A massa brioche, as tartes e o que sai do balcão ao longo da manhã.',
    items: pastelaria,
  },
]
</script>

<template>
  <div class="tw-pb-24">
    <PageHeading
      eyebrow="A montra"
      lede="O que a casa faz, dividido em duas mesas: o pão de um lado, a pastelaria do outro.">
      Os nossos <span class="tw-italic tw-text-rye">produtos.</span>
    </PageHeading>

    <nav class="tw-mx-auto tw-mt-8 tw-flex tw-max-w-6xl tw-gap-3 tw-px-5 md:tw-px-8" aria-label="Secções da montra">
      <a
        v-for="shelf in shelves"
        :key="shelf.id"
        :href="`#${shelf.id}`"
        class="tw-rounded-full tw-border tw-border-ink/15 tw-px-4 tw-py-2 tw-text-sm hover:tw-border-ink">
        {{ shelf.title }}
      </a>
    </nav>

    <section v-for="shelf in shelves" :id="shelf.id" :key="shelf.id" class="tw-mx-auto tw-mt-16 tw-max-w-6xl tw-scroll-mt-28 tw-px-5 md:tw-px-8">
      <h2 class="tw-font-serif tw-text-4xl md:tw-text-5xl">{{ shelf.title }}</h2>
      <p class="tw-mt-3 tw-max-w-xl tw-text-sm tw-leading-relaxed tw-text-ink/65">{{ shelf.lede }}</p>
      <div class="tw-mt-8 tw-grid tw-gap-4 sm:tw-grid-cols-2 lg:tw-grid-cols-3">
        <article v-for="item in shelf.items" :key="item.name" class="tw-flex tw-flex-col tw-overflow-hidden tw-rounded-[1.5rem] tw-bg-paper">
          <ProductMark :name="item.name" />
          <div class="tw-flex tw-flex-1 tw-flex-col tw-p-5">
            <div class="tw-flex tw-items-baseline tw-justify-between tw-gap-3">
              <h3 class="tw-font-serif tw-text-2xl">{{ item.name }}</h3>
              <p v-if="item.price" class="tw-shrink-0 tw-text-sm tw-text-rye">{{ item.price }}</p>
            </div>
            <p v-if="item.detail" class="tw-mt-3 tw-text-sm tw-leading-relaxed tw-text-ink/75">{{ item.detail }}</p>
            <ul v-if="item.options" class="tw-mt-3 tw-space-y-1.5 tw-text-sm tw-leading-relaxed tw-text-ink/75">
              <li v-for="option in item.options" :key="option">{{ option }}</li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
