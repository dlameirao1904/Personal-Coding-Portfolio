<template>
  <v-main class="tw-bg-[#f3efe6] tw-p-0">
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.documentElement.classList.add('tw-scroll-smooth', 'tw-bg-[#f3efe6]')
  document.body.classList.add('tw-bg-[#f3efe6]')
})
</script>
