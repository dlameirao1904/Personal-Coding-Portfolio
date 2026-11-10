<script lang="ts" setup>
import PageHeading from '@/components/PageHeading.vue'
import { contacts } from '@/data/site'
import { computed, ref } from 'vue'

const name = ref('')
const phone = ref('')
const items = ref('')
const when = ref('')
const tried = ref(false)
const ready = ref(false)

const missing = computed(() => tried.value && (!name.value.trim() || !phone.value.trim() || !items.value.trim()))

const summary = computed(() => {
  return [`${name.value.trim()} · ${phone.value.trim()}`, when.value.trim() ? `Para ${when.value.trim()}` : '', items.value.trim()]
    .filter(Boolean)
    .join('\n')
})

function submit() {
  tried.value = true
  ready.value = false
  if (!name.value.trim() || !phone.value.trim() || !items.value.trim()) return
  ready.value = true
}
</script>

<template>
  <div class="tw-pb-24">
    <PageHeading
      eyebrow="Encomendas"
      lede="Diz o que precisas e para quando. A padaria confirma por telefone, para o pão sair a horas.">
      Faz o teu <span class="tw-italic tw-text-rye">pedido.</span>
    </PageHeading>

    <form class="tw-mx-auto tw-mt-12 tw-grid tw-max-w-xl tw-gap-5 tw-px-5 md:tw-px-8" @submit.prevent="submit">
      <label class="tw-block">
        <span class="tw-text-xs tw-uppercase tw-tracking-[0.18em] tw-text-ink/50">Nome</span>
        <input v-model="name" name="nome" autocomplete="name" class="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-ink/15 tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-outline-none focus:tw-border-crust" />
      </label>
      <label class="tw-block">
        <span class="tw-text-xs tw-uppercase tw-tracking-[0.18em] tw-text-ink/50">Telefone</span>
        <input v-model="phone" name="telefone" type="tel" autocomplete="tel" class="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-ink/15 tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-outline-none focus:tw-border-crust" />
      </label>
      <label class="tw-block">
        <span class="tw-text-xs tw-uppercase tw-tracking-[0.18em] tw-text-ink/50">O que levas</span>
        <textarea v-model="items" name="pedido" rows="4" class="tw-mt-2 tw-w-full tw-resize-y tw-rounded-2xl tw-border tw-border-ink/15 tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-outline-none focus:tw-border-crust" />
      </label>
      <label class="tw-block">
        <span class="tw-text-xs tw-uppercase tw-tracking-[0.18em] tw-text-ink/50">Para quando</span>
        <input v-model="when" name="quando" class="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-ink/15 tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-outline-none focus:tw-border-crust" placeholder="Amanhã de manhã" />
      </label>
      <p v-if="missing" class="tw-text-sm tw-text-rye">Falta o nome, o telefone ou o que queres levar.</p>
      <button type="submit" class="tw-mt-2 tw-inline-flex tw-w-fit tw-rounded-full tw-bg-ink tw-px-5 tw-py-3 tw-text-sm tw-text-flour hover:tw-bg-rye">Preparar o pedido</button>
    </form>

    <section v-if="ready" class="tw-mx-auto tw-mt-10 tw-max-w-xl tw-px-5 md:tw-px-8">
      <div class="tw-rounded-[1.75rem] tw-bg-paper tw-p-6">
        <p class="tw-text-xs tw-uppercase tw-tracking-[0.18em] tw-text-crust">O pedido</p>
        <p class="tw-mt-4 tw-whitespace-pre-line tw-text-lg tw-font-light tw-leading-relaxed">{{ summary }}</p>
        <p class="tw-mt-4 tw-text-sm tw-leading-relaxed tw-text-ink/70">Liga para a padaria e lê isto. Assim fechamos a quantidade e a hora.</p>
        <a :href="contacts.phoneHref" class="tw-mt-6 tw-inline-flex tw-rounded-full tw-bg-crust tw-px-5 tw-py-3 tw-text-sm tw-text-flour hover:tw-bg-rye">Ligar {{ contacts.phoneDisplay }}</a>
      </div>
    </section>
  </div>
</template>
