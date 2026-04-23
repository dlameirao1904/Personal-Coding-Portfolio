<template>
  <v-app>
    <router-view />
    <v-overlay
      class="centered-content"
      location-strategy="connected"
      :model-value="isLoading"
      persistent
      scroll-strategy="reposition"
    >
      <v-progress-circular color="primary" indeterminate size="44"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script setup lang="ts">
import { useAppStore } from './stores/app'
const appStore = useAppStore()
const isLoading = computed(() => appStore.isLoading)
</script>

<style scoped></style>
