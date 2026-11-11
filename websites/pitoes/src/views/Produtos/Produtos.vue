<script lang="ts" setup>
import PageHeading from '@/components/PageHeading.vue'
import ProductCatalog from '@/components/ProductCatalog.vue'
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
  <div class="tw-pb-8">
    <PageHeading
      eyebrow="A montra"
      lede="Escolhe uma mesa, passa o rato pela lista ou desliza no telemóvel. O detalhe abre ao lado, em tipo grande.">
      Os nossos <span class="tw-italic tw-text-rye">produtos.</span>
    </PageHeading>

    <ProductCatalog :shelves="shelves" />
  </div>
</template>
