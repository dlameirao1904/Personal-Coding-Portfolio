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

    <section id="paes" class="tw-mx-auto tw-max-w-7xl tw-px-5 tw-py-24 md:tw-px-8 md:tw-py-32">
  <!-- Cabeçalho Editorial -->
  <div class="tw-flex tw-flex-col md:tw-flex-row md:tw-items-end md:tw-justify-between tw-gap-10 tw-mb-16 md:tw-mb-24">
    <div class="tw-max-w-2xl">
      <p class="tw-text-sm tw-font-semibold tw-uppercase tw-tracking-widest tw-text-crust">No Balcão</p>
      <h2 class="tw-mt-4 tw-font-serif tw-text-5xl tw-leading-tight md:tw-text-7xl tw-text-ink">
        Os favoritos da casa.
      </h2>
      <p class="tw-mt-6 tw-text-base tw-leading-relaxed tw-text-ink/70 md:tw-text-lg tw-max-w-lg">
        De côdea estaladiça e miolo macio, estas são as receitas que desaparecem mais depressa das nossas prateleiras. Um pequeno vislumbre daquilo que sai do nosso forno todos os dias.
      </p>
    </div>
    
    <router-link to="/produtos" class="tw-group tw-inline-flex tw-items-center tw-gap-2 tw-text-sm tw-font-medium tw-text-crust hover:tw-text-rye tw-transition-colors">
      <span class="tw-border-b tw-border-crust/30 tw-pb-0.5 group-hover:tw-border-rye/50 tw-transition-colors">Ver toda a montra</span>
      <svg class="tw-w-4 tw-h-4 group-hover:tw-translate-x-1 tw-transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </router-link>
  </div>

  <!-- Grelha Orgânica (Cartão central desfasado) -->
  <div class="tw-grid tw-gap-y-16 tw-gap-x-8 sm:tw-grid-cols-2 md:tw-grid-cols-3">
    <article 
      v-for="(product, index) in featuredProducts" 
      :key="product.slug" 
      class="tw-group tw-flex tw-flex-col"
      :class="{ 'md:tw-translate-y-12': index === 1 }"
    >
      <div 
        class="tw-relative tw-aspect-[4/5] tw-w-full tw-overflow-hidden tw-rounded-[2.5rem] tw-transition-transform tw-duration-500 group-hover:-tw-translate-y-2" 
        :class="wash[product.kind]"
      >
        <img
          v-if="product.photo"
          :src="product.photo"
          :alt="product.name"
          class="tw-h-full tw-w-full tw-object-cover tw-transition-transform tw-duration-700 group-hover:tw-scale-105" 
        />
        <BreadMark 
          v-else 
          :kind="product.kind" 
          class="tw-transition-transform tw-duration-700 group-hover:tw-scale-110" 
        />
      </div>
      <div class="tw-mt-6 md:tw-mt-8">
        <h3 class="tw-font-serif tw-text-3xl tw-text-ink">{{ product.name }}</h3>
        <p class="tw-mt-3 tw-text-sm tw-leading-relaxed tw-text-ink/65">{{ product.summary }}</p>
      </div>
    </article>
  </div>
