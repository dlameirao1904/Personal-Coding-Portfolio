<template>
  <footer class="tw-bg-gray-900 tw-pb-8 tw-pt-16 tw-text-white tw-border-t tw-border-gray-800">
      <div class="tw-mx-auto tw-max-w-7xl tw-px-6 md:tw-px-8">
          <div class="tw-mb-12 tw-grid tw-grid-cols-1 tw-gap-12 md:tw-grid-cols-4">
              
              <div class="tw-flex tw-flex-col tw-gap-4">
                  <v-img
                      src="@/assets/images/logo.png"
                      alt="Logo Gralhas"
                      width="90"
                      class="tw-mb-2"
                      contain 
                  />
                  <p class="tw-text-sm tw-leading-relaxed tw-text-gray-400">
                      A promover o desenvolvimento social, o bem-estar e a união no coração da Serra do Larouco.
                  </p>
                  <div class="tw-mt-2 tw-flex tw-gap-2">
                      <v-btn
                          icon="mdi-facebook"
                          variant="text"
                          color="gray-400"
                          href="https://web.facebook.com/profile.php?id=61564194351970"
                          class="hover:tw-text-primary tw-transition-colors"
                          density="comfortable"
                      ></v-btn>
                  </div>
              </div>

              <div>
                  <h4 class="tw-font-bold tw-mb-6 tw-text-lg tw-text-white tw-tracking-wide">Navegação</h4>
                  <ul class="tw-flex tw-flex-col tw-gap-3 tw-text-sm tw-text-gray-400">
                      <li>
                          <router-link
                              to="/associacao"
                              class="tw-transition-colors hover:tw-text-primary"
                              >Associação</router-link
                          >
                      </li>
                      <li>
                          <router-link
                              to="/eventos"
                              class="tw-transition-colors hover:tw-text-primary"
                              >Eventos</router-link
                          >
                      </li>
                      <li>
                          <router-link
                              to="/acoes"
                              class="tw-transition-colors hover:tw-text-primary"
                              >Ações</router-link
                          >
                      </li>
                      <li>
                          <router-link
                              to="/contactar"
                              class="tw-transition-colors hover:tw-text-primary"
                              >Contactar</router-link
                          >
                      </li>
                      <li>
                          <router-link
                              to="/agir"
                              class="tw-transition-colors hover:tw-text-primary tw-font-bold"
                              >Agir</router-link
                          >
                      </li>
                  </ul>
              </div>

              <div>
                  <h4 class="tw-font-bold tw-mb-6 tw-text-lg tw-text-white tw-tracking-wide">Contactos</h4>
                  <div class="tw-flex tw-flex-col tw-gap-4 tw-text-sm tw-text-gray-400">
                      <div class="tw-flex tw-items-center tw-gap-3">
                          <v-icon size="small" color="primary">mdi-phone</v-icon>
                          <span>919 981 950</span>
                      </div>
                      <div class="tw-flex tw-items-center tw-gap-3">
                          <v-icon size="small" color="primary">mdi-email</v-icon>
                          <span>associacao.gralhas11@gmail.com</span>
                      </div>
                  </div>
              </div>

              <div>
                  <h4 class="tw-font-bold tw-mb-6 tw-text-lg tw-text-white tw-tracking-wide">Onde Estamos</h4>
                  <div class="tw-flex tw-items-start tw-gap-3 tw-text-sm tw-text-gray-400">
                      <v-icon size="small" color="primary" class="tw-mt-1">mdi-map-marker</v-icon>
                      <p>
                          Largo da Aldeia<br />
                          5470-172 Gralhas<br />
                          <span class="tw-text-xs tw-italic tw-text-gray-500">(Montalegre)</span>
                      </p>
                  </div>
              </div>
          </div>

          <div class="tw-border-t tw-border-gray-800 tw-pt-8 tw-text-center tw-text-sm tw-text-gray-500">
              <p>&copy; {{ new Date().getFullYear() }} Associação Gralhas. Todos os direitos reservados.</p>
              <p class="tw-mt-2">Desenvolvido com dedicação para a aldeia de Gralhas.</p>
          </div>
      </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>