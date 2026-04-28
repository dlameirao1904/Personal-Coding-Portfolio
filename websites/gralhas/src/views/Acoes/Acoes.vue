<template>
  <div class="tw-bg-white">
    <section class="tw-relative tw-py-24 md:tw-py-32 tw-bg-gray-50 tw-overflow-hidden">
      <div class="tw-absolute tw-top-0 tw-right-0 tw--mt-16 tw--mr-16 tw-w-96 tw-h-96 tw-bg-primary/10 tw-rounded-full tw-blur-3xl"></div>
      <div class="tw-absolute tw-bottom-0 tw-left-0 tw--mb-16 tw--ml-16 tw-w-72 tw-h-72 tw-bg-secondary/10 tw-rounded-full tw-blur-3xl"></div>

      <v-container class="tw-relative tw-z-10">
        <div class="tw-max-w-3xl tw-mx-auto tw-text-center">
          <h2 class="tw-text-primary tw-font-bold tw-text-sm tw-tracking-[0.2em] tw-uppercase tw-mb-4">O Que Fazemos</h2>
          <h1 class="tw-text-5xl md:tw-text-6xl tw-font-extrabold tw-text-gray-900 tw-leading-tight">
            Mais do que palavras, <span class="tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-r tw-from-primary tw-to-secondary">ações que transformam</span>.
          </h1>
          <p class="tw-mt-6 tw-text-xl tw-text-gray-600 tw-leading-relaxed">
            Trabalhamos todos os dias para dinamizar a nossa aldeia, unir a comunidade e preservar o património de Gralhas para as gerações futuras.
          </p>
        </div>
      </v-container>
    </section>

    <section class="tw-py-20 tw-px-6 md:tw-px-16 tw-bg-white">
      <v-container>
        <v-row class="tw-gap-y-10">
          
          <v-col cols="12" md="6">
            <v-card 
              elevation="0" 
              class="tw-group tw-h-full tw-rounded-[30px] tw-border tw-border-gray-100 tw-overflow-hidden hover:tw-shadow-2xl tw-transition-all tw-duration-500"
            >
              <div class="tw-h-64 tw-overflow-hidden tw-relative">
                <v-img 
                  src="@/assets/images/acoes/cultura.jpg" 
                  cover 
                  class="tw-w-full tw-h-full tw-transform group-hover:tw-scale-110 tw-transition-transform tw-duration-700"
                ></v-img>
                <div class="tw-absolute tw-top-4 tw-right-4 tw-bg-white/90 tw-backdrop-blur-sm tw-p-3 tw-rounded-2xl tw-shadow-md">
                  <v-icon color="primary">mdi-drama-masks</v-icon>
                </div>
              </div>
              <div class="tw-p-8">
                <h3 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-3">Cultura e Tradição</h3>
                <p class="tw-text-gray-600 tw-leading-relaxed">
                  Preservamos a nossa identidade através da organização de magustos, festas populares e recriações históricas que mantêm vivas as raízes transmontanas.
                </p>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card 
              elevation="0" 
              class="tw-group tw-h-full tw-rounded-[30px] tw-border tw-border-gray-100 tw-overflow-hidden hover:tw-shadow-2xl tw-transition-all tw-duration-500"
            >
              <div class="tw-h-64 tw-overflow-hidden tw-relative">
                <v-img 
                  src="@/assets/images/acoes/desporto.jpg" 
                  cover 
                  class="tw-w-full tw-h-full tw-transform group-hover:tw-scale-110 tw-transition-transform tw-duration-700"
                ></v-img>
                <div class="tw-absolute tw-top-4 tw-right-4 tw-bg-white/90 tw-backdrop-blur-sm tw-p-3 tw-rounded-2xl tw-shadow-md">
                  <v-icon color="primary">mdi-soccer</v-icon>
                </div>
              </div>
              <div class="tw-p-8">
                <h3 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-3">Desporto e Lazer</h3>
                <p class="tw-text-gray-600 tw-leading-relaxed">
                  Promovemos a saúde e o espírito de equipa entre os jovens com torneios, caminhadas na Serra do Larouco e atividades recreativas para todas as idades.
                </p>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card 
              elevation="0" 
              class="tw-group tw-h-full tw-rounded-[30px] tw-border tw-border-gray-100 tw-overflow-hidden hover:tw-shadow-2xl tw-transition-all tw-duration-500"
            >
              <div class="tw-h-64 tw-overflow-hidden tw-relative">
                <v-img 
                  src="@/assets/images/acoes/apoio.jpg" 
                  cover 
                  class="tw-w-full tw-h-full tw-transform group-hover:tw-scale-110 tw-transition-transform tw-duration-700"
                ></v-img>
                <div class="tw-absolute tw-top-4 tw-right-4 tw-bg-white/90 tw-backdrop-blur-sm tw-p-3 tw-rounded-2xl tw-shadow-md">
                  <v-icon color="primary">mdi-hand-heart</v-icon>
                </div>
              </div>
              <div class="tw-p-8">
                <h3 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-3">Apoio Social</h3>
                <p class="tw-text-gray-600 tw-leading-relaxed">
                  Estamos ao lado dos nossos. Criamos oportunidades e momentos de partilha para combater o isolamento dos menos jovens e integrar as novas gerações.
                </p>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card 
              elevation="0" 
              class="tw-group tw-h-full tw-rounded-[30px] tw-border tw-border-gray-100 tw-overflow-hidden hover:tw-shadow-2xl tw-transition-all tw-duration-500"
            >
              <div class="tw-h-64 tw-overflow-hidden tw-relative">
                <v-img 
                  src="@/assets/images/acoes/sustentabilidade.jpg" 
                  cover 
                  class="tw-w-full tw-h-full tw-transform group-hover:tw-scale-110 tw-transition-transform tw-duration-700"
                ></v-img>
                <div class="tw-absolute tw-top-4 tw-right-4 tw-bg-white/90 tw-backdrop-blur-sm tw-p-3 tw-rounded-2xl tw-shadow-md">
                  <v-icon color="primary">mdi-pine-tree</v-icon>
                </div>
              </div>
              <div class="tw-p-8">
                <h3 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-3">Combate à Desertificação</h3>
                <p class="tw-text-gray-600 tw-leading-relaxed">
                  Iniciativas de valorização do nosso espaço rural e parcerias ativas para atrair interesse para a nossa aldeia, mostrando que o interior tem futuro.
                </p>
              </div>
            </v-card>
          </v-col>

        </v-row>
      </v-container>
    </section>

    <section class="tw-py-24 tw-px-6 md:tw-px-16 tw-bg-gray-900 tw-text-white tw-rounded-t-[60px]">
      <v-container>
        <v-row class="tw-items-center">
          <v-col cols="12" md="5">
            <h2 class="tw-text-primary tw-font-bold tw-text-sm tw-tracking-[0.2em] tw-uppercase tw-mb-4">Em Destaque</h2>
            <h3 class="tw-text-4xl md:tw-text-5xl tw-font-bold tw-mb-6 tw-leading-tight">
              O Nosso Próximo Passo
            </h3>
            <p class="tw-text-gray-400 tw-text-lg tw-leading-relaxed tw-mb-8">
              A nossa associação não pára. Temos sempre projetos em mente para dinamizar Gralhas. Seja a recuperação de um espaço comum ou a organização do próximo grande convívio da diáspora, o nosso foco é construir hoje a aldeia de amanhã.
            </p>
            <v-btn
              color="primary"
              variant="outlined"
              size="large"
              to="/eventos"
              class="tw-rounded-full tw-px-8 tw-font-bold hover:tw-bg-primary hover:tw-text-gray-900 tw-transition-colors"
            >
              Ver Calendário de Eventos
            </v-btn>
          </v-col>
          
          <v-col cols="12" md="6" class="tw-offset-md-1 tw-mt-12 md:tw-mt-0">
            <div class="tw-relative">
              <v-img
                src="@/assets/images/acoes/destaque.jpg"
                class="tw-rounded-[30px] tw-shadow-2xl"
                aspect-ratio="1"
                cover
              ></v-img>
              <div class="tw-absolute tw--bottom-8 tw--left-8 tw-bg-white tw-text-gray-900 tw-p-6 tw-rounded-2xl tw-shadow-xl tw-max-w-xs tw-hidden md:tw-block">
                <div class="tw-flex tw-items-center tw-gap-3 tw-mb-2">
                  <v-icon color="primary">mdi-lightbulb-on</v-icon>
                  <span class="tw-font-bold tw-text-lg">Tens uma ideia?</span>
                </div>
                <p class="tw-text-sm tw-text-gray-600">Estamos sempre recetivos a novas sugestões da comunidade.</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '../Layout/Footer.vue';
</script>

<style scoped>
.tw-bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>