</section>

    <!-- A Aldeia -->
    <section id="pitoes" class="tw-bg-paper">
      <div class="tw-relative tw-h-[75vh] tw-min-h-[32rem] tw-overflow-hidden">
        <img
          src="/photos/pitoes-panoramica.jpg"
          alt="Pitões das Júnias no inverno, com a serra ao fundo"
          class="tw-h-full tw-w-full tw-object-cover tw-scale-105 tw-transform tw-transition-transform tw-duration-[20s] hover:tw-scale-110" />
        <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-ink/80 tw-via-ink/40 tw-to-transparent"></div>
        <div class="tw-absolute tw-inset-0 tw-flex tw-items-end tw-justify-center tw-pb-24 tw-px-5 tw-text-center">
          <div class="tw-max-w-3xl">
            <p class="tw-text-sm tw-font-semibold tw-uppercase tw-tracking-[0.35em] tw-text-wheat">Trás-os-Montes</p>
            <h2 class="tw-mt-4 tw-font-serif tw-text-6xl tw-text-flour md:tw-text-8xl tw-drop-shadow-lg">Pitões das Júnias</h2>
            <p class="tw-mx-auto tw-mt-6 tw-max-w-xl tw-text-lg tw-font-light tw-text-flour/90 md:tw-text-xl">
              Onde o tempo dita a receita e o granito guarda a tradição.
            </p>
          </div>
        </div>
      </div>

      <div class="tw-mx-auto tw-grid tw-max-w-7xl tw-items-center tw-gap-16 tw-px-5 tw-py-24 md:tw-grid-cols-12 md:tw-px-8 md:tw-py-32">
        <div class="md:tw-col-span-6 md:tw-pr-8">
          <h3 class="tw-font-serif tw-text-4xl tw-leading-tight tw-text-ink md:tw-text-5xl">Uma aldeia esculpida na pedra e no tempo.</h3>
          <div class="tw-mt-8 tw-space-y-6 tw-text-base tw-font-light tw-leading-relaxed tw-text-ink/75 md:tw-text-lg">
            <p>
              A 1100 metros de altitude, abrigada no coração do Parque Nacional da Peneda-Gerês, Pitões das Júnias é um dos refúgios mais altos de Portugal. As suas raízes cruzam-se com as do Mosteiro de Santa Maria das Júnias, erguido no século XII.
            </p>
            <p>
              Aqui, a vida recusa a pressa. Segue o compasso das estações, o som da água nas cascatas geladas e os passos do pastoreio. Visitar Pitões não é apenas uma viagem no mapa; é um regresso ao essencial, à entreajuda e ao sabor da terra.
            </p>
          </div>
        </div>
        <div class="tw-relative tw-grid tw-grid-cols-2 tw-gap-4 md:tw-col-span-6 md:tw-gap-6">
          <img
            src="/photos/mosteiro.jpg"
            alt="Portal do Mosteiro de Santa Maria das Júnias"
            class="tw-aspect-[4/5] tw-w-full tw-rounded-[2rem] tw-object-cover tw-shadow-lg" />
          <img
            src="/photos/cascata.jpg"
            alt="Cascata na serra de Pitões das Júnias"
            class="tw-mt-12 tw-aspect-[4/5] tw-w-full tw-rounded-[2rem] tw-object-cover tw-shadow-lg" />
        </div>
      </div>
    </section>

    <!-- Os Fundadores -->
    <section id="fundadores" class="tw-bg-flour tw-py-24 md:tw-py-32">
      <div class="tw-mx-auto tw-flex tw-max-w-7xl tw-flex-col-reverse tw-items-center tw-gap-16 tw-px-5 md:tw-flex-row md:tw-px-8">
        <div class="md:tw-w-5/12">
          <p class="tw-text-sm tw-font-semibold tw-uppercase tw-tracking-widest tw-text-crust">Desde 2004</p>
          <h2 class="tw-mt-4 tw-font-serif tw-text-5xl tw-leading-tight tw-text-ink md:tw-text-6xl">As mãos na massa.</h2>
          <div class="tw-mt-8 tw-space-y-6 tw-text-base tw-font-light tw-leading-relaxed tw-text-ink/75 md:tw-text-lg">
            <p>
              A Gracinda é filha da terra. Foi pastora nestas serras, partiu para Paris e regressou com o Augusto e três filhos — o Lionel, o Tiago e a Marina. Na altura, o pão fresco só chegava à aldeia uma vez por semana.
            </p>
            <p>
              O Augusto trouxe o sotaque do Minho, de Celorico de Basto, mas foi a montanha que o conquistou. Juntos, acenderam o forno que hoje alimenta a rua, quem passa e as rotas vizinhas. A chaminé a fumegar de manhã é o relógio da aldeia.
            </p>
            <blockquote class="tw-relative tw-mt-10 tw-border-l-2 tw-border-rye tw-pl-8">
              <span class="tw-absolute -tw-left-3 -tw-top-4 tw-font-serif tw-text-6xl tw-text-rye/30">"</span>
              <p class="tw-font-serif tw-text-2xl tw-italic tw-leading-snug tw-text-ink">
                Não há quem passe em Pitões e não se deixe levar pelo cheiro do nosso pão.
              </p>
            </blockquote>
          </div>
          <router-link to="/equipa" class="tw-group tw-mt-10 tw-inline-flex tw-items-center tw-gap-2 tw-text-sm tw-font-medium tw-text-crust hover:tw-text-rye tw-transition-colors">
            <span class="tw-border-b tw-border-crust/30 tw-pb-0.5 group-hover:tw-border-rye/50">Conhecer a equipa</span>
            <svg class="tw-w-4 tw-h-4 group-hover:tw-translate-x-1 tw-transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
        </div>

        <div class="tw-relative tw-w-full md:tw-w-7/12">
          <div class="tw-aspect-[4/5] md:tw-aspect-auto md:tw-h-[40rem] tw-w-full tw-overflow-hidden tw-rounded-[2.5rem]">
            <img
              src="/photos/padaria.jpg"
              alt="Gracinda e Augusto Marinho à porta da padaria"
              class="tw-h-full tw-w-full tw-object-cover tw-object-top tw-shadow-2xl" />
          </div>
          <div class="tw-mt-6 md:tw-absolute md:-tw-bottom-8 md:-tw-left-8 md:tw-mt-0 md:tw-rounded-3xl md:tw-bg-paper md:tw-p-8 md:tw-shadow-xl md:tw-max-w-xs">
            <p class="tw-font-serif tw-text-3xl tw-text-ink">Fornada Quente</p>
            <p class="tw-mt-2 tw-text-sm tw-text-ink/70">A magia acontece todos os dias pelas <span class="tw-font-medium">{{ contacts.breadTime }}</span>.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Distribuição -->
    <section id="distribuicao" class="tw-bg-paper tw-py-24 md:tw-py-32">
      <div class="tw-mx-auto tw-max-w-7xl tw-px-5 md:tw-px-8">
        <div class="tw-flex tw-flex-col md:tw-flex-row md:tw-items-end md:tw-justify-between tw-gap-8 tw-mb-16">
          <div class="tw-max-w-2xl">
            <p class="tw-text-sm tw-font-semibold tw-uppercase tw-tracking-widest tw-text-crust">O Caminho do Pão</p>
            <h2 class="tw-mt-4 tw-font-serif tw-text-5xl tw-leading-tight tw-text-ink md:tw-text-6xl">Para além da montanha.</h2>
            <p class="tw-mt-6 tw-text-base tw-leading-relaxed tw-text-ink/70 md:tw-text-lg">
              De Pitões para o mundo (ou quase). A Tânia, o Ramos, o Domingos, o Isaac e o Augusto fazem a ponte entre o nosso forno e a sua mesa, cada um com a sua rota.
            </p>
          </div>
          <router-link to="/rotas" class="tw-group tw-inline-flex tw-items-center tw-gap-2 tw-text-sm tw-font-medium tw-text-crust hover:tw-text-rye">
            <span class="tw-border-b tw-border-crust/30 tw-pb-0.5 group-hover:tw-border-rye/50">Consultar as rotas</span>
            <svg class="tw-w-4 tw-h-4 group-hover:tw-translate-x-1 tw-transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
        </div>
        
        <div class="tw-grid tw-gap-6 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-5">
          <article v-for="person in distributors" :key="person.id" class="tw-group tw-rounded-[2rem] tw-bg-flour tw-p-8 tw-shadow-sm tw-transition-all hover:tw-shadow-md hover:-tw-translate-y-1">
            <div class="tw-mb-4 tw-h-12 tw-w-12 tw-rounded-full tw-bg-paper tw-flex tw-items-center tw-justify-center tw-text-crust">
              <svg class="tw-w-6 tw-h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 class="tw-font-serif tw-text-2xl tw-text-ink">{{ person.name }}</h3>
            <p class="tw-mt-3 tw-text-sm tw-font-medium tw-text-crust">{{ dayList(person.days) }}</p>
            <p v-if="person.note" class="tw-mt-2 tw-text-sm tw-leading-relaxed tw-text-ink/60">{{ person.note }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- O Atelier -->
    <section id="atelier" class="tw-bg-[#4e1824] tw-text-[#FBF6E8] tw-py-24 md:tw-py-32">
      <div class="tw-mx-auto tw-grid tw-max-w-7xl tw-items-center tw-gap-16 tw-px-5 md:tw-grid-cols-2 md:tw-px-8">
        <div>
          <p class="tw-text-sm tw-font-semibold tw-uppercase tw-tracking-widest tw-text-[#E7C7A1]">A outra mesa da casa</p>
          <h2 class="tw-mt-4 tw-font-serif tw-text-5xl tw-leading-tight md:tw-text-7xl">
            A doçura<br />
            <span class="tw-italic tw-text-[#E7C7A1]">de celebrar.</span>
          </h2>
        </div>
        <div class="md:tw-pl-12 md:tw-border-l md:tw-border-[#FBF6E8]/20">
          <p class="tw-text-lg tw-font-light tw-leading-relaxed tw-text-[#FBF6E8]/90 md:tw-text-xl">
            A padaria domina a arte da farinha e da água. Quando a ocasião pede açúcar, o Atelier da Marina entra em cena com bolos festivos e pastelaria de evento. Duas artes, a mesma família, a mesma aldeia.
          </p>
          <a
            :href="atelierSite"
            class="tw-mt-10 tw-group tw-inline-flex tw-items-center tw-gap-3 tw-rounded-full tw-bg-[#FBF6E8] tw-px-8 tw-py-4 tw-text-sm tw-font-medium tw-text-[#4e1824] tw-transition-transform hover:tw-scale-105"
            target="_blank"
            rel="noopener noreferrer">
            Visitar o Atelier
            <svg class="tw-w-4 tw-h-4 tw-transition-transform group-hover:tw-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
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
