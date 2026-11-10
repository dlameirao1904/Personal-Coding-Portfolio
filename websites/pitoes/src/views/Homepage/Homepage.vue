<script lang="ts" setup>
import BreadMark from '@/components/BreadMark.vue'
import FollowBread from '@/components/FollowBread.vue'
import LandingStage from '@/components/LandingStage.vue'
import { atelierSite, contacts, dayList, distributors, featuredProducts, ribbon, type BreadKind } from '@/data/site'

const wash: Record<BreadKind, string> = {
  broa: 'tw-bg-[#efe0cc]',
  cacete: 'tw-bg-[#e7d3bb]',
  rosca: 'tw-bg-[#f6e7d2]',
}
</script>

<template>
  <div>
    <LandingStage />
    <FollowBread />

    <div class="tw-h-28 tw-bg-flour md:tw-h-48" aria-hidden="true" />

    <div class="tw-overflow-hidden tw-border-y tw-border-ink/10 tw-bg-paper tw-py-4">
      <div class="marquee-track tw-flex tw-w-max">
        <p v-for="copy in 2" :key="copy" class="tw-flex tw-items-center">
          <span
            v-for="item in ribbon"
            :key="`${copy}-${item}`"
            class="tw-flex tw-items-center tw-px-5 tw-text-xs tw-uppercase tw-tracking-[0.22em] tw-text-ink/70">
            {{ item }}
            <span class="tw-ml-10 tw-inline-block tw-h-1 tw-w-1 tw-rounded-full tw-bg-crust" aria-hidden="true" />
          </span>
        </p>
      </div>
    </div>

    <section id="paes" class="tw-mx-auto tw-max-w-6xl tw-px-5 tw-py-20 md:tw-px-8 md:tw-py-28">
      <div class="tw-flex tw-flex-col tw-justify-between tw-gap-6 md:tw-flex-row md:tw-items-end">
        <div class="tw-max-w-xl">
          <p class="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.28em] tw-text-crust">O balcão</p>
          <h2 class="tw-mt-4 tw-font-serif tw-text-4xl tw-leading-[0.95] md:tw-text-6xl">Os que mais saem.</h2>
        </div>
        <router-link to="/produtos" class="tw-text-sm tw-underline tw-underline-offset-4 hover:tw-text-rye">Ver a montra</router-link>
      </div>
      <p class="tw-mt-6 tw-max-w-lg tw-text-sm tw-leading-relaxed tw-text-ink/60">
        A broa, o cacete e a rosca flor são os mais comercializados. O forno e o balcão têm mais; estes três abrem a montra. Os desenhos seguram o lugar das fotografias.
      </p>

      <div class="tw-mt-12 tw-grid tw-gap-8 md:tw-grid-cols-3">
        <article v-for="product in featuredProducts" :key="product.slug">
          <div class="tw-aspect-[4/5] tw-overflow-hidden tw-rounded-[2rem]" :class="wash[product.kind]">
            <img
              v-if="product.photo"
              :src="product.photo"
              :alt="product.name"
              class="tw-h-full tw-w-full tw-object-cover" />
            <BreadMark v-else :kind="product.kind" />
          </div>
          <h3 class="tw-mt-5 tw-font-serif tw-text-3xl">{{ product.name }}</h3>
          <p class="tw-mt-2 tw-text-sm tw-leading-relaxed tw-text-ink/70">{{ product.summary }}</p>
        </article>
      </div>
    </section>

    <section id="pitoes">
      <div class="tw-relative tw-h-[70vh] tw-min-h-[28rem]">
        <img
          src="/photos/pitoes-panoramica.jpg"
          alt="Pitões das Júnias no inverno, com a serra ao fundo"
          class="tw-h-full tw-w-full tw-object-cover" />
        <div class="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-ink/45 tw-px-5 tw-text-center">
          <div>
            <p class="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.3em] tw-text-wheat">Trás-os-Montes</p>
            <h2 class="tw-mt-4 tw-font-serif tw-text-5xl tw-text-flour md:tw-text-7xl">Pitões das Júnias</h2>
            <p class="tw-mx-auto tw-mt-6 tw-max-w-xl tw-text-lg tw-font-light tw-text-flour/85">Onde o tempo abranda e as tradições ganham sabor.</p>
          </div>
        </div>
      </div>

      <div class="tw-mx-auto tw-grid tw-max-w-6xl tw-items-center tw-gap-12 tw-px-5 tw-py-20 md:tw-grid-cols-12 md:tw-gap-16 md:tw-px-8 md:tw-py-28">
        <div class="md:tw-col-span-7">
          <h3 class="tw-font-serif tw-text-3xl tw-leading-tight md:tw-text-4xl">Uma aldeia de pedra e lendas</h3>
          <div class="tw-mt-8 tw-space-y-6 tw-text-lg tw-font-light tw-leading-relaxed tw-text-ink/70">
            <p>
              Situada a 1100 metros de altitude, no coração do Parque Nacional da Peneda-Gerês, Pitões das Júnias é uma das aldeias mais altas e isoladas de Portugal. Erguida em granito, a sua história confunde-se com a do Mosteiro de Santa Maria das Júnias, que remonta ao século XII.
            </p>
            <p>
              Aqui, a vida ainda segue o ritmo das estações e do gado. Entre as cascatas geladas e os trilhos de pastoreio, mantém-se viva a cultura do entreajuda e o respeito pela terra. Visitar Pitões é uma viagem ao Portugal de granito e de tempo lento.
            </p>
          </div>
        </div>
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 md:tw-col-span-5">
          <img
            src="/photos/mosteiro.jpg"
            alt="Portal do Mosteiro de Santa Maria das Júnias"
            class="tw-h-48 tw-w-full tw-rounded-lg tw-object-cover md:tw-h-64" />
          <img
            src="/photos/cascata.jpg"
            alt="Cascata na serra de Pitões das Júnias"
            class="tw-mt-8 tw-h-48 tw-w-full tw-rounded-lg tw-object-cover md:tw-h-64" />
        </div>
      </div>
    </section>

    <section id="fundadores" class="tw-bg-paper tw-py-16 md:tw-py-24">
      <div class="tw-mx-auto tw-flex tw-max-w-6xl tw-flex-col-reverse tw-items-center tw-gap-12 tw-px-5 md:tw-flex-row md:tw-gap-16 md:tw-px-8">
        <div class="md:tw-w-1/2">
          <p class="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.28em] tw-text-crust">Desde 2004</p>
          <h2 class="tw-mt-3 tw-font-serif tw-text-4xl tw-leading-[0.95] md:tw-text-5xl">A Padaria Pitões</h2>
          <div class="tw-mt-8 tw-space-y-6 tw-text-lg tw-font-light tw-leading-relaxed tw-text-ink/75">
            <p>
              Lá em cima, Pitões é uma aldeia pequena e a vista abre-se inteira. O forno trabalha a uma escala média: pão que chega para a rua, para quem passa e para as rotas, com o fumo da chaminé a contar a manhã.
            </p>
            <p>
              A Gracinda cresceu aqui, foi pastora na serra e passou por Paris. Voltou com o Augusto e três filhos pequenos — o Lionel, o Tiago e a Marina — quando o pão ainda só chegava uma vez por semana. O Augusto veio de Celorico de Basto, no Minho, e a serra ficou-lhe. Desde 2004 são os dois à frente da casa.
            </p>
            <blockquote class="tw-border-l-4 tw-border-crust tw-pl-6 tw-font-serif tw-text-2xl tw-italic tw-leading-snug tw-text-ink">
              Não há quem passe em Pitões e não se deixe levar pelo cheiro do nosso pão.
            </blockquote>
          </div>
          <router-link to="/equipa" class="tw-mt-8 tw-inline-flex tw-text-sm tw-underline tw-underline-offset-4 hover:tw-text-rye">A equipa</router-link>
        </div>

        <div class="tw-relative tw-w-full md:tw-w-1/2">
          <img
            src="/photos/padaria.jpg"
            alt="Gracinda e Augusto Marinho à porta da padaria"
            class="tw-h-[28rem] tw-w-full tw-rounded-lg tw-object-cover tw-object-top tw-shadow-xl md:tw-h-[36rem]" />
          <div class="tw-mt-4 md:tw-absolute md:tw-bottom-6 md:tw-right-6 md:tw-mt-0 md:tw-bg-crust md:tw-p-8 md:tw-text-flour">
            <p class="tw-font-serif tw-text-2xl">Pão quente</p>
            <p class="tw-text-sm tw-text-ink/70 md:tw-text-flour/80">Todos os dias, {{ contacts.breadTime }}.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="distribuicao" class="tw-bg-paper">
      <div class="tw-mx-auto tw-max-w-6xl tw-px-5 tw-py-20 md:tw-px-8 md:tw-py-24">
        <div class="tw-flex tw-flex-col tw-justify-between tw-gap-6 md:tw-flex-row md:tw-items-end">
          <div class="tw-max-w-xl">
            <p class="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.28em] tw-text-crust">Fora da aldeia</p>
            <h2 class="tw-mt-4 tw-font-serif tw-text-4xl tw-leading-[0.95] md:tw-text-6xl">Cinco pessoas, um pão.</h2>
          </div>
          <router-link to="/rotas" class="tw-text-sm tw-underline tw-underline-offset-4 hover:tw-text-rye">Ver as rotas</router-link>
        </div>
        <p class="tw-mt-6 tw-max-w-lg tw-text-sm tw-leading-relaxed tw-text-ink/65">
          A Tânia, o Ramos, o Domingos, o Isaac e o Augusto levam o pão nos dias deles.
        </p>
        <div class="tw-mt-10 tw-grid tw-gap-4 sm:tw-grid-cols-2 lg:tw-grid-cols-3">
          <article v-for="person in distributors" :key="person.id" class="tw-rounded-[1.5rem] tw-bg-flour tw-p-5">
            <p class="tw-font-serif tw-text-2xl">{{ person.name }}</p>
            <p class="tw-mt-4 tw-text-sm tw-leading-relaxed tw-text-ink/75">{{ dayList(person.days) }}</p>
            <p v-if="person.note" class="tw-mt-3 tw-text-sm tw-leading-relaxed tw-text-ink/60">{{ person.note }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="atelier" class="tw-bg-[#4e1824] tw-text-[#FBF6E8]">
      <div class="tw-mx-auto tw-grid tw-max-w-6xl tw-items-center tw-gap-10 tw-px-5 tw-py-20 md:tw-grid-cols-2 md:tw-px-8 md:tw-py-28">
        <div>
          <p class="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.28em] tw-text-[#E7C7A1]">A outra mesa da casa</p>
          <h2 class="tw-mt-4 tw-font-serif tw-text-4xl tw-leading-[0.95] md:tw-text-6xl">
            Bolos de aniversário<br />
            <span class="tw-italic">e pastelaria de evento.</span>
          </h2>
        </div>
        <div>
          <p class="tw-text-lg tw-font-light tw-leading-relaxed tw-text-[#FBF6E8]/85">
            O pão fica na padaria. Os bolos de ocasião e a pastelaria para festas são do Atelier da Marina, ligados à mesma família e à mesma aldeia.
          </p>
          <a
            :href="atelierSite"
            class="tw-mt-8 tw-inline-flex tw-rounded-full tw-bg-[#FBF6E8] tw-px-5 tw-py-3 tw-text-sm tw-text-[#4e1824] hover:tw-bg-white"
            target="_blank"
            rel="noopener noreferrer">
            Ir ao atelier
          </a>
        </div>
      </div>
    </section>

    <section class="tw-mx-auto tw-max-w-6xl tw-px-5 tw-pb-4 tw-pt-20 tw-text-center md:tw-px-8">
      <h2 class="tw-font-serif tw-text-3xl md:tw-text-4xl">Estás de passagem pelo Gerês?</h2>
      <p class="tw-mx-auto tw-mt-4 tw-max-w-2xl tw-text-lg tw-font-light tw-leading-relaxed tw-text-ink/70">
        Vem sentir o aroma do pão acabado de cozer. Estamos à tua espera na Rua do Outeiro.
      </p>
    </section>

    <section class="tw-mx-auto tw-grid tw-max-w-6xl tw-gap-8 tw-px-5 tw-py-16 md:tw-grid-cols-3 md:tw-px-8">
      <div>
        <p class="tw-text-xs tw-uppercase tw-tracking-[0.22em] tw-text-crust">Onde</p>
        <a :href="contacts.maps" target="_blank" rel="noopener noreferrer" class="tw-mt-3 tw-block tw-font-serif tw-text-2xl tw-leading-snug hover:tw-text-rye">
          <span v-for="line in contacts.address" :key="line" class="tw-block">{{ line }}</span>
        </a>
      </div>
      <div>
        <p class="tw-text-xs tw-uppercase tw-tracking-[0.22em] tw-text-crust">Pão quente</p>
        <p class="tw-mt-3 tw-font-serif tw-text-2xl">Todos os dias, {{ contacts.breadTime }}.</p>
      </div>
      <div>
        <p class="tw-text-xs tw-uppercase tw-tracking-[0.22em] tw-text-crust">Telefone</p>
        <a :href="contacts.phoneHref" class="tw-mt-3 tw-block tw-font-serif tw-text-2xl hover:tw-text-rye">{{ contacts.phoneDisplay }}</a>
      </div>
    </section>
  </div>
</template>
