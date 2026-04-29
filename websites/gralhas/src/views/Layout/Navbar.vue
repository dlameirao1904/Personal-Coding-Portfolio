<template>
  <div>
    <v-app-bar
      app
      elevation="0"
      class="tw-bg-white/80 tw-backdrop-blur-md tw-border-b tw-border-gray-200/50 tw-px-2 md:tw-px-6"
    >
      <router-link to="/" class="tw-flex tw-items-center tw-no-underline tw-cursor-pointer tw-transform hover:tw-scale-105 tw-transition-transform">
        <v-img
          src="@/assets/images/logo.png"
          alt="Logo Gralhas"
          width="50"
          height="50"
          contain
        ></v-img>
      </router-link>

      <v-spacer></v-spacer>

      <div class="tw-hidden md:tw-flex tw-items-center tw-gap-1">
        <v-btn 
          variant="text" 
          to="/associacao" 
          class="tw-capitalize tw-font-medium tw-tracking-wide hover:tw-opacity-70 tw-transition-opacity"
        >
          Associação
        </v-btn>
        
        <v-btn 
          variant="text" 
          to="/eventos" 
          class="tw-capitalize tw-font-medium tw-tracking-wide hover:tw-opacity-70 tw-transition-opacity"
        >
          Eventos
        </v-btn>
        
        <v-btn 
          variant="text" 
          to="/acoes" 
          class="tw-capitalize tw-font-medium tw-tracking-wide hover:tw-opacity-70 tw-transition-opacity"
        >
          Ações
        </v-btn>
        
        <v-btn 
          variant="text" 
          to="/contactar" 
          class="tw-capitalize tw-font-medium tw-tracking-wide hover:tw-opacity-70 tw-transition-opacity"
        >
          Contactar
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          to="/agir"
          class="tw-ml-4 tw-rounded-full tw-px-6 tw-font-bold tw-tracking-wide hover:tw--translate-y-0.5 hover:tw-shadow-lg tw-transform tw-transition-all tw-duration-300"
        >
          Tornar Membro
        </v-btn>
      </div>

      <v-btn 
        icon 
        variant="text" 
        class="md:tw-hidden" 
        @click="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer" 
      temporary 
      location="right" 
      class="tw-bg-white/95 tw-backdrop-blur-md"
    >
      <v-list nav class="tw-mt-4">
        <v-list-item to="/associacao" title="Associação" class="tw-mb-2"></v-list-item>
        <v-list-item to="/eventos" title="Eventos" class="tw-mb-2"></v-list-item>
        <v-list-item to="/acoes" title="Ações" class="tw-mb-2"></v-list-item>
        <v-list-item to="/contactar" title="Contactar" class="tw-mb-2"></v-list-item>
        
        <v-divider class="tw-my-4"></v-divider>
        
        <v-list-item>
          <v-btn 
            color="primary" 
            variant="flat" 
            block 
            to="/agir" 
            class="tw-rounded-full tw-font-bold tw-py-6"
          >
            Agir
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Controlo de estado do menu mobile
const drawer = ref(false)
</script>

<style scoped>
/* Pequeno ajuste para garantir que o link do router não tem estilos extra */
a {
  text-decoration: none;
}
</style>
