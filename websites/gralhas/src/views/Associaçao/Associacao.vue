<template>
  <div class="tw-bg-white">
    <section class="tw-relative tw-h-[70vh] tw-flex tw-items-center tw-justify-center tw-overflow-hidden">
      <v-img
        src="@/assets/images/associacao/gralhas_foto7.jpg"
        cover
        class="tw-absolute tw-inset-0 tw-brightness-75"
      >
        <template v-slot:placeholder>
          <div class="tw-flex tw-items-center tw-justify-center tw-h-full tw-bg-gray-200">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </template>
      </v-img>
      
      <div class="tw-relative tw-z-10 tw-text-center tw-px-6">
        <h1 class="tw-text-5xl md:tw-text-7xl tw-font-extrabold tw-text-white tw-tracking-tighter tw-drop-shadow-2xl">
          Nossa Terra, <span class="tw-text-primary-light">Nossa Alma</span>
        </h1>
        <p class="tw-mt-6 tw-text-xl tw-text-white/90 tw-max-w-2xl tw-mx-auto tw-font-medium">
          Gralhas: Onde a tradição da Serra do Larouco ganha vida através das pessoas.
        </p>
      </div>
    </section>

    <section class="tw-py-24 tw-px-6 md:tw-px-16">
      <v-container>
        <v-row class="tw-items-center">
          <v-col cols="12" md="6" class="tw-pr-md-16">
            <h2 class="tw-text-primary tw-font-bold tw-text-sm tw-tracking-[0.2em] tw-uppercase tw-mb-4">A Localidade</h2>
            <h3 class="tw-text-4xl tw-font-bold tw-text-gray-900 tw-leading-tight">
              Um refúgio de pedra no planalto do Larouco
            </h3>
            <div class="tw-w-20 tw-h-1.5 tw-bg-primary tw-my-8 tw-rounded-full"></div>
            <p class="tw-text-lg tw-text-gray-700 tw-leading-relaxed">
              Situada no concelho de Montalegre, Gralhas é uma localidade com uma beleza natural própria e uma riqueza cultural muito específica. Com cerca de 200 habitantes, as suas ruas estreitas e casas de pedra transportam-nos para um passado remoto e autêntico.
            </p>
            <p class="tw-mt-6 tw-text-lg tw-text-gray-700 tw-leading-relaxed">
              Aqui, no planalto da <strong>Serra do Larouco</strong>, onde nasce o Rio Cávado, a vida pulsa ao ritmo da agricultura e da pecuária, mantendo viva a essência de Trás-os-Montes.
            </p>
          </v-col>
          
          <v-col cols="12" md="6" class="tw-mt-12 md:tw-mt-0">
            <div class="tw-relative">
              <v-img
                src="@/assets/images/associacao/gralhas_foto6.jpg"
                class="tw-rounded-[40px] tw-shadow-2xl tw-z-10"
                aspect-ratio="1.2"
                cover
              ></v-img>
              <div class="tw-absolute tw--bottom-6 tw--left-6 tw-w-32 tw-h-32 tw-bg-secondary/10 tw-rounded-full tw--z-10"></div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="tw-bg-gray-900 tw-py-24 tw-text-white tw-rounded-t-[60px]">
      <v-container>
        <div class="tw-text-center tw-mb-16">
          <h2 class="tw-text-primary tw-font-bold tw-text-4xl md:tw-text-5xl">A.R.D.S.C.G</h2>
          <p class="tw-text-gray-400 tw-mt-4 tw-text-lg">Associação Recreativa, Desportiva e Sócio-Cultural de Gralhas</p>
        </div>

        <v-row class="tw-gap-y-12">
          <v-col cols="12" md="4">
            <div class="tw-p-8 tw-bg-white/5 tw-rounded-3xl tw-border tw-border-white/10 tw-h-full">
              <v-icon color="primary" size="40" class="tw-mb-6">mdi-flag-variant</v-icon>
              <h4 class="tw-text-xl tw-font-bold tw-mb-4">O Nosso Objeto</h4>
              <p class="tw-text-gray-400 tw-leading-relaxed">
                Dar continuidade às tradições rurais, promover o desporto entre os jovens e incentivar a sociabilização de toda a população.
              </p>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <div class="tw-p-8 tw-bg-white/5 tw-rounded-3xl tw-border tw-border-white/10 tw-h-full">
              <v-icon color="primary" size="40" class="tw-mb-6">mdi-sprout</v-icon>
              <h4 class="tw-text-xl tw-font-bold tw-mb-4">Resiliência</h4>
              <p class="tw-text-gray-400 tw-leading-relaxed">
                Temos como missão vital combater a desertificação que assola o interior, criando raízes fortes para que os nossos jovens queiram ficar e prosperar.
              </p>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <div class="tw-p-8 tw-bg-white/5 tw-rounded-3xl tw-border tw-border-white/10 tw-h-full">
              <v-icon color="primary" size="40" class="tw-mb-6">mdi-account-group</v-icon>
              <h4 class="tw-text-xl tw-font-bold tw-mb-4">Comunidade e Diáspora</h4>
              <p class="tw-text-gray-400 tw-leading-relaxed">
                Dinamizamos a comunidade local e aqueles que estão longe (diáspora), fomentando o convívio social e o bem-estar comunitário sustentável.
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="tw-py-24 tw-bg-white">
      <v-container>
        <v-row class="tw-items-center">
          <v-col cols="12" md="7">
            <div class="tw-grid tw-grid-cols-2 tw-gap-4">
              <v-img
                src="@/assets/images/associacao/IMG_0955.jpg"
                class="tw-rounded-2xl tw-shadow-lg"
                cover
                height="300"
              ></v-img>
              <v-img
                src="@/assets/images/associacao/screenshot_20200910_0143006870047476209789029.webp"
                class="tw-rounded-2xl tw-shadow-lg tw-mt-12"
                cover
                height="300"
              ></v-img>
            </div>
          </v-col>
          <v-col cols="12" md="5" class="tw-pl-md-12 tw-mt-12 md:tw-mt-0">
            <h3 class="tw-text-3xl tw-font-bold tw-text-gray-900">Um Motor de Mudança</h3>
            <p class="tw-mt-6 tw-text-gray-700 tw-text-lg tw-leading-relaxed">
              Contamos com um grupo de pessoas dedicadas, com origens na aldeia, empenhadas em tornar a nossa associação um verdadeiro motor de progresso. 
            </p>
            <p class="tw-mt-4 tw-text-gray-700 tw-text-lg tw-leading-relaxed">
              Estamos sempre abertos a novas ideias e parcerias que contribuam para alcançar os nossos objetivos e fazer a diferença na vida de quem habita no interior.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="tw-py-20 tw-bg-primary/5 tw-text-center">
      <v-container>
        <div class="tw-max-w-3xl tw-mx-auto">
          <h2 class="tw-text-4xl tw-font-bold tw-text-gray-900">Junte-se a esta nobre causa</h2>
          <p class="tw-mt-6 tw-text-xl tw-text-gray-600">
            Convidamos todos a participar ativamente nos nossos projetos, contribuindo para um futuro mais promissor e sustentável para Gralhas.
          </p>
          <v-btn
            color="primary"
            size="x-large"
            variant="flat"
            to="/agir"
            class="tw-mt-10 tw-rounded-full tw-px-12 tw-font-bold tw-h-16"
          >
            Tornar-me Membro
          </v-btn>
        </div>
      </v-container>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '../Layout/Footer.vue';
</script>

<style scoped>
.tw-text-primary-light {
  color: #50D16E;
}
</style>