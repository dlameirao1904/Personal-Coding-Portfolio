<template>
  <div>
    <section class="tw-relative tw-min-h-[85vh] tw-overflow-hidden tw-p-6 md:tw-p-10">
      <v-row class="tw-h-full tw-items-center">
        <v-col cols="12" md="6" class="tw-p-0 tw-relative tw-z-10">
          <v-img
            src="@/assets/images/homepage/GralhasLaroucoSol.jpg"
            height="80vh"
            cover
            class="tw-rounded-3xl tw-shadow-2xl tw-transform tw-transition-transform tw-duration-500 hover:tw-scale-[1.02] tw-border-4 tw-border-white/50"
          >
            <div class="tw-absolute tw-inset-0 tw-bg-black/20 tw-p-10 tw-flex tw-items-end">
              <h3 class="tw-text-white tw-text-3xl tw-font-bold tw-tracking-wide tw-text-stroke tw-text-stroke-white">Calor de Verão</h3>
            </div>
          </v-img>
        </v-col>
        
        <v-col cols="12" md="6" class="tw-p-0 tw-relative tw-mt-6 md:tw-mt-0 md:tw--ml-10 tw-z-20">
          <v-img
            src="@/assets/images/homepage/GralhasLaroucoNeve.jpg"
            height="80vh"
            cover
            class="tw-rounded-3xl tw-shadow-2xl tw-transform tw-transition-transform tw-duration-500 hover:tw-scale-[1.02] tw-border-4 tw-border-white/50"
          >
            <div class="tw-absolute tw-inset-0 tw-bg-black/20 tw-p-10 tw-flex tw-items-end tw-justify-end">
              <h3 class="tw-text-white tw-text-3xl tw-font-bold tw-tracking-wide tw-text-stroke tw-text-stroke-white">A Magia do Inverno</h3>
            </div>
          </v-img>
        </v-col>
      </v-row>
      
      <div class="tw-absolute tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-30 tw-text-center tw-bg-white/95 tw-p-12 tw-rounded-[40px] tw-shadow-3xl tw-backdrop-blur-lg tw-max-w-3xl tw-border tw-border-gray-100">
        <h1 class="tw-text-4xl md:tw-text-6xl tw-font-extrabold tw-text-gray-900 tw-leading-tight">
          Benvindos a Gralhas, <span class="tw-text-primary">Larouco</span>
        </h1>
        <p class="tw-text-lg md:tw-text-xl tw-text-gray-700 tw-mt-6 tw-px-6">
          Onde a beleza intemporal da serra se encontra com a autenticidade e o calor de uma comunidade vibrante.
        </p>
        <v-btn
          color="primary"
          variant="flat"
          to="/associacao"
          size="x-large"
          class="tw-mt-10 tw-rounded-full tw-px-10 tw-font-bold tw-tracking-wide hover:tw--translate-y-1 tw-transform tw-transition-all tw-duration-300"
        >
          Descobrir Mais
        </v-btn>
      </div>
    </section>

    <section class="tw-bg-gray-50 tw-py-20 tw-px-6 md:tw-px-16">
      <v-container>
        
        <v-row class="tw-items-center tw-mb-20 md:tw-mb-32">
          <v-col cols="12" md="5" class="tw-order-2 md:tw-order-1 tw-pr-md-8">
            <v-img
              src="@/assets/images/homepage/gralhas_foto5.jpg"
              class="tw-rounded-[30px] tw-shadow-xl tw-transform hover:tw-rotate-1 tw-transition-transform tw-duration-300"
              cover
            ></v-img>
          </v-col>
          
          <v-col cols="12" md="7" class="tw-order-1 md:tw-order-2 tw-pl-md-12">
            <h2 class="tw-text-primary tw-font-semibold tw-text-lg tw-tracking-wide tw-capitalize">Nossa História</h2>
            <h3 class="tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-gray-950 tw-mt-3 tw-leading-tight">
              Uma Janela para a Tradição
            </h3>
            <p class="tw-text-lg tw-text-gray-800 tw-mt-8 tw-leading-relaxed">
              Aninhada na encosta da Serra do Larouco, a aldeia de Gralhas é um refúgio de paz e um bastião da cultura transmontana. Aqui, o tempo parece abrandar, permitindo-nos apreciar a beleza da natureza e a riqueza das nossas tradições. É um lugar onde cada pedra conta uma história e cada sorriso acolhe um novo amigo.
            </p>
          </v-col>
        </v-row>

        <v-row class="tw-items-center">
          <v-col cols="12" md="7" class="tw-order-2 md:tw-order-1 tw-pr-md-12">
            <h2 class="tw-text-primary tw-font-semibold tw-text-lg tw-tracking-wide tw-capitalize">Propósito Vivo</h2>
            <h3 class="tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-gray-950 tw-mt-3 tw-leading-tight">
              Proteger o Passado, Construir o Futuro
            </h3>
            <p class="tw-text-lg tw-text-gray-800 tw-mt-8 tw-leading-relaxed">
              A nossa associação nasce da vontade inabalável das nossas gentes em preservar este património ímpar. O nosso foco é dinamizar a aldeia, apoiar a comunidade através de ações socioculturais e criar projetos que mantenham vivas as nossas raízes. Queremos garantir que as futuras gerações sintam o mesmo orgulho de pertencer a esta terra e que continuem a moldar o seu futuro com resiliência.
            </p>
            <div class="tw-mt-10">
              <v-btn
                variant="outlined"
                color="primary"
                to="/acoes"
                class="tw-rounded-full tw-px-8 tw-font-bold tw-tracking-wide hover:tw-bg-primary/5 tw-transition-colors"
                size="large"
              >
                Conhecer as Nossas Ações
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="5" class="tw-order-1 md:tw-order-2 tw-pl-md-8">
            <v-img
              src="@/assets/images/homepage/gralhas_missao.jpg"
              class="tw-rounded-[30px] tw-shadow-xl tw-transform hover:tw--rotate-1 tw-transition-transform tw-duration-300"
              cover
            ></v-img>
          </v-col>
        </v-row>

      </v-container>
    </section>

    <section class="tw-py-24 tw-px-6 md:tw-px-16 tw-bg-white">
      <v-container>
        <h2 class="tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-gray-950 tw-text-center tw-mb-20">
          Os nossos Valores
        </h2>
        
        <v-row class="tw-gap-8 md:tw-gap-6 tw-justify-center">
          <v-col cols="12" md="4">
            <v-card
              class="tw-p-10 tw-h-full tw-rounded-3xl tw-shadow-lg hover:tw-shadow-2xl hover:tw--translate-y-2 tw-transform tw-transition-all tw-duration-500 tw-border tw-border-gray-100"
              elevation="0"
            >
              <div class="tw-flex tw-justify-center tw-mb-8">
                <v-icon size="48" color="primary">mdi-target</v-icon>
              </div>
              <h4 class="tw-text-2xl tw-font-bold tw-text-secondary tw-text-center tw-mb-6">Missão:</h4>
              <p class="tw-text-lg tw-text-gray-700 tw-text-center tw-leading-relaxed tw-px-2">
                Contribuir para o desenvolvimento social local. Promover um ambiente saudável e acolhedor para a prática de atividades recreativas, desportivas e socioculturais, visando o bem-estar e integração dos associados, bem como o desenvolvimento pessoal e social da população.
              </p>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card
              class="tw-p-10 tw-h-full tw-rounded-3xl tw-shadow-lg hover:tw-shadow-2xl hover:tw--translate-y-2 tw-transform tw-transition-all tw-duration-500 tw-border tw-border-gray-100"
              elevation="0"
            >
              <div class="tw-flex tw-justify-center tw-mb-8">
                <v-icon size="48" color="primary">mdi-eye-outline</v-icon>
              </div>
              <h4 class="tw-text-2xl tw-font-bold tw-text-secondary tw-text-center tw-mb-6">Visão:</h4>
              <p class="tw-text-lg tw-text-gray-700 tw-text-center tw-leading-relaxed tw-px-2">
                Ser reconhecida como uma referência na promoção do bem-estar e qualidade de vida. Ser reconhecida como uma referência na promoção de atividades recreativas, desportivas e socioculturais, contribuindo para a melhoria da qualidade de vida de seus associados e da população em geral.
              </p>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card
              class="tw-p-10 tw-h-full tw-rounded-3xl tw-shadow-lg hover:tw-shadow-2xl hover:tw--translate-y-2 tw-transform tw-transition-all tw-duration-500 tw-border tw-border-gray-100"
              elevation="0"
            >
              <div class="tw-flex tw-justify-center tw-mb-8">
                <v-icon size="48" color="primary">mdi-diamond-stone</v-icon>
              </div>
              <h4 class="tw-text-2xl tw-font-bold tw-text-secondary tw-text-center tw-mb-6">Valores:</h4>
              <p class="tw-text-lg tw-text-gray-700 tw-text-center tw-leading-relaxed tw-px-2">
                Transparência, ética, respeito, solidariedade, diversidade, excelência, compromisso com a comunidade e sustentabilidade.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="tw-relative tw-min-h-[50vh] tw-p-10 tw-flex tw-items-center tw-justify-center tw-overflow-hidden">
      <v-img
        src="@/assets/images/homepage/gralhas_foto5.jpg"
        cover
        class="tw-absolute tw-inset-0 tw-opacity-20 tw-scale-125 tw-blur-[2px]"
      ></v-img>
      <div class="tw-text-center tw-relative tw-z-10 tw-max-w-2xl">
        <h2 class="tw-text-5xl md:tw-text-6xl tw-font-extrabold tw-text-gray-950 tw-leading-tight">
          Faça parte da <span class="tw-text-primary">nossa história</span>
        </h2>
        <v-btn
          color="secondary"
          variant="flat"
          to="/agir"
          size="x-large"
          class="tw-mt-12 tw-rounded-full tw-px-10 tw-font-bold tw-tracking-wide hover:tw-scale-105 tw-transform tw-transition-all tw-duration-300"
        >
          Juntar-se à Associação
        </v-btn>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '@/views/Layout/Footer.vue';
</script>

<style scoped>
.tw-text-stroke-white {
  -webkit-text-stroke: 1px white;
}
.tw-text-stroke {
  color: white;
}

.tw-shadow-3xl {
  box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.2);
}
</style>